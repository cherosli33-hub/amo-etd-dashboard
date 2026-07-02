# AMO ETD Dashboard

Dashboard Google Apps Script untuk merekod dan memantau prosedur Assistan Medical Officer (A.M.O) / ETD.

Fail utama projek:

- `Official-All-In-One.gs` - Apps Script lengkap yang mengandungi web app dashboard, API `doGet`/`doPost`, struktur Google Sheet, summary sheets, dan graf.

## Fungsi Utama

- Rekod kes/prosedur mengikut shift Pagi, Petang, dan Malam.
- Pilih prosedur dan tempoh masa seperti 10 minit, 15 minit, 30 minit, 1 jam, dan 2 jam.
- Simpan data ke Google Sheet rasmi.
- Papar dashboard harian dengan jumlah kes, pecahan shift, prosedur paling kerap, dan trend 7 hari.
- Jana ringkasan automatik untuk Daily, Weekly, Monthly, Yearly, DayOfWeekSummary, HourlySummary, dan tab Graf.
- Sokong auto refresh graf setiap 5 minit melalui trigger Apps Script.

## Cara Setup Ringkas

1. Buka Google Sheet rasmi untuk data prosedur.
2. Pergi ke Extensions > Apps Script.
3. Tampal kandungan `Official-All-In-One.gs` ke dalam project Apps Script.
4. Jika script bukan bound kepada Sheet rasmi, isi nilai `OFFICIAL_SPREADSHEET_ID`.
5. Jalankan `setupOfficialSheetStructure()` untuk sediakan header dan struktur Sheet.
6. Deploy sebagai Web App dan gunakan URL `/exec` rasmi.
7. Jalankan `installGraphAutoRefresh5Min()` jika mahu graf dikemas kini secara automatik.

## Struktur Data Sheet

Tab data utama menggunakan nama `Sheet1` dengan header berikut:

| Timestamp | Date | Time | Shift | Procedure | DurationMinutes |
| --- | --- | --- | --- | --- | --- |

## Nota Deploy

Dalam dashboard HTML, `BASE_URL` diisi secara automatik menggunakan `ScriptApp.getService().getUrl()`. Pastikan Web App deploy menggunakan URL `/exec`, bukan URL dev/HEAD, supaya POST dan GET data berjalan stabil.
