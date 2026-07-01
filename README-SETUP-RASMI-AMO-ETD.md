# Setup Sistem Rasmi AMO ETD

Folder ini untuk pindah sistem dashboard ke Google Sheet baru bawah email khas AMO ETD.
Sistem lama tidak perlu diubah.

## Fail utama

- `Official-All-In-One.gs`
  - Cara paling mudah. Paste semua kod ini ke file `Code` dalam Apps Script.
  - Sudah termasuk dashboard, penerimaan data, summary, graf, dan auto-refresh trigger.

- `Code-one-file.gs`
  - Alternatif kalau mahu asingkan `summary.gs`.

- `summary.gs`
  - Alternatif file summary/graf jika tidak guna all-in-one.

- `Index.html`
  - Alternatif multi-file sahaja. Tidak perlu guna jika guna all-in-one.

## Setup Google Sheet Baru

1. Login email rasmi AMO ETD.
2. Buka Google Sheets dan buat spreadsheet baru.
3. Namakan contoh: `Dashboard Prosedur AMO ETD Rasmi`.
4. Pastikan tab utama bernama `Sheet1`.
5. Buka `Extensions > Apps Script`.
6. Padam kod lama dalam file `Code`.
7. Paste kandungan `Official-All-In-One.gs`.
8. Save.

## Optional: Kunci Kepada Spreadsheet ID

Kod rasmi ada baris ini:

```js
const OFFICIAL_SPREADSHEET_ID = "";
```

Jika Apps Script dibuka dari Sheet rasmi, boleh biarkan kosong.
Jika mahu paksa sistem guna Sheet rasmi sahaja, isi ID spreadsheet:

```js
const OFFICIAL_SPREADSHEET_ID = "PASTE_ID_SHEET_RASMI_DI_SINI";
```

ID boleh diambil daripada URL Google Sheet:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

## Run Setup

Dalam Apps Script, run ikut turutan:

```js
setupOfficialSheetStructure
```

Kemudian:

```js
installGraphAutoRefresh5Min
```

Approve permission jika Google minta.

## Test Data Contoh

Run:

```js
testOfficialSystemWithSampleData
```

Semak `Sheet1`. Sepatutnya masuk 1 data contoh.
Semak juga tab summary/graf. Sepatutnya tab berikut wujud:

- `Daily`
- `Weekly`
- `Monthly`
- `Yearly`
- `DayOfWeekSummary`
- `HourlySummary`
- `Graf`

Jika data contoh tidak mahu disimpan, delete row test itu di `Sheet1`.

## Deploy Web App Baru

1. Klik `Deploy > New deployment`.
2. Pilih type: `Web app`.
3. Description: `AMO ETD Official Dashboard`.
4. Execute as: `Me`.
5. Who has access:
   - pilih `Anyone` jika dashboard perlu dibuka di phone tanpa login, atau
   - pilih pilihan organisasi jika akaun rasmi hanya benarkan internal.
6. Klik `Deploy`.
7. Copy URL yang hujungnya `/exec`.

URL `/exec` itu ialah link dashboard rasmi baru.

## Selepas Deploy

- Buka URL `/exec` di phone.
- Tambah satu kes dari dashboard.
- Semak data masuk ke `Sheet1`.
- Summary dan graf akan auto update setiap 5 minit.
- Untuk refresh manual, run:

```js
setupWowGraphSheet
```

## Matikan Auto Refresh 5 Minit

Jika perlu matikan trigger:

```js
removeGraphAutoRefresh5Min
```

