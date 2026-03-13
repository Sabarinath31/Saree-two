// ─── constants.jsx ──────────────────────────────────────────────────────────
// Config, theme, global styles, Supabase client, seed data,
// questionnaire questions, and design-mapping logic.
// Imported by components.jsx and App.jsx

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
  { id: 't1', name: 'Classic Bridal Kanjivaram',    subtitle: 'Traditional red silk, heavy gold zari',      badge: 'Most Popular', body_pattern_id: 'b6',  border_pattern_id: 'br3', pallu_pattern_id: 'p6',  palette_id: 'pal1' },
  { id: 't2', name: 'Festive Banarasi Royal',        subtitle: 'Deep blue with peacock brocade pallu',       badge: 'Trending',     body_pattern_id: 'b11', border_pattern_id: 'br6', pallu_pattern_id: 'p7',  palette_id: 'pal5' },
  { id: 't3', name: 'Contemporary Linen Office',     subtitle: 'Minimalist linen, double-line border',       badge: 'New',          body_pattern_id: 'b16', border_pattern_id: 'br7', pallu_pattern_id: 'p9',  palette_id: 'pal7' },
  { id: 't4', name: 'Rajasthani Bandhani Gala',      subtitle: 'Bandhani dots, zigzag border, festive pallu',badge: 'Folk Art',     body_pattern_id: 'b9',  border_pattern_id: 'br9', pallu_pattern_id: 'p8',  palette_id: 'pal8' },
  { id: 't5', name: 'Zardozi Bridal Midnight',       subtitle: 'Star-field body, rose garland, mandala pallu',badge: 'Luxury',      body_pattern_id: 'b8',  border_pattern_id: 'br4', pallu_pattern_id: 'p11', palette_id: 'pal5' },
  { id: 't6', name: 'Meenakari Festive Jaipur',      subtitle: 'Enamel body, lotus chain, sunburst pallu',   badge: 'Heritage',     body_pattern_id: 'b17', border_pattern_id: 'br12',pallu_pattern_id: 'p12', palette_id: 'pal8' },
]


// ─── EXPORTS ──────────────────────────────────────────────────────────────────
export {
  // config
  SUPABASE_URL, SUPABASE_KEY, CLAUDE_MODEL, ANTHROPIC_KEY,
  // theme
  T,
  // components
  GlobalStyles,
  // supabase
  sb,
  // seed data
  SEED_PATTERNS, SEED_PALETTES, SEED_TEMPLATES,
  // questionnaire
  QUESTIONS,
  COLOR_MAP, BODY_MAP, BORDER_PALLU_MAP, FABRIC_ADJUSTMENTS, RICHNESS_LAYER,
  buildDesignFromAnswers, generateRecommendations,
}
