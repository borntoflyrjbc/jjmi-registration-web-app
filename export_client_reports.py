"""
JJMI Participant Data Exporter
Generates Client-Ready Styled Excel & Official Presentation PDF Reports
"""

import sqlite3
import os
from datetime import datetime
import pandas as pd

DB_PATH = r"D:\Work\JJMI_Registration_App\data\jjmi_master.db"
OUTPUT_DIR = r"D:\Work\JJMI_Registration_App\exports"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def export_all():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    query = """
    SELECT 
        application_number AS "Application No",
        full_name AS "Devotee Name",
        phone_country_code || ' ' || phone_number AS "Mobile",
        whatsapp_country_code || ' ' || whatsapp_number AS "WhatsApp",
        email AS "Email",
        city AS "City",
        state_region AS "State",
        country AS "Country",
        category_name AS "Participation Category",
        fee_amount_minor / 100 AS "Fee (INR)",
        payment_status AS "Payment Status",
        payment_reference AS "UTR / Reference",
        payment_date AS "Payment Date",
        created_at AS "Registration Timestamp"
    FROM registrations
    ORDER BY created_at DESC;
    """
    df = pd.read_sql_query(query, conn)
    conn.close()

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # 1. Export Clean Excel (.xlsx)
    excel_path = os.path.join(OUTPUT_DIR, f"JJMI_Registrations_{timestamp}.xlsx")
    with pd.ExcelWriter(excel_path, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Devotee Registrations")
    print(f"✓ Excel Export: {excel_path} ({len(df)} records)")

    # 2. Export Clean CSV
    csv_path = os.path.join(OUTPUT_DIR, f"JJMI_Registrations_{timestamp}.csv")
    df.to_csv(csv_path, index=False, encoding="utf-8-sig")
    print(f"✓ CSV Export: {csv_path}")

    # 3. Export PDF Report via ReportLab
    try:
        from reportlab.lib.pagesizes import letter, landscape
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors

        pdf_path = os.path.join(OUTPUT_DIR, f"JJMI_Devotee_Roster_{timestamp}.pdf")
        doc = SimpleDocTemplate(
            pdf_path,
            pagesize=landscape(letter),
            rightMargin=20, leftMargin=20, topMargin=25, bottomMargin=25
        )

        elements = []
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            'Title',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=16,
            textColor=colors.HexColor('#081d36'),
            alignment=1,
            spaceAfter=4
        )
        subtitle_style = ParagraphStyle(
            'SubTitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            textColor=colors.HexColor('#78350f'),
            alignment=1,
            spaceAfter=15
        )

        elements.append(Paragraph("JAI JAGANNATH MISSION INTERNATIONAL", title_style))
        elements.append(Paragraph("Official Participant Master Roster • Spiritual Guide: Dr. Purshottam Tiwari", subtitle_style))

        # Prepare Table Data
        cols = ["Application No", "Devotee Name", "Mobile", "City/State", "Category", "Fee (INR)", "Status", "UTR Ref"]
        table_data = [cols]

        for _, row in df.iterrows():
            table_data.append([
                str(row["Application No"]),
                str(row["Devotee Name"])[:20],
                str(row["Mobile"]),
                f"{row['City']}, {row['State']}"[:18],
                str(row["Participation Category"])[:16],
                f"Rs. {row['Fee (INR)']}",
                str(row["Payment Status"]).upper(),
                str(row["UTR / Reference"] or "—")[:14]
            ])

        t = Table(table_data, colWidths=[95, 115, 95, 110, 100, 65, 80, 95])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#081d36')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#ffffff')),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 8),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('TOPPADDING', (0, 0), (-1, 0), 6),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#ffffff'), colors.HexColor('#f8fafc')]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('FONTSIZE', (0, 1), (-1, -1), 7.5),
        ]))

        elements.append(t)
        doc.build(elements)
        print(f"✓ Official PDF Report: {pdf_path}")
    except Exception as e:
        print(f"PDF creation skipped: {e}")

if __name__ == "__main__":
    export_all()

