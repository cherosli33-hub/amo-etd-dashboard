const SHEET_NAME = "Sheet1";
const HEADERS = ["Timestamp", "Date", "Time", "Shift", "Procedure", "DurationMinutes"];
const OFFICIAL_SPREADSHEET_ID = "";

function getOfficialSpreadsheet_() {
  const spreadsheetId = String(OFFICIAL_SPREADSHEET_ID || "").trim();
  if (spreadsheetId) return SpreadsheetApp.openById(spreadsheetId);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error("Google Sheet rasmi tidak dijumpai. Isi OFFICIAL_SPREADSHEET_ID atau buka Apps Script dari Sheet rasmi.");
  }
  return ss;
}

function getSheet_() {
  const ss = getOfficialSpreadsheet_();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === "data") {
    const sheet = getSheet_();
    const values = sheet.getDataRange().getValues();
    return json_(values);
  }

  return HtmlService
    .createTemplateFromFile("Index")
    .evaluate()
    .setTitle("Log Prosedur A.M.O")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function installGraphAutoRefresh5Min() {
  if (typeof setupWowGraphSheet !== "function") {
    throw new Error("setupWowGraphSheet tidak dijumpai. Pastikan summary.gs sudah ada dalam Apps Script.");
  }

  removeGraphAutoRefresh5Min();
  ScriptApp.newTrigger("setupWowGraphSheet")
    .timeBased()
    .everyMinutes(5)
    .create();
  setupWowGraphSheet();
}

function removeGraphAutoRefresh5Min() {
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === "setupWowGraphSheet") {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function setupOfficialSheetStructure() {
  const ss = getOfficialSpreadsheet_();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME, 0);
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  const existingHeaders = headerRange.getValues()[0].map(value => String(value || "").trim());
  const headerOk = HEADERS.every((header, index) => existingHeaders[index] === header);

  if (!headerOk) {
    headerRange.setValues([HEADERS]);
  }

  sheet.setFrozenRows(1);
  headerRange
    .setFontWeight("bold")
    .setBackground("#E8F0FE")
    .setFontColor("#174EA6");
  sheet.autoResizeColumns(1, HEADERS.length);

  if (typeof setupWowGraphSheet === "function") {
    setupWowGraphSheet();
  }

  return "Setup struktur Sheet rasmi siap.";
}

function testOfficialSystemWithSampleData() {
  const now = new Date();
  const payload = {
    date: Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd"),
    time: Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm"),
    shift: "morning",
    procedures: [
      { name: "Dressing", minutes: 15 },
    ],
  };

  const response = doPost({
    postData: {
      contents: JSON.stringify(payload),
    },
  });

  if (typeof setupWowGraphSheet === "function") {
    setupWowGraphSheet();
  }

  return response && typeof response.getContent === "function"
    ? response.getContent()
    : "Test sample selesai.";
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const rows = (payload.procedures || []).map(proc => [
        new Date(),
        payload.date,
        payload.time,
        payload.shift,
        proc.name,
        proc.minutes,
      ]);

      if (rows.length) {
        sheet
          .getRange(sheet.getLastRow() + 1, 1, rows.length, HEADERS.length)
          .setValues(rows);
      }
    } finally {
      lock.releaseLock();
    }

    return json_({ result: "success" });
  } catch (err) {
    return json_({ result: "error", message: String(err) });
  }
}
