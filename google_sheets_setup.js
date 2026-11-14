/**
 * Jai Jagannath Mission International (JJMI) - Real-Time Google Sheet Auto-Sync Script
 * 
 * SETUP INSTRUCTIONS (Takes only 1 minute):
 * 1. Open Google Sheets (https://sheets.new) and name it "JJMI Registrations 2026".
 * 2. Click "Extensions" -> "Apps Script" in the top menu.
 * 3. Delete any default code and PASTE THIS ENTIRE FILE.
 * 4. Click "Deploy" -> "New deployment".
 * 5. Select type: "Web app".
 * 6. Execute as: "Me", Who has access: "Anyone".
 * 7. Click "Deploy" and COPY the generated Web App URL (starts with https://script.google.com/macros/s/...).
 * 8. Set GOOGLE_SHEET_WEBHOOK_URL = <your_url> in Vercel Environment Variables or .env.local!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create header row if sheet is completely new/empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Application Number",
        "Full Name",
        "Mobile Number",
        "City",
        "State",
        "Category",
        "Contribution (INR)",
        "Fee Basis",
        "Email",
        "Status"
      ]);
      // Format header row with Royal Navy & Gold styling
      var headerRange = sheet.getRange(1, 1, 1, 11);
      headerRange.setBackground("#081d36");
      headerRange.setFontColor("#fef08a");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    
    // Parse incoming registration data from JJMI web application
    var data = JSON.parse(e.postData.contents);
    
    // Append the row to Google Sheet
    sheet.appendRow([
      data.created_at || new Date().toLocaleString(),
      data.application_number || "JJMI-" + Date.now(),
      data.full_name || "",
      data.phone_number || "",
      data.city || "",
      data.state_region || "",
      data.category_name || "General Participant",
      data.fee_inr !== undefined ? data.fee_inr : 500,
      data.fee_basis || "Annual",
      data.email || "",
      data.registration_status || "Registered"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

