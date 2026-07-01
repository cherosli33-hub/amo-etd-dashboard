const SHEET_NAME = "Sheet1";
const HEADERS = ["Timestamp", "Date", "Time", "Shift", "Procedure", "DurationMinutes"];
const OFFICIAL_SPREADSHEET_ID = "";
const DASHBOARD_HTML = "<!DOCTYPE html>\r\n<html lang=\"ms\">\r\n<head>\r\n<meta charset=\"UTF-8\">\r\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\">\r\n<title>Log Prosedur A.M.O</title>\r\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\r\n<link href=\"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap\" rel=\"stylesheet\">\r\n<style>\r\n  :root{\r\n    --bg:#F7F5F0; --panel:#FFFFFF; --border:#E4E0D5; --chip:#F1EEE5;\r\n    --text:#1C2420; --text2:#2B332F; --text3:#3A4440; --muted:#6B7268; --muted2:#5C6560; --faint:#8A8478;\r\n    --accent:#1C9665; --accent-soft:rgba(28,150,101,0.06); --accent-grad1:#6FE3A8; --accent-grad2:#4FC890; --accent-grad3:#2F8F66;\r\n    --pagi:#F2A93B; --pagi-glow:rgba(242,169,59,0.18);\r\n    --petang:#E2622E; --petang-glow:rgba(226,98,46,0.18);\r\n    --malam:#5B7FE0; --malam-glow:rgba(91,127,224,0.18);\r\n    --warn-bg:#FBF0E8; --warn-border:#E8C9A8; --warn-text:#8A4A1C;\r\n    color-scheme: light only;\r\n  }\r\n  *{box-sizing:border-box; margin:0; padding:0;}\r\n  html,body{background:var(--bg) !important; color:var(--text); font-family:'IBM Plex Sans',sans-serif; -webkit-tap-highlight-color:transparent;}\r\n  body{\r\n    min-height:100vh;\r\n    background-image:\r\n      linear-gradient(rgba(0,0,0,0.018) 1px, transparent 1px),\r\n      linear-gradient(90deg, rgba(0,0,0,0.018) 1px, transparent 1px);\r\n    background-size:28px 28px;\r\n  }\r\n  .font-display{font-family:'Space Grotesk',sans-serif;}\r\n  .font-mono{font-family:'IBM Plex Mono',monospace;}\r\n  button{font-family:inherit; cursor:pointer; border:none; background:none;}\r\n  .wrap{max-width:720px; margin:0 auto; padding:28px 20px 18px;}\n  .hidden{display:none !important;}\r\n\r\n  /* Header */\r\n  .header{display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:28px;}\r\n  .header .date{font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.2em; color:var(--muted); text-transform:uppercase; margin-bottom:6px;}\r\n  .header h1{font-family:'Space Grotesk',sans-serif; font-size:22px; font-weight:700; line-height:1.15; letter-spacing:-0.01em;}\r\n  .header .icon{width:44px; height:44px; border-radius:12px; background:var(--panel); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; flex-shrink:0;}\r\n\r\n  /* Sync warning */\r\n  .sync-warn{width:100%; display:flex; align-items:center; gap:10px; background:var(--warn-bg); border:1px solid var(--warn-border); color:var(--warn-text); font-size:14px; padding:12px 16px; border-radius:12px; margin-bottom:24px; text-align:left;}\r\n\r\n  /* Loading */\r\n  .loading-screen{display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; gap:12px;}\r\n  .spinner{width:24px; height:24px; border:3px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:spin 0.8s linear infinite;}\r\n  @keyframes spin{to{transform:rotate(360deg);}}\r\n  .loading-screen span{font-size:14px; color:var(--muted);}\r\n\r\n  /* Ring card */\r\n  .ring-card{background:var(--panel); border:1px solid var(--border); border-radius:16px; padding:20px; margin-bottom:28px;}\r\n  .ring-row{display:flex; align-items:center; gap:20px;}\r\n  .ring-box{position:relative; width:168px; height:168px; flex-shrink:0;}\r\n  .ring-center{position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;}\r\n  .ring-center .num{font-family:'IBM Plex Mono',monospace; font-size:30px; font-weight:600;}\r\n  .ring-center .lbl{font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:0.05em; margin-top:2px;}\r\n  .ring-legend{flex:1; display:flex; flex-direction:column; gap:10px;}\r\n  .ring-legend-row{display:flex; align-items:center; justify-content:space-between;}\r\n  .ring-legend-left{display:flex; align-items:center; gap:8px;}\r\n  .dot{width:8px; height:8px; border-radius:50%; flex-shrink:0;}\r\n  .ring-legend-row .label{font-size:14px; color:var(--text3);}\r\n  .ring-legend-row .now-tag{font-family:'IBM Plex Mono',monospace; font-size:10px; color:var(--muted);}\r\n  .ring-legend-row .count{font-family:'IBM Plex Mono',monospace; font-size:14px; color:var(--text);}\r\n\r\n  /* Section */\r\n  .section{margin-bottom:28px;}\r\n  .section h2{font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.12em; color:var(--muted2); margin-bottom:14px;}\r\n  .empty-note{background:var(--panel); border:1px dashed var(--border); border-radius:12px; padding:20px; text-align:center; font-size:14px; color:var(--faint);}\r\n\r\n  /* Bars */\r\n  .bar-row{margin-bottom:14px;}\r\n  .bar-row:last-child{margin-bottom:0;}\r\n  .bar-top{display:flex; align-items:baseline; justify-content:space-between; margin-bottom:6px;}\r\n  .bar-top .name{font-size:14px; font-weight:500; color:var(--text2);}\r\n  .bar-top .count{font-family:'IBM Plex Mono',monospace; font-size:14px; color:var(--muted);}\r\n  .bar-track{height:6px; background:var(--panel); border-radius:99px; overflow:hidden;}\r\n  .bar-fill{height:100%; border-radius:99px; transition:width 0.6s ease-out;}\r\n\r\n  /* Trend chart */\r\n  .trend-chart{display:flex; align-items:flex-end; gap:10px; height:128px; padding:8px 4px 0;}\r\n  .trend-col{flex:1; display:flex; flex-direction:column; align-items:center; gap:8px; height:100%; justify-content:flex-end;}\r\n  .trend-count{font-family:'IBM Plex Mono',monospace; font-size:10px; color:var(--muted); height:12px;}\r\n  .trend-bar{width:100%; border-radius:5px 5px 0 0; transition:height 0.6s ease-out; min-height:4px;}\r\n  .trend-label{font-size:11px; color:var(--muted);}\r\n  .trend-label.today{color:var(--accent); font-weight:600;}\r\n\r\n  /* Case list */\r\n  .case-list{display:flex; flex-direction:column; gap:10px;}\r\n  .case-card{background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:14px;}\r\n  .case-card-row{display:flex; align-items:flex-start; justify-content:space-between; gap:8px;}\r\n  .case-meta{display:flex; align-items:center; gap:8px; margin-bottom:8px;}\r\n  .case-time{font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--muted);}\r\n  .shift-pill{font-size:11px; padding:2px 8px; border-radius:99px; font-weight:500;}\r\n  .case-procs{display:flex; flex-wrap:wrap; gap:6px;}\r\n  .proc-chip{font-size:12px; background:var(--chip); color:var(--text3); padding:4px 8px; border-radius:6px;}\r\n  .proc-chip .dur{color:var(--faint);}\r\n  .del-btn{flex-shrink:0; width:28px; height:28px; border-radius:6px; display:flex; align-items:center; justify-content:center; color:var(--faint); transition:color 0.15s, background 0.15s;}\r\n  .del-btn:hover{color:#E2622E; background:#FBE8E0;}\r\n\r\n  /* FAB */\r\n  .fab{position:static; margin:6px auto 28px; width:78px; height:78px; border-radius:50%; background:#15815A; color:#FFFFFF; display:flex; align-items:center; justify-content:center; box-shadow:0 12px 32px rgba(21,129,90,0.45); transition:transform 0.1s; z-index:40;}\n  .fab:active{transform:scale(0.95);}\r\n\r\n  /* Modal */\r\n  .modal-overlay{position:fixed; inset:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; padding:0 24px; z-index:50;}\r\n  .modal-box{background:var(--panel); border:1px solid var(--border); border-radius:16px; padding:20px; max-width:380px; width:100%;}\r\n  .modal-box p{font-size:14px; color:var(--text2); margin-bottom:16px;}\r\n  .modal-actions{display:flex; gap:8px;}\r\n  .modal-btn{flex:1; padding:10px; border-radius:8px; font-size:14px; font-weight:500;}\r\n  .modal-btn.cancel{color:var(--text2); background:var(--chip);}\r\n  .modal-btn.confirm{color:#fff; background:#E2622E;}\r\n\r\n  /* Toast */\r\n  .toast{position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:var(--panel); border:1px solid var(--border); color:var(--text); padding:10px 16px; border-radius:99px; font-size:14px; font-weight:500; box-shadow:0 12px 32px rgba(0,0,0,0.18); z-index:60; display:flex; align-items:center; gap:8px; max-width:90%; text-align:center; animation:toastIn 0.25s ease-out;}\r\n  @keyframes toastIn{from{opacity:0; transform:translate(-50%,8px);} to{opacity:1; transform:translate(-50%,0);}}\r\n\r\n  /* New case screen */\r\n  .nc-header{display:flex; align-items:center; gap:12px; margin-bottom:24px;}\r\n  .back-btn{width:36px; height:36px; border-radius:8px; background:var(--panel); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--text3); flex-shrink:0;}\r\n  .nc-step{font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.2em; color:var(--muted); text-transform:uppercase;}\r\n  .nc-title{font-family:'Space Grotesk',sans-serif; font-size:20px; font-weight:700;}\r\n\r\n  .shift-option{width:100%; text-align:left; padding:16px; border-radius:12px; border:1px solid var(--border); background:var(--panel); display:flex; align-items:center; gap:12px; margin-bottom:12px; transition:border-color 0.15s, background 0.15s;}\r\n  .shift-option .dot{width:10px; height:10px;}\r\n  .shift-option .shift-name{font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:15px;}\r\n  .shift-option .shift-time{font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--muted); margin-top:2px;}\r\n\r\n  .active-shift-tag{display:flex; align-items:center; gap:8px; margin-bottom:16px; font-size:13px; color:var(--muted2);}\r\n\r\n  .proc-card{border-radius:12px; border:1px solid var(--border); background:var(--panel); margin-bottom:10px; transition:border-color 0.15s, background 0.15s;}\r\n  .proc-card.selected{border-color:var(--accent); background:var(--accent-soft);}\r\n  .proc-card-btn{width:100%; display:flex; align-items:center; gap:12px; padding:14px; text-align:left;}\r\n  .checkbox{width:20px; height:20px; border-radius:6px; border:2px solid var(--border); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:border-color 0.15s, background 0.15s;}\r\n  .checkbox.checked{border-color:var(--accent); background:var(--accent);}\r\n  .proc-name{font-size:14px; font-weight:500; color:var(--text2);}\r\n  .dur-row{padding:0 14px 14px; display:flex; flex-wrap:wrap; gap:6px;}\r\n  .dur-chip{font-family:'IBM Plex Mono',monospace; font-size:12px; padding:6px 10px; border-radius:8px; background:var(--chip); color:var(--muted2); border:1px solid var(--border); transition:background 0.15s, color 0.15s;}\r\n  .dur-chip.selected{background:var(--accent); color:#fff; border-color:var(--accent);}\r\n\r\n  .save-bar{position:sticky; bottom:0; padding-top:16px; margin-top:16px; background:linear-gradient(to top, var(--bg) 60%, transparent);}\r\n  .save-btn{width:100%; padding:14px; border-radius:12px; font-family:'Space Grotesk',sans-serif; font-weight:600; color:#fff; background:var(--accent); display:flex; align-items:center; justify-content:center; gap:8px; transition:opacity 0.15s;}\r\n  .save-btn:disabled{opacity:0.4;}\n\n  @media (max-width: 520px){\n    .wrap{max-width:none; width:100%; padding:18px 8px 14px;}\n    .header{margin-bottom:20px; gap:10px; padding:0 2px;}\n    .header .date{font-size:12px; letter-spacing:0.13em;}\n    .header h1{font-size:26px; line-height:1.1;}\n    .header .icon{width:50px; height:50px;}\n    .ring-card{padding:16px 12px; margin-bottom:24px;}\n    .ring-row{gap:12px;}\n    .ring-box{width:188px; height:188px;}\n    .ring-box > svg{width:188px; height:188px;}\n    .ring-center .num{font-size:38px;}\n    .ring-center .lbl{font-size:11px;}\n    .ring-legend{gap:13px;}\n    .ring-legend-row .label,\n    .ring-legend-row .count{font-size:17px;}\n    .ring-legend-row .now-tag{font-size:11px;}\n    .section{margin-bottom:24px;}\n    .section h2{font-size:15px;}\n    .bar-top .name,\n    .bar-top .count{font-size:17px;}\n    .bar-track{height:9px;}\n    .trend-chart{height:160px; gap:8px;}\n    .trend-count{font-size:12px; height:14px;}\n    .trend-label{font-size:13px;}\n    .fab{width:88px; height:88px; margin:10px auto 24px;}\n    .fab svg{width:42px; height:42px;}\n    .shift-option{padding:18px 16px;}\n    .shift-option .shift-name{font-size:17px;}\n    .shift-option .shift-time{font-size:13px;}\n    .proc-card-btn{padding:16px;}\n    .proc-name{font-size:16px;}\n    .dur-chip{font-size:13px; padding:8px 12px;}\n    .save-btn{padding:16px; font-size:16px;}\n  }\n\n  @media (max-width: 380px){\n    .ring-box{width:180px; height:180px;}\n    .ring-box > svg{width:180px; height:180px;}\n    .ring-legend-row .label,\n    .ring-legend-row .count{font-size:16px;}\n  }\n\n  svg{display:block;}\n</style>\n</head>\r\n<body>\r\n\r\n<div id=\"loading-screen\" class=\"loading-screen\">\r\n  <div class=\"spinner\"></div>\r\n  <span>Memuatkan data dari Sheet...</span>\r\n</div>\r\n\r\n<div id=\"dashboard-view\" class=\"wrap hidden\"></div>\r\n<div id=\"newcase-view\" class=\"wrap hidden\"></div>\r\n\r\n<button id=\"fab\" class=\"fab hidden\" aria-label=\"Tambah kes baru\">\n  <svg width=\"36\" height=\"36\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"></line><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line></svg>\n</button>\n\r\n<div id=\"modal-root\"></div>\r\n<div id=\"toast-root\"></div>\r\n\r\n<script>\r\n// ====================== CONFIG ======================\r\n// IMPORTANT: this must be the exact Web App \"/exec\" URL from Deploy > Manage\r\n// deployments. We hardcode it rather than deriving from window.location.href,\r\n// because Apps Script's served page can load through an intermediate\r\n// googleusercontent.com proxy URL â€” using that proxy URL for POST/GET calls\r\n// causes silent failures. Always the *exec* URL, not the dev/HEAD one.\r\nconst BASE_URL = \"%%BASE_URL%%\";\r\nconst DATA_URL = BASE_URL + \"?action=data\";\r\n\r\nconst SHIFTS = [\r\n  { id: \"morning\", label: \"Pagi\", time: \"07:00 â€“ 14:00\", color: \"var(--pagi)\", hex: \"#F2A93B\", glow: \"var(--pagi-glow)\" },\r\n  { id: \"evening\", label: \"Petang\", time: \"14:00 â€“ 21:00\", color: \"var(--petang)\", hex: \"#E2622E\", glow: \"var(--petang-glow)\" },\r\n  { id: \"night\", label: \"Malam\", time: \"21:00 â€“ 07:00\", color: \"var(--malam)\", hex: \"#5B7FE0\", glow: \"var(--malam-glow)\" },\r\n];\r\n\r\nconst PROCEDURES = [\r\n  \"Dressing\",\"T&S\",\"Eye Irrigation\",\"Ambulance Call\",\"Change CBD\",\r\n  \"Change Ryle's Tube\",\"Blood Taking\",\"Suture Removal (S.T.O)\",\"Blood for TSB\",\"Nail Avulsion\",\r\n];\r\n\r\nconst DURATIONS = [\n  { id: \"10m\", label: \"10 min\", minutes: 10 },\n  { id: \"15m\", label: \"15 min\", minutes: 15 },\n  { id: \"30m\", label: \"30 min\", minutes: 30 },\n  { id: \"1h\", label: \"1 jam\", minutes: 60 },\n  { id: \"2h\", label: \"2 jam\", minutes: 120 },\n];\n\nfunction shiftMeta(id){ return SHIFTS.find(s => s.id === id); }\nfunction todayKey(){\n  const d = new Date();\n  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,\"0\")}-${String(d.getDate()).padStart(2,\"0\")}`;\n}\nfunction dateKeyOffset(daysAgo){\n  const d = new Date();\n  d.setDate(d.getDate() - daysAgo);\n  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,\"0\")}-${String(d.getDate()).padStart(2,\"0\")}`;\n}\nfunction visibleTrendDateKeys(){\n  const keys = new Set();\n  for(let i=0;i<7;i++) keys.add(dateKeyOffset(i));\n  return keys;\n}\nfunction normalizeDateKey(value){\n  if(!value) return \"\";\n  if(value instanceof Date && !Number.isNaN(value.getTime())){\n    return `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,\"0\")}-${String(value.getDate()).padStart(2,\"0\")}`;\n  }\n  const raw = String(value).trim();\n  if(/^\\d{4}-\\d{1,2}-\\d{1,2}T/.test(raw)){\n    const parsedIso = new Date(raw);\n    if(!Number.isNaN(parsedIso.getTime())){\n      return `${parsedIso.getFullYear()}-${String(parsedIso.getMonth()+1).padStart(2,\"0\")}-${String(parsedIso.getDate()).padStart(2,\"0\")}`;\n    }\n  }\n  const iso = raw.match(/^(\\d{4})-(\\d{1,2})-(\\d{1,2})/);\n  if(iso) return `${iso[1]}-${iso[2].padStart(2,\"0\")}-${iso[3].padStart(2,\"0\")}`;\n  const slash = raw.match(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})/);\n  if(slash){\n    const a = Number(slash[1]);\n    const b = Number(slash[2]);\n    const year = slash[3];\n    const day = a > 12 ? a : b;\n    const month = a > 12 ? b : a;\n    return `${year}-${String(month).padStart(2,\"0\")}-${String(day).padStart(2,\"0\")}`;\n  }\n  const parsed = new Date(raw);\n  if(!Number.isNaN(parsed.getTime())){\n    return `${parsed.getFullYear()}-${String(parsed.getMonth()+1).padStart(2,\"0\")}-${String(parsed.getDate()).padStart(2,\"0\")}`;\n  }\n  return raw;\n}\nfunction esc(str){\n  const div = document.createElement(\"div\");\n  div.textContent = str;\n  return div.innerHTML;\n}\n// ====================== STATE ======================\nlet state = {\n  cases: [],\n  dashboardDate: todayKey(),\n  view: \"dashboard\", // dashboard | newcase\n  step: 1,\r\n  selectedShift: null,\r\n  selectedProcs: {}, // { name: durationId }\r\n  syncError: false,\r\n  saving: false,\r\n};\r\n\r\n// ====================== DATA LAYER ======================\r\nasync function loadCases(){\n  state.dashboardDate = todayKey();\n  document.getElementById(\"loading-screen\").classList.remove(\"hidden\");\n  document.getElementById(\"dashboard-view\").classList.add(\"hidden\");\n  document.getElementById(\"fab\").classList.add(\"hidden\");\r\n  try{\n    const res = await fetch(`${DATA_URL}&_=${Date.now()}`, { method: \"GET\", cache: \"no-store\" });\n    const rows = await res.json();\n    const dataRows = rows.slice(1); // skip header\n    const grouped = {};\n    const trendDateKeys = visibleTrendDateKeys();\n    dataRows.forEach((row, idx) => {\n      const [ts, date, time, shift, procedure, minutes] = row;\n      const dateKey = normalizeDateKey(date);\n      if(!trendDateKeys.has(dateKey)) return;\n      const key = `${ts}|${dateKey}|${time}|${shift}`;\n      if(!grouped[key]){\n        grouped[key] = { id: `remote_${idx}_${ts}`, date: dateKey, time, shift, procedures: [] };\n      }\n      const durMin = Number(minutes);\r\n      const durMatch = DURATIONS.find(d => d.minutes === durMin);\r\n      grouped[key].procedures.push({\r\n        name: procedure,\r\n        minutes: durMin,\r\n        durationLabel: durMatch ? durMatch.label : `${durMin} min`,\r\n      });\r\n    });\r\n    state.cases = Object.values(grouped);\r\n    state.syncError = false;\r\n  }catch(e){\r\n    console.error(\"Load failed:\", e);\r\n    state.syncError = true;\r\n  }\r\n  document.getElementById(\"loading-screen\").classList.add(\"hidden\");\r\n  document.getElementById(\"fab\").classList.remove(\"hidden\");\r\n  renderView();\r\n}\r\n\r\nasync function saveCase(newCase){\r\n  state.saving = true;\r\n  try{\r\n    const res = await fetch(BASE_URL, {\r\n      method: \"POST\",\r\n      headers: { \"Content-Type\": \"text/plain;charset=utf-8\" },\r\n      body: JSON.stringify(newCase),\r\n    });\r\n    const resultText = await res.text();\r\n    console.log(\"POST status:\", res.status, \"body:\", resultText);\r\n    let parsed;\r\n    try{ parsed = JSON.parse(resultText); }catch(_){ parsed = null; }\r\n    if(!res.ok || !parsed || parsed.result !== \"success\"){\r\n      throw new Error(\"Server did not confirm success: \" + resultText.slice(0,200));\r\n    }\r\n    state.cases.push(newCase);\r\n    state.syncError = false;\r\n    showToast(\"Kes disimpan ke Google Sheet\");\r\n  }catch(e){\r\n    console.error(\"Save failed:\", e);\r\n    state.cases.push(newCase);\r\n    state.syncError = true;\r\n    showToast(\"Disimpan, tapi gagal sync ke Sheet\");\r\n  }\r\n  state.saving = false;\r\n  state.view = \"dashboard\";\r\n  state.step = 1;\r\n  state.selectedShift = null;\r\n  state.selectedProcs = {};\r\n  renderView();\r\n}\r\n\r\nfunction deleteCaseLocal(id){\r\n  state.cases = state.cases.filter(c => c.id !== id);\r\n  renderView();\r\n}\r\n\r\n// ====================== TOAST ======================\r\nfunction showToast(msg){\r\n  const root = document.getElementById(\"toast-root\");\r\n  root.innerHTML = `<div class=\"toast\">\r\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#1C9665\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"></polyline></svg>\r\n    ${esc(msg)}\r\n  </div>`;\r\n  setTimeout(() => { root.innerHTML = \"\"; }, 3200);\r\n}\r\n\r\n// ====================== RENDER: DASHBOARD ======================\r\nfunction renderDashboard(){\n  const today = state.dashboardDate;\n  const now = new Date();\n  const todayCases = state.cases.filter(c => c.date === today);\r\n\r\n  // Stats\r\n  const procCount = {};\r\n  const shiftCount = { morning: 0, evening: 0, night: 0 };\r\n  let totalProcedures = 0;\r\n  todayCases.forEach(c => {\r\n    shiftCount[c.shift] = (shiftCount[c.shift] || 0) + c.procedures.length;\r\n    c.procedures.forEach(p => {\r\n      procCount[p.name] = (procCount[p.name] || 0) + 1;\r\n      totalProcedures++;\r\n    });\r\n  });\r\n  const topProcedures = Object.entries(procCount).sort((a,b) => b[1]-a[1]).slice(0,5);\r\n  const maxProcCount = topProcedures.length ? topProcedures[0][1] : 1;\r\n\r\n  // 7-day trend\r\n  const days = [];\r\n  for(let i=6;i>=0;i--){\r\n    const d = new Date();\r\n    d.setDate(d.getDate()-i);\r\n    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,\"0\")}-${String(d.getDate()).padStart(2,\"0\")}`;\r\n    const count = state.cases.filter(c => c.date === key).reduce((sum,c) => sum + c.procedures.length, 0);\r\n    days.push({ label: d.toLocaleDateString(\"ms-MY\",{weekday:\"short\"}).slice(0,3), count, isToday: key === today });\r\n  }\r\n  const maxDay = Math.max(...days.map(d=>d.count), 1);\r\n\r\n  const h = now.getHours();\r\n  const currentShiftId = (h>=7 && h<14) ? \"morning\" : (h>=14 && h<21) ? \"evening\" : \"night\";\r\n\r\n  // Ring geometry\r\n  const total = Math.max(shiftCount.morning + shiftCount.evening + shiftCount.night, 1);\r\n  const R = 72, CIRC = 2*Math.PI*R, gapLen = (6/360)*CIRC;\r\n  let cursor = 0;\r\n  const arcs = SHIFTS.map(s => {\r\n    const val = shiftCount[s.id] || 0;\r\n    const rawLen = (val/total) * (CIRC - gapLen*3);\r\n    const len = val > 0 ? Math.max(rawLen, 10) : 0;\r\n    const start = cursor;\r\n    cursor += len + gapLen;\r\n    return { ...s, val, len, start };\r\n  });\r\n\r\n  const html = `\r\n    <div class=\"header\">\r\n      <div>\n        <div class=\"date\">ETD &middot; ${esc(now.toLocaleDateString(\"ms-MY\",{day:\"numeric\",month:\"long\",year:\"numeric\"}))}</div>\n        <h1>Log Prosedur Assistan Medical Officer (A.M.O)</h1>\n      </div>\n      <div class=\"icon\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#1C9665\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2\"></path><rect x=\"9\" y=\"3\" width=\"6\" height=\"4\" rx=\"1\"></rect></svg>\n      </div>\n    </div>\n\r\n    ${state.syncError ? `\r\n      <button class=\"sync-warn\" onclick=\"loadCases()\">\r\n        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex-shrink:0\"><path d=\"M2 12c0-1 .4-2 1-3l1.4-1.4\"></path><path d=\"M22 12c0 1-.4 2-1 3l-1.4 1.4\"></path><line x1=\"2\" y1=\"2\" x2=\"22\" y2=\"22\"></line></svg>\r\n        <span>Tak dapat sync dengan Google Sheet. Data baru disimpan dalam app sahaja. Tekan untuk cuba lagi.</span>\r\n      </button>\r\n    ` : \"\"}\r\n\r\n    <div class=\"ring-card\">\r\n      <div class=\"ring-row\">\r\n        <div class=\"ring-box\">\r\n          <svg width=\"168\" height=\"168\" viewBox=\"0 0 168 168\" style=\"transform:rotate(-90deg)\">\r\n            <circle cx=\"84\" cy=\"84\" r=\"${R}\" fill=\"none\" stroke=\"#F1EEE5\" stroke-width=\"14\"/>\r\n            ${arcs.map(arc => `\r\n              <circle cx=\"84\" cy=\"84\" r=\"${R}\" fill=\"none\" stroke=\"${arc.hex}\" stroke-width=\"14\" stroke-linecap=\"round\"\r\n                stroke-dasharray=\"${arc.len} ${CIRC-arc.len}\" stroke-dashoffset=\"${-arc.start}\"\r\n                opacity=\"${arc.id===currentShiftId ? 1 : 0.55}\" style=\"transition:stroke-dasharray 0.7s ease-out\"/>\r\n            `).join(\"\")}\r\n          </svg>\r\n          <div class=\"ring-center\">\r\n            <span class=\"num\">${todayCases.length}</span>\r\n            <span class=\"lbl\">kes hari ini</span>\r\n          </div>\r\n        </div>\r\n        <div class=\"ring-legend\">\r\n          ${SHIFTS.map(s => `\r\n            <div class=\"ring-legend-row\">\r\n              <div class=\"ring-legend-left\">\r\n                <span class=\"dot\" style=\"background:${s.hex}; ${s.id===currentShiftId ? `box-shadow:0 0 0 3px ${s.glow}` : \"\"}\"></span>\r\n                <span class=\"label\">${s.label}</span>\r\n                ${s.id===currentShiftId ? `<span class=\"now-tag\">sekarang</span>` : \"\"}\r\n              </div>\r\n              <span class=\"count\">${shiftCount[s.id] || 0}</span>\r\n            </div>\r\n          `).join(\"\")}\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"section\">\r\n      <h2>Prosedur paling kerap</h2>\r\n      ${topProcedures.length === 0 ? `<div class=\"empty-note\">Belum ada prosedur direkod hari ini.</div>` : `\r\n        ${topProcedures.map(([name,count],i) => `\r\n          <div class=\"bar-row\">\r\n            <div class=\"bar-top\"><span class=\"name\">${esc(name)}</span><span class=\"count\">${count}</span></div>\r\n            <div class=\"bar-track\"><div class=\"bar-fill\" style=\"width:${Math.max((count/maxProcCount)*100,5)}%; background:${i===0 ? \"linear-gradient(90deg,#6FE3A8,#4FC890)\" : \"#E4E0D5\"}\"></div></div>\r\n          </div>\r\n        `).join(\"\")}\r\n      `}\r\n    </div>\r\n\r\n    <div class=\"section\">\r\n      <h2>Trend 7 hari</h2>\r\n      <div class=\"trend-chart\">\r\n        ${days.map(d => `\r\n          <div class=\"trend-col\">\r\n            <span class=\"trend-count\">${d.count || \"\"}</span>\r\n            <div class=\"trend-bar\" style=\"height:${Math.max((d.count/maxDay)*100, d.count>0?6:2)}%; background:${d.isToday ? \"linear-gradient(180deg,#6FE3A8,#2F8F66)\" : \"#E4E0D5\"}\"></div>\r\n            <span class=\"trend-label ${d.isToday ? \"today\" : \"\"}\">${esc(d.label)}</span>\r\n          </div>\r\n        `).join(\"\")}\r\n      </div>\r\n    </div>\r\n\r\n  `;\n\n  document.getElementById(\"dashboard-view\").innerHTML = html;\n}\n\n// ====================== RENDER: NEW CASE ======================\nfunction renderNewCase(){\r\n  const view = document.getElementById(\"newcase-view\");\r\n\r\n  if(state.step === 1){\r\n    view.innerHTML = `\r\n      <div class=\"nc-header\">\r\n        <button class=\"back-btn\" onclick=\"goBackToDashboard()\">\r\n          <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"15 18 9 12 15 6\"></polyline></svg>\r\n        </button>\r\n        <div>\r\n          <div class=\"nc-step\">Kes baru &middot; Langkah 1/2</div>\r\n          <div class=\"nc-title\">Pilih shift</div>\r\n        </div>\r\n      </div>\r\n      <div>\r\n        ${SHIFTS.map(s => `\r\n          <button class=\"shift-option\" onclick=\"selectShift('${s.id}')\">\r\n            <span class=\"dot\" style=\"background:${s.hex}\"></span>\r\n            <div>\r\n              <div class=\"shift-name\">${s.label}</div>\r\n              <div class=\"shift-time\">${s.time}</div>\r\n            </div>\r\n          </button>\r\n        `).join(\"\")}\r\n      </div>\r\n    `;\r\n    return;\r\n  }\r\n\r\n  // step 2\r\n  const activeShift = shiftMeta(state.selectedShift);\r\n  const selectedCount = Object.keys(state.selectedProcs).length;\r\n\r\n  view.innerHTML = `\r\n    <div class=\"nc-header\">\r\n      <button class=\"back-btn\" onclick=\"state.step=1; renderView();\">\r\n        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"15 18 9 12 15 6\"></polyline></svg>\r\n      </button>\r\n      <div>\r\n        <div class=\"nc-step\">Kes baru &middot; Langkah 2/2</div>\r\n        <div class=\"nc-title\">Prosedur & tempoh</div>\r\n      </div>\r\n    </div>\r\n    <div class=\"active-shift-tag\">\r\n      <span class=\"dot\" style=\"background:${activeShift.hex}; width:8px; height:8px;\"></span>\r\n      <span>Shift ${activeShift.label} &middot; ${activeShift.time}</span>\r\n    </div>\r\n    <div>\r\n      ${PROCEDURES.map(name => {\r\n        const isSelected = !!state.selectedProcs[name];\r\n        const safeId = name.replace(/[^a-zA-Z0-9]/g,\"_\");\r\n        return `\r\n          <div class=\"proc-card ${isSelected ? \"selected\" : \"\"}\" id=\"card_${safeId}\">\r\n            <button class=\"proc-card-btn\" onclick=\"toggleProcedure('${name.replace(/'/g,\"\\\\'\")}')\">\r\n              <span class=\"checkbox ${isSelected ? \"checked\" : \"\"}\">\r\n                ${isSelected ? `<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"white\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"></polyline></svg>` : \"\"}\r\n              </span>\r\n              <span class=\"proc-name\">${esc(name)}</span>\r\n            </button>\r\n            ${isSelected ? `\r\n              <div class=\"dur-row\">\r\n                ${DURATIONS.map(d => `\r\n                  <button class=\"dur-chip ${state.selectedProcs[name]===d.id ? \"selected\" : \"\"}\" onclick=\"setDuration('${name.replace(/'/g,\"\\\\'\")}','${d.id}')\">${d.label}</button>\r\n                `).join(\"\")}\r\n              </div>\r\n            ` : \"\"}\r\n          </div>\r\n        `;\r\n      }).join(\"\")}\r\n    </div>\r\n    <div class=\"save-bar\">\r\n      <button class=\"save-btn\" id=\"save-btn\" ${selectedCount===0 || state.saving ? \"disabled\" : \"\"} onclick=\"handleSaveCase()\">\r\n        Simpan kes ${selectedCount>0 ? `(${selectedCount} prosedur)` : \"\"}\r\n      </button>\r\n    </div>\r\n  `;\r\n}\r\n\r\nfunction selectShift(id){\r\n  state.selectedShift = id;\r\n  state.step = 2;\r\n  renderView();\r\n}\r\n\r\nfunction toggleProcedure(name){\r\n  if(state.selectedProcs[name]){\r\n    delete state.selectedProcs[name];\r\n  }else{\r\n    state.selectedProcs[name] = \"15m\";\r\n  }\r\n  renderView();\r\n}\r\n\r\nfunction setDuration(name, durId){\r\n  state.selectedProcs[name] = durId;\r\n  renderView();\r\n}\r\n\r\nfunction goBackToDashboard(){\r\n  state.view = \"dashboard\";\r\n  state.step = 1;\r\n  state.selectedShift = null;\r\n  state.selectedProcs = {};\r\n  renderView();\r\n}\r\n\r\nfunction handleSaveCase(){\r\n  const now = new Date();\r\n  const newCase = {\r\n    id: `case_${now.getTime()}_${Math.random().toString(36).slice(2,7)}`,\r\n    date: todayKey(),\r\n    time: now.toLocaleTimeString(\"ms-MY\",{hour:\"2-digit\",minute:\"2-digit\"}),\r\n    shift: state.selectedShift,\r\n    procedures: Object.entries(state.selectedProcs).map(([name,durId]) => {\r\n      const dur = DURATIONS.find(d => d.id === durId);\r\n      return { name, durationId: durId, durationLabel: dur.label, minutes: dur.minutes };\r\n    }),\r\n  };\r\n  saveCase(newCase);\r\n}\r\n\r\n// ====================== MAIN RENDER SWITCH ======================\r\nfunction renderView(){\r\n  const dash = document.getElementById(\"dashboard-view\");\r\n  const nc = document.getElementById(\"newcase-view\");\r\n  const fab = document.getElementById(\"fab\");\r\n\r\n  if(state.view === \"dashboard\"){\r\n    dash.classList.remove(\"hidden\");\r\n    nc.classList.add(\"hidden\");\r\n    fab.classList.remove(\"hidden\");\r\n    renderDashboard();\r\n  }else{\r\n    dash.classList.add(\"hidden\");\r\n    nc.classList.remove(\"hidden\");\r\n    fab.classList.add(\"hidden\");\r\n    renderNewCase();\r\n  }\r\n}\r\n\r\ndocument.getElementById(\"fab\").addEventListener(\"click\", () => {\n  state.view = \"newcase\";\n  state.step = 1;\n  renderView();\n});\n\nfunction reloadIfDateChanged(){\n  const currentDate = todayKey();\n  if(state.dashboardDate !== currentDate){\n    state.cases = [];\n    state.dashboardDate = currentDate;\n    if(state.view === \"dashboard\") renderView();\n    loadCases();\n  }\n}\nsetInterval(reloadIfDateChanged, 60000);\n\n// ====================== INIT ======================\nloadCases();\n</script>\r\n</body>\r\n</html>\r\n\r\n";

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

  const html = DASHBOARD_HTML.replace("%%BASE_URL%%", ScriptApp.getService().getUrl());
  return HtmlService
    .createHtmlOutput(html)
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


// ====================== SUMMARY AND GRAPH FUNCTIONS ======================
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

