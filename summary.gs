const SUMMARY_SOURCE_SHEET = "Sheet1";
const SUMMARY_FIXED_PROCEDURES = [
  "Dressing",
  "T&S",
  "Eye Irrigation",
  "Ambulance Call",
  "Change CBD",
  "Change Ryle's Tube",
  "Blood Taking",
  "Suture Removal (S.T.O)",
  "Blood for TSB",
  "Nail Avulsion",
];

function setupSummarySheets() {
  refreshSummarySheets();
}

function setupWowGraphSheet() {
  refreshSummarySheets();
  createWowGraphSheet_();
}

function getSummarySpreadsheet_() {
  if (typeof getOfficialSpreadsheet_ === "function") {
    return getOfficialSpreadsheet_();
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error("Google Sheet rasmi tidak dijumpai. Isi OFFICIAL_SPREADSHEET_ID dalam Code.gs atau buka Apps Script dari Sheet rasmi.");
  }
  return ss;
}

function refreshSummarySheets() {
  const ss = getSummarySpreadsheet_();
  const source = ss.getSheetByName(SUMMARY_SOURCE_SHEET);
  if (!source) throw new Error(`Tab data asal "${SUMMARY_SOURCE_SHEET}" tidak dijumpai.`);

  const rows = source.getDataRange().getValues().slice(1);
  const records = rows
    .map(row => ({
      timestamp: row[0],
      dateKey: summaryDateKey_(row[1]),
      hourKey: summaryHourKey_(row[2], row[0]),
      shift: String(row[3] || "").trim(),
      procedure: String(row[4] || "").trim(),
      minutes: Number(row[5]) || 0,
    }))
    .filter(record => record.dateKey && record.procedure);

  const procedures = summaryProcedureList_(records);

  writePivotSheet_(ss, "Daily", "Tarikh", records, procedures, record => record.dateKey, "Jumlah Setiap Prosedur Harian");
  writePivotSheet_(ss, "Weekly", "Minggu", records, procedures, record => summaryWeekKey_(record.dateKey), "Jumlah Setiap Prosedur Mingguan");
  writePivotSheet_(ss, "Monthly", "Bulan", records, procedures, record => record.dateKey.slice(0, 7), "Jumlah Setiap Prosedur Bulanan");
  writePivotSheet_(ss, "Yearly", "Tahun", records, procedures, record => record.dateKey.slice(0, 4), "Jumlah Setiap Prosedur Tahunan");
  writeDayOfWeekSummary_(ss, records, procedures);
  writeHourlySummary_(ss, records);
  deleteSummaryTabs_(ss, ["ProcedureSummary", "ShiftSummary", "ShiftDurationSummary"]);
}

function summaryProcedureList_(records) {
  const names = new Set(SUMMARY_FIXED_PROCEDURES);
  records.forEach(record => names.add(record.procedure));
  return Array.from(names).filter(Boolean);
}

function summaryDateKey_(value) {
  if (!value) return "";
  if (Object.prototype.toString.call(value) === "[object Date]" && !Number.isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }

  const raw = String(value).trim();
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return Utilities.formatDate(parsed, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }

  const match = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) {
    return `${match[1]}-${String(match[2]).padStart(2, "0")}-${String(match[3]).padStart(2, "0")}`;
  }
  return "";
}

function summaryWeekKey_(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  const year = Utilities.formatDate(date, Session.getScriptTimeZone(), "YYYY");
  const week = Utilities.formatDate(date, Session.getScriptTimeZone(), "ww");
  return `${year}-W${week}`;
}

function summaryHourKey_(timeValue, timestampValue) {
  if (Object.prototype.toString.call(timeValue) === "[object Date]" && !Number.isNaN(timeValue.getTime())) {
    return Utilities.formatDate(timeValue, Session.getScriptTimeZone(), "HH:00");
  }

  const raw = String(timeValue || "").trim();
  const match24 = raw.match(/^(\d{1,2}):(\d{2})/);
  if (match24) {
    let hour = Number(match24[1]);
    const isPM = /\b(PM|PTG|PETANG)\b/i.test(raw);
    const isAM = /\b(AM|PG|PAGI)\b/i.test(raw);
    if (isPM && hour < 12) hour += 12;
    if (isAM && hour === 12) hour = 0;
    if (hour >= 0 && hour <= 23) return `${String(hour).padStart(2, "0")}:00`;
  }

  if (Object.prototype.toString.call(timestampValue) === "[object Date]" && !Number.isNaN(timestampValue.getTime())) {
    return Utilities.formatDate(timestampValue, Session.getScriptTimeZone(), "HH:00");
  }
  return "Tiada Jam";
}

function summaryDayName_(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  const names = ["Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu", "Ahad"];
  const mondayBasedIndex = (date.getDay() + 6) % 7;
  return names[mondayBasedIndex] || "Tiada Hari";
}

function writePivotSheet_(ss, sheetName, firstHeader, records, procedures, groupFn, chartTitle) {
  const table = new Map();
  records.forEach(record => {
    const key = groupFn(record);
    if (!key) return;
    if (!table.has(key)) {
      table.set(key, Object.fromEntries(procedures.map(name => [name, 0])));
    }
    table.get(key)[record.procedure] = (table.get(key)[record.procedure] || 0) + 1;
  });

  const output = [[firstHeader, ...procedures, "Jumlah Keseluruhan"]];
  Array.from(table.keys()).sort().forEach(key => {
    const counts = procedures.map(name => table.get(key)[name] || 0);
    output.push([key, ...counts, counts.reduce((sum, value) => sum + value, 0)]);
  });

  if (output.length === 1) {
    output.push(["Tiada data", ...procedures.map(() => 0), 0]);
  }

  writeSummaryTable_(ss, sheetName, output, chartTitle);
}

function writeDayOfWeekSummary_(ss, records, procedures) {
  const order = ["Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu", "Ahad"];
  const outputRows = [];
  const table = new Map(order.map(day => [day, Object.fromEntries(procedures.map(name => [name, 0]))]));

  records.forEach(record => {
    const day = summaryDayName_(record.dateKey);
    if (!table.has(day)) table.set(day, Object.fromEntries(procedures.map(name => [name, 0])));
    table.get(day)[record.procedure] = (table.get(day)[record.procedure] || 0) + 1;
  });

  const output = [["Hari", ...procedures, "Jumlah Keseluruhan"]];
  order.forEach(day => {
    const counts = procedures.map(name => table.get(day)[name] || 0);
    outputRows.push([day, ...counts, counts.reduce((sum, value) => sum + value, 0)]);
  });
  outputRows.sort((a, b) => b[b.length - 1] - a[a.length - 1]);
  output.push(...outputRows);
  writeSummaryTable_(ss, "DayOfWeekSummary", output, "Hari Paling Banyak Prosedur");
  createTableChart_(ss.getSheetByName("DayOfWeekSummary"), "Hari Paling Banyak Prosedur", 1, output[0].length + 2, 900, 360);
}

function writeHourlySummary_(ss, records) {
  const hours = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, "0")}:00`);
  const table = new Map(hours.map(hour => [hour, { count: 0, minutes: 0 }]));

  records.forEach(record => {
    const hour = record.hourKey || "Tiada Jam";
    if (!table.has(hour)) table.set(hour, { count: 0, minutes: 0 });
    table.get(hour).count += 1;
    table.get(hour).minutes += record.minutes;
  });

  const output = [["Jam", "Jumlah Prosedur", "Jumlah Minit", "Jumlah Jam"]];
  Array.from(table.keys()).sort().forEach(hour => {
    const value = table.get(hour);
    if (value.count === 0 && hour === "Tiada Jam") return;
    output.push([hour, value.count, value.minutes, Math.round((value.minutes / 60) * 10) / 10]);
  });
  writeSummaryTable_(ss, "HourlySummary", output, "Waktu Paling Sibuk");
  createTableChart_(ss.getSheetByName("HourlySummary"), "Waktu Paling Sibuk", 1, output[0].length + 2, 720, 360);
}

function writeSummaryTable_(ss, sheetName, values, chartTitle) {
  const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  sheet.clear();
  sheet.getCharts().forEach(chart => sheet.removeChart(chart));

  const rowCount = values.length;
  const colCount = values[0].length;
  sheet.getRange(1, 1, rowCount, colCount).setValues(values);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, colCount).setFontWeight("bold").setBackground("#E4E0D5");
  sheet.getRange(1, 1, rowCount, colCount).setFontFamily("Arial").setFontSize(10);
  sheet.autoResizeColumns(1, colCount);
}

function deleteSummaryTabs_(ss, sheetNames) {
  sheetNames.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (sheet && ss.getSheets().length > 1) ss.deleteSheet(sheet);
  });
}

function createTableChart_(sheet, chartTitle, row, col, width, height) {
  if (!sheet) return;
  sheet.getCharts().forEach(chart => sheet.removeChart(chart));
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 2) return;

  const chartColCount = Math.max(2, lastCol - 1);
  const effectiveChartColCount = sheet.getName() === "HourlySummary" ? 2 : chartColCount;
  const chart = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(sheet.getRange(1, 1, lastRow, effectiveChartColCount))
    .setPosition(row, col, 0, 0)
    .setOption("title", chartTitle)
    .setOption("useFirstRowAsHeaders", true)
    .setOption("useFirstColumnAsDomain", true)
    .setOption("legend", { position: effectiveChartColCount > 2 ? "right" : "none" })
    .setOption("height", height)
    .setOption("width", width)
    .setOption("backgroundColor", "#FFFFFF")
    .setOption("chartArea", {
      backgroundColor: "#FFFFFF",
      width: "68%",
      height: "65%",
    })
    .setOption("hAxis", {
      textStyle: { color: "#3C4043" },
      titleTextStyle: { color: "#3C4043" },
      slantedText: true,
    })
    .setOption("vAxis", {
      minValue: 0,
      textStyle: { color: "#3C4043" },
      titleTextStyle: { color: "#3C4043" },
      gridlines: { color: "#DADCE0" },
    })
    .setOption("colors", summaryChartColors_())
    .build();
  sheet.insertChart(chart);
}

function summaryChartColors_() {
  return [
    "#1A73E8",
    "#34A853",
    "#FBBC04",
    "#A142F4",
    "#EA4335",
    "#00ACC1",
    "#F4511E",
    "#7CB342",
    "#D81B60",
    "#5E35B1",
    "#00897B",
    "#C0CA33",
  ];
}

function createWowGraphSheet_() {
  const ss = getSummarySpreadsheet_();
  const sheet = ss.getSheetByName("Graf") || ss.insertSheet("Graf");

  sheet.clear();
  sheet.getRange("A1:N120").breakApart();
  sheet.getCharts().forEach(chart => sheet.removeChart(chart));
  sheet.setHiddenGridlines(true);
  sheet.setTabColor("#1A73E8");

  sheet.getRange("A1:N120").setBackground("#FFFFFF");
  sheet.setColumnWidths(1, 10, 95);
  sheet.setColumnWidths(11, 1, 26);
  sheet.setColumnWidths(12, 3, 120);
  sheet.setRowHeights(1, 120, 28);

  sheet.getRange("A1:N2").merge()
    .setValue("DASHBOARD PROSEDUR ETD")
    .setFontSize(24)
    .setFontWeight("bold")
    .setFontColor("#FFFFFF")
    .setBackground("#1A73E8")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  sheet.getRange("A3:N3").merge()
    .setValue("Ringkasan automatik berdasarkan data prosedur harian, mingguan, bulanan dan tahunan")
    .setFontSize(11)
    .setFontColor("#31506F")
    .setBackground("#E8F0FE")
    .setHorizontalAlignment("center");

  createKpiCards_(ss, sheet);

  titleBox_(sheet, "A10:N10", "1. GRAF DAILY - JUMLAH PROSEDUR MENGIKUT TARIKH");
  titleBox_(sheet, "A28:N28", "2. GRAF WEEKLY - JUMLAH PROSEDUR MENGIKUT MINGGU");
  titleBox_(sheet, "A46:N46", "3. GRAF MONTHLY - JUMLAH PROSEDUR MENGIKUT BULAN");
  titleBox_(sheet, "A64:N64", "4. GRAF YEARLY - JUMLAH PROSEDUR MENGIKUT TAHUN");
  titleBox_(sheet, "A82:N82", "5. GRAF DAY OF WEEK - HARI PALING BANYAK PROSEDUR");
  titleBox_(sheet, "A100:N100", "6. GRAF HOURLY - WAKTU PALING SIBUK");

  createWowColumnChart_(ss, sheet, "Daily", 11, 1, "Daily Procedure Trend");
  createWowColumnChart_(ss, sheet, "Weekly", 29, 1, "Weekly Procedure Trend");
  createWowColumnChart_(ss, sheet, "Monthly", 47, 1, "Monthly Procedure Trend");
  createWowColumnChart_(ss, sheet, "Yearly", 65, 1, "Yearly Procedure Trend");
  createWowColumnChart_(ss, sheet, "DayOfWeekSummary", 83, 1, "Hari Paling Banyak Prosedur");
  createWowColumnChart_(ss, sheet, "HourlySummary", 101, 1, "Waktu Paling Sibuk");

  sheet.getRange("A117:N118").merge()
    .setValue("Data dikemas kini apabila setupWowGraphSheet dijalankan selepas data baru masuk.")
    .setFontColor("#31506F")
    .setFontSize(10)
    .setHorizontalAlignment("center")
    .setBackground("#E8F0FE");
}

function createKpiCards_(ss, sheet) {
  const daily = ss.getSheetByName("Daily");
  let total = 0;
  let latestDate = "-";

  if (daily && daily.getLastRow() >= 2) {
    const lastRow = daily.getLastRow();
    const lastCol = daily.getLastColumn();
    latestDate = daily.getRange(lastRow, 1).getDisplayValue();
    total = daily.getRange(lastRow, lastCol).getDisplayValue();
  }

  card_(sheet, "A5:C8", "TARIKH TERKINI", latestDate, "#E8F0FE", "#1A73E8");
  card_(sheet, "D5:F8", "TOTAL PROSEDUR", total, "#E6F4EA", "#188038");
  card_(sheet, "G5:I8", "SUMBER DATA", "Sheet1", "#F3E8FD", "#7E22CE");
  card_(sheet, "J5:N8", "STATUS", "Live / Manual Refresh", "#FEF7E0", "#B06000");
}

function card_(sheet, range, title, value, bgColor, textColor) {
  const cell = sheet.getRange(range);
  cell.merge()
    .setValue(`${title}\n\n${value}`)
    .setBackground(bgColor)
    .setFontColor(textColor)
    .setFontSize(13)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
}

function titleBox_(sheet, range, title) {
  sheet.getRange(range).merge()
    .setValue(title)
    .setFontSize(13)
    .setFontWeight("bold")
    .setFontColor("#174EA6")
    .setBackground("#E8F0FE")
    .setHorizontalAlignment("left")
    .setVerticalAlignment("middle");
}

function createWowColumnChart_(ss, dashboardSheet, sourceSheetName, row, col, title) {
  const source = ss.getSheetByName(sourceSheetName);
  if (!source) return;

  const lastRow = source.getLastRow();
  const lastCol = source.getLastColumn();
  if (lastRow < 2 || lastCol < 2) return;

  const chartColCount = sourceSheetName === "HourlySummary" ? 2 : Math.max(2, lastCol - 1);
  const range = source.getRange(1, 1, lastRow, chartColCount);
  const labels = source.getRange(1, 2, 1, Math.max(1, chartColCount - 1)).getValues()[0].filter(Boolean);
  const colors = summaryChartColors_();
  const chart = dashboardSheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(range)
    .setPosition(row, col, 0, 0)
    .setOption("title", title)
    .setOption("useFirstRowAsHeaders", true)
    .setOption("useFirstColumnAsDomain", true)
    .setOption("titleTextStyle", {
      color: "#202124",
      fontSize: 16,
      bold: true,
    })
    .setOption("height", 420)
    .setOption("width", 900)
    .setOption("backgroundColor", "#FFFFFF")
    .setOption("chartArea", {
      backgroundColor: "#FFFFFF",
      width: "66%",
      height: "65%",
    })
    .setOption("legend", {
      position: "right",
      textStyle: { color: "#202124", fontSize: 10 },
    })
    .setOption("hAxis", {
      textStyle: { color: "#3C4043" },
      titleTextStyle: { color: "#3C4043" },
      slantedText: true,
    })
    .setOption("vAxis", {
      minValue: 0,
      textStyle: { color: "#3C4043" },
      titleTextStyle: { color: "#3C4043" },
      gridlines: { color: "#DADCE0" },
    })
    .setOption("colors", summaryChartColors_())
    .build();

  dashboardSheet.insertChart(chart);
  createManualLegend_(dashboardSheet, row, 11, labels, colors);
}

function createManualLegend_(sheet, row, col, labels, colors) {
  const titleRange = sheet.getRange(row, col, 1, 4);
  titleRange.merge()
    .setValue("PETUNJUK PROSEDUR")
    .setBackground("#E8F0FE")
    .setFontColor("#174EA6")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  labels.forEach((label, index) => {
    const targetRow = row + 1 + index;
    sheet.getRange(targetRow, col)
      .setValue("")
      .setBackground(colors[index % colors.length])
      .setBorder(true, true, true, true, false, false, "#FFFFFF", SpreadsheetApp.BorderStyle.SOLID);

    const labelRange = sheet.getRange(targetRow, col + 1, 1, 3);
    labelRange.merge()
      .setValue(label)
      .setBackground("#FFFFFF")
      .setFontColor("#202124")
      .setFontSize(9)
      .setHorizontalAlignment("left")
      .setVerticalAlignment("middle");
  });
}
