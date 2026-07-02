# AMO ETD Dashboard

Dashboard Google Apps Script untuk merekod dan memantau prosedur Assistan Medical Officer (A.M.O) / ETD.

Fail utama projek:

- `Official-All-In-One.gs` - Apps Script lengkap yang mengandungi web app dashboard, API `doGet`/`doPost`, struktur Google Sheet, summary sheets, dan graf.

## Fungsi Utama

- Rekod kes/prosedur mengikut shift Pagi, Petang, dan Malam.
- Rekod Zone pesakit: Secondary Triage, Yellow Zone, dan Red Zone.
- Rekod Registration Number secara optional untuk rujukan pesakit.
- Pilih prosedur dan tempoh masa seperti 10 minit, 15 minit, 30 minit, 1 jam, dan 2 jam.
- Simpan data ke Google Sheet rasmi.
- Papar dashboard harian dengan jumlah pesakit/prosedur mengikut Zone, pecahan shift, prosedur paling kerap, sejarah data, dan trend 7 hari.
- Jana ringkasan automatik untuk Daily, Weekly, Monthly, Yearly, DayOfWeekSummary, HourlySummary, ZoneSummary, ZoneProcedureSummary, dan tab Graf.
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

Tab data utama menggunakan nama `Sheet1` dengan header asal berikut:

| Timestamp | Date | Time | Shift | Procedure | DurationMinutes |
| --- | --- | --- | --- | --- | --- |

Versi terkini menggunakan dua lajur tambahan:

| Timestamp | Date | Time | Shift | Zone | RegistrationNumber | Procedure | DurationMinutes |
| --- | --- | --- | --- | --- | --- | --- | --- |

Jika Sheet lama masih menggunakan 6 lajur asal, script akan cuba memasukkan `Zone` dan `RegistrationNumber` sebelum lajur `Procedure` apabila `setupOfficialSheetStructure()` atau akses data dijalankan.

## Zone dan Prosedur

Pilihan Zone:

- Secondary Triage
- Yellow Zone
- Red Zone

Prosedur baharu:

- ECG
- Medication
- Accompany CT Scan
- Accompany X-Ray
- Accompany for Admission

Nota logik:

- ECG dan Medication boleh dipilih di semua Zone.
- Accompany CT Scan, Accompany X-Ray, dan Accompany for Admission hanya dipaparkan untuk Yellow Zone dan Red Zone.
- Registration Number optional dan tidak mempengaruhi kiraan prosedur atau graf.

## Nota Deploy

Dalam dashboard HTML, `BASE_URL` diisi secara automatik menggunakan `ScriptApp.getService().getUrl()`. Pastikan Web App deploy menggunakan URL `/exec`, bukan URL dev/HEAD, supaya POST dan GET data berjalan stabil.
