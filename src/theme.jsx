// ─── theme.jsx ────────────────────────────────────────────────────────────────
// Dark antique theme + global CSS. Import T and GlobalStyles from here.

// ─── DARK ANTIQUE THEME ───────────────────────────────────────────────────────
export const T = {
  bg:          '#0E0C09',   // near-black parchment
  surface:     '#1A1710',   // dark surface
  surfaceAlt:  '#231F15',   // slightly lighter panel
  surfaceHov:  '#2C271A',   // hover state
  border:      '#3A3320',   // dark gold-tinted border
  borderLight: '#2A2518',   // subtle border
  gold:        '#C9A843',   // metallic gold
  goldLight:   '#E8C97A',   // lighter gold highlight
  goldDark:    '#8B6914',   // deep gold / amber
  accent:      '#7B3F00',   // deep burnt orange / rust
  text:        '#F0E6C8',   // warm parchment text
  textMid:     '#B8A878',   // mid tone
  textLight:   '#7A6A44',   // muted label
  error:       '#E05252',
  success:     '#5CB85C',
  info:        '#5B9BD5',
}

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
export const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { height: 100%; }
    body, #root {
      height: 100%;
      min-height: 100dvh;
      background: ${T.bg};
      color: ${T.text};
      font-family: 'Jost', sans-serif;
      font-weight: 300;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: ${T.surface}; }
    ::-webkit-scrollbar-thumb { background: ${T.goldDark}; border-radius: 2px; }

    input, textarea, select {
      font-family: 'Jost', sans-serif;
      color-scheme: dark;
    }
    button { cursor: pointer; font-family: 'Jost', sans-serif; }

    @keyframes fadeIn  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
    @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes spin    { to { transform:rotate(360deg); } }
    @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
    @keyframes pulse   { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.06); opacity:.8; } }
    @keyframes waveform { 0%,100% { height:4px; } 50% { height:18px; } }
    @keyframes glow    { 0%,100% { box-shadow:0 0 8px ${T.goldDark}44; } 50% { box-shadow:0 0 20px ${T.gold}88; } }

    .fade-in  { animation: fadeIn  0.35s ease forwards; }
    .slide-up { animation: slideUp 0.3s  ease forwards; }

    /* ── Buttons ── */
    .btn-primary {
      background: linear-gradient(135deg, ${T.goldDark}, ${T.gold});
      color: #0E0C09;
      border: none;
      padding: 11px 26px;
      border-radius: 2px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1.8px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 14px rgba(201,168,67,0.25);
    }
    .btn-primary:hover  { filter:brightness(1.12); box-shadow:0 4px 22px rgba(201,168,67,0.38); }
    .btn-primary:disabled { opacity:.45; cursor:not-allowed; filter:none; }

    .btn-outline {
      background: transparent;
      color: ${T.gold};
      border: 1px solid ${T.gold}88;
      padding: 9px 22px;
      border-radius: 2px;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-outline:hover { background: ${T.gold}18; border-color: ${T.gold}; }

    .btn-ghost {
      background: transparent;
      color: ${T.textMid};
      border: 1px solid ${T.border};
      padding: 7px 16px;
      border-radius: 2px;
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-ghost:hover { border-color: ${T.gold}88; color: ${T.gold}; }

    /* ── Cards ── */
    .card {
      background: ${T.surface};
      border: 1px solid ${T.border};
      border-radius: 4px;
      overflow: hidden;
    }
    .card-hover:hover {
      border-color: ${T.gold}66;
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(0,0,0,0.4);
    }

    /* ── Inputs ── */
    .input-field {
      width: 100%;
      background: ${T.surfaceAlt};
      border: 1px solid ${T.border};
      border-radius: 2px;
      padding: 11px 14px;
      font-size: 13px;
      color: ${T.text};
      outline: none;
      transition: border-color 0.2s;
    }
    .input-field:focus  { border-color: ${T.gold}88; background: ${T.surface}; }
    .input-field::placeholder { color: ${T.textLight}; }

    /* ── Labels ── */
    .label-xs {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: ${T.gold};
      display: block;
    }
    .label-sm {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 1.8px;
      text-transform: uppercase;
      color: ${T.textMid};
      display: block;
    }

    /* ── Divider ── */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, ${T.border}, transparent);
      margin: 18px 0;
    }

    /* ── Chips ── */
    .chip {
      display: inline-flex;
      align-items: center;
      padding: 5px 14px;
      border-radius: 40px;
      border: 1px solid ${T.border};
      font-size: 11px;
      font-weight: 400;
      letter-spacing: 0.4px;
      color: ${T.textMid};
      background: ${T.surfaceAlt};
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .chip:hover { border-color: ${T.gold}88; color: ${T.gold}; }
    .chip.active {
      background: linear-gradient(135deg, ${T.goldDark}, ${T.gold});
      color: #0E0C09;
      border-color: ${T.gold};
      font-weight: 600;
    }

    /* ── Status badges ── */
    .status-draft      { background:#2A2000; color:#C9A843; border:1px solid #C9A84344; padding:2px 9px; border-radius:40px; font-size:9px; letter-spacing:1px; text-transform:uppercase; }
    .status-submitted  { background:#001830; color:#5B9BD5; border:1px solid #5B9BD544; padding:2px 9px; border-radius:40px; font-size:9px; letter-spacing:1px; text-transform:uppercase; }
    .status-review     { background:#200008; color:#E05252; border:1px solid #E0525244; padding:2px 9px; border-radius:40px; font-size:9px; letter-spacing:1px; text-transform:uppercase; }
    .status-approved   { background:#001A08; color:#5CB85C; border:1px solid #5CB85C44; padding:2px 9px; border-radius:40px; font-size:9px; letter-spacing:1px; text-transform:uppercase; }
    .status-production { background:#1A0830; color:#9B7FD4; border:1px solid #9B7FD444; padding:2px 9px; border-radius:40px; font-size:9px; letter-spacing:1px; text-transform:uppercase; }

    /* ── Gold gradient text ── */
    .gold-gradient {
      background: linear-gradient(135deg, ${T.goldDark}, ${T.gold}, ${T.goldLight});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .shimmer-text {
      background: linear-gradient(90deg, ${T.goldDark} 0%, ${T.goldLight} 40%, ${T.gold} 60%, ${T.goldDark} 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s linear infinite;
    }

    /* ── Scrollable panels ── */
    .panel-scroll {
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: ${T.goldDark} ${T.surface};
    }

    /* ── Responsive helpers ── */
    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
    }
    @media (min-width: 769px) {
      .hide-desktop { display: none !important; }
    }
  `}</style>
)
