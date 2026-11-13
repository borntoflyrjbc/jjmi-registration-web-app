# 🕉️ Jai Jagannath Mission International — Registration & Payment Web App

A production-ready, mobile-first, high-trust digital participant application and registration web application for **Jai Jagannath Mission International** under the guidance of **Dr. Purshottam Tiwari**.

---

## 🌟 Key Features

1. **Mobile-First Responsive UX**:
   - Tailored specifically for 360px+ mobile screens (Android/iOS) and full desktop displays.
   - Designed following **Rahul's Design DNA**: Deep Jagannath Navy (`#0a192f`), sacred saffron/marigold accents, authentic temple imagery, clean typography, zero AI clutter.

2. **6-Step Streamlined Registration Wizard**:
   - **Step 1: Personal Information**: Full name, international dialing code, calling mobile, synced WhatsApp number, email, optional DOB.
   - **Step 2: Participation Categories**: 8 official tiers from Well-Wisher (Free) to Life Participant and Institutional Partner.
   - **Step 3: Location**: Worldwide country selector, state, city, postal code, street address.
   - **Step 4: Areas of Service Interest**: Multi-select across 10 spiritual & social streams (Annadan, Youth Awakening, Man Samvad, Kirtan, etc.).
   - **Step 5: Background & Availability**: Profession/qualification, weekly seva availability, and purpose for joining.
   - **Step 6: Review & Declarations**: Summary card, mandatory rules acceptance, privacy notice acknowledgment, and optional publicity photo consent.

3. **Official UPI Payment & Dynamic QR Engine**:
   - **Direct Beneficiary**: `PURUSHOTTAM TIWARI` (`9479492992@pthdfc`) • HDFC Bank.
   - **Mobile 1-Click UPI Intent**: Directly launches Google Pay, PhonePe, Paytm, BHIM, or any installed UPI app with pre-filled amount and unique application number.
   - **Dynamic Crisp QR Code**: High-resolution server-generated QR with quiet zone.
   - **Download QR Feature**: 1-Click high-resolution PNG download (`JJMI-Payment-[APP#].png`) for scanning from secondary devices.
   - **Original Tiwari Ji Physical QR Card**: Toggleable in UI for maximum devotee trust.
   - **Free Well-Wisher Bypass**: Immediately confirms free registrations without payment gating.
   - **Post-Payment UTR Submission**: Applicants can enter their 12-digit UPI UTR to trigger verification.

4. **Master SQLite Database & Auto-Migrations**:
   - High-performance local database stored at `data/jjmi_master.db` with WAL mode enabled.
   - Tracks unique application numbers (`JJMI-2026-XXXXXX`), timestamps, payment status, UTR reference, and audit records.

5. **Authorized Admin Portal (`/admin`)**:
   - Protected sign-in at `/admin/login`.
   - Real-time metrics: Total Applicants, Paid/Confirmed, Free Well-Wishers, Under Review, Pending Payments, and Total Funds Collected (INR).
   - Instant Search & Filter by category, payment status, name, phone, email, or UTR.
   - Detailed applicant review modal with status updater and private admin notes.
   - **1-Click CSV Export**: Comprehensive export with anti-formula injection safeguards (`=`, `+`, `-`, `@` sanitization).

---

## 🚀 Quick Start & Development

### 1. Run Development Server
```bash
cd D:\Work\JJMI_Registration_App
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Build for Production
```bash
npm run build
npm run start
```

---

## 🔐 Admin Portal Credentials

- **URL**: `http://localhost:3000/admin/login`
- **Default Email**: `borntoflyrj2026@gmail.com`
- **Default Password**: `purshottamtiwari`
*(Can be changed via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`)*

---

## 📂 Project Directory Structure

```
JJMI_Registration_App/
├── data/                                 # SQLite master database (jjmi_master.db)
├── public/
│   └── assets/                           # Genuine Jagannath deities, temple, logo, UPI QR
│       ├── tiwari_ji_upi_qr.jpg          # Original scanned QR card
│       ├── jagannath_deities.png         # Lord Jagannath, Balabhadra, Subhadra
│       ├── jagannath_temple.png          # Puri Sri Jagannath Temple
│       └── jjmi_logo.jpg                 # Official Mission Logo
├── src/
│   ├── app/
│   │   ├── page.tsx                      # Multi-step public registration form
│   │   ├── layout.tsx                    # Global root layout & SEO metadata
│   │   ├── rules/page.tsx                # Participation rules & constitution
│   │   ├── privacy/page.tsx              # Privacy & data protection notice
│   │   ├── success/page.tsx              # Registration certificate & print slip
│   │   ├── payment-pending/page.tsx      # Application status lookup & UTR submit
│   │   ├── admin/                        # Protected master dashboard
│   │   └── api/                          # Backend REST endpoints (registrations, QR, verify, export)
│   ├── components/                       # Modular UI components (Header, Footer, Steps, Payment)
│   └── lib/                              # Database engine, categories, countries, types
├── .env.example                          # Environment template
└── .env.local                            # Local active configuration
```

