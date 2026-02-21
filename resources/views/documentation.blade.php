<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>UPIP API Reference — Unified Preventive Intelligence Platform</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0a0c0f;
    --surface: #111418;
    --surface2: #181c22;
    --surface3: #1f242d;
    --border: #252b35;
    --border2: #2e3643;
    --text: #e2e8f0;
    --text-dim: #8492a6;
    --text-dimmer: #4a5568;
    --accent: #00d4aa;
    --accent-dim: rgba(0,212,170,0.12);
    --accent-dim2: rgba(0,212,170,0.06);
    --blue: #4f9cf9;
    --blue-dim: rgba(79,156,249,0.12);
    --orange: #f97316;
    --orange-dim: rgba(249,115,22,0.12);
    --red: #f87171;
    --red-dim: rgba(248,113,113,0.10);
    --yellow: #fbbf24;
    --yellow-dim: rgba(251,191,36,0.10);
    --purple: #a78bfa;
    --purple-dim: rgba(167,139,250,0.10);
    --green: #34d399;
    --green-dim: rgba(52,211,153,0.10);
    --sidebar-w: 280px;
    --font-mono: 'IBM Plex Mono', monospace;
    --font-sans: 'IBM Plex Sans', sans-serif;
    --font-display: 'Space Mono', monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-sans);
    font-size: 14px;
    line-height: 1.6;
    display: flex;
    min-height: 100vh;
  }

  /* ── SIDEBAR ─────────────────────────────────────────────────── */
  .sidebar {
    width: var(--sidebar-w);
    min-height: 100vh;
    background: var(--surface);
    border-right: 1px solid var(--border);
    position: fixed;
    top: 0; left: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    z-index: 100;
  }

  .sidebar-header {
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-logo {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .sidebar-tagline {
    font-size: 11px;
    color: var(--text-dimmer);
    margin-top: 4px;
    font-family: var(--font-mono);
  }

  .sidebar-version {
    display: inline-block;
    margin-top: 10px;
    font-family: var(--font-mono);
    font-size: 10px;
    background: var(--accent-dim);
    color: var(--accent);
    border: 1px solid rgba(0,212,170,0.25);
    padding: 2px 8px;
    border-radius: 3px;
  }

  .sidebar-nav { padding: 12px 0; flex: 1; }

  .nav-group { margin-bottom: 4px; }

  .nav-group-label {
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-dimmer);
    padding: 10px 20px 4px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 20px;
    color: var(--text-dim);
    text-decoration: none;
    font-size: 12.5px;
    transition: all 0.15s;
    border-left: 2px solid transparent;
    cursor: pointer;
  }

  .nav-item:hover, .nav-item.active {
    color: var(--text);
    background: var(--accent-dim2);
    border-left-color: var(--accent);
  }

  .nav-method {
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 600;
    padding: 1px 5px;
    border-radius: 2px;
    min-width: 34px;
    text-align: center;
    flex-shrink: 0;
  }

  .method-get    { background: var(--blue-dim);   color: var(--blue);   }
  .method-post   { background: var(--green-dim);  color: var(--green);  }
  .method-put    { background: var(--yellow-dim); color: var(--yellow); }
  .method-delete { background: var(--red-dim);    color: var(--red);    }

  /* ── MAIN CONTENT ─────────────────────────────────────────────── */
  .main {
    margin-left: var(--sidebar-w);
    flex: 1;
    max-width: 100%;
  }

  .hero {
    background: linear-gradient(135deg, #0a0c0f 0%, #0d1520 50%, #0a1218 100%);
    border-bottom: 1px solid var(--border);
    padding: 64px 60px 56px;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero::after {
    content: '';
    position: absolute;
    bottom: 0; left: 200px;
    right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.3;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--accent);
    background: var(--accent-dim);
    border: 1px solid rgba(0,212,170,0.3);
    padding: 4px 12px;
    border-radius: 3px;
    margin-bottom: 20px;
  }

  .hero-badge::before { content: '◆'; font-size: 7px; }

  .hero h1 {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 12px;
  }

  .hero h1 span { color: var(--accent); }

  .hero-desc {
    font-size: 15px;
    color: var(--text-dim);
    max-width: 620px;
    line-height: 1.7;
    margin-bottom: 28px;
  }

  .hero-meta {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }

  .hero-meta-item {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-dimmer);
  }

  .hero-meta-item span { color: var(--text-dim); }

  .governance-strip {
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
    padding: 12px 60px;
    display: flex;
    gap: 0;
    font-family: var(--font-mono);
    font-size: 11px;
    overflow-x: auto;
  }

  .gov-item {
    display: flex;
    align-items: center;
    gap: 0;
    white-space: nowrap;
  }

  .gov-role {
    color: var(--text-dimmer);
    padding: 0 8px;
  }

  .gov-action {
    color: var(--accent);
    font-weight: 600;
  }

  .gov-arrow {
    color: var(--border2);
    padding: 0 6px;
  }

  /* ── CONTENT SECTIONS ─────────────────────────────────────────── */
  .content { padding: 0 60px 80px; }

  .section {
    padding-top: 56px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 56px;
  }

  .section:last-child { border-bottom: none; }

  .section-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 32px;
  }

  .section-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .section-title {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 700;
    color: #fff;
  }

  .section-subtitle {
    font-size: 12px;
    color: var(--text-dimmer);
    font-family: var(--font-mono);
    margin-top: 2px;
  }

  /* ── ENDPOINT CARDS ─────────────────────────────────────────────── */
  .endpoint {
    margin-bottom: 32px;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    background: var(--surface);
  }

  .endpoint-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    user-select: none;
    transition: background 0.15s;
  }

  .endpoint-header:hover { background: var(--surface2); }

  .endpoint-method {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 4px;
    min-width: 52px;
    text-align: center;
  }

  .endpoint-path {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text);
    flex: 1;
  }

  .endpoint-path .path-param {
    color: var(--orange);
  }

  .endpoint-desc {
    font-size: 12px;
    color: var(--text-dim);
    margin-left: auto;
    text-align: right;
  }

  .endpoint-auth {
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--yellow);
    background: var(--yellow-dim);
    border: 1px solid rgba(251,191,36,0.2);
    padding: 3px 8px;
    border-radius: 3px;
    white-space: nowrap;
  }

  .endpoint-body { padding: 20px; }

  .endpoint-summary {
    font-size: 13px;
    color: var(--text-dim);
    margin-bottom: 20px;
    line-height: 1.65;
  }

  /* ── TABLES ──────────────────────────────────────────────────── */
  .param-section { margin-bottom: 24px; }

  .param-section-title {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dimmer);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .param-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12.5px;
  }

  th {
    text-align: left;
    padding: 8px 12px;
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text-dimmer);
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
  }

  td {
    padding: 9px 12px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }

  tr:last-child td { border-bottom: none; }

  tr:hover td { background: var(--surface2); }

  .td-name {
    font-family: var(--font-mono);
    color: var(--blue);
    font-size: 12px;
    white-space: nowrap;
  }

  .td-type {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--purple);
  }

  .td-required {
    font-family: var(--font-mono);
    font-size: 10px;
  }

  .req-yes { color: var(--red); }
  .req-no  { color: var(--text-dimmer); }
  .req-cond { color: var(--yellow); }

  /* ── CODE BLOCKS ─────────────────────────────────────────────── */
  .code-block {
    background: var(--surface3);
    border: 1px solid var(--border2);
    border-radius: 8px;
    overflow: hidden;
    margin: 12px 0;
  }

  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid var(--border);
  }

  .code-lang {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-dimmer);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .code-copy {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-dimmer);
    cursor: pointer;
    background: none;
    border: none;
    padding: 2px 6px;
    border-radius: 3px;
    transition: all 0.15s;
  }

  .code-copy:hover { color: var(--accent); background: var(--accent-dim2); }

  pre {
    padding: 16px;
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1.65;
    color: var(--text);
  }

  .hl-key    { color: var(--blue); }
  .hl-str    { color: var(--green); }
  .hl-num    { color: var(--purple); }
  .hl-bool   { color: var(--orange); }
  .hl-null   { color: var(--text-dimmer); }
  .hl-comment{ color: var(--text-dimmer); font-style: italic; }

  /* ── RESPONSE TABS ────────────────────────────────────────────── */
  .response-tabs {
    display: flex;
    gap: 2px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .response-tab {
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 5px 12px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--text-dim);
    transition: all 0.15s;
  }

  .response-tab.active, .response-tab:hover { color: var(--text); }
  .response-tab.s2xx { border-color: rgba(52,211,153,0.3); }
  .response-tab.s2xx.active { background: var(--green-dim); color: var(--green); }
  .response-tab.s4xx { border-color: rgba(251,191,36,0.3); }
  .response-tab.s4xx.active { background: var(--yellow-dim); color: var(--yellow); }
  .response-tab.s5xx { border-color: rgba(248,113,113,0.3); }
  .response-tab.s5xx.active { background: var(--red-dim); color: var(--red); }

  /* ── TAGS / BADGES ────────────────────────────────────────────── */
  .badge {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 10px;
    padding: 2px 7px;
    border-radius: 3px;
    vertical-align: middle;
  }

  .badge-consent  { background: var(--accent-dim); color: var(--accent); border: 1px solid rgba(0,212,170,0.25); }
  .badge-role     { background: var(--purple-dim); color: var(--purple); border: 1px solid rgba(167,139,250,0.25); }
  .badge-encrypt  { background: var(--orange-dim); color: var(--orange); border: 1px solid rgba(249,115,22,0.25); }
  .badge-phase    { background: var(--blue-dim);   color: var(--blue);   border: 1px solid rgba(79,156,249,0.25); }
  .badge-new      { background: var(--yellow-dim); color: var(--yellow); border: 1px solid rgba(251,191,36,0.25); }

  /* ── ALERT BOXES ──────────────────────────────────────────────── */
  .alert {
    border-radius: 8px;
    padding: 14px 16px;
    margin: 16px 0;
    font-size: 13px;
    display: flex;
    gap: 12px;
    line-height: 1.6;
  }

  .alert-icon { flex-shrink: 0; margin-top: 1px; }

  .alert-info    { background: var(--blue-dim);   border: 1px solid rgba(79,156,249,0.2);  color: #93c5fd; }
  .alert-warn    { background: var(--yellow-dim); border: 1px solid rgba(251,191,36,0.2);  color: #fcd34d; }
  .alert-danger  { background: var(--red-dim);    border: 1px solid rgba(248,113,113,0.2); color: #fca5a5; }
  .alert-success { background: var(--green-dim);  border: 1px solid rgba(52,211,153,0.2);  color: #6ee7b7; }

  /* ── OVERVIEW TABLE ───────────────────────────────────────────── */
  .overview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 32px;
  }

  .overview-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
  }

  .overview-card-label {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-dimmer);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }

  .overview-card-value {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--accent);
  }

  /* ── FORMULA BOX ──────────────────────────────────────────────── */
  .formula {
    background: var(--surface3);
    border: 1px solid var(--border2);
    border-left: 3px solid var(--accent);
    border-radius: 0 8px 8px 0;
    padding: 16px 20px;
    margin: 16px 0;
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.8;
    color: var(--text);
  }

  .formula .f-comment { color: var(--text-dimmer); font-style: italic; }
  .formula .f-var { color: var(--blue); }
  .formula .f-op  { color: var(--text-dimmer); }
  .formula .f-val { color: var(--green); }

  /* ── SCROLLBAR ────────────────────────────────────────────────── */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-dimmer); }

  /* ── SEARCH ───────────────────────────────────────────────────── */
  .search-wrap {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
  }

  .search-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 7px 10px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text);
    outline: none;
    transition: border-color 0.15s;
  }

  .search-input::placeholder { color: var(--text-dimmer); }
  .search-input:focus { border-color: var(--accent); }

  /* ── INLINE MONO ──────────────────────────────────────────────── */
  code {
    font-family: var(--font-mono);
    font-size: 11.5px;
    background: var(--surface3);
    border: 1px solid var(--border);
    padding: 1px 5px;
    border-radius: 3px;
    color: var(--accent);
  }

  /* ── DIVIDER ──────────────────────────────────────────────────── */
  .divider {
    height: 1px;
    background: var(--border);
    margin: 24px 0;
  }

  h3 {
    font-family: var(--font-sans);
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    margin: 20px 0 10px;
  }

  p { color: var(--text-dim); line-height: 1.7; margin-bottom: 10px; }
  p:last-child { margin-bottom: 0; }

  ul { padding-left: 20px; color: var(--text-dim); }
  ul li { margin-bottom: 4px; line-height: 1.65; }
</style>
</head>
<body>

<!-- ─── SIDEBAR ─────────────────────────────────────────────────────────── -->
<nav class="sidebar">
  <div class="sidebar-header">
    <div class="sidebar-logo">UPIP API</div>
    <div class="sidebar-tagline">Preventive Intelligence Platform</div>
    <div class="sidebar-version">v1.0 · Laravel 11</div>
  </div>
  <div class="search-wrap">
    <input class="search-input" type="text" placeholder="Search endpoints..." id="search">
  </div>
  <div class="sidebar-nav" id="sidenav">
    <div class="nav-group">
      <div class="nav-group-label">Overview</div>
      <a class="nav-item" href="#overview">📋 Introduction</a>
      <a class="nav-item" href="#auth-overview">🔐 Authentication</a>
      <a class="nav-item" href="#errors">⚠️ Error Handling</a>
      <a class="nav-item" href="#governance">🛡️ Governance</a>
    </div>
    <div class="nav-group">
      <div class="nav-group-label">Authentication</div>
      <a class="nav-item" href="#ep-register"><span class="nav-method method-post">POST</span> Register</a>
      <a class="nav-item" href="#ep-login"><span class="nav-method method-post">POST</span> Login</a>
      <a class="nav-item" href="#ep-refresh"><span class="nav-method method-post">POST</span> Refresh</a>
      <a class="nav-item" href="#ep-logout"><span class="nav-method method-post">POST</span> Logout</a>
      <a class="nav-item" href="#ep-me"><span class="nav-method method-get">GET</span> Me</a>
    </div>
    <div class="nav-group">
      <div class="nav-group-label">Consent</div>
      <a class="nav-item" href="#ep-consent-get"><span class="nav-method method-get">GET</span> List Consents</a>
      <a class="nav-item" href="#ep-consent-post"><span class="nav-method method-post">POST</span> Grant Consent</a>
      <a class="nav-item" href="#ep-consent-delete"><span class="nav-method method-delete">DEL</span> Revoke Module</a>
    </div>
    <div class="nav-group">
      <div class="nav-group-label">Observations</div>
      <a class="nav-item" href="#ep-obs-wearable"><span class="nav-method method-post">POST</span> Wearable</a>
      <a class="nav-item" href="#ep-obs-behavioral"><span class="nav-method method-post">POST</span> Behavioral</a>
      <a class="nav-item" href="#ep-obs-speech"><span class="nav-method method-post">POST</span> Speech</a>
      <a class="nav-item" href="#ep-obs-diagnostic"><span class="nav-method method-post">POST</span> Diagnostic</a>
      <a class="nav-item" href="#ep-obs-list"><span class="nav-method method-get">GET</span> List</a>
      <a class="nav-item" href="#ep-obs-show"><span class="nav-method method-get">GET</span> Show</a>
    </div>
    <div class="nav-group">
      <div class="nav-group-label">Risk</div>
      <a class="nav-item" href="#ep-risk-uprs"><span class="nav-method method-get">GET</span> UPRS</a>
      <a class="nav-item" href="#ep-risk-scores"><span class="nav-method method-get">GET</span> Scores</a>
      <a class="nav-item" href="#ep-risk-history"><span class="nav-method method-get">GET</span> History</a>
      <a class="nav-item" href="#ep-risk-family"><span class="nav-method method-post">POST</span> Family History</a>
      <a class="nav-item" href="#ep-risk-genetic"><span class="nav-method method-post">POST</span> Genetic</a>
    </div>
    <div class="nav-group">
      <div class="nav-group-label">Devices</div>
      <a class="nav-item" href="#ep-devices-post"><span class="nav-method method-post">POST</span> Register</a>
      <a class="nav-item" href="#ep-devices-list"><span class="nav-method method-get">GET</span> List</a>
      <a class="nav-item" href="#ep-devices-delete"><span class="nav-method method-delete">DEL</span> Unregister</a>
    </div>
    <div class="nav-group">
      <div class="nav-group-label">Clinician</div>
      <a class="nav-item" href="#ep-clin-queue"><span class="nav-method method-get">GET</span> Queue</a>
      <a class="nav-item" href="#ep-clin-case"><span class="nav-method method-get">GET</span> Case Detail</a>
      <a class="nav-item" href="#ep-clin-review"><span class="nav-method method-post">POST</span> Submit Review</a>
      <a class="nav-item" href="#ep-clin-patients"><span class="nav-method method-get">GET</span> Patients</a>
      <a class="nav-item" href="#ep-clin-history"><span class="nav-method method-get">GET</span> Patient History</a>
    </div>
    <div class="nav-group">
      <div class="nav-group-label">Admin</div>
      <a class="nav-item" href="#ep-admin-weights-get"><span class="nav-method method-get">GET</span> Risk Weights</a>
      <a class="nav-item" href="#ep-admin-weights-put"><span class="nav-method method-put">PUT</span> Update Weights</a>
      <a class="nav-item" href="#ep-admin-audit"><span class="nav-method method-get">GET</span> Audit Logs</a>
      <a class="nav-item" href="#ep-admin-models"><span class="nav-method method-get">GET</span> Model Versions</a>
    </div>
    <div class="nav-group">
      <div class="nav-group-label">User & Audit</div>
      <a class="nav-item" href="#ep-user-profile"><span class="nav-method method-get">GET</span> Profile</a>
      <a class="nav-item" href="#ep-user-update"><span class="nav-method method-put">PUT</span> Update Profile</a>
      <a class="nav-item" href="#ep-audit"><span class="nav-method method-get">GET</span> Audit Logs</a>
    </div>
  </div>
</nav>

<!-- ─── MAIN ─────────────────────────────────────────────────────────────── -->
<main class="main">

  <!-- HERO -->
  <div class="hero">
    <div class="hero-badge">REST API · JSON · JWT Auth</div>
    <h1>UPIP <span>API Reference</span></h1>
    <p class="hero-desc">Complete endpoint documentation for the Unified Preventive Intelligence Platform. All requests return probabilistic risk insights. This system is not a medical device and does not produce clinical diagnoses.</p>
    <div class="hero-meta">
      <div class="hero-meta-item">Base URL: <span>https://api.upip.health/api/v1</span></div>
      <div class="hero-meta-item">Format: <span>application/json</span></div>
      <div class="hero-meta-item">Auth: <span>JWT Bearer Token</span></div>
      <div class="hero-meta-item">Framework: <span>Laravel 11</span></div>
    </div>
  </div>

  <!-- GOVERNANCE STRIP -->
  <div class="governance-strip">
    <div class="gov-item"><span class="gov-role">AI</span><span class="gov-action">Detect</span></div>
    <div class="gov-item"><span class="gov-arrow">→</span><span class="gov-role">Human</span><span class="gov-action">Interpret</span></div>
    <div class="gov-item"><span class="gov-arrow">→</span><span class="gov-role">System</span><span class="gov-action">Inform</span></div>
    <div class="gov-item"><span class="gov-arrow">→</span><span class="gov-role">Clinician</span><span class="gov-action">Decide</span></div>
    <div class="gov-item"><span class="gov-arrow">→</span><span class="gov-role">User</span><span class="gov-action">Prevent</span></div>
  </div>

  <div class="content">

    <!-- ═══════════════════════════════ OVERVIEW ══════════════════════════ -->
    <section class="section" id="overview">
      <div class="section-header">
        <div class="section-icon" style="background:var(--accent-dim)">📋</div>
        <div>
          <div class="section-title">Introduction</div>
          <div class="section-subtitle">Base URL, request format, conventions</div>
        </div>
      </div>

      <div class="overview-grid">
        <div class="overview-card">
          <div class="overview-card-label">Base URL</div>
          <div class="overview-card-value">https://api.upip.health/api/v1</div>
        </div>
        <div class="overview-card">
          <div class="overview-card-label">Content Type</div>
          <div class="overview-card-value">application/json</div>
        </div>
        <div class="overview-card">
          <div class="overview-card-label">Auth Scheme</div>
          <div class="overview-card-value">JWT Bearer</div>
        </div>
        <div class="overview-card">
          <div class="overview-card-label">Token TTL</div>
          <div class="overview-card-value">60 minutes</div>
        </div>
        <div class="overview-card">
          <div class="overview-card-label">Rate Limit</div>
          <div class="overview-card-value">60 req / min</div>
        </div>
        <div class="overview-card">
          <div class="overview-card-label">Timestamp Format</div>
          <div class="overview-card-value">ISO 8601 UTC</div>
        </div>
      </div>

      <div class="alert alert-warn">
        <span class="alert-icon">⚠️</span>
        <div><strong>Medical Disclaimer.</strong> All risk scores produced by this API are probabilistic estimates and are <strong>not medical diagnoses</strong>. The system does not prescribe medication, diagnose disease, or trigger emergency services autonomously. Every elevated risk case requires human clinician review before any action is taken.</div>
      </div>

      <h3>Global Response Fields</h3>
      <p>Every response body includes these governance metadata fields:</p>
      <div class="code-block">
        <div class="code-header"><span class="code-lang">JSON — every response</span></div>
        <pre>{
  <span class="hl-key">"is_diagnostic"</span>: <span class="hl-bool">false</span>,
  <span class="hl-key">"message"</span>: <span class="hl-str">"Risk scores are probabilistic and not medical diagnoses."</span>
}</pre>
      </div>

      <h3>Mobile Platform Headers</h3>
      <p>Mobile clients should send these headers with every request to enable platform-specific confidence scoring:</p>
      <table>
        <thead><tr><th>Header</th><th>Values</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td class="td-name">X-Device-Platform</td><td class="td-type">ios | android</td><td>Source platform for source reliability scoring</td></tr>
          <tr><td class="td-name">X-App-Version</td><td class="td-type">string</td><td>App version string for audit logs</td></tr>
          <tr><td class="td-name">X-Device-ID</td><td class="td-type">string</td><td>Device identifier for multi-device tracking</td></tr>
        </tbody>
      </table>
    </section>

    <!-- ═══════════════════════════ AUTH OVERVIEW ═════════════════════════ -->
    <section class="section" id="auth-overview">
      <div class="section-header">
        <div class="section-icon" style="background:var(--yellow-dim)">🔐</div>
        <div>
          <div class="section-title">Authentication</div>
          <div class="section-subtitle">JWT Bearer token · RBAC roles</div>
        </div>
      </div>

      <p>UPIP uses <strong>JWT (JSON Web Tokens)</strong> via <code>tymon/jwt-auth</code>. Include the token in every protected request:</p>

      <div class="code-block">
        <div class="code-header"><span class="code-lang">HTTP Header</span></div>
        <pre>Authorization: Bearer &lt;your_access_token&gt;</pre>
      </div>

      <h3>Roles & Permissions</h3>
      <table>
        <thead><tr><th>Role</th><th>Capabilities</th></tr></thead>
        <tbody>
          <tr>
            <td><span class="badge badge-role">patient</span></td>
            <td>Submit observations, view own risk scores, manage consent, register devices</td>
          </tr>
          <tr>
            <td><span class="badge badge-role">clinician</span></td>
            <td>All patient capabilities + access review queue, view all patient data, submit clinical reviews</td>
          </tr>
          <tr>
            <td><span class="badge badge-role">admin</span></td>
            <td>All clinician capabilities + manage risk weights, model versions, full audit log access</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- ═══════════════════════════════ ERRORS ════════════════════════════ -->
    <section class="section" id="errors">
      <div class="section-header">
        <div class="section-icon" style="background:var(--red-dim)">⚠️</div>
        <div>
          <div class="section-title">Error Handling</div>
          <div class="section-subtitle">HTTP status codes and error shape</div>
        </div>
      </div>

      <table>
        <thead><tr><th>Status</th><th>Meaning</th><th>Common Cause</th></tr></thead>
        <tbody>
          <tr><td class="td-name" style="color:var(--green)">200</td><td>OK</td><td>Request succeeded</td></tr>
          <tr><td class="td-name" style="color:var(--green)">201</td><td>Created</td><td>Resource created (register, consent grant)</td></tr>
          <tr><td class="td-name" style="color:var(--green)">202</td><td>Accepted</td><td>Observation queued for async processing</td></tr>
          <tr><td class="td-name" style="color:var(--yellow)">401</td><td>Unauthorized</td><td>Missing or expired JWT token</td></tr>
          <tr><td class="td-name" style="color:var(--yellow)">403</td><td>Forbidden</td><td>Missing consent, insufficient role, or access denied</td></tr>
          <tr><td class="td-name" style="color:var(--yellow)">404</td><td>Not Found</td><td>Resource does not exist or belongs to another user</td></tr>
          <tr><td class="td-name" style="color:var(--orange)">422</td><td>Unprocessable</td><td>Validation failed — see <code>errors</code> field</td></tr>
          <tr><td class="td-name" style="color:var(--red)">429</td><td>Too Many Requests</td><td>Rate limit exceeded</td></tr>
          <tr><td class="td-name" style="color:var(--red)">500</td><td>Server Error</td><td>Internal failure; AI service unavailable</td></tr>
        </tbody>
      </table>

      <h3>Validation Error Shape (422)</h3>
      <div class="code-block">
        <div class="code-header"><span class="code-lang">JSON — 422 Validation Error</span></div>
        <pre>{
  <span class="hl-key">"message"</span>: <span class="hl-str">"The given data was invalid."</span>,
  <span class="hl-key">"errors"</span>: {
    <span class="hl-key">"value"</span>: [<span class="hl-str">"The value field is required."</span>],
    <span class="hl-key">"observed_at"</span>: [<span class="hl-str">"The observed at must be a date before or equal to now."</span>]
  }
}</pre>
      </div>

      <h3>Consent Denied Shape (403)</h3>
      <div class="code-block">
        <div class="code-header"><span class="code-lang">JSON — 403 Consent Missing</span></div>
        <pre>{
  <span class="hl-key">"message"</span>: <span class="hl-str">"Consent for 'wearable' data processing is required."</span>,
  <span class="hl-key">"action"</span>: <span class="hl-str">"Grant consent at POST /v1/consent"</span>,
  <span class="hl-key">"is_diagnostic"</span>: <span class="hl-bool">false</span>
}</pre>
      </div>
    </section>

    <!-- ═══════════════════════════ GOVERNANCE ═══════════════════════════ -->
    <section class="section" id="governance">
      <div class="section-header">
        <div class="section-icon" style="background:var(--purple-dim)">🛡️</div>
        <div>
          <div class="section-title">Governance Boundaries</div>
          <div class="section-subtitle">What the system will and will never do</div>
        </div>
      </div>
      <div class="alert alert-danger">
        <span class="alert-icon">🚫</span>
        <div>The system will <strong>never</strong>: diagnose disease · prescribe medication · label psychiatric disorders · trigger emergency dispatch autonomously · share data externally without consent.</div>
      </div>
      <div class="alert alert-success">
        <span class="alert-icon">✅</span>
        <div>The system <strong>always</strong>: returns <code>is_diagnostic: false</code> · requires human clinician confirmation for elevated cases · enforces consent before processing · logs every data access to audit trail.</div>
      </div>

      <h3>UPRS Formula</h3>
      <div class="formula">
        <span class="f-comment"># Unified Preventive Risk Score</span><br>
        <span class="f-var">UPRS</span> <span class="f-op">=</span> (<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="f-var">cardiovascular_score</span> <span class="f-op">×</span> <span class="f-val">cardio_weight</span>  &nbsp;&nbsp;<span class="f-comment">  # default 0.40</span><br>
        &nbsp;&nbsp;<span class="f-op">+</span> <span class="f-var">metabolic_score</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="f-op">×</span> <span class="f-val">metabolic_weight</span> &nbsp;<span class="f-comment">  # default 0.35</span><br>
        &nbsp;&nbsp;<span class="f-op">+</span> <span class="f-var">mental_score</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="f-op">×</span> <span class="f-val">mental_weight</span>   &nbsp;&nbsp;<span class="f-comment">  # default 0.25</span><br>
        ) <span class="f-op">×</span> <span class="f-var">genetic_modifier</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="f-comment">  # default 1.0</span><br><br>
        <span class="f-comment"># Tiers:</span><br>
        <span class="f-var">low</span>      <span class="f-op">→</span> UPRS <span class="f-op">≤</span> <span class="f-val">0.33</span><br>
        <span class="f-var">moderate</span> <span class="f-op">→</span> UPRS <span class="f-op">≤</span> <span class="f-val">0.66</span><br>
        <span class="f-var">elevated</span> <span class="f-op">→</span> UPRS <span class="f-op">&gt;</span> <span class="f-val">0.66</span> <span class="f-op">→</span> triggers clinician review queue
      </div>
    </section>

    <!-- ════════════════════════ AUTH ENDPOINTS ════════════════════════ -->
    <section class="section" id="auth-endpoints">
      <div class="section-header">
        <div class="section-icon" style="background:var(--yellow-dim)">🔑</div>
        <div>
          <div class="section-title">Authentication Endpoints</div>
          <div class="section-subtitle">/auth/register · /auth/login · /auth/refresh · /auth/logout · /auth/me</div>
        </div>
      </div>

      <!-- REGISTER -->
      <div class="endpoint" id="ep-register">
        <div class="endpoint-header">
          <span class="endpoint-method method-post">POST</span>
          <span class="endpoint-path">/auth/register</span>
          <span class="endpoint-desc">Register a new patient account</span>
        </div>
        <div class="endpoint-body">
          <p class="endpoint-summary">Creates a new patient user account and returns a JWT access token. The user is automatically assigned the <code>patient</code> role. No consent is granted at registration — call <code>POST /consent</code> to enable data processing.</p>

          <div class="param-section">
            <div class="param-section-title">Request Body</div>
            <table>
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Validation</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">name</td><td class="td-type">string</td><td class="td-required req-yes">required</td><td>max:255</td><td>Full display name</td></tr>
                <tr><td class="td-name">email</td><td class="td-type">string</td><td class="td-required req-yes">required</td><td>email, unique</td><td>Unique email address</td></tr>
                <tr><td class="td-name">password</td><td class="td-type">string</td><td class="td-required req-yes">required</td><td>min:10, confirmed</td><td>Must include password_confirmation</td></tr>
                <tr><td class="td-name">password_confirmation</td><td class="td-type">string</td><td class="td-required req-yes">required</td><td>—</td><td>Must match password</td></tr>
                <tr><td class="td-name">dob</td><td class="td-type">date</td><td class="td-required req-no">optional</td><td>before:today</td><td>Date of birth (ISO 8601)</td></tr>
                <tr><td class="td-name">gender</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td>enum</td><td><code>male</code> · <code>female</code> · <code>other</code> · <code>prefer_not_to_say</code></td></tr>
                <tr><td class="td-name">region</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td>size:2</td><td>ISO 3166-1 alpha-2 country code (e.g. <code>NG</code>). Used for population-adjusted risk calibration.</td></tr>
              </tbody>
            </table>
          </div>

          <div class="param-section">
            <div class="param-section-title">Responses</div>
            <div class="response-tabs">
              <span class="response-tab s2xx active">201 Created</span>
              <span class="response-tab s4xx">422 Validation</span>
            </div>
            <div class="code-block">
              <div class="code-header"><span class="code-lang">201 — Success</span></div>
              <pre>{
  <span class="hl-key">"access_token"</span>: <span class="hl-str">"eyJ0eXAiOiJKV1QiLCJhbGci..."</span>,
  <span class="hl-key">"token_type"</span>: <span class="hl-str">"bearer"</span>,
  <span class="hl-key">"expires_in"</span>: <span class="hl-num">3600</span>,
  <span class="hl-key">"user"</span>: {
    <span class="hl-key">"id"</span>: <span class="hl-num">42</span>,
    <span class="hl-key">"name"</span>: <span class="hl-str">"Ada Okafor"</span>,
    <span class="hl-key">"email"</span>: <span class="hl-str">"ada@example.com"</span>,
    <span class="hl-key">"roles"</span>: [<span class="hl-str">"patient"</span>]
  },
  <span class="hl-key">"is_diagnostic"</span>: <span class="hl-bool">false</span>,
  <span class="hl-key">"message"</span>: <span class="hl-str">"Risk scores are probabilistic and not medical diagnoses."</span>
}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- LOGIN -->
      <div class="endpoint" id="ep-login">
        <div class="endpoint-header">
          <span class="endpoint-method method-post">POST</span>
          <span class="endpoint-path">/auth/login</span>
          <span class="endpoint-desc">Authenticate and receive JWT</span>
        </div>
        <div class="endpoint-body">
          <p class="endpoint-summary">Authenticates a user with email and password. Returns a JWT access token. Tokens expire after 60 minutes; use <code>/auth/refresh</code> to extend.</p>
          <div class="param-section">
            <div class="param-section-title">Request Body</div>
            <table>
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">email</td><td class="td-type">string</td><td class="td-required req-yes">required</td><td>Registered email address</td></tr>
                <tr><td class="td-name">password</td><td class="td-type">string</td><td class="td-required req-yes">required</td><td>Account password</td></tr>
              </tbody>
            </table>
          </div>
          <div class="param-section">
            <div class="param-section-title">Responses</div>
            <div class="code-block">
              <div class="code-header"><span class="code-lang">200 — Success</span></div>
              <pre>{
  <span class="hl-key">"access_token"</span>: <span class="hl-str">"eyJ0eXAiOiJKV1QiLCJhbGci..."</span>,
  <span class="hl-key">"token_type"</span>: <span class="hl-str">"bearer"</span>,
  <span class="hl-key">"expires_in"</span>: <span class="hl-num">3600</span>,
  <span class="hl-key">"user"</span>: {
    <span class="hl-key">"id"</span>: <span class="hl-num">42</span>,
    <span class="hl-key">"name"</span>: <span class="hl-str">"Ada Okafor"</span>,
    <span class="hl-key">"email"</span>: <span class="hl-str">"ada@example.com"</span>,
    <span class="hl-key">"roles"</span>: [<span class="hl-str">"patient"</span>]
  },
  <span class="hl-key">"is_diagnostic"</span>: <span class="hl-bool">false</span>,
  <span class="hl-key">"message"</span>: <span class="hl-str">"Risk scores are probabilistic and not medical diagnoses."</span>
}</pre>
            </div>
            <div class="code-block">
              <div class="code-header"><span class="code-lang">401 — Invalid Credentials</span></div>
              <pre>{
  <span class="hl-key">"message"</span>: <span class="hl-str">"Invalid credentials."</span>
}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- REFRESH -->
      <div class="endpoint" id="ep-refresh">
        <div class="endpoint-header">
          <span class="endpoint-method method-post">POST</span>
          <span class="endpoint-path">/auth/refresh</span>
          <div class="endpoint-auth">🔒 JWT</div>
          <span class="endpoint-desc">Refresh access token</span>
        </div>
        <div class="endpoint-body">
          <p class="endpoint-summary">Invalidates the current token and issues a new one. The refresh window is 14 days from initial login (<code>JWT_REFRESH_TTL=20160</code> minutes).</p>
          <div class="param-section">
            <div class="param-section-title">Responses</div>
            <div class="code-block">
              <div class="code-header"><span class="code-lang">200 — New Token</span></div>
              <pre>{
  <span class="hl-key">"access_token"</span>: <span class="hl-str">"eyJ0eXAiOiJKV1QiLCJhbGci..."</span>,
  <span class="hl-key">"token_type"</span>: <span class="hl-str">"bearer"</span>,
  <span class="hl-key">"expires_in"</span>: <span class="hl-num">3600</span>,
  <span class="hl-key">"user"</span>: { <span class="hl-comment">/* user object */</span> },
  <span class="hl-key">"is_diagnostic"</span>: <span class="hl-bool">false</span>,
  <span class="hl-key">"message"</span>: <span class="hl-str">"Risk scores are probabilistic and not medical diagnoses."</span>
}</pre>
            </div>
            <div class="code-block">
              <div class="code-header"><span class="code-lang">401 — Refresh Window Expired</span></div>
              <pre>{ <span class="hl-key">"message"</span>: <span class="hl-str">"Token refresh failed."</span> }</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- LOGOUT -->
      <div class="endpoint" id="ep-logout">
        <div class="endpoint-header">
          <span class="endpoint-method method-post">POST</span>
          <span class="endpoint-path">/auth/logout</span>
          <div class="endpoint-auth">🔒 JWT</div>
          <span class="endpoint-desc">Invalidate current token</span>
        </div>
        <div class="endpoint-body">
          <div class="code-block">
            <div class="code-header"><span class="code-lang">200</span></div>
            <pre>{ <span class="hl-key">"message"</span>: <span class="hl-str">"Successfully logged out."</span> }</pre>
          </div>
        </div>
      </div>

      <!-- ME -->
      <div class="endpoint" id="ep-me">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/auth/me</span>
          <div class="endpoint-auth">🔒 JWT</div>
          <span class="endpoint-desc">Current user + active consents</span>
        </div>
        <div class="endpoint-body">
          <div class="code-block">
            <div class="code-header"><span class="code-lang">200</span></div>
            <pre>{
  <span class="hl-key">"user"</span>: {
    <span class="hl-key">"id"</span>: <span class="hl-num">42</span>,
    <span class="hl-key">"name"</span>: <span class="hl-str">"Ada Okafor"</span>,
    <span class="hl-key">"email"</span>: <span class="hl-str">"ada@example.com"</span>,
    <span class="hl-key">"dob"</span>: <span class="hl-str">"1990-03-15"</span>,
    <span class="hl-key">"gender"</span>: <span class="hl-str">"female"</span>,
    <span class="hl-key">"region"</span>: <span class="hl-str">"NG"</span>,
    <span class="hl-key">"roles"</span>: [<span class="hl-str">"patient"</span>]
  },
  <span class="hl-key">"active_consents"</span>: [<span class="hl-str">"wearable"</span>, <span class="hl-str">"clinical"</span>]
}</pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════ CONSENT ENDPOINTS ════════════════════════ -->
    <section class="section" id="consent-endpoints">
      <div class="section-header">
        <div class="section-icon" style="background:var(--accent-dim)">✅</div>
        <div>
          <div class="section-title">Consent Management</div>
          <div class="section-subtitle">Grant · list · revoke data processing consent</div>
        </div>
      </div>

      <div class="alert alert-info">
        <span class="alert-icon">ℹ️</span>
        <div>Consent must be granted before any observation data is accepted. Revoking consent immediately blocks all processing for that module. Consent actions are permanently logged in the audit trail.</div>
      </div>

      <h3>Consent Modules</h3>
      <table>
        <thead><tr><th>Module</th><th>Data Covered</th><th>Encryption</th><th>Build Phase</th></tr></thead>
        <tbody>
          <tr><td class="td-name">wearable</td><td>Heart rate, HRV, SpO₂, sleep, steps, temperature</td><td>—</td><td><span class="badge badge-phase">Phase 1</span></td></tr>
          <tr><td class="td-name">clinical</td><td>Lab results, blood pressure, glucose, ECG</td><td>—</td><td><span class="badge badge-phase">Phase 1</span></td></tr>
          <tr><td class="td-name">behavioral</td><td>Movement patterns, social activity, screen time</td><td>—</td><td><span class="badge badge-phase">Phase 2</span></td></tr>
          <tr><td class="td-name">speech</td><td>Speech feature vectors (never raw audio)</td><td><span class="badge badge-encrypt">AES-256</span></td><td><span class="badge badge-phase">Phase 3</span></td></tr>
          <tr><td class="td-name">genetic</td><td>Genetic markers, polygenic risk scores</td><td><span class="badge badge-encrypt">AES-256</span></td><td><span class="badge badge-phase">Phase 4</span></td></tr>
        </tbody>
      </table>

      <!-- LIST CONSENTS -->
      <div class="endpoint" id="ep-consent-get" style="margin-top:24px">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/consent</span>
          <div class="endpoint-auth">🔒 JWT · patient</div>
        </div>
        <div class="endpoint-body">
          <div class="code-block">
            <div class="code-header"><span class="code-lang">200</span></div>
            <pre>{
  <span class="hl-key">"data"</span>: [
    {
      <span class="hl-key">"id"</span>: <span class="hl-num">1</span>,
      <span class="hl-key">"user_id"</span>: <span class="hl-num">42</span>,
      <span class="hl-key">"module"</span>: <span class="hl-str">"wearable"</span>,
      <span class="hl-key">"granted"</span>: <span class="hl-bool">true</span>,
      <span class="hl-key">"granted_at"</span>: <span class="hl-str">"2025-02-01T10:00:00Z"</span>,
      <span class="hl-key">"revoked_at"</span>: <span class="hl-null">null</span>,
      <span class="hl-key">"ip_address"</span>: <span class="hl-str">"197.x.x.x"</span>
    }
  ],
  <span class="hl-key">"modules"</span>: [
    { <span class="hl-key">"name"</span>: <span class="hl-str">"wearable"</span>, <span class="hl-key">"value"</span>: <span class="hl-str">"wearable"</span> },
    { <span class="hl-key">"name"</span>: <span class="hl-str">"behavioral"</span>, <span class="hl-key">"value"</span>: <span class="hl-str">"behavioral"</span> },
    <span class="hl-comment">// ... all available modules</span>
  ]
}</pre>
          </div>
        </div>
      </div>

      <!-- GRANT CONSENT -->
      <div class="endpoint" id="ep-consent-post">
        <div class="endpoint-header">
          <span class="endpoint-method method-post">POST</span>
          <span class="endpoint-path">/consent</span>
          <div class="endpoint-auth">🔒 JWT · patient</div>
        </div>
        <div class="endpoint-body">
          <p class="endpoint-summary">Grants consent for one or more modules. Any existing consent for a module is superseded. Consent is recorded with IP address, user agent, and timestamp for legal compliance.</p>
          <div class="param-section">
            <div class="param-section-title">Request Body</div>
            <table>
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">modules</td><td class="td-type">string[]</td><td class="td-required req-yes">required</td><td>Array of module names. Valid: <code>wearable</code> <code>behavioral</code> <code>speech</code> <code>genetic</code> <code>clinical</code></td></tr>
              </tbody>
            </table>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">Request Example</span></div>
            <pre>{ <span class="hl-key">"modules"</span>: [<span class="hl-str">"wearable"</span>, <span class="hl-str">"clinical"</span>] }</pre>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">201 — Created</span></div>
            <pre>{
  <span class="hl-key">"message"</span>: <span class="hl-str">"Consent recorded."</span>,
  <span class="hl-key">"data"</span>: [
    { <span class="hl-key">"id"</span>: <span class="hl-num">5</span>, <span class="hl-key">"module"</span>: <span class="hl-str">"wearable"</span>, <span class="hl-key">"granted"</span>: <span class="hl-bool">true</span>, <span class="hl-key">"granted_at"</span>: <span class="hl-str">"2025-02-21T09:00:00Z"</span> },
    { <span class="hl-key">"id"</span>: <span class="hl-num">6</span>, <span class="hl-key">"module"</span>: <span class="hl-str">"clinical"</span>, <span class="hl-key">"granted"</span>: <span class="hl-bool">true</span>, <span class="hl-key">"granted_at"</span>: <span class="hl-str">"2025-02-21T09:00:00Z"</span> }
  ]
}</pre>
          </div>
        </div>
      </div>

      <!-- REVOKE CONSENT -->
      <div class="endpoint" id="ep-consent-delete">
        <div class="endpoint-header">
          <span class="endpoint-method method-delete">DEL</span>
          <span class="endpoint-path">/consent/<span class="path-param">{module}</span></span>
          <div class="endpoint-auth">🔒 JWT · patient</div>
        </div>
        <div class="endpoint-body">
          <p class="endpoint-summary">Revokes consent for the specified module. All future data ingestion for this module is immediately blocked. Historical data is retained unless deletion is explicitly requested through a separate data subject access request process.</p>
          <div class="param-section">
            <div class="param-section-title">Path Parameters</div>
            <table>
              <thead><tr><th>Param</th><th>Type</th><th>Values</th></tr></thead>
              <tbody>
                <tr><td class="td-name">module</td><td class="td-type">string</td><td><code>wearable</code> · <code>behavioral</code> · <code>speech</code> · <code>genetic</code> · <code>clinical</code></td></tr>
              </tbody>
            </table>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">200</span></div>
            <pre>{ <span class="hl-key">"message"</span>: <span class="hl-str">"Consent for 'wearable' revoked. Processing of this data type has been stopped."</span> }</pre>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">422 — Invalid Module</span></div>
            <pre>{ <span class="hl-key">"message"</span>: <span class="hl-str">"Invalid module: unknown_module."</span> }</pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════ OBSERVATIONS ════════════════════════════ -->
    <section class="section" id="observations-endpoints">
      <div class="section-header">
        <div class="section-icon" style="background:var(--blue-dim)">📡</div>
        <div>
          <div class="section-title">Observation Ingestion</div>
          <div class="section-subtitle">Wearable · Behavioral · Speech · Diagnostic</div>
        </div>
      </div>

      <div class="alert alert-info">
        <span class="alert-icon">ℹ️</span>
        <div>All ingestion endpoints return <strong>202 Accepted</strong>. Processing is asynchronous — feature engineering and UPRS computation run via a background queue job. Observations with future timestamps (beyond 5 min clock skew) are rejected.</div>
      </div>

      <!-- WEARABLE -->
      <div class="endpoint" id="ep-obs-wearable">
        <div class="endpoint-header">
          <span class="endpoint-method method-post">POST</span>
          <span class="endpoint-path">/observations/wearable</span>
          <div class="endpoint-auth">🔒 JWT · <span class="badge badge-consent">wearable</span></div>
          <span class="endpoint-desc">iOS HealthKit / Android Health Connect</span>
        </div>
        <div class="endpoint-body">
          <p class="endpoint-summary">Submit a physiological measurement from a wearable device. One call per measurement type per timestamp. Glucose values submitted in <code>mg/dL</code> are automatically converted to <code>mmol/L</code>. Sleep values submitted in <code>hours</code> are converted to <code>minutes</code>.</p>

          <div class="param-section">
            <div class="param-section-title">Request Body</div>
            <table>
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">sub_type</td><td class="td-type">string</td><td class="td-required req-yes">required</td><td><code>heart_rate</code> · <code>hrv</code> · <code>spo2</code> · <code>sleep</code> · <code>steps</code> · <code>temperature</code> · <code>bp_systolic</code> · <code>bp_diastolic</code></td></tr>
                <tr><td class="td-name">value</td><td class="td-type">numeric</td><td class="td-required req-yes">required</td><td>Measurement value</td></tr>
                <tr><td class="td-name">unit</td><td class="td-type">string</td><td class="td-required req-yes">required</td><td>See unit table below</td></tr>
                <tr><td class="td-name">observed_at</td><td class="td-type">datetime</td><td class="td-required req-yes">required</td><td>ISO 8601. Must not be in the future (&gt;5 min clock skew rejected)</td></tr>
                <tr><td class="td-name">platform</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td><code>ios</code> · <code>android</code>. Affects confidence score.</td></tr>
                <tr><td class="td-name">health_api</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td><code>HealthKit</code> · <code>HealthConnect</code> · <code>GoogleFit</code></td></tr>
                <tr><td class="td-name">device_id</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td>Registered device ID to link observation</td></tr>
              </tbody>
            </table>
          </div>

          <div class="param-section">
            <div class="param-section-title">Accepted Units per sub_type</div>
            <table>
              <thead><tr><th>sub_type</th><th>Accepted Input Units</th><th>Canonical (stored)</th></tr></thead>
              <tbody>
                <tr><td class="td-name">heart_rate</td><td><code>bpm</code> · <code>beats/min</code></td><td class="td-type">bpm</td></tr>
                <tr><td class="td-name">hrv</td><td><code>ms</code> · <code>milliseconds</code></td><td class="td-type">ms</td></tr>
                <tr><td class="td-name">spo2</td><td><code>%</code> · <code>percent</code></td><td class="td-type">%</td></tr>
                <tr><td class="td-name">steps</td><td><code>count</code></td><td class="td-type">count</td></tr>
                <tr><td class="td-name">sleep</td><td><code>minutes</code> · <code>hours</code></td><td class="td-type">minutes</td></tr>
                <tr><td class="td-name">glucose</td><td><code>mmol/L</code> · <code>mg/dL</code> (auto-converted)</td><td class="td-type">mmol/L</td></tr>
                <tr><td class="td-name">bp_systolic / bp_diastolic</td><td><code>mmHg</code></td><td class="td-type">mmHg</td></tr>
                <tr><td class="td-name">temperature</td><td><code>°C</code> · <code>celsius</code></td><td class="td-type">°C</td></tr>
              </tbody>
            </table>
          </div>

          <div class="code-block">
            <div class="code-header"><span class="code-lang">Request — iOS HealthKit heart rate</span></div>
            <pre>{
  <span class="hl-key">"sub_type"</span>: <span class="hl-str">"heart_rate"</span>,
  <span class="hl-key">"value"</span>: <span class="hl-num">68</span>,
  <span class="hl-key">"unit"</span>: <span class="hl-str">"bpm"</span>,
  <span class="hl-key">"observed_at"</span>: <span class="hl-str">"2025-02-21T07:45:00Z"</span>,
  <span class="hl-key">"platform"</span>: <span class="hl-str">"ios"</span>,
  <span class="hl-key">"health_api"</span>: <span class="hl-str">"HealthKit"</span>,
  <span class="hl-key">"device_id"</span>: <span class="hl-str">"apple-watch-uuid-xyz"</span>
}</pre>
          </div>

          <div class="code-block">
            <div class="code-header"><span class="code-lang">202 — Accepted</span></div>
            <pre>{
  <span class="hl-key">"data"</span>: {
    <span class="hl-key">"id"</span>: <span class="hl-str">"550e8400-e29b-41d4-a716-446655440000"</span>,
    <span class="hl-key">"type"</span>: <span class="hl-str">"wearable"</span>,
    <span class="hl-key">"observed_at"</span>: <span class="hl-str">"2025-02-21T07:45:00Z"</span>,
    <span class="hl-key">"confidence_score"</span>: <span class="hl-num">0.9</span>
  },
  <span class="hl-key">"message"</span>: <span class="hl-str">"Wearable observation recorded."</span>,
  <span class="hl-key">"is_diagnostic"</span>: <span class="hl-bool">false</span>
}</pre>
          </div>

          <div class="param-section">
            <div class="param-section-title">Confidence Score Logic</div>
            <table>
              <thead><tr><th>Platform</th><th>Base Score</th></tr></thead>
              <tbody>
                <tr><td class="td-name">ios / android</td><td>0.90</td></tr>
                <tr><td class="td-name">manual</td><td>0.75</td></tr>
                <tr><td class="td-name">unknown</td><td>0.50</td></tr>
              </tbody>
            </table>
            <p style="margin-top:8px;font-size:12px;color:var(--text-dimmer)">Penalized –0.05 per missing field in the normalized payload.</p>
          </div>
        </div>
      </div>

      <!-- BEHAVIORAL -->
      <div class="endpoint" id="ep-obs-behavioral">
        <div class="endpoint-header">
          <span class="endpoint-method method-post">POST</span>
          <span class="endpoint-path">/observations/behavioral</span>
          <div class="endpoint-auth">🔒 JWT · <span class="badge badge-consent">behavioral</span> · <span class="badge badge-phase">Phase 2</span></div>
        </div>
        <div class="endpoint-body">
          <div class="param-section">
            <div class="param-section-title">Request Body</div>
            <table>
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">observed_at</td><td class="td-type">datetime</td><td class="td-required req-yes">required</td><td>ISO 8601. Not in future.</td></tr>
                <tr><td class="td-name">sub_type</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td>e.g. <code>daily_summary</code></td></tr>
                <tr><td class="td-name">step_count</td><td class="td-type">integer</td><td class="td-required req-no">optional</td><td>Total steps. Used for movement entropy.</td></tr>
                <tr><td class="td-name">active_minutes</td><td class="td-type">integer</td><td class="td-required req-no">optional</td><td>Minutes of moderate-to-vigorous activity</td></tr>
                <tr><td class="td-name">sedentary_minutes</td><td class="td-type">integer</td><td class="td-required req-no">optional</td><td>Minutes sedentary</td></tr>
                <tr><td class="td-name">social_events</td><td class="td-type">integer</td><td class="td-required req-no">optional</td><td>Number of social interactions (calls, meetings). Used for social withdrawal index.</td></tr>
                <tr><td class="td-name">screen_time_min</td><td class="td-type">integer</td><td class="td-required req-no">optional</td><td>Total screen time in minutes</td></tr>
                <tr><td class="td-name">value</td><td class="td-type">numeric</td><td class="td-required req-no">optional</td><td>Arbitrary scalar metric</td></tr>
                <tr><td class="td-name">unit</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td>Unit for scalar value</td></tr>
              </tbody>
            </table>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">202 — Accepted</span></div>
            <pre>{
  <span class="hl-key">"data"</span>: { <span class="hl-key">"id"</span>: <span class="hl-str">"uuid"</span>, <span class="hl-key">"type"</span>: <span class="hl-str">"behavioral"</span>, <span class="hl-key">"observed_at"</span>: <span class="hl-str">"..."</span>, <span class="hl-key">"confidence_score"</span>: <span class="hl-num">0.9</span> },
  <span class="hl-key">"message"</span>: <span class="hl-str">"Behavioral observation recorded."</span>,
  <span class="hl-key">"is_diagnostic"</span>: <span class="hl-bool">false</span>
}</pre>
          </div>
        </div>
      </div>

      <!-- SPEECH -->
      <div class="endpoint" id="ep-obs-speech">
        <div class="endpoint-header">
          <span class="endpoint-method method-post">POST</span>
          <span class="endpoint-path">/observations/speech</span>
          <div class="endpoint-auth">🔒 JWT · <span class="badge badge-consent">speech</span> · <span class="badge badge-encrypt">AES-256</span> · <span class="badge badge-phase">Phase 3</span></div>
        </div>
        <div class="endpoint-body">
          <div class="alert alert-warn">
            <span class="alert-icon">🔒</span>
            <div>Raw audio is <strong>never</strong> transmitted. Feature extraction happens on-device. Only numeric feature vectors are sent and stored with AES-256 field-level encryption.</div>
          </div>
          <div class="param-section">
            <div class="param-section-title">Request Body</div>
            <table>
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Constraints</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">observed_at</td><td class="td-type">datetime</td><td class="td-required req-yes">required</td><td>before_or_equal:now</td><td>Timestamp of recording</td></tr>
                <tr><td class="td-name">duration_sec</td><td class="td-type">integer</td><td class="td-required req-yes">required</td><td>1–600</td><td>Recording duration in seconds</td></tr>
                <tr><td class="td-name">features_vector</td><td class="td-type">numeric[]</td><td class="td-required req-yes">required</td><td>array of numbers</td><td>Pre-extracted acoustic feature vector from on-device model</td></tr>
                <tr><td class="td-name">language</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td>size:2</td><td>ISO 639-1 language code (e.g. <code>en</code>, <code>yo</code>)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- DIAGNOSTIC -->
      <div class="endpoint" id="ep-obs-diagnostic">
        <div class="endpoint-header">
          <span class="endpoint-method method-post">POST</span>
          <span class="endpoint-path">/observations/diagnostic</span>
          <div class="endpoint-auth">🔒 JWT · <span class="badge badge-consent">clinical</span></div>
        </div>
        <div class="endpoint-body">
          <div class="param-section">
            <div class="param-section-title">Request Body</div>
            <table>
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">sub_type</td><td class="td-type">string</td><td class="td-required req-yes">required</td><td><code>blood_pressure</code> · <code>glucose</code> · <code>cholesterol</code> · <code>ecg</code> · <code>other</code></td></tr>
                <tr><td class="td-name">value</td><td class="td-type">numeric</td><td class="td-required req-yes">required</td><td>Measurement value</td></tr>
                <tr><td class="td-name">unit</td><td class="td-type">string</td><td class="td-required req-yes">required</td><td>e.g. <code>mmHg</code>, <code>mmol/L</code>, <code>mg/dL</code></td></tr>
                <tr><td class="td-name">observed_at</td><td class="td-type">datetime</td><td class="td-required req-yes">required</td><td>ISO 8601. Must not be in future.</td></tr>
                <tr><td class="td-name">loinc_code</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td>LOINC code for lab test (e.g. <code>2093-3</code> for total cholesterol)</td></tr>
                <tr><td class="td-name">snomed_code</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td>SNOMED-CT concept code</td></tr>
                <tr><td class="td-name">reference_range</td><td class="td-type">object</td><td class="td-required req-no">optional</td><td>e.g. <code>{"low": 3.9, "high": 5.5, "unit": "mmol/L"}</code></td></tr>
                <tr><td class="td-name">lab_name</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td>Name of lab or facility</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- LIST OBSERVATIONS -->
      <div class="endpoint" id="ep-obs-list">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/observations</span>
          <div class="endpoint-auth">🔒 JWT · patient</div>
        </div>
        <div class="endpoint-body">
          <div class="param-section">
            <div class="param-section-title">Query Parameters</div>
            <table>
              <thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">type</td><td class="td-type">string</td><td>Filter by <code>wearable</code> · <code>behavioral</code> · <code>speech</code> · <code>diagnostic</code></td></tr>
                <tr><td class="td-name">from</td><td class="td-type">datetime</td><td>Start of time range (ISO 8601)</td></tr>
                <tr><td class="td-name">to</td><td class="td-type">datetime</td><td>End of time range (ISO 8601)</td></tr>
                <tr><td class="td-name">per_page</td><td class="td-type">integer</td><td>Items per page. Default: <code>20</code></td></tr>
                <tr><td class="td-name">page</td><td class="td-type">integer</td><td>Page number. Default: <code>1</code></td></tr>
              </tbody>
            </table>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">200 — Paginated List</span></div>
            <pre>{
  <span class="hl-key">"data"</span>: [
    {
      <span class="hl-key">"id"</span>: <span class="hl-str">"550e8400-e29b-41d4-a716-446655440000"</span>,
      <span class="hl-key">"user_id"</span>: <span class="hl-num">42</span>,
      <span class="hl-key">"type"</span>: <span class="hl-str">"wearable"</span>,
      <span class="hl-key">"sub_type"</span>: <span class="hl-str">"heart_rate"</span>,
      <span class="hl-key">"payload"</span>: {
        <span class="hl-key">"resource_type"</span>: <span class="hl-str">"Observation"</span>,
        <span class="hl-key">"sub_type"</span>: <span class="hl-str">"heart_rate"</span>,
        <span class="hl-key">"value"</span>: <span class="hl-num">68</span>,
        <span class="hl-key">"unit"</span>: <span class="hl-str">"bpm"</span>,
        <span class="hl-key">"device_platform"</span>: <span class="hl-str">"ios"</span>,
        <span class="hl-key">"health_api"</span>: <span class="hl-str">"HealthKit"</span>
      },
      <span class="hl-key">"unit"</span>: <span class="hl-str">"bpm"</span>,
      <span class="hl-key">"confidence_score"</span>: <span class="hl-num">0.9</span>,
      <span class="hl-key">"source_reliability"</span>: <span class="hl-str">"high"</span>,
      <span class="hl-key">"observed_at"</span>: <span class="hl-str">"2025-02-21T07:45:00Z"</span>
    }
  ],
  <span class="hl-key">"meta"</span>: {
    <span class="hl-key">"current_page"</span>: <span class="hl-num">1</span>,
    <span class="hl-key">"per_page"</span>: <span class="hl-num">20</span>,
    <span class="hl-key">"total"</span>: <span class="hl-num">147</span>,
    <span class="hl-key">"last_page"</span>: <span class="hl-num">8</span>
  }
}</pre>
          </div>
        </div>
      </div>

      <!-- SHOW OBSERVATION -->
      <div class="endpoint" id="ep-obs-show">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/observations/<span class="path-param">{id}</span></span>
          <div class="endpoint-auth">🔒 JWT · patient</div>
        </div>
        <div class="endpoint-body">
          <div class="param-section">
            <div class="param-section-title">Path Parameters</div>
            <table>
              <thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">id</td><td class="td-type">UUID</td><td>Observation UUID. Scoped to authenticated user — 404 returned for other users' IDs.</td></tr>
              </tbody>
            </table>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">404 — Not Found</span></div>
            <pre>{ <span class="hl-key">"message"</span>: <span class="hl-str">"No query results for model [Observation]."</span> }</pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════ RISK ENDPOINTS ════════════════════════════ -->
    <section class="section" id="risk-endpoints">
      <div class="section-header">
        <div class="section-icon" style="background:var(--red-dim)">📊</div>
        <div>
          <div class="section-title">Risk Scores</div>
          <div class="section-subtitle">UPRS · domain scores · longitudinal history · family history · genetic</div>
        </div>
      </div>

      <!-- UPRS -->
      <div class="endpoint" id="ep-risk-uprs">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/risk/uprs</span>
          <div class="endpoint-auth">🔒 JWT · patient</div>
          <span class="endpoint-desc">Compute and return fresh UPRS</span>
        </div>
        <div class="endpoint-body">
          <p class="endpoint-summary">Triggers a synchronous computation of the Unified Preventive Risk Score. Runs feature engineering → AI inference for all domains → aggregates with configured weights → applies genetic modifier. Returns the newly computed score and explanation vectors (SHAP values).</p>
          <div class="alert alert-warn">
            <span class="alert-icon">⚠️</span>
            <div>This endpoint triggers live AI inference. If the Python AI service is unavailable, <code>confidence_score: 0.0</code> and <code>model_version: "fallback"</code> are returned. The score should be treated with caution when confidence is 0.</div>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">200 — UPRS Response</span></div>
            <pre>{
  <span class="hl-key">"data"</span>: {
    <span class="hl-key">"uprs_score"</span>: <span class="hl-num">0.421</span>,
    <span class="hl-key">"uprs_tier"</span>: <span class="hl-str">"moderate"</span>,           <span class="hl-comment">// low | moderate | elevated</span>
    <span class="hl-key">"cardiovascular_score"</span>: <span class="hl-num">0.38</span>,
    <span class="hl-key">"metabolic_score"</span>: <span class="hl-num">0.45</span>,
    <span class="hl-key">"mental_score"</span>: <span class="hl-num">0.41</span>,
    <span class="hl-key">"genetic_modifier"</span>: <span class="hl-num">1.1</span>,              <span class="hl-comment">// 1.0 = neutral</span>
    <span class="hl-key">"confidence_score"</span>: <span class="hl-num">0.87</span>,
    <span class="hl-key">"computed_at"</span>: <span class="hl-str">"2025-02-21T09:30:00Z"</span>,
    <span class="hl-key">"model_version"</span>: <span class="hl-str">"v1.0.0"</span>,
    <span class="hl-key">"explanation_vector"</span>: {
      <span class="hl-key">"cardiovascular"</span>: {
        <span class="hl-key">"resting_hr_baseline"</span>: <span class="hl-num">0.12</span>,
        <span class="hl-key">"hrv_deviation"</span>: <span class="hl-num">-0.08</span>,
        <span class="hl-key">"bp_slope"</span>: <span class="hl-num">0.19</span>
      },
      <span class="hl-key">"metabolic"</span>: {
        <span class="hl-key">"glucose_variability"</span>: <span class="hl-num">0.24</span>,
        <span class="hl-key">"sleep_efficiency"</span>: <span class="hl-num">-0.11</span>
      },
      <span class="hl-key">"mental"</span>: {
        <span class="hl-key">"stress_trend"</span>: <span class="hl-num">0.15</span>,
        <span class="hl-key">"social_withdrawal_index"</span>: <span class="hl-num">0.07</span>
      },
      <span class="hl-key">"anomaly"</span>: { <span class="hl-key">"probability"</span>: <span class="hl-num">0.05</span>, <span class="hl-key">"confidence_score"</span>: <span class="hl-num">0.91</span> }
    }
  },
  <span class="hl-key">"is_diagnostic"</span>: <span class="hl-bool">false</span>,
  <span class="hl-key">"message"</span>: <span class="hl-str">"Risk scores are probabilistic and not medical diagnoses."</span>
}</pre>
          </div>

          <div class="param-section">
            <div class="param-section-title">UPRS Tier Reference</div>
            <table>
              <thead><tr><th>Tier</th><th>Score Range</th><th>Action</th></tr></thead>
              <tbody>
                <tr><td class="td-name" style="color:var(--green)">low</td><td>0.00 – 0.33</td><td>No action. Preventive recommendations provided.</td></tr>
                <tr><td class="td-name" style="color:var(--yellow)">moderate</td><td>0.34 – 0.66</td><td>Lifestyle recommendations. Monitor trend.</td></tr>
                <tr><td class="td-name" style="color:var(--red)">elevated</td><td>0.67 – 1.00</td><td>Automatically queued for clinician review. Human confirmation required before any action.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- SCORES -->
      <div class="endpoint" id="ep-risk-scores">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/risk/scores</span>
          <div class="endpoint-auth">🔒 JWT · patient</div>
          <span class="endpoint-desc">Latest stored domain scores</span>
        </div>
        <div class="endpoint-body">
          <p class="endpoint-summary">Returns the most recently computed risk scores without triggering new inference. Use <code>/risk/uprs</code> to force a fresh computation.</p>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">404 — No Scores Yet</span></div>
            <pre>{
  <span class="hl-key">"message"</span>: <span class="hl-str">"No risk scores computed yet. Submit observations to generate scores."</span>,
  <span class="hl-key">"is_diagnostic"</span>: <span class="hl-bool">false</span>
}</pre>
          </div>
        </div>
      </div>

      <!-- HISTORY -->
      <div class="endpoint" id="ep-risk-history">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/risk/history</span>
          <div class="endpoint-auth">🔒 JWT · patient</div>
        </div>
        <div class="endpoint-body">
          <div class="param-section">
            <div class="param-section-title">Query Parameters</div>
            <table>
              <thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">from</td><td class="td-type">datetime</td><td>Start date filter</td></tr>
                <tr><td class="td-name">to</td><td class="td-type">datetime</td><td>End date filter</td></tr>
                <tr><td class="td-name">per_page</td><td class="td-type">integer</td><td>Default: <code>30</code></td></tr>
              </tbody>
            </table>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">200 — Longitudinal History</span></div>
            <pre>{
  <span class="hl-key">"data"</span>: {
    <span class="hl-key">"data"</span>: [
      {
        <span class="hl-key">"id"</span>: <span class="hl-num">11</span>,
        <span class="hl-key">"uprs_score"</span>: <span class="hl-num">0.421</span>,
        <span class="hl-key">"uprs_tier"</span>: <span class="hl-str">"moderate"</span>,
        <span class="hl-key">"cardiovascular_score"</span>: <span class="hl-num">0.38</span>,
        <span class="hl-key">"metabolic_score"</span>: <span class="hl-num">0.45</span>,
        <span class="hl-key">"mental_score"</span>: <span class="hl-num">0.41</span>,
        <span class="hl-key">"model_version"</span>: { <span class="hl-key">"version"</span>: <span class="hl-str">"v1.0.0"</span> },
        <span class="hl-key">"computed_at"</span>: <span class="hl-str">"2025-02-21T09:30:00Z"</span>
      }
    ],
    <span class="hl-key">"meta"</span>: { <span class="hl-key">"total"</span>: <span class="hl-num">22</span>, <span class="hl-key">"current_page"</span>: <span class="hl-num">1</span>, <span class="hl-key">"last_page"</span>: <span class="hl-num">1</span> }
  },
  <span class="hl-key">"is_diagnostic"</span>: <span class="hl-bool">false</span>,
  <span class="hl-key">"message"</span>: <span class="hl-str">"Risk scores are probabilistic and not medical diagnoses."</span>
}</pre>
          </div>
        </div>
      </div>

      <!-- FAMILY HISTORY -->
      <div class="endpoint" id="ep-risk-family">
        <div class="endpoint-header">
          <span class="endpoint-method method-post">POST</span>
          <span class="endpoint-path">/risk/family-history</span>
          <div class="endpoint-auth">🔒 JWT · patient</div>
        </div>
        <div class="endpoint-body">
          <p class="endpoint-summary">Stores or updates the user's family health history. Used to calibrate UPRS population risk modifiers. All fields are optional — send only what is known.</p>
          <div class="param-section">
            <div class="param-section-title">Request Body</div>
            <table>
              <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">family_diabetes</td><td class="td-type">boolean</td><td>First-degree relative with diabetes</td></tr>
                <tr><td class="td-name">family_cardiovascular</td><td class="td-type">boolean</td><td>First-degree relative with heart disease</td></tr>
                <tr><td class="td-name">family_hypertension</td><td class="td-type">boolean</td><td>First-degree relative with hypertension</td></tr>
                <tr><td class="td-name">family_cancer</td><td class="td-type">boolean</td><td>First-degree relative with cancer</td></tr>
                <tr><td class="td-name">family_mental_illness</td><td class="td-type">boolean</td><td>First-degree relative with mental illness history</td></tr>
                <tr><td class="td-name">additional_conditions</td><td class="td-type">object[]</td><td>Array of <code>{ condition: string, relative: string }</code></td></tr>
              </tbody>
            </table>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">202</span></div>
            <pre>{ <span class="hl-key">"message"</span>: <span class="hl-str">"Family history recorded. Recalculating risk profile."</span>, <span class="hl-key">"is_diagnostic"</span>: <span class="hl-bool">false</span> }</pre>
          </div>
        </div>
      </div>

      <!-- GENETIC -->
      <div class="endpoint" id="ep-risk-genetic">
        <div class="endpoint-header">
          <span class="endpoint-method method-post">POST</span>
          <span class="endpoint-path">/risk/genetic</span>
          <div class="endpoint-auth">🔒 JWT · <span class="badge badge-consent">genetic</span> · <span class="badge badge-encrypt">AES-256</span> · <span class="badge badge-phase">Phase 4</span></div>
        </div>
        <div class="endpoint-body">
          <p class="endpoint-summary">Stores genetic risk markers and polygenic risk scores with AES-256 field-level encryption. Computes a <code>genetic_modifier</code> (1.0–1.5×) applied to the UPRS. Access requires explicit <code>genetic</code> consent.</p>
          <div class="param-section">
            <div class="param-section-title">Request Body</div>
            <table>
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">source</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td><code>patient_provided</code> · <code>lab_partner</code> · <code>research</code></td></tr>
                <tr><td class="td-name">markers</td><td class="td-type">object[]</td><td class="td-required req-no">optional</td><td>Array of <code>{ gene: string, variant: string, risk_allele: string }</code>. High-risk genes: <code>BRCA1</code> <code>BRCA2</code> <code>APOE4</code> <code>FH</code>.</td></tr>
                <tr><td class="td-name">polygenic_risk_scores</td><td class="td-type">object</td><td class="td-required req-no">optional</td><td>Map of trait → score (0.0–1.0). e.g. <code>{ "cardiovascular": 0.72, "t2d": 0.45 }</code></td></tr>
              </tbody>
            </table>
          </div>
          <div class="param-section">
            <div class="param-section-title">Genetic Modifier Computation</div>
            <table>
              <thead><tr><th>Condition</th><th>Modifier Adjustment</th></tr></thead>
              <tbody>
                <tr><td>No genetic data provided</td><td>1.0 (neutral)</td></tr>
                <tr><td>Each high-risk gene marker (BRCA1, BRCA2, APOE4, FH)</td><td>+0.05</td></tr>
                <tr><td>Each polygenic score &gt; 0.80</td><td>+0.03</td></tr>
                <tr><td>Maximum modifier</td><td>1.50 (capped)</td></tr>
              </tbody>
            </table>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">202</span></div>
            <pre>{ <span class="hl-key">"message"</span>: <span class="hl-str">"Genetic risk markers recorded securely."</span>, <span class="hl-key">"is_diagnostic"</span>: <span class="hl-bool">false</span> }</pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════ DEVICES ═════════════════════════════════ -->
    <section class="section" id="devices-endpoints">
      <div class="section-header">
        <div class="section-icon" style="background:var(--blue-dim)">📱</div>
        <div>
          <div class="section-title">Devices</div>
          <div class="section-subtitle">Register iOS and Android devices</div>
        </div>
      </div>

      <div class="endpoint" id="ep-devices-post">
        <div class="endpoint-header">
          <span class="endpoint-method method-post">POST</span>
          <span class="endpoint-path">/devices</span>
          <div class="endpoint-auth">🔒 JWT · patient</div>
          <span class="endpoint-desc">Register or update a device</span>
        </div>
        <div class="endpoint-body">
          <p class="endpoint-summary">Registers an iOS or Android device. If the device_id already exists for this user, the record is updated (upsert). Used to associate observations with devices and enable push notifications.</p>
          <div class="param-section">
            <div class="param-section-title">Request Body</div>
            <table>
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">platform</td><td class="td-type">string</td><td class="td-required req-yes">required</td><td><code>ios</code> · <code>android</code></td></tr>
                <tr><td class="td-name">device_id</td><td class="td-type">string</td><td class="td-required req-yes">required</td><td>Unique device identifier from OS (max 255 chars)</td></tr>
                <tr><td class="td-name">device_name</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td>Human-readable name (e.g. <code>Ada's iPhone 16</code>)</td></tr>
                <tr><td class="td-name">os_version</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td>OS version string (e.g. <code>18.2</code>)</td></tr>
                <tr><td class="td-name">app_version</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td>UPIP app version (e.g. <code>1.0.4</code>)</td></tr>
                <tr><td class="td-name">health_api</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td><code>HealthKit</code> · <code>HealthConnect</code> · <code>GoogleFit</code></td></tr>
                <tr><td class="td-name">push_token</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td>FCM / APNs push notification token</td></tr>
              </tbody>
            </table>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">201 — Created</span></div>
            <pre>{
  <span class="hl-key">"message"</span>: <span class="hl-str">"Device registered."</span>,
  <span class="hl-key">"data"</span>: {
    <span class="hl-key">"id"</span>: <span class="hl-num">3</span>,
    <span class="hl-key">"user_id"</span>: <span class="hl-num">42</span>,
    <span class="hl-key">"platform"</span>: <span class="hl-str">"ios"</span>,
    <span class="hl-key">"device_id"</span>: <span class="hl-str">"apple-watch-uuid-xyz"</span>,
    <span class="hl-key">"device_name"</span>: <span class="hl-str">"Ada's iPhone 16"</span>,
    <span class="hl-key">"health_api"</span>: <span class="hl-str">"HealthKit"</span>,
    <span class="hl-key">"is_active"</span>: <span class="hl-bool">true</span>,
    <span class="hl-key">"last_seen_at"</span>: <span class="hl-str">"2025-02-21T09:00:00Z"</span>
  }
}</pre>
          </div>
        </div>
      </div>

      <div class="endpoint" id="ep-devices-list">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/devices</span>
          <div class="endpoint-auth">🔒 JWT · patient</div>
        </div>
        <div class="endpoint-body">
          <p>Returns all active (non-unregistered) devices for the authenticated user.</p>
        </div>
      </div>

      <div class="endpoint" id="ep-devices-delete">
        <div class="endpoint-header">
          <span class="endpoint-method method-delete">DEL</span>
          <span class="endpoint-path">/devices/<span class="path-param">{id}</span></span>
          <div class="endpoint-auth">🔒 JWT · patient</div>
        </div>
        <div class="endpoint-body">
          <p>Soft-unregisters a device by setting <code>is_active = false</code>. Historical observations from this device are retained.</p>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">200</span></div>
            <pre>{ <span class="hl-key">"message"</span>: <span class="hl-str">"Device unregistered."</span> }</pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════ CLINICIAN ══════════════════════════════ -->
    <section class="section" id="clinician-endpoints">
      <div class="section-header">
        <div class="section-icon" style="background:var(--orange-dim)">👨‍⚕️</div>
        <div>
          <div class="section-title">Clinician — Human-in-the-Loop</div>
          <div class="section-subtitle">Role: clinician · admin</div>
        </div>
      </div>

      <div class="alert alert-danger">
        <span class="alert-icon">🚫</span>
        <div>AI cannot finalize medical decisions. All elevated UPRS cases are queued for human clinician review. A clinician must explicitly submit a review decision before any action is communicated to the patient.</div>
      </div>

      <!-- QUEUE -->
      <div class="endpoint" id="ep-clin-queue">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/clinician/queue</span>
          <div class="endpoint-auth">🔒 JWT · <span class="badge badge-role">clinician</span></div>
          <span class="endpoint-desc">Pending elevated cases</span>
        </div>
        <div class="endpoint-body">
          <div class="param-section">
            <div class="param-section-title">Query Parameters</div>
            <table>
              <thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">priority</td><td class="td-type">string</td><td>Filter by <code>normal</code> · <code>high</code> · <code>urgent</code></td></tr>
                <tr><td class="td-name">per_page</td><td class="td-type">integer</td><td>Default: <code>20</code></td></tr>
              </tbody>
            </table>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">200</span></div>
            <pre>{
  <span class="hl-key">"data"</span>: {
    <span class="hl-key">"data"</span>: [
      {
        <span class="hl-key">"id"</span>: <span class="hl-num">7</span>,
        <span class="hl-key">"patient"</span>: { <span class="hl-key">"id"</span>: <span class="hl-num">42</span>, <span class="hl-key">"name"</span>: <span class="hl-str">"Ada Okafor"</span>, <span class="hl-key">"dob"</span>: <span class="hl-str">"1990-03-15"</span>, <span class="hl-key">"region"</span>: <span class="hl-str">"NG"</span> },
        <span class="hl-key">"status"</span>: <span class="hl-str">"pending"</span>,
        <span class="hl-key">"priority"</span>: <span class="hl-str">"high"</span>,
        <span class="hl-key">"latest_risk_score"</span>: { <span class="hl-key">"uprs_score"</span>: <span class="hl-num">0.79</span>, <span class="hl-key">"uprs_tier"</span>: <span class="hl-str">"elevated"</span> },
        <span class="hl-key">"created_at"</span>: <span class="hl-str">"2025-02-21T09:31:00Z"</span>
      }
    ]
  },
  <span class="hl-key">"is_diagnostic"</span>: <span class="hl-bool">false</span>,
  <span class="hl-key">"message"</span>: <span class="hl-str">"Risk scores are probabilistic and not medical diagnoses."</span>
}</pre>
          </div>

          <div class="param-section">
            <div class="param-section-title">Priority Assignment Logic</div>
            <table>
              <thead><tr><th>UPRS Score</th><th>Priority</th></tr></thead>
              <tbody>
                <tr><td>≥ 0.90</td><td class="td-name" style="color:var(--red)">urgent</td></tr>
                <tr><td>0.75 – 0.89</td><td class="td-name" style="color:var(--orange)">high</td></tr>
                <tr><td>0.67 – 0.74</td><td class="td-name" style="color:var(--text-dim)">normal</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- CASE DETAIL -->
      <div class="endpoint" id="ep-clin-case">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/clinician/cases/<span class="path-param">{caseId}</span></span>
          <div class="endpoint-auth">🔒 JWT · <span class="badge badge-role">clinician</span></div>
        </div>
        <div class="endpoint-body">
          <p class="endpoint-summary">Returns full case detail: patient profile, risk score with SHAP explanation vectors, 50 most recent observations, and computed features. Intended to give the clinician complete context for decision-making.</p>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">200</span></div>
            <pre>{
  <span class="hl-key">"data"</span>: {
    <span class="hl-key">"id"</span>: <span class="hl-num">7</span>,
    <span class="hl-key">"patient"</span>: { <span class="hl-comment">/* full user object */</span> },
    <span class="hl-key">"risk_score"</span>: {
      <span class="hl-key">"uprs_score"</span>: <span class="hl-num">0.79</span>,
      <span class="hl-key">"uprs_tier"</span>: <span class="hl-str">"elevated"</span>,
      <span class="hl-key">"cardiovascular_score"</span>: <span class="hl-num">0.81</span>,
      <span class="hl-key">"explanation_vector"</span>: { <span class="hl-comment">/* SHAP values */</span> }
    },
    <span class="hl-key">"observations"</span>: [ <span class="hl-comment">/* last 50 observations */</span> ],
    <span class="hl-key">"features"</span>: {
      <span class="hl-key">"resting_hr_baseline"</span>: <span class="hl-num">84</span>,
      <span class="hl-key">"hrv_deviation"</span>: <span class="hl-num">18.4</span>,
      <span class="hl-key">"sleep_efficiency"</span>: <span class="hl-num">0.71</span>,
      <span class="hl-key">"stress_trend"</span>: <span class="hl-num">0.22</span>
    }
  },
  <span class="hl-key">"is_diagnostic"</span>: <span class="hl-bool">false</span>,
  <span class="hl-key">"message"</span>: <span class="hl-str">"Risk scores are probabilistic. Clinical judgment is required."</span>
}</pre>
          </div>
        </div>
      </div>

      <!-- SUBMIT REVIEW -->
      <div class="endpoint" id="ep-clin-review">
        <div class="endpoint-header">
          <span class="endpoint-method method-post">POST</span>
          <span class="endpoint-path">/clinician/review/<span class="path-param">{caseId}</span></span>
          <div class="endpoint-auth">🔒 JWT · <span class="badge badge-role">clinician</span></div>
          <span class="endpoint-desc">Submit human review decision</span>
        </div>
        <div class="endpoint-body">
          <p class="endpoint-summary">Submits the clinician's decision for a pending elevated case. This is the human confirmation step — the AI never finalizes this decision. The patient receives a notification with preventive (non-diagnostic) language based on the decision.</p>
          <div class="param-section">
            <div class="param-section-title">Request Body</div>
            <table>
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">decision</td><td class="td-type">string</td><td class="td-required req-yes">required</td><td><code>dismissed</code> — no action needed · <code>referred</code> — refer to specialist · <code>escalated</code> — urgent follow-up</td></tr>
                <tr><td class="td-name">notes</td><td class="td-type">string</td><td class="td-required req-yes">required</td><td>Clinical notes. Minimum 10 characters, max 5000. Stored in audit trail.</td></tr>
                <tr><td class="td-name">recommendation</td><td class="td-type">string</td><td class="td-required req-no">optional</td><td>Preventive recommendation text. Sent to patient (non-diagnostic language only).</td></tr>
                <tr><td class="td-name">follow_up_required</td><td class="td-type">boolean</td><td class="td-required req-no">optional</td><td>Whether a follow-up appointment is recommended</td></tr>
                <tr><td class="td-name">follow_up_date</td><td class="td-type">date</td><td class="td-required req-cond">cond.</td><td>Required if <code>follow_up_required: true</code>. Must be after today.</td></tr>
              </tbody>
            </table>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">200</span></div>
            <pre>{
  <span class="hl-key">"message"</span>: <span class="hl-str">"Review submitted successfully."</span>,
  <span class="hl-key">"case_id"</span>: <span class="hl-str">"7"</span>,
  <span class="hl-key">"decision"</span>: <span class="hl-str">"referred"</span>,
  <span class="hl-key">"is_diagnostic"</span>: <span class="hl-bool">false</span>
}</pre>
          </div>
          <div class="alert alert-warn">
            <span class="alert-icon">⚠️</span>
            <div>Attempting to review a case that is not in <code>pending</code> status will return <strong>404</strong>. Cases can only be reviewed once.</div>
          </div>
        </div>
      </div>

      <!-- PATIENTS -->
      <div class="endpoint" id="ep-clin-patients">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/clinician/patients</span>
          <div class="endpoint-auth">🔒 JWT · <span class="badge badge-role">clinician</span></div>
        </div>
        <div class="endpoint-body">
          <div class="param-section">
            <div class="param-section-title">Query Parameters</div>
            <table>
              <thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">search</td><td class="td-type">string</td><td>Partial name search (LIKE query)</td></tr>
                <tr><td class="td-name">per_page</td><td class="td-type">integer</td><td>Default: <code>20</code></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- PATIENT HISTORY -->
      <div class="endpoint" id="ep-clin-history">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/clinician/patients/<span class="path-param">{userId}</span>/history</span>
          <div class="endpoint-auth">🔒 JWT · <span class="badge badge-role">clinician</span></div>
        </div>
        <div class="endpoint-body">
          <p>Returns paginated longitudinal UPRS history for a specific patient, including model version metadata per computation.</p>
        </div>
      </div>
    </section>

    <!-- ════════════════════════ ADMIN ═══════════════════════════════════ -->
    <section class="section" id="admin-endpoints">
      <div class="section-header">
        <div class="section-icon" style="background:var(--purple-dim)">⚙️</div>
        <div>
          <div class="section-title">Admin Endpoints</div>
          <div class="section-subtitle">Role: admin only</div>
        </div>
      </div>

      <div class="endpoint" id="ep-admin-weights-get">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/admin/risk-weights</span>
          <div class="endpoint-auth">🔒 JWT · <span class="badge badge-role">admin</span></div>
        </div>
        <div class="endpoint-body">
          <p>Returns the currently active UPRS domain weight configuration.</p>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">200</span></div>
            <pre>{
  <span class="hl-key">"id"</span>: <span class="hl-num">3</span>,
  <span class="hl-key">"cardiovascular_weight"</span>: <span class="hl-num">0.40</span>,
  <span class="hl-key">"metabolic_weight"</span>: <span class="hl-num">0.35</span>,
  <span class="hl-key">"mental_weight"</span>: <span class="hl-num">0.25</span>,
  <span class="hl-key">"is_active"</span>: <span class="hl-bool">true</span>,
  <span class="hl-key">"updated_at"</span>: <span class="hl-str">"2025-02-01T00:00:00Z"</span>
}</pre>
          </div>
        </div>
      </div>

      <div class="endpoint" id="ep-admin-weights-put">
        <div class="endpoint-header">
          <span class="endpoint-method method-put">PUT</span>
          <span class="endpoint-path">/admin/risk-weights</span>
          <div class="endpoint-auth">🔒 JWT · <span class="badge badge-role">admin</span></div>
        </div>
        <div class="endpoint-body">
          <p class="endpoint-summary">Updates UPRS domain weights. Supersedes the existing active config (old record is set inactive). All three weights must sum exactly to <code>1.0</code>.</p>
          <div class="param-section">
            <div class="param-section-title">Request Body</div>
            <table>
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Constraints</th></tr></thead>
              <tbody>
                <tr><td class="td-name">cardiovascular_weight</td><td class="td-type">float</td><td class="td-required req-yes">required</td><td>0.0 – 1.0</td></tr>
                <tr><td class="td-name">metabolic_weight</td><td class="td-type">float</td><td class="td-required req-yes">required</td><td>0.0 – 1.0</td></tr>
                <tr><td class="td-name">mental_weight</td><td class="td-type">float</td><td class="td-required req-yes">required</td><td>0.0 – 1.0</td></tr>
              </tbody>
            </table>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">422 — Weights Don't Sum to 1.0</span></div>
            <pre>{ <span class="hl-key">"message"</span>: <span class="hl-str">"Weights must sum to 1.0."</span> }</pre>
          </div>
        </div>
      </div>

      <div class="endpoint" id="ep-admin-audit">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/admin/audit-logs</span>
          <div class="endpoint-auth">🔒 JWT · <span class="badge badge-role">admin</span></div>
        </div>
        <div class="endpoint-body">
          <div class="param-section">
            <div class="param-section-title">Query Parameters</div>
            <table>
              <thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">user_id</td><td class="td-type">integer</td><td>Filter by subject user ID</td></tr>
                <tr><td class="td-name">action</td><td class="td-type">string</td><td>Filter by action type (e.g. <code>post_observation</code>, <code>clinician_review_submitted</code>)</td></tr>
                <tr><td class="td-name">from</td><td class="td-type">datetime</td><td>Start of date range</td></tr>
                <tr><td class="td-name">per_page</td><td class="td-type">integer</td><td>Default: <code>50</code></td></tr>
              </tbody>
            </table>
          </div>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">200 — Audit Log Entry</span></div>
            <pre>{
  <span class="hl-key">"data"</span>: [
    {
      <span class="hl-key">"id"</span>: <span class="hl-num">891</span>,
      <span class="hl-key">"user"</span>: { <span class="hl-key">"id"</span>: <span class="hl-num">42</span>, <span class="hl-key">"name"</span>: <span class="hl-str">"Ada Okafor"</span>, <span class="hl-key">"email"</span>: <span class="hl-str">"ada@example.com"</span> },
      <span class="hl-key">"actor_id"</span>: <span class="hl-num">42</span>,
      <span class="hl-key">"action"</span>: <span class="hl-str">"post_observation"</span>,
      <span class="hl-key">"resource_type"</span>: <span class="hl-str">"Observation"</span>,
      <span class="hl-key">"resource_id"</span>: <span class="hl-str">"550e8400-..."</span>,
      <span class="hl-key">"ip_address"</span>: <span class="hl-str">"197.x.x.x"</span>,
      <span class="hl-key">"metadata"</span>: { <span class="hl-key">"method"</span>: <span class="hl-str">"POST"</span>, <span class="hl-key">"path"</span>: <span class="hl-str">"v1/observations/wearable"</span>, <span class="hl-key">"status_code"</span>: <span class="hl-num">202</span> },
      <span class="hl-key">"created_at"</span>: <span class="hl-str">"2025-02-21T09:00:01Z"</span>
    }
  ]
}</pre>
          </div>
          <div class="param-section">
            <div class="param-section-title">Audited Action Types</div>
            <table>
              <thead><tr><th>Action</th><th>Trigger</th></tr></thead>
              <tbody>
                <tr><td class="td-name">post_observation</td><td>Any observation submitted</td></tr>
                <tr><td class="td-name">post_risk_data</td><td>Family history or genetic data submitted</td></tr>
                <tr><td class="td-name">clinician_review_submitted</td><td>Clinician completes a review</td></tr>
                <tr><td class="td-name">post_consent / delete_consent</td><td>Consent granted or revoked</td></tr>
                <tr><td class="td-name">get_risk_data</td><td>UPRS or scores fetched</td></tr>
                <tr><td class="td-name">audit_log_access</td><td>Audit logs viewed</td></tr>
                <tr><td class="td-name">get_request / post_request</td><td>All other authenticated requests</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="endpoint" id="ep-admin-models">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/admin/model-versions</span>
          <div class="endpoint-auth">🔒 JWT · <span class="badge badge-role">admin</span></div>
        </div>
        <div class="endpoint-body">
          <p>Returns paginated list of AI model versions with calibration scores, bias test status, and deployment timestamps.</p>
          <div class="code-block">
            <div class="code-header"><span class="code-lang">200 — Model Version Object</span></div>
            <pre>{
  <span class="hl-key">"id"</span>: <span class="hl-num">1</span>,
  <span class="hl-key">"model_name"</span>: <span class="hl-str">"CardioRisk-LGBM"</span>,
  <span class="hl-key">"version"</span>: <span class="hl-str">"v1.0.0"</span>,
  <span class="hl-key">"domain"</span>: <span class="hl-str">"cardiovascular"</span>,
  <span class="hl-key">"calibration_score"</span>: <span class="hl-num">0.92</span>,
  <span class="hl-key">"bias_test_passed"</span>: <span class="hl-bool">true</span>,
  <span class="hl-key">"drift_threshold"</span>: <span class="hl-num">0.05</span>,
  <span class="hl-key">"is_active"</span>: <span class="hl-bool">true</span>,
  <span class="hl-key">"deployed_at"</span>: <span class="hl-str">"2025-01-15T00:00:00Z"</span>,
  <span class="hl-key">"deprecated_at"</span>: <span class="hl-null">null</span>
}</pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════ USER & AUDIT ════════════════════════════ -->
    <section class="section" id="user-endpoints">
      <div class="section-header">
        <div class="section-icon" style="background:var(--green-dim)">👤</div>
        <div>
          <div class="section-title">User Profile & Audit</div>
          <div class="section-subtitle">/users · /audit-logs</div>
        </div>
      </div>

      <div class="endpoint" id="ep-user-profile">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/users/profile</span>
          <div class="endpoint-auth">🔒 JWT · patient</div>
        </div>
        <div class="endpoint-body">
          <p>Returns the authenticated user's profile with roles, active devices, and latest risk score.</p>
        </div>
      </div>

      <div class="endpoint" id="ep-user-update">
        <div class="endpoint-header">
          <span class="endpoint-method method-put">PUT</span>
          <span class="endpoint-path">/users/profile</span>
          <div class="endpoint-auth">🔒 JWT · patient</div>
        </div>
        <div class="endpoint-body">
          <div class="param-section">
            <div class="param-section-title">Request Body (all optional)</div>
            <table>
              <thead><tr><th>Field</th><th>Type</th><th>Constraints</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td class="td-name">name</td><td class="td-type">string</td><td>max:255</td><td>Display name</td></tr>
                <tr><td class="td-name">dob</td><td class="td-type">date</td><td>before:today</td><td>Date of birth</td></tr>
                <tr><td class="td-name">gender</td><td class="td-type">string</td><td>enum</td><td><code>male</code> · <code>female</code> · <code>other</code> · <code>prefer_not_to_say</code></td></tr>
                <tr><td class="td-name">region</td><td class="td-type">string</td><td>size:2</td><td>ISO 3166-1 alpha-2. Used for population risk calibration. Changing region triggers risk recalibration.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="endpoint" id="ep-audit">
        <div class="endpoint-header">
          <span class="endpoint-method method-get">GET</span>
          <span class="endpoint-path">/audit-logs</span>
          <div class="endpoint-auth">🔒 JWT · patient</div>
        </div>
        <div class="endpoint-body">
          <p>Returns paginated audit log of all data access events for the authenticated user only. Supports <code>per_page</code> query parameter. Default: <code>30</code> per page.</p>
        </div>
      </div>
    </section>

  </div><!-- /content -->
</main>

<script>
  // Active nav highlight on scroll
  const sections = document.querySelectorAll('[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + id) {
            item.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));

  // Copy button (stub)
  document.querySelectorAll('.code-copy').forEach(btn => {
    btn.addEventListener('click', function() {
      const pre = this.closest('.code-block').querySelector('pre');
      navigator.clipboard?.writeText(pre.innerText);
      this.textContent = 'Copied!';
      setTimeout(() => this.textContent = 'Copy', 1500);
    });
  });

  // Sidebar search
  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', function() {
    const q = this.value.toLowerCase();
    document.querySelectorAll('.nav-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
    document.querySelectorAll('.nav-group-label').forEach(label => {
      const group = label.nextElementSibling;
      if (group) {
        const visible = [...group.querySelectorAll('.nav-item')].some(i => i.style.display !== 'none');
        label.style.display = visible ? '' : 'none';
      }
    });
  });
</script>
</body>
</html>