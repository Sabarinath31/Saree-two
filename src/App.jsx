import { useState, useEffect, useRef, useCallback } from 'react'

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://glvmekmiwyyasnepceqp.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsdm1la21pd3l5YXNuZXBjZXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMzEwNjIsImV4cCI6MjA4ODkwNzA2Mn0.-Fx8aPqpxSHIkm9RAkVT92nXNyFPSBUYLmWhuEr3ONU'
const CLAUDE_MODEL = 'claude-sonnet-4-20250514'
// 🔑 Add your Anthropic API key here
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_KEY || ''

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  bg: '#FAF8F3',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F0E8',
  border: '#E8DFC8',
  borderLight: '#F0E8D8',
  gold: '#D4AF37',
  goldLight: '#E8C97A',
  goldDark: '#6A1B9A',
  text: '#2C2416',
  textMid: '#6B5A3E',
  textLight: '#9C8A6A',
  error: '#C0392B',
  success: '#27AE60',
  info: '#2980B9',
}

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
`

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    ${fonts}
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body {
      background: ${T.bg};
      color: ${T.text};
      font-family: 'Jost', sans-serif;
      font-weight: 300;
      -webkit-font-smoothing: antialiased;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${T.surfaceAlt}; }
    ::-webkit-scrollbar-thumb { background: ${T.goldLight}; border-radius: 2px; }
    input, textarea, select { font-family: 'Jost', sans-serif; }
    button { cursor: pointer; font-family: 'Jost', sans-serif; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%,100% { transform: scale(1); opacity:1; } 50% { transform: scale(1.08); opacity:0.8; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes ripple { 0% { transform: scale(0.8); opacity:1; } 100% { transform: scale(2.5); opacity:0; } }
    @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes waveform { 0%,100% { height:4px; } 50% { height:18px; } }

    .fade-in { animation: fadeIn 0.4s ease forwards; }
    .slide-up { animation: slideUp 0.35s ease forwards; }

    .gold-gradient {
      background: linear-gradient(135deg, ${T.goldDark}, ${T.gold}, ${T.goldLight}, ${T.gold});
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

    .btn-primary {
      background: linear-gradient(135deg, ${T.goldDark}, ${T.gold});
      color: ${T.surface};
      border: none;
      padding: 12px 28px;
      border-radius: 2px;
      font-family: 'Jost', sans-serif;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 2px 12px rgba(201,168,67,0.3);
    }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(201,168,67,0.4); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .btn-outline {
      background: transparent;
      color: ${T.gold};
      border: 1px solid ${T.gold};
      padding: 10px 24px;
      border-radius: 2px;
      font-family: 'Jost', sans-serif;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .btn-outline:hover { background: ${T.gold}; color: white; }

    .btn-ghost {
      background: transparent;
      color: ${T.textMid};
      border: 1px solid ${T.border};
      padding: 8px 18px;
      border-radius: 2px;
      font-family: 'Jost', sans-serif;
      font-size: 12px;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-ghost:hover { border-color: ${T.gold}; color: ${T.gold}; }

    .card {
      background: ${T.surface};
      border: 1px solid ${T.border};
      border-radius: 4px;
      overflow: hidden;
    }

    .input-field {
      width: 100%;
      background: ${T.surfaceAlt};
      border: 1px solid ${T.border};
      border-radius: 2px;
      padding: 12px 16px;
      font-family: 'Jost', sans-serif;
      font-size: 14px;
      color: ${T.text};
      outline: none;
      transition: border-color 0.2s;
    }
    .input-field:focus { border-color: ${T.gold}; background: white; }
    .input-field::placeholder { color: ${T.textLight}; }

    .label-xs {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: ${T.gold};
    }
    .label-sm {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: ${T.textMid};
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, ${T.border}, transparent);
      margin: 24px 0;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      padding: 7px 16px;
      border-radius: 40px;
      border: 1px solid ${T.border};
      font-size: 12px;
      font-weight: 400;
      letter-spacing: 0.5px;
      color: ${T.textMid};
      background: ${T.surface};
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .chip:hover { border-color: ${T.gold}; color: ${T.gold}; }
    .chip.active {
      background: linear-gradient(135deg, ${T.goldDark}, ${T.gold});
      color: white;
      border-color: ${T.gold};
      box-shadow: 0 2px 8px rgba(201,168,67,0.3);
    }

    .status-draft { background: #FEF9EC; color: #B7791F; border: 1px solid #F6E05E; padding: 3px 10px; border-radius: 40px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; }
    .status-submitted { background: #EBF8FF; color: #2B6CB0; border: 1px solid #90CDF4; padding: 3px 10px; border-radius: 40px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; }
    .status-review { background: #FFF5F5; color: #C53030; border: 1px solid #FEB2B2; padding: 3px 10px; border-radius: 40px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; }
    .status-approved { background: #F0FFF4; color: #276749; border: 1px solid #9AE6B4; padding: 3px 10px; border-radius: 40px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; }
    .status-production { background: #FAF5FF; color: #6B46C1; border: 1px solid #D6BCFA; padding: 3px 10px; border-radius: 40px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; }
  `}</style>
)

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
const sb = {
  _h: (token) => ({
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${token || SUPABASE_KEY}`,
    'Prefer': 'return=representation'
  }),
  signUp: async (email, password, role = 'customer') => {
    try {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
        body: JSON.stringify({ email, password, data: { role } })
      })
      const data = await r.json()
      console.log('SignUp response:', r.status, data)
      return data
    } catch(e) {
      console.error('SignUp fetch error:', e)
      return { error: { message: 'Network error - could not reach Supabase. Check your internet connection.' } }
    }
  },
  signIn: async (email, password) => {
    try {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
        body: JSON.stringify({ email, password })
      })
      const data = await r.json()
      console.log('SignIn response:', r.status, data)
      return data
    } catch(e) {
      console.error('SignIn fetch error:', e)
      return { error: { message: 'Network error - could not reach Supabase. Check your internet connection.' } }
    }
  },
  getUser: async (token) => {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: sb._h(token) })
    return r.json()
  },
  signOut: async (token) => {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: 'POST', headers: sb._h(token) })
  },
  select: async (table, filters = '', token) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filters}`, { headers: sb._h(token) })
    return r.json()
  },
  insert: async (table, data, token) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST', headers: sb._h(token), body: JSON.stringify(data)
    })
    return r.json()
  },
  update: async (table, data, filters, token) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filters}`, {
      method: 'PATCH', headers: sb._h(token), body: JSON.stringify(data)
    })
    return r.json()
  },
  delete: async (table, filters, token) => {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filters}`, { method: 'DELETE', headers: sb._h(token) })
  }
}

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED_PATTERNS = [
  // Body patterns
  { id: 'b1', name: 'Plain Weave', saree_part: 'body', style_type: 'minimal', richness_level: 1, tags: ['plain', 'minimal', 'cotton', 'linen', 'casual'] },
  { id: 'b2', name: 'Thin Stripes', saree_part: 'body', style_type: 'modern', richness_level: 2, tags: ['stripes', 'modern', 'office', 'casual'] },
  { id: 'b3', name: 'Checks Pattern', saree_part: 'body', style_type: 'traditional', richness_level: 2, tags: ['checks', 'chettinad', 'cotton', 'traditional'] },
  { id: 'b4', name: 'Floral Butta', saree_part: 'body', style_type: 'traditional', richness_level: 3, tags: ['floral', 'butta', 'silk', 'festival'] },
  { id: 'b5', name: 'Ikat Diamond', saree_part: 'body', style_type: 'traditional', richness_level: 3, tags: ['ikat', 'diamond', 'weave', 'traditional'] },
  { id: 'b6', name: 'Temple Motifs', saree_part: 'body', style_type: 'traditional', richness_level: 4, tags: ['temple', 'motifs', 'silk', 'wedding', 'kanchipuram'] },
  { id: 'b7', name: 'Peacock Grid', saree_part: 'body', style_type: 'bridal', richness_level: 5, tags: ['peacock', 'grid', 'bridal', 'silk', 'rich'] },
  { id: 'b8', name: 'Zari Dots', saree_part: 'body', style_type: 'traditional', richness_level: 4, tags: ['zari', 'dots', 'gold', 'silk', 'wedding'] },
  { id: 'b9', name: 'Bandhani Dots', saree_part: 'body', style_type: 'festive', richness_level: 3, tags: ['bandhani', 'dots', 'tie-dye', 'festival'] },
  { id: 'b10', name: 'Leheriya Wave', saree_part: 'body', style_type: 'modern', richness_level: 2, tags: ['leheriya', 'wave', 'diagonal', 'casual'] },
  { id: 'b11', name: 'Mughal Arch', saree_part: 'body', style_type: 'bridal', richness_level: 5, tags: ['mughal', 'arch', 'banarasi', 'bridal', 'rich'] },
  { id: 'b12', name: 'Geometric Tiles', saree_part: 'body', style_type: 'modern', richness_level: 3, tags: ['geometric', 'tiles', 'modern', 'designer'] },
  { id: 'b13', name: 'Lotus Pond', saree_part: 'body', style_type: 'traditional', richness_level: 4, tags: ['lotus', 'floral', 'traditional', 'festival'] },
  { id: 'b14', name: 'Warli Tribal', saree_part: 'body', style_type: 'artisanal', richness_level: 3, tags: ['warli', 'tribal', 'art', 'handloom'] },
  { id: 'b15', name: 'Kashmiri Chinar', saree_part: 'body', style_type: 'traditional', richness_level: 4, tags: ['kashmiri', 'chinar', 'floral', 'embroidery'] },
  { id: 'b16', name: 'Diagonal Pinstripe', saree_part: 'body', style_type: 'minimal', richness_level: 2, tags: ['pinstripe', 'diagonal', 'office', 'minimal'] },
  { id: 'b17', name: 'Meenakari Bloom', saree_part: 'body', style_type: 'bridal', richness_level: 5, tags: ['meenakari', 'bloom', 'enamel', 'bridal', 'rich'] },
  // Border patterns
  { id: 'br1', name: 'Single Kasavu', saree_part: 'border', style_type: 'traditional', richness_level: 2, tags: ['kasavu', 'kerala', 'gold', 'cotton', 'single'] },
  { id: 'br2', name: 'Double Kasavu', saree_part: 'border', style_type: 'traditional', richness_level: 3, tags: ['kasavu', 'double', 'kerala', 'silk', 'festival'] },
  { id: 'br3', name: 'Temple Border', saree_part: 'border', style_type: 'traditional', richness_level: 4, tags: ['temple', 'border', 'kanchipuram', 'traditional'] },
  { id: 'br4', name: 'Mango Motif', saree_part: 'border', style_type: 'traditional', richness_level: 3, tags: ['mango', 'motif', 'paisleys', 'traditional'] },
  { id: 'br5', name: 'Peacock Border', saree_part: 'border', style_type: 'bridal', richness_level: 5, tags: ['peacock', 'border', 'bridal', 'wedding', 'rich'] },
  { id: 'br6', name: 'Broad Zari', saree_part: 'border', style_type: 'bridal', richness_level: 5, tags: ['zari', 'broad', 'gold', 'bridal', 'banarasi'] },
  { id: 'br7', name: 'Thin Gold Line', saree_part: 'border', style_type: 'minimal', richness_level: 1, tags: ['thin', 'gold', 'line', 'minimal', 'linen', 'office'] },
  { id: 'br8', name: 'Floral Chain', saree_part: 'border', style_type: 'modern', richness_level: 3, tags: ['floral', 'chain', 'modern', 'party'] },
  { id: 'br9', name: 'Geometric Steps', saree_part: 'border', style_type: 'modern', richness_level: 3, tags: ['geometric', 'steps', 'modern', 'designer'] },
  { id: 'br10', name: 'Wave Crest', saree_part: 'border', style_type: 'festive', richness_level: 3, tags: ['wave', 'crest', 'festival', 'casual'] },
  { id: 'br11', name: 'Diamond Chain', saree_part: 'border', style_type: 'traditional', richness_level: 4, tags: ['diamond', 'chain', 'banarasi', 'wedding'] },
  { id: 'br12', name: 'Lotus Row', saree_part: 'border', style_type: 'traditional', richness_level: 3, tags: ['lotus', 'row', 'traditional', 'festival'] },
  // Pallu patterns
  { id: 'p1', name: 'Rich Zari Pallu', saree_part: 'pallu', style_type: 'bridal', richness_level: 5, tags: ['zari', 'rich', 'gold', 'bridal', 'wedding'] },
  { id: 'p2', name: 'Contrast Pallu', saree_part: 'pallu', style_type: 'traditional', richness_level: 3, tags: ['contrast', 'traditional', 'festival'] },
  { id: 'p3', name: 'Peacock Pallu', saree_part: 'pallu', style_type: 'bridal', richness_level: 5, tags: ['peacock', 'pallu', 'bridal', 'wedding', 'rich'] },
  { id: 'p4', name: 'Floral Pallu', saree_part: 'pallu', style_type: 'festive', richness_level: 4, tags: ['floral', 'pallu', 'festival', 'silk'] },
  { id: 'p5', name: 'Minimal Pallu', saree_part: 'pallu', style_type: 'minimal', richness_level: 1, tags: ['minimal', 'pallu', 'linen', 'casual', 'office'] },
  { id: 'p6', name: 'Temple Arch Pallu', saree_part: 'pallu', style_type: 'traditional', richness_level: 4, tags: ['temple', 'arch', 'kanchipuram', 'silk', 'traditional'] },
  { id: 'p7', name: 'Mughal Garden', saree_part: 'pallu', style_type: 'bridal', richness_level: 5, tags: ['mughal', 'garden', 'banarasi', 'bridal', 'rich'] },
  { id: 'p8', name: 'Butta Scatter', saree_part: 'pallu', style_type: 'festive', richness_level: 3, tags: ['butta', 'scatter', 'festival', 'silk'] },
  { id: 'p9', name: 'Stripe Pallu', saree_part: 'pallu', style_type: 'modern', richness_level: 2, tags: ['stripe', 'modern', 'pallu', 'casual'] },
  { id: 'p10', name: 'Embroidered Vines', saree_part: 'pallu', style_type: 'designer', richness_level: 4, tags: ['embroidered', 'vines', 'designer', 'party'] },
  { id: 'p11', name: 'Kashmiri Pallu', saree_part: 'pallu', style_type: 'traditional', richness_level: 4, tags: ['kashmiri', 'floral', 'traditional', 'wedding'] },
  { id: 'p12', name: 'Geometric Pallu', saree_part: 'pallu', style_type: 'modern', richness_level: 3, tags: ['geometric', 'modern', 'designer', 'party'] },
]

const SEED_PALETTES = [
  { id: 'pal1', name: 'Royal Kanchipuram', primary_color: '#8B0000', secondary_color: '#C9A843', accent_color: '#FFD700', occasion: 'wedding' },
  { id: 'pal2', name: 'Kerala Gold', primary_color: '#F5F5DC', secondary_color: '#C9A843', accent_color: '#8B6914', occasion: 'festival' },
  { id: 'pal3', name: 'Mysore Ivory', primary_color: '#FFFAF0', secondary_color: '#C9A843', accent_color: '#556B2F', occasion: 'wedding' },
  { id: 'pal4', name: 'Pastel Rose', primary_color: '#FFB6C1', secondary_color: '#FFF0F5', accent_color: '#C9A843', occasion: 'party' },
  { id: 'pal5', name: 'Banarasi Blue', primary_color: '#191970', secondary_color: '#C9A843', accent_color: '#87CEEB', occasion: 'wedding' },
  { id: 'pal6', name: 'Chettinad Classic', primary_color: '#2F4F4F', secondary_color: '#8FBC8F', accent_color: '#C9A843', occasion: 'casual' },
  { id: 'pal7', name: 'Office Linen', primary_color: '#D2B48C', secondary_color: '#F5F5DC', accent_color: '#8B7355', occasion: 'office' },
  { id: 'pal8', name: 'Festival Emerald', primary_color: '#006400', secondary_color: '#C9A843', accent_color: '#90EE90', occasion: 'festival' },
]

const SEED_TEMPLATES = [
  { id: 't1', name: 'Kerala Kasavu', description: 'Classic white cotton with gold kasavu border', body_pattern_id: 'b1', border_pattern_id: 'br1', pallu_pattern_id: 'p5', palette_id: 'pal2' },
  { id: 't2', name: 'Kanchipuram Silk', description: 'Rich silk with temple borders and heavy pallu', body_pattern_id: 'b6', border_pattern_id: 'br3', pallu_pattern_id: 'p6', palette_id: 'pal1' },
  { id: 't3', name: 'Banarasi Bridal', description: 'Opulent Mughal patterns for the big day', body_pattern_id: 'b11', border_pattern_id: 'br6', pallu_pattern_id: 'p7', palette_id: 'pal5' },
  { id: 't4', name: 'Chettinad Cotton', description: 'Earthy checks with minimal gold border', body_pattern_id: 'b3', border_pattern_id: 'br7', pallu_pattern_id: 'p5', palette_id: 'pal6' },
  { id: 't5', name: 'Modern Linen', description: 'Clean pinstripes for the working woman', body_pattern_id: 'b16', border_pattern_id: 'br7', pallu_pattern_id: 'p9', palette_id: 'pal7' },
  { id: 't6', name: 'Festival Silk', description: 'Vibrant peacock motifs for celebrations', body_pattern_id: 'b7', border_pattern_id: 'br5', pallu_pattern_id: 'p3', palette_id: 'pal8' },
]

// ─── SVG PATTERN RENDERER ─────────────────────────────────────────────────────
function PatternRenderer({ patternId, color = '#8B0000', accentColor = '#C9A843', width = 200, height = 200 }) {
  const c = color
  const a = accentColor
  const patterns = {
    b1: <rect width={width} height={height} fill={c} />,
    b2: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/12)}, (_,i) => <line key={i} x1={i*12} y1={0} x2={i*12} y2={height} stroke={a} strokeWidth={0.8} opacity={0.5} />)}
    </>,
    b3: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(height/16)}, (_,i) => <line key={`h${i}`} x1={0} y1={i*16} x2={width} y2={i*16} stroke={a} strokeWidth={0.8} opacity={0.4} />)}
      {Array.from({length: Math.ceil(width/16)}, (_,i) => <line key={`v${i}`} x1={i*16} y1={0} x2={i*16} y2={height} stroke={a} strokeWidth={0.8} opacity={0.4} />)}
    </>,
    b4: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/20)}, (_,x) => Array.from({length: Math.ceil(height/20)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*20+10},${y*20+10})`}>
          <ellipse rx={4} ry={6} fill={a} opacity={0.7} />
          <ellipse rx={2} ry={3} fill={c} opacity={0.9} />
        </g>
      )))}
    </>,
    b5: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/24)}, (_,x) => Array.from({length: Math.ceil(height/24)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*24+12},${y*24+12})`}>
          <polygon points="0,-8 8,0 0,8 -8,0" fill="none" stroke={a} strokeWidth={1} opacity={0.6} />
          <polygon points="0,-4 4,0 0,4 -4,0" fill={a} opacity={0.4} />
        </g>
      )))}
    </>,
    b6: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/28)}, (_,x) => Array.from({length: Math.ceil(height/28)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*28+14},${y*28+14})`}>
          <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill={a} opacity={0.5} />
        </g>
      )))}
    </>,
    b7: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/32)}, (_,x) => Array.from({length: Math.ceil(height/32)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*32+16},${y*32+16})`}>
          <path d={`M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z`} fill={a} opacity={0.5} />
          <circle r={3} fill={c} />
        </g>
      )))}
    </>,
    b8: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/18)}, (_,x) => Array.from({length: Math.ceil(height/18)}, (_,y) => (
        <circle key={`${x}-${y}`} cx={x*18+9} cy={y*18+9} r={3} fill={a} opacity={0.7} />
      )))}
    </>,
    b9: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/14)}, (_,x) => Array.from({length: Math.ceil(height/14)}, (_,y) => (
        <circle key={`${x}-${y}`} cx={x*14+7} cy={y*14+7} r={4} fill="none" stroke={a} strokeWidth={1.5} opacity={0.6} />
      )))}
    </>,
    b10: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(height/10)}, (_,i) => (
        <path key={i} d={`M0,${i*10} Q${width/4},${i*10-5} ${width/2},${i*10} Q${3*width/4},${i*10+5} ${width},${i*10}`} fill="none" stroke={a} strokeWidth={1.2} opacity={0.5} />
      ))}
    </>,
    b11: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/36)}, (_,x) => Array.from({length: Math.ceil(height/40)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*36+18},${y*40+20})`}>
          <path d={`M0,-16 C8,-16 14,-8 14,0 C14,8 8,16 0,16 C-8,16 -14,8 -14,0 C-14,-8 -8,-16 0,-16Z`} fill="none" stroke={a} strokeWidth={1} opacity={0.5} />
          <line x1={0} y1={-16} x2={0} y2={16} stroke={a} strokeWidth={0.5} opacity={0.3} />
          <line x1={-14} y1={0} x2={14} y2={0} stroke={a} strokeWidth={0.5} opacity={0.3} />
        </g>
      )))}
    </>,
    b12: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/20)}, (_,x) => Array.from({length: Math.ceil(height/20)}, (_,y) => (
        <rect key={`${x}-${y}`} x={x*20+4} y={y*20+4} width={12} height={12} fill="none" stroke={a} strokeWidth={1} opacity={0.5} transform={`rotate(45, ${x*20+10}, ${y*20+10})`} />
      )))}
    </>,
    b13: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/26)}, (_,x) => Array.from({length: Math.ceil(height/26)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*26+13},${y*26+13})`}>
          <circle r={5} fill={a} opacity={0.4} />
          <circle r={9} fill="none" stroke={a} strokeWidth={1} opacity={0.3} />
          {[0,45,90,135,180,225,270,315].map(ang => (
            <line key={ang} x1={0} y1={0} x2={Math.cos(ang*Math.PI/180)*9} y2={Math.sin(ang*Math.PI/180)*9} stroke={a} strokeWidth={0.8} opacity={0.4} />
          ))}
        </g>
      )))}
    </>,
    b14: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/30)}, (_,x) => Array.from({length: Math.ceil(height/30)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*30+15},${y*30+15})`}>
          <line x1={0} y1={-10} x2={-7} y2={5} stroke={a} strokeWidth={1.5} opacity={0.6} />
          <line x1={0} y1={-10} x2={7} y2={5} stroke={a} strokeWidth={1.5} opacity={0.6} />
          <line x1={-7} y1={5} x2={7} y2={5} stroke={a} strokeWidth={1.5} opacity={0.6} />
          <circle cx={0} cy={-10} r={2} fill={a} opacity={0.7} />
        </g>
      )))}
    </>,
    b15: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/22)}, (_,x) => Array.from({length: Math.ceil(height/22)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*22+11},${y*22+11})`}>
          <path d={`M0,-9 C5,-9 9,-5 9,0 C9,5 5,9 0,9 C-5,9 -9,5 -9,0`} fill="none" stroke={a} strokeWidth={1} opacity={0.5} />
          <path d={`M0,-9 C-5,-9 -9,-5 -9,0`} fill="none" stroke={a} strokeWidth={1} opacity={0.3} />
        </g>
      )))}
    </>,
    b16: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil((width+height)/14)}, (_,i) => (
        <line key={i} x1={i*14-height} y1={0} x2={i*14} y2={height} stroke={a} strokeWidth={0.7} opacity={0.4} />
      ))}
    </>,
    b17: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/24)}, (_,x) => Array.from({length: Math.ceil(height/24)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*24+12},${y*24+12})`}>
          <circle r={8} fill={a} opacity={0.3} />
          <circle r={5} fill={a} opacity={0.4} />
          <circle r={2} fill={a} opacity={0.8} />
          {[0,60,120,180,240,300].map(ang => (
            <circle key={ang} cx={Math.cos(ang*Math.PI/180)*8} cy={Math.sin(ang*Math.PI/180)*8} r={1.5} fill={a} opacity={0.6} />
          ))}
        </g>
      )))}
    </>,
  }

  const border_patterns = {
    br1: <>
      <rect width={width} height={height} fill={c} />
      <rect y={height*0.3} width={width} height={height*0.4} fill={a} opacity={0.8} />
      <rect y={height*0.4} width={width} height={height*0.2} fill={c} opacity={0.6} />
    </>,
    br2: <>
      <rect width={width} height={height} fill={c} />
      <rect y={height*0.15} width={width} height={height*0.2} fill={a} opacity={0.8} />
      <rect y={height*0.65} width={width} height={height*0.2} fill={a} opacity={0.8} />
    </>,
    br3: <>
      <rect width={width} height={height} fill={a} />
      {Array.from({length: Math.ceil(width/16)}, (_,i) => (
        <g key={i} transform={`translate(${i*16+8}, ${height/2})`}>
          <polygon points="0,-8 6,0 0,8 -6,0" fill={c} />
          <polygon points="0,-4 3,0 0,4 -3,0" fill={a} />
        </g>
      ))}
    </>,
    br4: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/20)}, (_,i) => (
        <g key={i} transform={`translate(${i*20+10}, ${height/2})`}>
          <ellipse rx={6} ry={8} fill={a} opacity={0.7} />
          <ellipse rx={3} ry={4} fill={c} />
        </g>
      ))}
    </>,
    br5: <>
      <rect width={width} height={height} fill={a} />
      {Array.from({length: Math.ceil(width/28)}, (_,i) => (
        <g key={i} transform={`translate(${i*28+14}, ${height/2})`}>
          <path d={`M0,-10 C5,-6 10,-2 6,2 C10,6 5,10 0,10 C-5,10 -10,6 -6,2 C-10,-2 -5,-6 0,-10Z`} fill={c} opacity={0.9} />
          <circle r={2} fill={a} />
        </g>
      ))}
    </>,
    br6: <>
      <rect width={width} height={height} fill={a} />
      {Array.from({length: Math.ceil(width/12)}, (_,i) => (
        <rect key={i} x={i*12} y={0} width={8} height={height} fill={c} opacity={0.15} />
      ))}
      <rect y={height*0.2} width={width} height={height*0.6} fill={c} opacity={0.1} />
    </>,
    br7: <>
      <rect width={width} height={height} fill={c} />
      <line x1={0} y1={height/2} x2={width} y2={height/2} stroke={a} strokeWidth={2} />
    </>,
    br8: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/18)}, (_,i) => (
        <g key={i} transform={`translate(${i*18+9}, ${height/2})`}>
          <circle r={5} fill={a} opacity={0.6} />
          <circle r={2} fill={c} />
        </g>
      ))}
    </>,
    br9: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/14)}, (_,i) => (
        <polygon key={i} points={`${i*14},0 ${i*14+7},${height} ${i*14+14},0`} fill={a} opacity={0.5} />
      ))}
    </>,
    br10: <>
      <rect width={width} height={height} fill={c} />
      <path d={'M0,' + (height/2) + ' ' + Array.from({length: Math.ceil(width/20)}, (_,i) => 'Q' + (i*20+10) + ',' + (i%2===0?0:height) + ' ' + ((i+1)*20) + ',' + (height/2)).join(' ')} fill="none" stroke={a} strokeWidth={2} opacity={0.8} />
    </>,
    br11: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/16)}, (_,i) => (
        <polygon key={i} points={`${i*16+8},${height*0.1} ${i*16+14},${height/2} ${i*16+8},${height*0.9} ${i*16+2},${height/2}`} fill={a} opacity={0.6} />
      ))}
    </>,
    br12: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/22)}, (_,i) => (
        <g key={i} transform={`translate(${i*22+11}, ${height/2})`}>
          <ellipse rx={7} ry={5} fill={a} opacity={0.5} />
          <ellipse rx={4} ry={3} fill={c} />
          <ellipse rx={2} ry={1.5} fill={a} opacity={0.7} />
        </g>
      ))}
    </>,
  }

  const pallu_patterns = {
    p1: <>
      <rect width={width} height={height} fill={a} />
      {Array.from({length: Math.ceil(width/8)}, (_,i) => (
        <rect key={i} x={i*8} y={0} width={5} height={height} fill={c} opacity={0.2} />
      ))}
      {Array.from({length: Math.ceil(height/8)}, (_,i) => (
        <rect key={`h${i}`} x={0} y={i*8} width={width} height={3} fill={c} opacity={0.1} />
      ))}
    </>,
    p2: <>
      <rect width={width} height={height} fill={a} />
      <rect width={width} height={height/2} fill={c} opacity={0.9} />
      {Array.from({length: Math.ceil(width/20)}, (_,i) => (
        <g key={i} transform={`translate(${i*20+10}, ${height*0.75})`}>
          <polygon points="0,-8 6,0 0,8 -6,0" fill={c} opacity={0.7} />
        </g>
      ))}
    </>,
    p3: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/30)}, (_,x) => Array.from({length: Math.ceil(height/30)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*30+15},${y*30+15})`}>
          <path d={`M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z`} fill={a} opacity={0.6} />
          <circle r={3} fill={c} />
          {[0,60,120,180,240,300].map(ang => (
            <line key={ang} x1={0} y1={0} x2={Math.cos(ang*Math.PI/180)*14} y2={Math.sin(ang*Math.PI/180)*14} stroke={a} strokeWidth={0.8} opacity={0.3} />
          ))}
        </g>
      )))}
    </>,
    p4: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/22)}, (_,x) => Array.from({length: Math.ceil(height/22)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*22+11},${y*22+11})`}>
          <ellipse rx={6} ry={9} fill={a} opacity={0.5} />
          <ellipse rx={3} ry={5} fill={c} />
          <ellipse rx={1} ry={2} fill={a} opacity={0.8} />
        </g>
      )))}
    </>,
    p5: <rect width={width} height={height} fill={c} />,
    p6: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/26)}, (_,x) => Array.from({length: Math.ceil(height/32)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*26+13},${y*32+16})`}>
          <path d={`M0,-14 C6,-14 12,-6 12,0 C12,6 6,14 0,14 C-6,14 -12,6 -12,0 C-12,-6 -6,-14 0,-14Z`} fill="none" stroke={a} strokeWidth={1.2} opacity={0.6} />
          <polygon points="0,-8 4,-4 4,4 0,8 -4,4 -4,-4" fill={a} opacity={0.3} />
        </g>
      )))}
    </>,
    p7: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/32)}, (_,x) => Array.from({length: Math.ceil(height/36)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*32+16},${y*36+18})`}>
          <circle r={12} fill="none" stroke={a} strokeWidth={1} opacity={0.4} />
          <circle r={7} fill={a} opacity={0.2} />
          <circle r={3} fill={a} opacity={0.6} />
          {[0,45,90,135,180,225,270,315].map(ang => (
            <line key={ang} x1={Math.cos(ang*Math.PI/180)*7} y1={Math.sin(ang*Math.PI/180)*7} x2={Math.cos(ang*Math.PI/180)*12} y2={Math.sin(ang*Math.PI/180)*12} stroke={a} strokeWidth={1} opacity={0.5} />
          ))}
        </g>
      )))}
    </>,
    p8: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/20)}, (_,x) => Array.from({length: Math.ceil(height/20)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*20+10},${y*20+10})`}>
          <ellipse rx={5} ry={7} fill={a} opacity={0.5} />
          <ellipse rx={2} ry={3} fill={c} />
        </g>
      )))}
    </>,
    p9: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/14)}, (_,i) => (
        <rect key={i} x={i*14} y={0} width={7} height={height} fill={a} opacity={0.3} />
      ))}
    </>,
    p10: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: 4}, (_,i) => (
        <path key={i} d={`M${(i+0.5)*width/4},0 C${(i+1)*width/4},${height/4} ${i*width/4},${height/2} ${(i+0.5)*width/4},${3*height/4} C${(i+1)*width/4},${height} ${i*width/4},${height} ${(i+0.5)*width/4},${height}`} fill="none" stroke={a} strokeWidth={1.5} opacity={0.6} />
      ))}
    </>,
    p11: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/24)}, (_,x) => Array.from({length: Math.ceil(height/24)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*24+12},${y*24+12})`}>
          <path d={`M0,-10 C5,-10 10,-5 10,0 C10,5 5,10 0,10 C-5,10 -10,5 -10,0 C-10,-5 -5,-10 0,-10Z`} fill="none" stroke={a} strokeWidth={1} opacity={0.5} />
          <circle r={3} fill={a} opacity={0.4} />
        </g>
      )))}
    </>,
    p12: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/18)}, (_,x) => Array.from({length: Math.ceil(height/18)}, (_,y) => (
        <rect key={`${x}-${y}`} x={x*18+3} y={y*18+3} width={12} height={12} fill="none" stroke={a} strokeWidth={1} opacity={0.5} />
      )))}
    </>,
  }

  const part = patternId?.startsWith('br') ? border_patterns : patternId?.startsWith('p') ? pallu_patterns : patterns
  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
      {part[patternId] || <rect width={width} height={height} fill={c} />}
    </svg>
  )
}

// ─── SAREE CANVAS ─────────────────────────────────────────────────────────────
function SareeCanvas({ design, scale = 1 }) {
  const w = Math.round(200 * scale)
  const palluH = Math.round(160 * scale)
  const borderH = Math.round(18 * scale)
  const bodyH = Math.round(260 * scale)
  const blouseH = Math.round(55 * scale)
  const totalH = palluH + borderH*2 + bodyH + blouseH

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      borderRadius: 4, overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(44,36,22,0.15)',
      width: w
    }}>
      {/* Label */}
      <div style={{
        width: '100%', padding: '4px 0', textAlign: 'center',
        background: 'rgba(44,36,22,0.06)', fontSize: 8, letterSpacing: 2,
        textTransform: 'uppercase', color: T.textLight, fontWeight: 600
      }}>Pallu</div>

      {/* Pallu */}
      <div style={{width: w, height: palluH, overflow:'hidden', position:'relative'}}>
        <PatternRenderer patternId={design.palluPattern} color={design.primaryColor} accentColor={design.accentColor} width={w} height={palluH} />
        {/* shimmer overlay */}
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,transparent 40%,rgba(255,255,255,0.08) 50%,transparent 60%)',pointerEvents:'none'}} />
      </div>

      {/* Top border */}
      <div style={{width: w, height: borderH, overflow:'hidden'}}>
        <PatternRenderer patternId={design.borderPattern} color={design.secondaryColor} accentColor={design.accentColor} width={w} height={borderH} />
      </div>

      {/* Label */}
      <div style={{
        width: '100%', padding: '3px 0', textAlign: 'center',
        background: 'rgba(44,36,22,0.04)', fontSize: 7, letterSpacing: 2,
        textTransform: 'uppercase', color: T.textLight, fontWeight: 600
      }}>Body</div>

      {/* Body with zari borders */}
      <div style={{width: w, height: bodyH, overflow:'hidden', position:'relative'}}>
        <PatternRenderer patternId={design.bodyPattern} color={design.primaryColor} accentColor={design.accentColor} width={w} height={bodyH} />
        {/* Left zari border */}
        <div style={{position:'absolute',top:0,left:0,bottom:0,width:Math.round(14*scale),background:`linear-gradient(90deg,${design.accentColor}99,${design.accentColor}33)`,pointerEvents:'none'}} />
        {/* Right zari border */}
        <div style={{position:'absolute',top:0,right:0,bottom:0,width:Math.round(14*scale),background:`linear-gradient(270deg,${design.accentColor}99,${design.accentColor}33)`,pointerEvents:'none'}} />
      </div>

      {/* Bottom border */}
      <div style={{width: w, height: borderH, overflow:'hidden'}}>
        <PatternRenderer patternId={design.borderPattern} color={design.secondaryColor} accentColor={design.accentColor} width={w} height={borderH} />
      </div>

      {/* Blouse */}
      <div style={{width: w, height: blouseH, overflow:'hidden', position:'relative'}}>
        <PatternRenderer patternId={design.bodyPattern} color={design.secondaryColor} accentColor={design.accentColor} width={w} height={blouseH} />
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'rgba(44,36,22,0.08)',pointerEvents:'none'}} />
        <div style={{
          position:'absolute',bottom:0,left:0,right:0,height:Math.round(16*scale),
          background:`linear-gradient(90deg,${design.accentColor}66,${design.accentColor}CC,${design.accentColor}66)`,
          pointerEvents:'none'
        }} />
      </div>
      <div style={{
        width: '100%', padding: '4px 0', textAlign: 'center',
        background: 'rgba(44,36,22,0.06)', fontSize: 8, letterSpacing: 2,
        textTransform: 'uppercase', color: T.textLight, fontWeight: 600
      }}>Blouse</div>
    </div>
  )
}

// ─── NOTIFICATION ─────────────────────────────────────────────────────────────
function Notification({ notification }) {
  if (!notification) return null
  const colors = {
    success: { bg: '#F0FFF4', border: '#9AE6B4', text: '#276749' },
    error: { bg: '#FFF5F5', border: '#FEB2B2', text: '#C53030' },
    info: { bg: '#EBF8FF', border: '#90CDF4', text: '#2B6CB0' },
  }
  const c = colors[notification.type] || colors.info
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      padding: '12px 20px', borderRadius: 4, fontSize: 13,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      animation: 'slideUp 0.3s ease',
      maxWidth: 320, fontWeight: 400
    }}>
      {notification.msg}
    </div>
  )
}

// ─── VOICE QUESTIONNAIRE ──────────────────────────────────────────────────────
// ─── DEEP QUESTIONNAIRE SYSTEM ───────────────────────────────────────────────
// Questions are grouped by saree part. AI decides follow-ups based on answers.
const QUESTION_BANK = {
  // ── SECTION 1: Occasion & Intent ──
  occasion: {
    id: 'occasion', section: 'Occasion',
    icon: '✨',
    text: 'What is this saree being designed for?',
    subtext: 'This helps us match the right richness and formality.',
    options: [
      { value: 'Wedding', desc: 'Bridal or wedding guest wear' },
      { value: 'Festival', desc: 'Puja, Diwali, Onam, Pongal etc.' },
      { value: 'Party', desc: 'Celebrations, receptions, get-togethers' },
      { value: 'Office', desc: 'Professional, everyday elegance' },
      { value: 'Casual', desc: 'Daily wear, outings, family events' },
    ]
  },
  wearer: {
    id: 'wearer', section: 'Occasion',
    icon: '👤',
    text: 'Who is going to wear this saree?',
    subtext: 'Age and role influence design choices significantly.',
    options: [
      { value: 'Bride', desc: 'The main bride - maximum richness' },
      { value: 'Mother of Bride', desc: 'Elegant, dignified, complementary' },
      { value: 'Wedding Guest', desc: 'Festive but not outshining the bride' },
      { value: 'Young Woman (20s–30s)', desc: 'Trendy, contemporary styles' },
      { value: 'Mature Woman (40s+)', desc: 'Classic, refined, comfortable' },
    ]
  },

  // ── SECTION 2: Fabric ──
  fabric: {
    id: 'fabric', section: 'Fabric',
    icon: '🧵',
    text: 'What fabric would you prefer?',
    subtext: 'Fabric determines drape, sheen, and overall feel.',
    options: [
      { value: 'Kanchipuram Silk', desc: 'Heavy, lustrous - ideal for weddings' },
      { value: 'Banarasi Silk', desc: 'Rich brocade weave, Mughal heritage' },
      { value: 'Mysore Silk', desc: 'Lightweight, smooth, everyday elegance' },
      { value: 'Cotton', desc: 'Breathable, casual to semi-formal' },
      { value: 'Linen', desc: 'Minimal, modern, office-friendly' },
      { value: 'Organza', desc: 'Sheer, delicate, contemporary' },
      { value: 'Georgette', desc: 'Flowy, party and evening wear' },
    ]
  },
  fabricWeight: {
    id: 'fabricWeight', section: 'Fabric',
    icon: '⚖️',
    text: 'How heavy or light should the saree feel?',
    subtext: 'This affects drape and how long you can comfortably wear it.',
    options: [
      { value: 'Light & Flowy', desc: 'Easy to manage, all-day comfort' },
      { value: 'Medium Weight', desc: 'Balanced drape and structure' },
      { value: 'Heavy & Structured', desc: 'Grand presence, traditional feel' },
    ]
  },

  // ── SECTION 3: Body Design ──
  bodyStyle: {
    id: 'bodyStyle', section: 'Body Design',
    icon: '🟫',
    text: 'What should the main body of the saree look like?',
    subtext: 'The body covers most of the saree - this is the dominant visual.',
    options: [
      { value: 'Plain / Solid', desc: 'Clean, unadorned - lets border & pallu shine' },
      { value: 'Subtle Texture', desc: 'Stripes, checks or light weave pattern' },
      { value: 'All-Over Motifs', desc: 'Small buttas or flowers scattered throughout' },
      { value: 'Bold Pattern', desc: 'Ikat, geometric or large repeat pattern' },
      { value: 'Zari Infused', desc: 'Gold thread woven throughout the body' },
    ]
  },
  bodyMotif: {
    id: 'bodyMotif', section: 'Body Design',
    icon: '🌸',
    text: 'What kind of motifs appeal to you for the body?',
    subtext: 'Only if the body has patterns - skip if you chose plain.',
    options: [
      { value: 'Floral', desc: 'Roses, lotus, jasmine - timeless feminine' },
      { value: 'Peacock', desc: 'Rich, traditional Indian motif' },
      { value: 'Temple / Rudraksha', desc: 'Sacred geometry, South Indian style' },
      { value: 'Geometric', desc: 'Modern, structured, clean lines' },
      { value: 'Tribal / Warli', desc: 'Handloom artisan aesthetic' },
      { value: 'Mughal / Floral Arch', desc: 'North Indian, Banarasi heritage' },
    ]
  },

  // ── SECTION 4: Border ──
  borderWeight: {
    id: 'borderWeight', section: 'Border',
    icon: '📏',
    text: 'How prominent should the border (kasavu) be?',
    subtext: 'The border runs along the length of the saree.',
    options: [
      { value: 'Thin (1–2cm)', desc: 'Minimal line, modern or casual' },
      { value: 'Medium (3–5cm)', desc: 'Balanced - suits most occasions' },
      { value: 'Broad (6–10cm)', desc: 'Statement border, traditional sarees' },
      { value: 'Grand Zari Border (10cm+)', desc: 'Bridal weight, maximum impact' },
    ]
  },
  borderStyle: {
    id: 'borderStyle', section: 'Border',
    icon: '🔰',
    text: 'What pattern style do you want for the border?',
    subtext: 'This defines the character of the saree edge.',
    options: [
      { value: 'Single Kasavu Line', desc: 'Classic Kerala style, elegant simplicity' },
      { value: 'Double Kasavu', desc: 'Two gold lines - traditional and festive' },
      { value: 'Temple / Gopuram', desc: 'Arch motifs, Kanchipuram style' },
      { value: 'Mango / Paisley', desc: 'Curved teardrop motifs, classic Indian' },
      { value: 'Peacock Procession', desc: 'Rich birds along the border' },
      { value: 'Floral Vine', desc: 'Delicate flowers, contemporary feel' },
      { value: 'Geometric Chain', desc: 'Modern, structured repeat pattern' },
    ]
  },

  // ── SECTION 5: Pallu ──
  palluStyle: {
    id: 'palluStyle', section: 'Pallu',
    icon: '🎨',
    text: 'What overall feel do you want for the pallu?',
    subtext: 'The pallu is the most visible part - draped over the shoulder.',
    options: [
      { value: 'Minimal - same as body', desc: 'Seamless look, no contrast' },
      { value: 'Contrast colour pallu', desc: 'Different colour from body' },
      { value: 'Rich & Heavy pallu', desc: 'Dense zari or embroidery' },
      { value: 'Designer pallu', desc: 'Statement piece with unique motifs' },
    ]
  },
  palluMotif: {
    id: 'palluMotif', section: 'Pallu',
    icon: '🦚',
    text: 'What should the pallu design feature?',
    subtext: 'The centrepiece of your entire saree.',
    options: [
      { value: 'Peacock Spread', desc: 'Majestic, bridal, full feather display' },
      { value: 'Floral Bouquet', desc: 'Dense flowers, feminine and classic' },
      { value: 'Temple Arch', desc: 'Gopuram arches, sacred geometry' },
      { value: 'Mughal Garden', desc: 'Vines, flowers, Banarasi heritage' },
      { value: 'Butta Clusters', desc: 'Small motifs scattered on pallu' },
      { value: 'Plain with Zari', desc: 'Solid colour with gold shimmer' },
      { value: 'Geometric', desc: 'Modern angular patterns' },
    ]
  },

  // ── SECTION 6: Colour ──
  colorBase: {
    id: 'colorBase', section: 'Colour',
    icon: '🎨',
    text: 'What is your base colour preference for the saree?',
    subtext: 'The primary colour that dominates the body.',
    options: [
      { value: 'Deep Red / Maroon', desc: 'Classic bridal, powerful and rich' },
      { value: 'Royal Blue / Navy', desc: 'Regal, sophisticated' },
      { value: 'Forest Green / Emerald', desc: 'Lush, festive, traditional' },
      { value: 'Cream / Off-White', desc: 'Pure, elegant, Kerala style' },
      { value: 'Pink / Rose Gold', desc: 'Feminine, party-ready' },
      { value: 'Purple / Violet', desc: 'Royal, modern and luxurious' },
      { value: 'Black', desc: 'Bold, modern, evening wear' },
      { value: 'Pastel (any)', desc: 'Soft, contemporary, gentle hues' },
    ]
  },
  colorAccent: {
    id: 'colorAccent', section: 'Colour',
    icon: '✨',
    text: 'What accent or contrast colour should complement it?',
    subtext: 'Used for borders, zari, and pallu highlights.',
    options: [
      { value: 'Gold Zari', desc: 'Traditional gold thread - never fails' },
      { value: 'Silver Zari', desc: 'Modern, cool-toned elegance' },
      { value: 'Contrast (complementary colour)', desc: 'Opposite on the colour wheel' },
      { value: 'Same Family (deeper shade)', desc: 'Tonal, subtle, refined' },
      { value: 'Ivory / Cream', desc: 'Soft contrast, very wearable' },
    ]
  },
}

// AI-driven question flow - determines next question based on answers
function getNextQuestionId(answers, currentId) {
  const flow = {
    'occasion': 'wearer',
    'wearer': 'fabric',
    'fabric': (a) => (a.fabric === 'Linen' || a.fabric === 'Organza') ? 'bodyStyle' : 'fabricWeight',
    'fabricWeight': 'bodyStyle',
    'bodyStyle': (a) => a.bodyStyle === 'Plain / Solid' ? 'borderWeight' : 'bodyMotif',
    'bodyMotif': 'borderWeight',
    'borderWeight': 'borderStyle',
    'borderStyle': 'palluStyle',
    'palluStyle': (a) => a.palluStyle === 'Minimal - same as body' ? 'colorBase' : 'palluMotif',
    'palluMotif': 'colorBase',
    'colorBase': 'colorAccent',
    'colorAccent': null, // done
  }
  const next = flow[currentId]
  if (!next) return null
  if (typeof next === 'function') return next(answers)
  return next
}

function getQuestionSequence(answers) {
  const seq = []
  let current = 'occasion'
  while (current) {
    seq.push(current)
    current = getNextQuestionId(answers, current)
  }
  return seq
}

function VoiceQuestionnaire({ onComplete, onBack }) {
  const [questionIds, setQuestionIds] = useState(['occasion'])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [animIn, setAnimIn] = useState(true)
  const recognitionRef = useRef(null)

  const currentId = questionIds[currentIdx]
  const q = QUESTION_BANK[currentId]
  // Estimate total - recalculate based on current answers
  const estimatedTotal = getQuestionSequence(answers).length

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.88; u.pitch = 1.05
    u.onstart = () => setIsSpeaking(true)
    u.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(u)
  }, [])

  useEffect(() => {
    if (q) {
      setAnimIn(false)
      setTimeout(() => { setAnimIn(true); speak(q.text) }, 120)
    }
    return () => { window.speechSynthesis?.cancel() }
  }, [currentIdx, speak])

  const handleAnswer = (optionValue) => {
    const newAnswers = { ...answers, [currentId]: optionValue }
    setAnswers(newAnswers)
    speak(`Got it - ${optionValue}.`)

    // Recalculate the full question path based on new answers
    const newSequence = getQuestionSequence(newAnswers)
    setQuestionIds(newSequence)

    setTimeout(() => {
      const nextIdx = currentIdx + 1
      if (nextIdx < newSequence.length) {
        setCurrentIdx(nextIdx)
      } else {
        handleComplete(newAnswers)
      }
    }, 700)
  }

  const handleComplete = async (finalAnswers) => {
    setIsGenerating(true)
    speak('Perfect! Designing your ideal saree now - this will take just a moment.')
    try {
      const prefLines = Object.entries(finalAnswers).map(([k,v]) => {
        const section = QUESTION_BANK[k] ? QUESTION_BANK[k].section : k
        const question = QUESTION_BANK[k] ? QUESTION_BANK[k].text : k
        return section + ' - ' + question + ': ' + v
      })
      const userPrompt = "Customer's detailed preferences:\n" + prefLines.join('\n') + "\n\nDesign the perfect saree for this customer."
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL, max_tokens: 1200,
          system: `You are a master Indian saree designer with 30 years of experience. 
Based on the customer's detailed preferences, create a precise saree design recommendation.

Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    {"name":"Kanchipuram Bridal Silk","description":"Detailed description of why this suits them","matchScore":96,"fabric":"Kanchipuram Silk","estimatedBudget":"₹25,000–₹80,000"},
    {"name":"Second option name","description":"...","matchScore":88,"fabric":"...","estimatedBudget":"..."}
  ],
  "design": {
    "primaryColor":"#8B0000",
    "secondaryColor":"#F5F5DC",
    "accentColor":"#C9A843",
    "bodyPattern":"b6",
    "borderPattern":"br3",
    "palluPattern":"p3",
    "sareeStyle":"Kanchipuram Silk",
    "fabric":"Kanchipuram Silk",
    "occasion":"Wedding",
    "keyFeatures":["Heavy zari border","Peacock pallu","Rich body motifs"],
    "stylingTip":"Pair with a contrast blouse in emerald green for a stunning combination.",
    "explanation":"Detailed explanation of design choices made."
  }
}

Pattern IDs available:
- Body: b1(Plain), b2(Stripes), b3(Checks), b4(Floral Butta), b5(Ikat Diamond), b6(Temple Motifs), b7(Peacock Grid), b8(Zari Dots), b9(Bandhani), b10(Leheriya Wave), b11(Mughal Arch), b12(Geometric), b13(Lotus), b14(Warli), b15(Kashmiri), b16(Pinstripe), b17(Meenakari)
- Border: br1(Single Kasavu), br2(Double Kasavu), br3(Temple), br4(Mango), br5(Peacock), br6(Broad Zari), br7(Thin Gold), br8(Floral Chain), br9(Geometric Steps), br10(Wave), br11(Diamond Chain), br12(Lotus Row)
- Pallu: p1(Rich Zari), p2(Contrast), p3(Peacock), p4(Floral), p5(Minimal), p6(Temple Arch), p7(Mughal Garden), p8(Butta Scatter), p9(Stripe), p10(Embroidered Vines), p11(Kashmiri), p12(Geometric)

Match patterns intelligently to the customer's preferences. Use hex color codes that match their stated color preference precisely.`,
          messages: [{
            role: 'user',
            content: userPrompt
          }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      onComplete(parsed, finalAnswers)
    } catch(e) {
      console.error('AI generation error:', e)
      onComplete({
        recommendations: [{ name: 'Classic Silk Saree', description: 'A timeless design based on your preferences.', matchScore: 85, fabric: finalAnswers.fabric || 'Silk', estimatedBudget: '₹15,000–₹40,000' }],
        design: { primaryColor: '#8B0000', secondaryColor: '#F5F5DC', accentColor: '#D4AF37', bodyPattern: 'b6', borderPattern: 'br3', palluPattern: 'p6', explanation: 'Classic silk saree design based on your preferences.' }
      }, finalAnswers)
    }
  }

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { alert('Voice input not supported. Please tap an option.'); return }
    window.speechSynthesis?.cancel()
    const recognition = new SpeechRecognition()
    recognition.continuous = false; recognition.interimResults = true; recognition.lang = 'en-IN'
    recognitionRef.current = recognition
    recognition.onstart = () => { setIsListening(true); setTranscript('') }
    recognition.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(t)
      if (e.results[e.results.length-1].isFinal) {
        const opts = q.options.map(o => o.value)
        const match = opts.find(o => t.toLowerCase().includes(o.toLowerCase().split(' ')[0]))
        if (match) { setIsListening(false); handleAnswer(match) }
      }
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    recognition.start()
  }

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false) }

  if (isGenerating) {
    return (
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:60,gap:24,minHeight:400}}>
        <div style={{position:'relative',width:80,height:80}}>
          <div style={{position:'absolute',inset:0,borderRadius:'50%',border:`3px solid ${T.goldLight}`,borderTopColor:T.gold,animation:'spin 1s linear infinite'}} />
          <div style={{position:'absolute',inset:8,borderRadius:'50%',border:`2px solid rgba(106,27,154,0.2)`,borderBottomColor:'#6A1B9A',animation:'spin 1.5s linear infinite reverse'}} />
          <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28}}>🧵</div>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontFamily:'Cormorant Garamond',fontSize:24,color:T.text,fontStyle:'italic',marginBottom:8}}>
            Crafting your perfect saree...
          </div>
          <div className="label-xs" style={{color:T.textLight}}>AI is analysing your preferences</div>
        </div>
        {/* Show answers summary while loading */}
        <div style={{background:T.surfaceAlt,border:`1px solid ${T.border}`,borderRadius:4,padding:16,maxWidth:320,width:'100%'}}>
          <p className="label-xs" style={{marginBottom:10}}>Your selections</p>
          {Object.entries(answers).map(([k,v]) => (
            <div key={k} style={{display:'flex',justifyContent:'space-between',fontSize:11,color:T.textMid,padding:'3px 0',borderBottom:`1px solid ${T.borderLight}`}}>
              <span style={{color:T.textLight}}>{QUESTION_BANK[k]?.section}</span>
              <span style={{fontWeight:500}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!q) return null

  const progress = ((currentIdx) / Math.max(estimatedTotal, 1)) * 100
  const sectionColor = {
    'Occasion': '#6A1B9A', 'Fabric': '#1565C0', 'Body Design': '#2E7D32',
    'Border': '#E65100', 'Pallu': '#AD1457', 'Colour': '#D4AF37'
  }
  const currentSectionColor = sectionColor[q.section] || T.gold

  return (
    <div style={{maxWidth:520,margin:'0 auto',padding:'0 16px 40px'}}>

      {/* Section indicator */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:currentSectionColor}} />
          <span style={{fontSize:10,letterSpacing:2,textTransform:'uppercase',color:currentSectionColor,fontWeight:600}}>{q.section}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span className="label-xs">Q{currentIdx+1} of ~{estimatedTotal}</span>
          <button onClick={onBack} className="btn-ghost" style={{padding:'4px 10px',fontSize:10}}>← Back</button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{marginBottom:28}}>
        <div style={{height:3,background:T.border,borderRadius:2,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${progress}%`,background:`linear-gradient(90deg,#6A1B9A,${T.gold})`,borderRadius:2,transition:'width 0.5s ease'}} />
        </div>
        {/* Section dots */}
        <div style={{display:'flex',gap:4,marginTop:8,justifyContent:'space-between'}}>
          {['Occasion','Fabric','Body Design','Border','Pallu','Colour'].map(s => (
            <div key={s} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:q.section===s?sectionColor[s]:T.border,transition:'background 0.3s',border:`1px solid ${q.section===s?sectionColor[s]:T.border}`}} />
              <span style={{fontSize:7,color:q.section===s?sectionColor[s]:T.textLight,letterSpacing:0.5,fontWeight:q.section===s?600:300}}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Avatar */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:24}}>
        <div style={{
          width:64,height:64,borderRadius:'50%',
          background:`linear-gradient(135deg,#6A1B9A,${T.gold})`,
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:`0 0 0 ${isSpeaking?'14px':'6px'} rgba(106,27,154,0.12)`,
          transition:'box-shadow 0.3s ease',marginBottom:10,
          animation:isSpeaking?'pulse 1.5s ease infinite':'none'
        }}>
          <span style={{fontSize:q.icon?24:28}}>{q.icon || '🧵'}</span>
        </div>
        {isSpeaking && (
          <div style={{display:'flex',gap:3,alignItems:'flex-end',height:18}}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{width:3,background:T.gold,borderRadius:2,animation:`waveform 0.8s ease ${i*0.15}s infinite`}} />
            ))}
          </div>
        )}
      </div>

      {/* Question text */}
      <div style={{textAlign:'center',marginBottom:8,animation:animIn?'fadeIn 0.35s ease':'none'}}>
        <h2 style={{fontFamily:'Cormorant Garamond',fontSize:24,fontWeight:400,color:T.text,lineHeight:1.3,marginBottom:6}}>
          {q.text}
        </h2>
        {q.subtext && (
          <p style={{fontSize:11,color:T.textLight,lineHeight:1.6,fontStyle:'italic'}}>{q.subtext}</p>
        )}
      </div>

      <div className="divider" style={{margin:'16px 0'}} />

      {/* Options - detailed cards */}
      <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:28}}>
        {q.options.map(opt => (
          <button key={opt.value} onClick={() => handleAnswer(opt.value)} style={{
            display:'flex',alignItems:'center',gap:14,
            padding:'12px 16px',borderRadius:4,
            border:`1.5px solid ${T.border}`,
            background:T.surface,
            cursor:'pointer',textAlign:'left',
            transition:'all 0.2s ease',
            width:'100%'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='#6A1B9A'; e.currentTarget.style.background='rgba(106,27,154,0.04)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.background=T.surface }}>
            <div style={{
              width:32,height:32,borderRadius:'50%',flexShrink:0,
              background:`linear-gradient(135deg,rgba(106,27,154,0.1),rgba(212,175,55,0.1))`,
              border:`1px solid ${T.border}`,
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:12,color:'#6A1B9A',fontWeight:600
            }}>
              {opt.value.charAt(0)}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:500,color:T.text,marginBottom:2}}>{opt.value}</div>
              {opt.desc && <div style={{fontSize:11,color:T.textLight}}>{opt.desc}</div>}
            </div>
            <div style={{color:T.border,fontSize:16,flexShrink:0}}>›</div>
          </button>
        ))}
      </div>

      {/* Voice button */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
        <button
          onMouseDown={startListening} onTouchStart={startListening}
          onMouseUp={stopListening} onTouchEnd={stopListening}
          style={{
            width:64,height:64,borderRadius:'50%',
            background:isListening?'linear-gradient(135deg,#C53030,#E53E3E)':`linear-gradient(135deg,#6A1B9A,${T.gold})`,
            border:'none',color:'white',fontSize:24,cursor:'pointer',
            boxShadow:isListening?'0 0 0 12px rgba(197,48,48,0.2)':'0 4px 20px rgba(106,27,154,0.3)',
            transition:'all 0.3s ease',
            animation:isListening?'pulse 1s ease infinite':'none',
            display:'flex',alignItems:'center',justifyContent:'center'
          }}>
          🎤
        </button>
        <span className="label-xs" style={{color:isListening?'#C53030':T.textLight}}>
          {isListening ? 'Listening...' : 'Hold to speak'}
        </span>
        {transcript && (
          <div style={{background:T.surfaceAlt,border:`1px solid ${T.border}`,borderRadius:4,padding:'8px 16px',fontSize:12,color:T.textMid,maxWidth:300,textAlign:'center'}}>
            "{transcript}"
          </div>
        )}
      </div>
    </div>
  )
}

function ImageUploadPage({ onBack, onDesignReady, notify }) {
  const [preview, setPreview] = useState(null)
  const [base64Data, setBase64Data] = useState(null)
  const [mediaType, setMediaType] = useState('image/jpeg')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const fileRef = useRef()
  const cameraRef = useRef()
  const isMobile = window.innerWidth < 768

  const handleFile = (file) => {
    if (!file) return
    setMediaType(file.type || 'image/jpeg')
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      setBase64Data(e.target.result.split(',')[1])
    }
    reader.readAsDataURL(file)
  }

  const analyzeImage = async () => {
    if (!base64Data) return
    setIsAnalyzing(true)
    setResult(null)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: 1000,
          system: `You are a saree design expert and image analyst. Analyze the uploaded image. If it contains a saree or fabric, extract design details and return ONLY valid JSON: {"isSaree":true,"detectedStyle":"Kanchipuram Silk","colors":{"primary":"#8B0000","secondary":"#C9A843","accent":"#FFD700"},"patterns":{"body":"temple motifs","border":"heavy zari","pallu":"peacock design"},"fabric":"silk","occasion":"wedding","designConfig":{"primaryColor":"#8B0000","secondaryColor":"#C9A843","accentColor":"#FFD700","bodyPattern":"b6","borderPattern":"br3","palluPattern":"p3"},"similarStyles":["Kanchipuram Silk","Banarasi Bridal"],"description":"A rich red Kanchipuram silk saree..."}. Pattern IDs: body(b1-b17), border(br1-br12), pallu(p1-p12). If no saree detected, return {"isSaree":false,"message":"No saree detected"}.`,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
              { type: 'text', text: 'Analyze this image for saree design details. Extract colors, patterns, fabric, and recreate it as a digital design.' }
            ]
          }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || '{}'
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setResult(parsed)
    } catch (e) {
      notify('Could not analyze image. Please try again.', 'error')
    }
    setIsAnalyzing(false)
  }

  return (
    <div style={{maxWidth:520,margin:'0 auto',padding:'0 16px'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:32}}>
        <button onClick={onBack} className="btn-ghost" style={{padding:'6px 14px',fontSize:11}}>← Back</button>
        <h2 style={{fontFamily:'Cormorant Garamond',fontSize:24,fontWeight:400,color:T.text}}>Image Upload Mode</h2>
      </div>

      {!preview ? (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{
            border:`2px dashed ${T.border}`,borderRadius:8,
            padding:48,textAlign:'center',
            background:T.surfaceAlt,
            cursor:'pointer'
          }} onClick={() => fileRef.current.click()}>
            <div style={{fontSize:48,marginBottom:12}}>🖼️</div>
            <p style={{fontFamily:'Cormorant Garamond',fontSize:20,color:T.textMid,marginBottom:6}}>Upload a saree image</p>
            <p style={{fontSize:12,color:T.textLight}}>JPG, PNG, WEBP supported</p>
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e => handleFile(e.target.files[0])} />
          </div>

          {isMobile && (
            <div style={{display:'flex',gap:12}}>
              <button className="btn-outline" style={{flex:1}} onClick={() => fileRef.current.click()}>
                📁 Choose File
              </button>
              <button className="btn-primary" style={{flex:1}} onClick={() => cameraRef.current.click()}>
                📷 Camera
              </button>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{display:'none'}} onChange={e => handleFile(e.target.files[0])} />
            </div>
          )}

          <div style={{padding:16,background:T.surfaceAlt,borderRadius:4,border:`1px solid ${T.border}`}}>
            <p className="label-xs" style={{marginBottom:8}}>What AI will do with your image</p>
            {['🎨 Recreate the saree design on canvas', '🔍 Find similar patterns from our library', '🌈 Extract and apply the color palette'].map(t => (
              <div key={t} style={{fontSize:12,color:T.textMid,padding:'4px 0',display:'flex',alignItems:'center',gap:8}}>{t}</div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{position:'relative',borderRadius:8,overflow:'hidden',border:`1px solid ${T.border}`}}>
            <img src={preview} alt="Uploaded saree" style={{width:'100%',maxHeight:300,objectFit:'cover',display:'block'}} />
            <button
              onClick={() => { setPreview(null); setBase64Data(null); setResult(null) }}
              style={{position:'absolute',top:8,right:8,background:'rgba(0,0,0,0.6)',color:'white',border:'none',borderRadius:'50%',width:28,height:28,cursor:'pointer',fontSize:14}}>
              ✕
            </button>
          </div>

          {!result && (
            <button className="btn-primary" onClick={analyzeImage} disabled={isAnalyzing} style={{width:'100%',padding:16}}>
              {isAnalyzing ? '🔍 Analysing...' : '✨ Analyse Saree'}
            </button>
          )}

          {isAnalyzing && (
            <div style={{textAlign:'center',padding:32}}>
              <div style={{width:48,height:48,borderRadius:'50%',border:`3px solid ${T.goldLight}`,borderTopColor:T.gold,animation:'spin 1s linear infinite',margin:'0 auto 16px'}} />
              <p style={{fontFamily:'Cormorant Garamond',fontSize:18,color:T.textMid,fontStyle:'italic'}}>Analysing your saree...</p>
              <p style={{fontSize:11,color:T.textLight,marginTop:4}}>Detecting patterns, colors &amp; style</p>
            </div>
          )}

          {result && result.isSaree && (
            <div className="card fade-in" style={{padding:20}}>
              <p className="label-xs" style={{marginBottom:16}}>Analysis Complete</p>
              <h3 style={{fontFamily:'Cormorant Garamond',fontSize:22,color:T.text,marginBottom:8}}>{result.detectedStyle}</h3>
              <p style={{fontSize:13,color:T.textMid,marginBottom:16,lineHeight:1.6}}>{result.description}</p>

              {/* Color palette */}
              <div style={{marginBottom:16}}>
                <p className="label-xs" style={{marginBottom:8}}>Extracted Colors</p>
                <div style={{display:'flex',gap:8}}>
                  {result.colors && Object.entries(result.colors).map(([k,v]) => (
                    <div key={k} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:v,border:`1px solid ${T.border}`,boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}} />
                      <span style={{fontSize:9,color:T.textLight,textTransform:'capitalize'}}>{k}</span>
                    </div>
                  ))}
                </div>
              </div>

              {result.similarStyles?.length > 0 && (
                <div style={{marginBottom:16}}>
                  <p className="label-xs" style={{marginBottom:8}}>Similar Styles</p>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {result.similarStyles.map(s => <span key={s} className="chip" style={{fontSize:11}}>{s}</span>)}
                  </div>
                </div>
              )}

              <button className="btn-primary" style={{width:'100%'}} onClick={() => onDesignReady(result.designConfig)}>
                Open in Designer →
              </button>
            </div>
          )}

          {result && !result.isSaree && (
            <div style={{textAlign:'center',padding:24,background:T.surfaceAlt,borderRadius:4,border:`1px solid ${T.border}`}}>
              <p style={{fontSize:16,color:T.textMid,marginBottom:8}}>No saree detected in this image.</p>
              <p style={{fontSize:12,color:T.textLight,marginBottom:16}}>Try uploading a clearer saree photo.</p>
              <button className="btn-ghost" onClick={() => { setPreview(null); setResult(null) }}>Try Again</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onAuth, notify }) {
  const [tab, setTab] = useState('signin')
  const [role, setRole] = useState('customer')
  const [form, setForm] = useState({ email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const isMobile = window.innerWidth < 768

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Please fill all fields'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setBusy(true); setError('')
    try {
      if (tab === 'signup') {
        const r = await sb.signUp(form.email, form.password, role)
        if (r.error) {
          setError(r.error.message || 'Signup failed. Please try again.')
          setBusy(false); return
        }
        // Email confirmation is OFF - auto sign-in immediately after signup
        const r2 = await sb.signIn(form.email, form.password)
        if (r2.access_token && r2.user) {
          sessionStorage.setItem('sb_token', r2.access_token)
          sessionStorage.setItem('sb_user', JSON.stringify(r2.user))
          const assignedRole = r2.user?.user_metadata?.role || role
          onAuth(r2.user, r2.access_token, assignedRole)
          return
        }
        setTab('signin')
      } else {
        const r = await sb.signIn(form.email, form.password)
        if (r.error) {
          setError(r.error.message || 'Invalid email or password.')
          setBusy(false); return
        }
        if (!r.access_token) {
          setError('Login failed. Please check your credentials.')
          setBusy(false); return
        }
        sessionStorage.setItem('sb_token', r.access_token)
        sessionStorage.setItem('sb_user', JSON.stringify(r.user))
        const userRole = r.user?.user_metadata?.role || 'customer'
        onAuth(r.user, r.access_token, userRole)
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError('Connection error. Please check your internet and try again.')
    }
    setBusy(false)
  }

  return (
    <div style={{
      minHeight:'100vh',display:'flex',
      background:`linear-gradient(135deg,${T.bg} 0%,${T.surfaceAlt} 50%,${T.bg} 100%)`
    }}>
      {/* Left panel - desktop only */}
      {!isMobile && <div style={{
        flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        padding:40,background:`linear-gradient(135deg,#2C2416,#4A3B24)`
      }}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <div style={{fontSize:16,letterSpacing:8,color:T.goldLight,marginBottom:8,textTransform:'uppercase',fontWeight:300}}>✦ Welcome to ✦</div>
          <h1 style={{fontFamily:'Cormorant Garamond',fontSize:52,fontWeight:300,color:'#FAF8F3',lineHeight:1.1,marginBottom:8}}>
            AI Saree<br/>Designer
          </h1>
          <div style={{fontSize:11,letterSpacing:4,color:T.goldLight,textTransform:'uppercase',marginTop:12}}>Studio</div>
        </div>

        {/* Preview canvas */}
        <div style={{transform:'scale(0.85)',transformOrigin:'center'}}>
          <SareeCanvas design={{ primaryColor:'#8B0000', secondaryColor:'#F5F5DC', accentColor:'#C9A843', bodyPattern:'b6', borderPattern:'br3', palluPattern:'p6' }} />
        </div>

        <div style={{marginTop:40,textAlign:'center'}}>
          <p style={{color:'rgba(250,248,243,0.5)',fontSize:13,lineHeight:1.8,maxWidth:280}}>
            Design your dream saree with AI assistance.<br/>
            <span style={{color:T.goldLight}}>Voice-guided • Pattern library • Instant preview</span>
          </p>
        </div>
      </div>}

      {/* Right panel - auth form */}
      <div style={{
        width: isMobile ? '100%' : 440,
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        padding:40,background:T.surface,
        boxShadow: '-4px 0 40px rgba(44,36,22,0.08)'
      }}>
        {/* Mobile logo */}
        {isMobile && (
          <div style={{textAlign:'center',marginBottom:40}}>
            <div style={{fontSize:10,letterSpacing:6,color:T.gold,marginBottom:6,textTransform:'uppercase'}}>✦ Welcome to ✦</div>
            <h1 style={{fontFamily:'Cormorant Garamond',fontSize:38,fontWeight:300,color:T.text,lineHeight:1.1}}>
              AI Saree<br/>Designer
            </h1>
            <div style={{fontSize:9,letterSpacing:4,color:T.textLight,textTransform:'uppercase',marginTop:8}}>Studio</div>
          </div>
        )}

        <div style={{width:'100%',maxWidth:340}}>
          <h2 style={{fontFamily:'Cormorant Garamond',fontSize:30,fontWeight:400,color:T.text,marginBottom:6}}>
            {tab === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{fontSize:12,color:T.textLight,marginBottom:32,letterSpacing:0.3}}>
            {tab === 'signin' ? 'Sign in to continue designing' : 'Join the studio today'}
          </p>

          {/* Tabs */}
          <div style={{display:'flex',gap:0,marginBottom:28,border:`1px solid ${T.border}`,borderRadius:2,overflow:'hidden'}}>
            {['signin','signup'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex:1,padding:'10px 0',border:'none',cursor:'pointer',
                fontSize:11,letterSpacing:1.5,fontWeight:500,textTransform:'uppercase',
                background: tab===t ? `linear-gradient(135deg,${T.goldDark},${T.gold})` : T.surfaceAlt,
                color: tab===t ? 'white' : T.textMid,
                transition:'all 0.2s'
              }}>{t === 'signin' ? 'Sign In' : 'Sign Up'}</button>
            ))}
          </div>

          {/* Role selector - signup only */}
          {tab === 'signup' && (
            <div style={{marginBottom:20}}>
              <p className="label-xs" style={{marginBottom:10}}>I am a</p>
              <div style={{display:'flex',gap:10}}>
                {[{v:'customer',label:'Customer',icon:'👗',desc:'Design my saree'},{v:'designer',label:'Designer',icon:'✏️',desc:'Manage & create'}].map(r => (
                  <div key={r.v} onClick={() => setRole(r.v)} style={{
                    flex:1,padding:'12px 10px',borderRadius:4,
                    border:`1.5px solid ${role===r.v ? T.gold : T.border}`,
                    background: role===r.v ? '#FEF9EC' : T.surfaceAlt,
                    cursor:'pointer',textAlign:'center',transition:'all 0.2s'
                  }}>
                    <div style={{fontSize:22,marginBottom:4}}>{r.icon}</div>
                    <div style={{fontSize:12,fontWeight:500,color:role===r.v?T.goldDark:T.text,marginBottom:2}}>{r.label}</div>
                    <div style={{fontSize:10,color:T.textLight}}>{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <div style={{display:'flex',flexDirection:'column',gap:14,marginBottom:20}}>
            <input className="input-field" type="email" placeholder="Email address" value={form.email} onChange={e => setForm({...form,email:e.target.value})} onKeyDown={e => e.key==='Enter' && handleSubmit()} />
            <input className="input-field" type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} onKeyDown={e => e.key==='Enter' && handleSubmit()} />
          </div>

          {error && <p style={{color:T.error,fontSize:12,marginBottom:12,padding:'8px 12px',background:'#FFF5F5',borderRadius:2,border:'1px solid #FEB2B2'}}>{error}</p>}

          <button className="btn-primary" style={{width:'100%',padding:'14px 0'}} onClick={handleSubmit} disabled={busy}>
            {busy ? 'Please wait...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

          <div className="divider" style={{margin:'20px 0'}} />
          <p style={{textAlign:'center',fontSize:11,color:T.textLight,letterSpacing:0.5}}>
            Powered by <span style={{color:T.gold,fontWeight:500}}>Claude AI</span> × <span style={{color:T.gold,fontWeight:500}}>Supabase</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── CUSTOMER HOME ────────────────────────────────────────────────────────────
function CustomerHome({ user, onNavigate }) {
  const name = user?.email?.split('@')[0] || 'there'
  const cards = [
    { id: 'canvas', icon: '✏️', title: 'Start New Design', desc: 'Jump straight to the live canvas and begin creating', color: `linear-gradient(135deg,${T.goldDark},${T.gold})`, textColor:'white' },
    { id: 'mydesigns', icon: '👗', title: 'My Designs', desc: 'View your saved drafts and submitted designs', color: T.surface, textColor: T.text },
    { id: 'aimode', icon: '🤖', title: 'AI Mode', desc: 'Voice questionnaire or type a prompt to generate', color: T.surface, textColor: T.text },
    { id: 'imageupload', icon: '📷', title: 'Image Upload', desc: 'Upload or capture a photo - AI recreates the design', color: T.surface, textColor: T.text },
  ]

  return (
    <div style={{padding:'32px 20px',maxWidth:600,margin:'0 auto'}}>
      {/* Greeting */}
      <div style={{marginBottom:36}}>
        <p className="label-xs" style={{marginBottom:6}}>Welcome back</p>
        <h1 style={{fontFamily:'Cormorant Garamond',fontSize:38,fontWeight:300,color:T.text,lineHeight:1.1}}>
          Hello, {name} <span style={{fontSize:30}}>✦</span>
        </h1>
        <p style={{fontSize:13,color:T.textMid,marginTop:8,fontStyle:'italic',fontFamily:'Cormorant Garamond'}}>
          What would you like to create today?
        </p>
      </div>

      {/* Main action cards */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:32}}>
        {cards.map((card,i) => (
          <div key={card.id} onClick={() => onNavigate(card.id)} className="card" style={{
            padding:20,cursor:'pointer',
            background: card.color,
            border: i===0 ? 'none' : `1px solid ${T.border}`,
            transition:'all 0.25s ease',
            animation:`fadeIn 0.4s ease ${i*0.08}s both`
          }}
          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 30px rgba(44,36,22,0.12)' }}
          onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}>
            <div style={{fontSize:28,marginBottom:10}}>{card.icon}</div>
            <h3 style={{fontFamily:'Cormorant Garamond',fontSize:18,fontWeight:400,color:card.textColor,marginBottom:6,lineHeight:1.2}}>{card.title}</h3>
            <p style={{fontSize:11,color:i===0?'rgba(255,255,255,0.8)':T.textLight,lineHeight:1.5}}>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Divider with label */}
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
        <div style={{flex:1,height:1,background:T.border}} />
        <span className="label-xs">Saree Styles</span>
        <div style={{flex:1,height:1,background:T.border}} />
      </div>

      {/* Quick style chips */}
      <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
        {['Kerala Kasavu','Kanchipuram Silk','Banarasi','Chettinad Cotton','Mysore Silk','Linen','Organza'].map(s => (
          <button key={s} className="chip" onClick={() => onNavigate('canvas')} style={{fontSize:11}}>{s}</button>
        ))}
      </div>
    </div>
  )
}

// ─── DESIGNER CANVAS ──────────────────────────────────────────────────────────
function DesignerCanvas({ user, token, initialDesign, notify, onBack, patterns: propPatterns, palettes: propPalettes }) {
  const isMobile = window.innerWidth < 768
  const [design, setDesign] = useState(initialDesign || {
    primaryColor: '#8B0000', secondaryColor: '#F5F5DC',
    accentColor: '#C9A843', bodyPattern: 'b4',
    borderPattern: 'br1', palluPattern: 'p2'
  })
  const [designName, setDesignName] = useState('My Saree Design')
  const [activeSection, setActiveSection] = useState('body')
  const [mobileTab, setMobileTab] = useState('controls')
  const [saving, setSaving] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiResult, setAiResult] = useState(null)

  const patterns = propPatterns && propPatterns.length > 0 ? propPatterns : SEED_PATTERNS
  const palettes = propPalettes && propPalettes.length > 0 ? propPalettes : SEED_PALETTES

  const sectionPatterns = {
    body: patterns.filter(p => p.saree_part === 'body'),
    border: patterns.filter(p => p.saree_part === 'border'),
    pallu: patterns.filter(p => p.saree_part === 'pallu'),
  }

  const currentPatternKey = { body: 'bodyPattern', border: 'borderPattern', pallu: 'palluPattern' }

  const applyPalette = (pal) => setDesign(d => ({...d, primaryColor:pal.primary_color, secondaryColor:pal.secondary_color, accentColor:pal.accent_color}))

  const generateAI = async () => {
    if (!aiPrompt.trim()) return
    setIsGenerating(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type':'application/json','x-api-key':'','anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true' },
        body: JSON.stringify({
          model: CLAUDE_MODEL, max_tokens: 600,
          system: `You are a saree design AI. Return ONLY valid JSON: {"primaryColor":"#hex","secondaryColor":"#hex","accentColor":"#hex","bodyPattern":"b1","borderPattern":"br1","palluPattern":"p1","explanation":"..."} Pattern IDs body:b1-b17, border:br1-br12, pallu:p1-p12.`,
          messages: [{ role:'user', content: `Design a saree: ${aiPrompt}` }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || '{}'
      const parsed = JSON.parse(text.replace(/```json|```/g,'').trim())
      setDesign(d => ({...d,...parsed}))
      setAiResult(parsed.explanation)
    } catch { notify('AI generation failed. Try again.','error') }
    setIsGenerating(false)
  }

  const saveDesign = async () => {
    if (!user) return
    setSaving(true)
    try {
      await sb.insert('saved_designs', {
        user_id: user.id, name: designName,
        design_data: design,
        thumbnail_colors: [design.primaryColor, design.secondaryColor, design.accentColor],
        status: 'draft'
      }, token)
      notify('Design saved!', 'success')
    } catch { notify('Could not save. Try again.', 'error') }
    setSaving(false)
  }

  const exportPNG = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 400; canvas.height = 660
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = design.primaryColor; ctx.fillRect(0, 0, 400, 170)
    ctx.fillStyle = design.secondaryColor; ctx.fillRect(0, 170, 400, 22)
    ctx.fillStyle = design.primaryColor; ctx.fillRect(0, 192, 400, 420)
    ctx.fillStyle = design.secondaryColor; ctx.fillRect(0, 612, 400, 22)
    ctx.fillStyle = design.secondaryColor; ctx.fillRect(0, 634, 400, 26)
    ctx.fillStyle = design.accentColor; ctx.fillRect(0, 648, 400, 12)
    ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = 'bold 16px serif'
    ctx.fillText(designName, 20, 30)
    const link = document.createElement('a')
    link.download = `${designName.replace(/\s/g,'-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    notify('Design exported!','success')
  }

  const Controls = () => (
    <div style={{display:'flex',flexDirection:'column',gap:20,padding: isMobile?'16px 0':'0'}}>
      {/* AI Generator */}
      <div>
        <p className="label-xs" style={{marginBottom:10}}>AI Generator</p>
        <div style={{display:'flex',gap:8}}>
          <input className="input-field" style={{flex:1,fontSize:12}} placeholder="e.g. red wedding silk saree..."
            value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&generateAI()} />
          <button className="btn-primary" onClick={generateAI} disabled={isGenerating} style={{whiteSpace:'nowrap',padding:'0 14px',fontSize:11}}>
            {isGenerating?'...':'✨'}
          </button>
        </div>
        {aiResult && <p style={{fontSize:11,color:T.textMid,marginTop:8,fontStyle:'italic',lineHeight:1.5}}>{aiResult}</p>}
      </div>

      {/* Section selector */}
      <div>
        <p className="label-xs" style={{marginBottom:10}}>Edit Section</p>
        <div style={{display:'flex',gap:6}}>
          {['body','border','pallu'].map(s => (
            <button key={s} onClick={()=>setActiveSection(s)} style={{
              flex:1,padding:'8px 4px',border:`1px solid ${activeSection===s?T.gold:T.border}`,
              background:activeSection===s?'#FEF9EC':T.surfaceAlt,
              color:activeSection===s?T.goldDark:T.textMid,
              borderRadius:2,cursor:'pointer',fontSize:11,
              fontWeight:activeSection===s?500:300,
              textTransform:'capitalize',letterSpacing:0.5,
              transition:'all 0.2s'
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Pattern grid */}
      <div>
        <p className="label-xs" style={{marginBottom:10}}>Patterns - {activeSection}</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
          {sectionPatterns[activeSection].map(p => (
            <div key={p.id} onClick={()=>setDesign(d=>({...d,[currentPatternKey[activeSection]]:p.id}))}
              style={{
                borderRadius:3,overflow:'hidden',cursor:'pointer',
                border:`2px solid ${design[currentPatternKey[activeSection]]===p.id?T.gold:T.border}`,
                transition:'all 0.2s',
                boxShadow: design[currentPatternKey[activeSection]]===p.id?`0 0 0 1px ${T.goldLight}`:'none'
              }}>
              <PatternRenderer patternId={p.id} color={design.primaryColor} accentColor={design.accentColor} width={80} height={60} />
              <div style={{padding:'4px',background:T.surface,fontSize:8,textAlign:'center',color:T.textLight,letterSpacing:0.5,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{p.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Color palettes */}
      <div>
        <p className="label-xs" style={{marginBottom:10}}>Colour Palettes</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {palettes.map(pal => (
            <div key={pal.id} onClick={()=>applyPalette(pal)} style={{
              padding:'10px 12px',borderRadius:3,cursor:'pointer',
              border:`1px solid ${T.border}`,background:T.surface,
              transition:'all 0.2s'
            }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=T.gold}
            onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
              <div style={{display:'flex',gap:4,marginBottom:6}}>
                {[pal.primary_color,pal.secondary_color,pal.accent_color].map((c,i)=>(<div key={i} style={{width:16,height:16,borderRadius:'50%',background:c,border:`1px solid ${T.border}`}} />))}
              </div>
              <div style={{fontSize:10,color:T.textMid,fontWeight:400}}>{pal.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom colors */}
      <div>
        <p className="label-xs" style={{marginBottom:10}}>Custom Colors</p>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {[['primaryColor','Primary'],['secondaryColor','Secondary'],['accentColor','Accent']].map(([k,label]) => (
            <div key={k} style={{display:'flex',alignItems:'center',gap:10}}>
              <input type="color" value={design[k]} onChange={e=>setDesign(d=>({...d,[k]:e.target.value}))}
                style={{width:32,height:32,borderRadius:2,border:`1px solid ${T.border}`,cursor:'pointer',padding:2,background:'white'}} />
              <span style={{fontSize:11,color:T.textMid}}>{label}</span>
              <code style={{marginLeft:'auto',fontSize:9,color:T.textLight}}>{design[k]}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const SavePanel = () => (
    <div style={{display:'flex',flexDirection:'column',gap:16,padding:isMobile?'16px 0':'0'}}>
      <div>
        <p className="label-xs" style={{marginBottom:8}}>Design Name</p>
        <input className="input-field" value={designName} onChange={e=>setDesignName(e.target.value)} placeholder="My Saree Design" />
      </div>
      <button className="btn-primary" style={{width:'100%'}} onClick={saveDesign} disabled={saving}>
        {saving ? 'Saving...' : '💾 Save Design'}
      </button>
      <button className="btn-outline" style={{width:'100%'}} onClick={exportPNG}>⬇ Export PNG</button>

      <div className="divider" />

      <div>
        <p className="label-xs" style={{marginBottom:10}}>Current Design</p>
        <div style={{display:'flex',gap:6,marginBottom:8}}>
          {[design.primaryColor,design.secondaryColor,design.accentColor].map((c,i)=>(<div key={i} style={{width:28,height:28,borderRadius:'50%',background:c,border:`1px solid ${T.border}`}} />))}
        </div>
        <p style={{fontSize:10,color:T.textLight}}>Body: {design.bodyPattern} · Border: {design.borderPattern} · Pallu: {design.palluPattern}</p>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div style={{display:'flex',flexDirection:'column',height:'100vh',background:T.bg}}>
        {/* Top bar */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',background:T.surface,borderBottom:`1px solid ${T.border}`}}>
          <button onClick={onBack} className="btn-ghost" style={{padding:'5px 10px',fontSize:10}}>← Home</button>
          <span style={{fontFamily:'Cormorant Garamond',fontSize:16,color:T.text}}>Designer</span>
          <button className="btn-ghost" style={{padding:'5px 10px',fontSize:10}} onClick={saveDesign}>{saving?'...':'Save'}</button>
        </div>

        {/* Canvas - top 42% */}
        <div style={{height:'42%',display:'flex',alignItems:'center',justifyContent:'center',background:`radial-gradient(ellipse at center,${T.surfaceAlt},${T.bg})`,padding:12,position:'relative'}}>
          {isGenerating && (
            <div style={{position:'absolute',inset:0,background:'rgba(250,248,243,0.85)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:10}}>
              <div style={{width:32,height:32,borderRadius:'50%',border:`2px solid ${T.goldLight}`,borderTopColor:T.gold,animation:'spin 1s linear infinite',marginBottom:8}} />
              <span style={{fontSize:11,color:T.textMid}}>Generating...</span>
            </div>
          )}
          <SareeCanvas design={design} scale={0.62} />
          <div style={{position:'absolute',bottom:8,left:'50%',transform:'translateX(-50%)',display:'flex',gap:5}}>
            {[design.primaryColor,design.secondaryColor,design.accentColor].map((c,i)=>(
              <div key={i} style={{width:10,height:10,borderRadius:'50%',background:c,border:`1px solid ${T.border}`}} />
            ))}
          </div>
        </div>

        {/* Bottom tabs */}
        <div style={{display:'flex',background:T.surface,borderTop:`1px solid ${T.border}`}}>
          {[['controls','✦ Design'],['save','↓ Save']].map(([t,l]) => (
            <button key={t} onClick={()=>setMobileTab(t)} style={{
              flex:1,padding:'10px 0',border:'none',cursor:'pointer',
              background:'transparent',fontSize:10,letterSpacing:1.5,
              fontWeight:mobileTab===t?500:300,textTransform:'uppercase',
              color:mobileTab===t?T.gold:T.textMid,
              borderTop:`2px solid ${mobileTab===t?T.gold:'transparent'}`,
              transition:'all 0.2s'
            }}>{l}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:'auto',padding:'0 16px 100px'}}>
          {mobileTab==='controls' ? Controls() : SavePanel()}
        </div>
      </div>
    )
  }

  // Desktop 3-panel
  return (
    <div style={{display:'flex',height:'100vh',background:T.bg}}>
      {/* Left */}
      <div style={{width:280,overflowY:'auto',padding:24,background:T.surface,borderRight:`1px solid ${T.border}`}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:24}}>
          <button onClick={onBack} className="btn-ghost" style={{padding:'5px 12px',fontSize:10}}>← Back</button>
          <span style={{fontFamily:'Cormorant Garamond',fontSize:16,color:T.text}}>Canvas</span>
        </div>
        {Controls()}
      </div>

      {/* Center */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',background:`radial-gradient(ellipse at center,${T.surfaceAlt} 0%,${T.bg} 70%)`,position:'relative'}}>
        {isGenerating && (
          <div style={{position:'absolute',inset:0,background:'rgba(250,248,243,0.8)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:10}}>
            <div style={{width:48,height:48,borderRadius:'50%',border:`3px solid ${T.goldLight}`,borderTopColor:T.gold,animation:'spin 1s linear infinite',marginBottom:12}} />
            <span style={{fontFamily:'Cormorant Garamond',fontSize:20,color:T.textMid,fontStyle:'italic'}}>AI is creating...</span>
          </div>
        )}
        <SareeCanvas design={design} scale={1.1} />
      </div>

      {/* Right */}
      <div style={{width:220,overflowY:'auto',padding:24,background:T.surface,borderLeft:`1px solid ${T.border}`}}>
        {SavePanel()}
      </div>
    </div>
  )
}

// ─── AI MODE PAGE ─────────────────────────────────────────────────────────────
function AIModePage({ onBack, onDesignReady, notify }) {
  const [mode, setMode] = useState('choose') // choose | questionnaire | prompt | results
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState(null)
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState(null)

  const generateFromPrompt = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type':'application/json','x-api-key':'','anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true' },
        body: JSON.stringify({
          model: CLAUDE_MODEL, max_tokens: 800,
          system: `Saree design expert. Return ONLY valid JSON: {"recommendations":[{"name":"...","description":"...","matchScore":90}],"design":{"primaryColor":"#hex","secondaryColor":"#hex","accentColor":"#hex","bodyPattern":"b1","borderPattern":"br1","palluPattern":"p1","explanation":"..."}}. Pattern IDs: body b1-b17, border br1-br12, pallu p1-p12.`,
          messages: [{ role:'user', content: `Design a saree based on: ${prompt}` }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || '{}'
      const parsed = JSON.parse(text.replace(/```json|```/g,'').trim())
      setResults(parsed)
      setMode('results')
    } catch { notify('Generation failed. Try again.','error') }
    setIsGenerating(false)
  }

  const handleQuestionnaireComplete = (result, answers) => {
    setQuestionnaireAnswers(answers)
    setResults(result)
    setMode('results')
  }

  if (mode === 'questionnaire') {
    return (
      <div style={{minHeight:'100vh',background:T.bg,padding:'32px 20px'}}>
        <VoiceQuestionnaire onComplete={handleQuestionnaireComplete} onBack={()=>setMode('choose')} />
      </div>
    )
  }

  if (mode === 'results' && results) {
    return (
      <div style={{maxWidth:560,margin:'0 auto',padding:'32px 20px'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:32}}>
          <button onClick={()=>setMode('choose')} className="btn-ghost" style={{padding:'6px 14px',fontSize:11}}>← Back</button>
          <h2 style={{fontFamily:'Cormorant Garamond',fontSize:26,fontWeight:400,color:T.text}}>Your Design</h2>
        </div>

        {/* Preview */}
        <div style={{display:'flex',justifyContent:'center',marginBottom:28}}>
          <SareeCanvas design={results.design || {primaryColor:'#8B0000',secondaryColor:'#F5F5DC',accentColor:'#C9A843',bodyPattern:'b6',borderPattern:'br3',palluPattern:'p6'}} scale={0.9} />
        </div>

        {/* Explanation */}
        {results.design?.explanation && (
          <div style={{background:T.surfaceAlt,border:`1px solid ${T.border}`,borderRadius:4,padding:16,marginBottom:20}}>
            <p className="label-xs" style={{marginBottom:6}}>AI Design Notes</p>
            <p style={{fontSize:13,color:T.textMid,lineHeight:1.7,fontStyle:'italic',fontFamily:'Cormorant Garamond'}}>{results.design.explanation}</p>
          </div>
        )}

        {/* Recommendations */}
        {results.recommendations?.length > 0 && (
          <div style={{marginBottom:24}}>
            <p className="label-xs" style={{marginBottom:12}}>Recommended Styles</p>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {results.recommendations.map((r,i) => (
                <div key={i} className="card" style={{padding:'14px 16px',display:'flex',alignItems:'center',gap:12}}>
                  <div style={{
                    width:40,height:40,borderRadius:'50%',flexShrink:0,
                    background:`linear-gradient(135deg,${T.goldDark},${T.gold})`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    color:'white',fontSize:12,fontWeight:600
                  }}>{r.matchScore || 90}%</div>
                  <div>
                    <div style={{fontFamily:'Cormorant Garamond',fontSize:16,color:T.text,marginBottom:2}}>{r.name}</div>
                    <div style={{fontSize:11,color:T.textLight,lineHeight:1.4}}>{r.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="btn-primary" style={{width:'100%',padding:16,fontSize:13}} onClick={() => onDesignReady(results.design)}>
          Open in Designer →
        </button>
      </div>
    )
  }

  // Choose mode
  return (
    <div style={{maxWidth:520,margin:'0 auto',padding:'32px 20px'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:32}}>
        <button onClick={onBack} className="btn-ghost" style={{padding:'6px 14px',fontSize:11}}>← Back</button>
        <h2 style={{fontFamily:'Cormorant Garamond',fontSize:26,fontWeight:400,color:T.text}}>AI Mode</h2>
      </div>

      {/* Voice questionnaire section */}
      <div className="card" style={{padding:24,marginBottom:16}}>
        <div style={{display:'flex',gap:16,alignItems:'flex-start',marginBottom:20}}>
          <div style={{
            width:48,height:48,borderRadius:'50%',flexShrink:0,
            background:`linear-gradient(135deg,${T.goldDark},${T.gold})`,
            display:'flex',alignItems:'center',justifyContent:'center',fontSize:22
          }}>🎤</div>
          <div>
            <h3 style={{fontFamily:'Cormorant Garamond',fontSize:20,color:T.text,marginBottom:4}}>Voice Questionnaire</h3>
            <p style={{fontSize:12,color:T.textLight,lineHeight:1.6}}>Answer 6 guided questions - by speaking or tapping. AI designs your perfect saree.</p>
          </div>
        </div>
        <button className="btn-primary" style={{width:'100%'}} onClick={()=>setMode('questionnaire')}>
          Start Conversation →
        </button>
      </div>

      {/* Divider */}
      <div style={{display:'flex',alignItems:'center',gap:12,margin:'20px 0'}}>
        <div style={{flex:1,height:1,background:T.border}} />
        <span style={{fontSize:10,letterSpacing:2,color:T.textLight,textTransform:'uppercase'}}>or</span>
        <div style={{flex:1,height:1,background:T.border}} />
      </div>

      {/* Prompt section */}
      <div className="card" style={{padding:24}}>
        <div style={{display:'flex',gap:16,alignItems:'flex-start',marginBottom:20}}>
          <div style={{
            width:48,height:48,borderRadius:'50%',flexShrink:0,
            background:T.surfaceAlt,border:`1px solid ${T.border}`,
            display:'flex',alignItems:'center',justifyContent:'center',fontSize:22
          }}>✨</div>
          <div>
            <h3 style={{fontFamily:'Cormorant Garamond',fontSize:20,color:T.text,marginBottom:4}}>Type a Prompt</h3>
            <p style={{fontSize:12,color:T.textLight,lineHeight:1.6}}>Describe your dream saree in your own words and let AI generate it.</p>
          </div>
        </div>
        <textarea className="input-field" rows={3} placeholder="e.g. Traditional red silk wedding saree with peacock pallu and heavy gold border..." value={prompt} onChange={e=>setPrompt(e.target.value)} style={{marginBottom:12,resize:'none',lineHeight:1.6}} />
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:14}}>
          {['Wedding silk saree','Kerala kasavu','Minimal linen office saree','Bridal Banarasi'].map(s=>(
            <button key={s} className="chip" style={{fontSize:10}} onClick={()=>setPrompt(s)}>{s}</button>
          ))}
        </div>
        <button className="btn-primary" style={{width:'100%'}} onClick={generateFromPrompt} disabled={isGenerating||!prompt.trim()}>
          {isGenerating ? '✨ Generating...' : '✨ Generate Design'}
        </button>
      </div>
    </div>
  )
}

// ─── MY DESIGNS ───────────────────────────────────────────────────────────────
function MyDesignsPage({ user, token, onBack, onOpenDesign, notify }) {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDesigns()
  }, [])

  const loadDesigns = async () => {
    setLoading(true)
    try {
      const data = await sb.select('saved_designs', `user_id=eq.${user.id}&order=created_at.desc`, token)
      setDesigns(Array.isArray(data) ? data : [])
    } catch { setDesigns([]) }
    setLoading(false)
  }

  const deleteDesign = async (id) => {
    try {
      await sb.delete('saved_designs', `id=eq.${id}`, token)
      setDesigns(d => d.filter(x => x.id !== id))
      notify('Design deleted','info')
    } catch { notify('Could not delete','error') }
  }

  const statusLabel = (s) => {
    const map = { draft:'Draft', submitted:'Submitted', review:'Under Review', approved:'Approved', production:'Production Ready' }
    return map[s] || s || 'Draft'
  }

  return (
    <div style={{maxWidth:600,margin:'0 auto',padding:'32px 20px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button onClick={onBack} className="btn-ghost" style={{padding:'6px 14px',fontSize:11}}>← Back</button>
          <h2 style={{fontFamily:'Cormorant Garamond',fontSize:26,fontWeight:400,color:T.text}}>My Designs</h2>
        </div>
        <span style={{fontSize:11,color:T.textLight}}>{designs.length} saved</span>
      </div>

      {loading ? (
        <div style={{textAlign:'center',padding:60}}>
          <div style={{width:40,height:40,borderRadius:'50%',border:`2px solid ${T.goldLight}`,borderTopColor:T.gold,animation:'spin 1s linear infinite',margin:'0 auto'}} />
        </div>
      ) : designs.length === 0 ? (
        <div style={{textAlign:'center',padding:60}}>
          <div style={{fontSize:48,marginBottom:16}}>👗</div>
          <h3 style={{fontFamily:'Cormorant Garamond',fontSize:22,color:T.textMid,marginBottom:8}}>No designs yet</h3>
          <p style={{fontSize:13,color:T.textLight}}>Start designing to see your creations here.</p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {designs.map(d => (
            <div key={d.id} className="card" style={{padding:16,display:'flex',gap:14,alignItems:'center'}}>
              {/* Color preview */}
              <div style={{display:'flex',flexDirection:'column',gap:2,flexShrink:0}}>
                {(d.thumbnail_colors||[d.design_data?.primaryColor,'#C9A843']).slice(0,3).map((c,i)=>(
                  <div key={i} style={{width:28,height:28,borderRadius:2,background:c||'#ccc'}} />
                ))}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:'Cormorant Garamond',fontSize:17,color:T.text,marginBottom:4,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{d.name}</div>
                <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                  <span className={`status-${d.status||'draft'}`}>{statusLabel(d.status)}</span>
                  <span style={{fontSize:10,color:T.textLight}}>{d.created_at ? new Date(d.created_at).toLocaleDateString() : ''}</span>
                </div>
              </div>
              <div style={{display:'flex',gap:8,flexShrink:0}}>
                <button className="btn-ghost" style={{padding:'5px 10px',fontSize:10}} onClick={()=>onOpenDesign(d.design_data)}>Edit</button>
                <button onClick={()=>deleteDesign(d.id)} style={{background:'transparent',border:'none',color:T.textLight,cursor:'pointer',fontSize:14,padding:4}}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── DESIGNER DASHBOARD ───────────────────────────────────────────────────────
function DesignerDashboard({ user, token, notify, onBack, patterns: propPatterns, palettes: propPalettes, templates: propTemplates }) {
  const [activeTab, setActiveTab] = useState('requests')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'requests') loadRequests()
  }, [activeTab])

  const loadRequests = async () => {
    setLoading(true)
    try {
      const data = await sb.select('saved_designs', `order=created_at.desc&limit=30`, token)
      setRequests(Array.isArray(data) ? data : [])
    } catch { setRequests([]) }
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    try {
      await sb.update('saved_designs', { status }, `id=eq.${id}`, token)
      setRequests(r => r.map(x => x.id===id ? {...x, status} : x))
      notify(`Status updated to: ${status}`,'success')
    } catch { notify('Could not update status','error') }
  }

  // patternLibrary | customerRequests tabs
  const tabs = [
    { id:'requests', label:'Customer Requests', icon:'📋' },
    { id:'patterns', label:'Pattern Library', icon:'🗂️' },
    { id:'templates', label:'Style Templates', icon:'📐' },
  ]

  const statusColors = {
    draft:'#B7791F', submitted:'#2B6CB0', review:'#C53030',
    approved:'#276749', production:'#6B46C1'
  }

  return (
    <div style={{minHeight:'100vh',background:T.bg}}>
      {/* Header */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <button onClick={onBack} className="btn-ghost" style={{padding:'5px 12px',fontSize:10}}>← Home</button>
          <h1 style={{fontFamily:'Cormorant Garamond',fontSize:24,fontWeight:400,color:T.text}}>Designer Dashboard</h1>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:T.success}} />
          <span style={{fontSize:11,color:T.textMid}}>{user?.email}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,padding:'20px 24px',maxWidth:900,margin:'0 auto'}}>
        {[
          {label:'Total Requests', value:requests.length, icon:'📋'},
          {label:'Pending Review', value:requests.filter(r=>r.status==='submitted'||r.status==='review').length, icon:'⏳'},
          {label:'Approved', value:requests.filter(r=>r.status==='approved').length, icon:'✅'},
          {label:'In Production', value:requests.filter(r=>r.status==='production').length, icon:'🏭'},
        ].map(s => (
          <div key={s.label} className="card" style={{padding:16,textAlign:'center'}}>
            <div style={{fontSize:24,marginBottom:6}}>{s.icon}</div>
            <div style={{fontFamily:'Cormorant Garamond',fontSize:28,color:T.gold,marginBottom:4}}>{s.value}</div>
            <div style={{fontSize:10,color:T.textLight,letterSpacing:0.5}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{maxWidth:900,margin:'0 auto',padding:'0 24px'}}>
        <div style={{display:'flex',gap:0,borderBottom:`1px solid ${T.border}`,marginBottom:24}}>
          {tabs.map(t => (
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
              padding:'12px 20px',border:'none',cursor:'pointer',
              background:'transparent',fontSize:12,letterSpacing:0.5,
              color:activeTab===t.id?T.gold:T.textMid,
              borderBottom:`2px solid ${activeTab===t.id?T.gold:'transparent'}`,
              transition:'all 0.2s',fontFamily:'Jost',fontWeight:activeTab===t.id?500:300
            }}>{t.icon} {t.label}</button>
          ))}
        </div>

        {/* Customer Requests */}
        {activeTab === 'requests' && (
          loading ? (
            <div style={{textAlign:'center',padding:48}}>
              <div style={{width:40,height:40,borderRadius:'50%',border:`2px solid ${T.goldLight}`,borderTopColor:T.gold,animation:'spin 1s linear infinite',margin:'0 auto'}} />
            </div>
          ) : requests.length === 0 ? (
            <div style={{textAlign:'center',padding:60}}>
              <div style={{fontSize:48,marginBottom:12}}>📭</div>
              <p style={{fontFamily:'Cormorant Garamond',fontSize:20,color:T.textMid}}>No requests yet</p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {requests.map(r => (
                <div key={r.id} className="card" style={{padding:16}}>
                  <div style={{display:'flex',gap:16,alignItems:'center'}}>
                    {/* Color preview */}
                    <div style={{display:'flex',gap:2,flexShrink:0}}>
                      {(r.thumbnail_colors||['#ccc']).map((c,i)=>(
                        <div key={i} style={{width:20,height:48,borderRadius:2,background:c}} />
                      ))}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:'Cormorant Garamond',fontSize:17,color:T.text,marginBottom:4}}>{r.name}</div>
                      <div style={{fontSize:11,color:T.textLight,marginBottom:8}}>{r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : ''}</div>
                      {/* Status actions */}
                      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        {['review','approved','production'].map(s => (
                          <button key={s} onClick={()=>updateStatus(r.id,s)} style={{
                            padding:'4px 10px',border:`1px solid ${r.status===s?statusColors[s]:T.border}`,
                            background:r.status===s?`${statusColors[s]}15`:'transparent',
                            color:r.status===s?statusColors[s]:T.textLight,
                            borderRadius:40,cursor:'pointer',fontSize:9,
                            letterSpacing:0.8,textTransform:'uppercase',
                            transition:'all 0.2s'
                          }}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{flexShrink:0}}>
                      <span className={`status-${r.status||'draft'}`}>{r.status||'Draft'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Pattern Library */}
        {activeTab === 'patterns' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:12}}>
              {(propPatterns&&propPatterns.length>0?propPatterns:SEED_PATTERNS).map(p => (
                <div key={p.id} className="card" style={{overflow:'hidden'}}>
                  <PatternRenderer patternId={p.id} color='#8B0000' accentColor='#C9A843' width={120} height={90} />
                  <div style={{padding:'8px 10px'}}>
                    <div style={{fontSize:11,color:T.text,fontWeight:400,marginBottom:2}}>{p.name}</div>
                    <div style={{fontSize:9,color:T.textLight,textTransform:'capitalize'}}>{p.saree_part} · {p.style_type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Style Templates */}
        {activeTab === 'templates' && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16}}>
            {(propTemplates&&propTemplates.length>0?propTemplates:SEED_TEMPLATES).map(t => {
              const pal = (propPalettes&&propPalettes.length>0?propPalettes:SEED_PALETTES).find(p=>p.id===t.palette_id) || SEED_PALETTES[0]
              return (
                <div key={t.id} className="card" style={{padding:0,overflow:'hidden'}}>
                  <div style={{height:120,display:'flex',alignItems:'center',justifyContent:'center',background:`linear-gradient(135deg,${pal.primary_color},${pal.secondary_color})`}}>
                    <SareeCanvas design={{primaryColor:pal.primary_color,secondaryColor:pal.secondary_color,accentColor:pal.accent_color,bodyPattern:t.body_pattern_id,borderPattern:t.border_pattern_id,palluPattern:t.pallu_pattern_id}} scale={0.4} />
                  </div>
                  <div style={{padding:14}}>
                    <div style={{fontFamily:'Cormorant Garamond',fontSize:17,color:T.text,marginBottom:4}}>{t.name}</div>
                    <div style={{fontSize:11,color:T.textLight}}>{t.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── MAIN NAV ─────────────────────────────────────────────────────────────────
function TopNav({ user, userRole, onSignOut, onHome }) {
  return (
    <div style={{
      position:'sticky',top:0,zIndex:100,
      background:`rgba(250,248,243,0.95)`,
      backdropFilter:'blur(12px)',
      borderBottom:`1px solid ${T.border}`,
      padding:'0 24px',height:56,
      display:'flex',alignItems:'center',justifyContent:'space-between'
    }}>
      <button onClick={onHome} style={{background:'transparent',border:'none',cursor:'pointer',padding:0}}>
        <span style={{fontFamily:'Cormorant Garamond',fontSize:20,fontWeight:400}} className="gold-gradient">
          ✦ AI Saree Designer
        </span>
      </button>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        {userRole === 'designer' && (
          <span style={{fontSize:9,padding:'3px 10px',background:'#FEF9EC',border:`1px solid ${T.goldLight}`,borderRadius:40,color:T.goldDark,letterSpacing:1,textTransform:'uppercase',fontWeight:500}}>Designer</span>
        )}
        <span style={{fontSize:11,color:T.textMid,maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.email}</span>
        <button className="btn-ghost" style={{padding:'5px 12px',fontSize:10}} onClick={onSignOut}>Sign Out</button>
      </div>
    </div>
  )
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [userRole, setUserRole] = useState('customer')
  const [authLoading, setAuthLoading] = useState(true)
  const [page, setPage] = useState('home')
  const [initialDesign, setInitialDesign] = useState(null)
  const [notification, setNotification] = useState(null)
  // Supabase-loaded data
  const [dbPatterns, setDbPatterns] = useState([])
  const [dbPalettes, setDbPalettes] = useState([])
  const [dbTemplates, setDbTemplates] = useState([])
  const [dbLoaded, setDbLoaded] = useState(false)

  // Restore session
  useEffect(() => {
    const t = sessionStorage.getItem('sb_token')
    const u = sessionStorage.getItem('sb_user')
    if (t && u) {
      const parsedUser = JSON.parse(u)
      setToken(t); setUser(parsedUser)
      setUserRole(parsedUser?.user_metadata?.role || 'customer')
    }
    setAuthLoading(false)
  }, [])

  // Load all data from Supabase on mount
  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        const [pats, pals, tmps] = await Promise.all([
          sb.select('design_patterns', 'order=id.asc'),
          sb.select('color_palettes', 'order=id.asc'),
          sb.select('ai_design_templates', 'order=id.asc'),
        ])
        const validPats = Array.isArray(pats) && pats.length > 0
        const validPals = Array.isArray(pals) && pals.length > 0
        const validTmps = Array.isArray(tmps) && tmps.length > 0
        if (validPats) setDbPatterns(pats)
        if (validPals) setDbPalettes(pals)
        if (validTmps) setDbTemplates(tmps)
        setDbLoaded(true)
        console.log(`✅ Supabase loaded: ${validPats?pats.length:0} patterns, ${validPals?pals.length:0} palettes, ${validTmps?tmps.length:0} templates`)
      } catch(e) {
        console.warn('⚠️ Supabase load failed, using seed data:', e)
        setDbLoaded(true)
      }
    }
    loadFromSupabase()
  }, [])

  // Merge: use Supabase data if available, else fall back to seed
  const patterns = dbPatterns.length > 0 ? dbPatterns : SEED_PATTERNS
  const palettes = dbPalettes.length > 0 ? dbPalettes : SEED_PALETTES
  const templates = dbTemplates.length > 0 ? dbTemplates : SEED_TEMPLATES

  const notify = (msg, type = 'info') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3500)
  }

  const handleAuth = (u, t, role) => {
    setUser(u); setToken(t); setUserRole(role)
    setPage('home')
  }

  const handleSignOut = async () => {
    if (token) await sb.signOut(token)
    sessionStorage.removeItem('sb_token')
    sessionStorage.removeItem('sb_user')
    setUser(null); setToken(null)
    setPage('home')
  }

  const handleNavigate = (target) => {
    if (target === 'canvas') { setInitialDesign(null); setPage('canvas') }
    else setPage(target)
  }

  const handleDesignReady = (design) => {
    setInitialDesign(design)
    setPage('canvas')
  }

  if (authLoading) {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:T.bg}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:48,height:48,borderRadius:'50%',border:`3px solid ${T.goldLight}`,borderTopColor:T.gold,animation:'spin 1s linear infinite',margin:'0 auto 16px'}} />
          <p style={{fontFamily:'Cormorant Garamond',fontSize:18,color:T.textMid,fontStyle:'italic'}}>Loading studio...</p>
        </div>
      </div>
    )
  }

  if (!user) return (
    <>
      <GlobalStyles />
      <AuthPage onAuth={handleAuth} notify={notify} />
      <Notification notification={notification} />
    </>
  )

  // Full-screen pages (no nav)
  if (page === 'canvas') return (
    <>
      <GlobalStyles />
      <DesignerCanvas user={user} token={token} initialDesign={initialDesign} notify={notify} onBack={()=>setPage('home')} />
      <Notification notification={notification} />
    </>
  )
  if (page === 'aimode') return (
    <>
      <GlobalStyles />
      <div style={{minHeight:'100vh',background:T.bg}}>
        <TopNav user={user} userRole={userRole} onSignOut={handleSignOut} onHome={()=>setPage('home')} />
        <AIModePage onBack={()=>setPage('home')} onDesignReady={handleDesignReady} notify={notify} />
      </div>
      <Notification notification={notification} />
    </>
  )
  if (page === 'imageupload') return (
    <>
      <GlobalStyles />
      <div style={{minHeight:'100vh',background:T.bg}}>
        <TopNav user={user} userRole={userRole} onSignOut={handleSignOut} onHome={()=>setPage('home')} />
        <div style={{padding:'32px 20px'}}>
          <ImageUploadPage onBack={()=>setPage('home')} onDesignReady={handleDesignReady} notify={notify} />
        </div>
      </div>
      <Notification notification={notification} />
    </>
  )
  if (page === 'mydesigns') return (
    <>
      <GlobalStyles />
      <div style={{minHeight:'100vh',background:T.bg}}>
        <TopNav user={user} userRole={userRole} onSignOut={handleSignOut} onHome={()=>setPage('home')} />
        <MyDesignsPage user={user} token={token} onBack={()=>setPage('home')} onOpenDesign={handleDesignReady} notify={notify} />
      </div>
      <Notification notification={notification} />
    </>
  )
  if (page === 'designer' || (page === 'home' && userRole === 'designer')) return (
    <>
      <GlobalStyles />
      <DesignerDashboard user={user} token={token} notify={notify} onBack={()=>setPage('home')} patterns={patterns} palettes={palettes} templates={templates} />
      <Notification notification={notification} />
    </>
  )

  // Home page
  return (
    <>
      <GlobalStyles />
      <div style={{minHeight:'100vh',background:T.bg}}>
        <TopNav user={user} userRole={userRole} onSignOut={handleSignOut} onHome={()=>setPage('home')} />
        {userRole === 'designer'
          ? <DesignerDashboard user={user} token={token} notify={notify} onBack={()=>setPage('home')} patterns={patterns} palettes={palettes} templates={templates} />
          : <CustomerHome user={user} onNavigate={handleNavigate} />
        }
      </div>
      <Notification notification={notification} />
    </>
  )
}
