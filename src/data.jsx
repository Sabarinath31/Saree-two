// ─── data.jsx ─────────────────────────────────────────────────────────────────
// App config, Supabase client, seed data, questionnaire, design mapping logic

// ─── CONFIG ───────────────────────────────────────────────────────────────────
export const SUPABASE_URL = 'https://glvmekmiwyyasnepceqp.supabase.co'
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsdm1la21pd3l5YXNuZXBjZXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMzEwNjIsImV4cCI6MjA4ODkwNzA2Mn0.-Fx8aPqpxSHIkm9RAkVT92nXNyFPSBUYLmWhuEr3ONU'
export const GEMINI_MODEL   = 'gemini-2.5-flash'
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

// 🔑 Set VITE_GEMINI_KEY in your .env file
export const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || ''
console.log('Gemini API Key:', GEMINI_KEY ? 'YES ✅' : 'MISSING ❌')
export const HF_TOKEN         = import.meta.env.VITE_HF_TOKEN || ''
export const REPLICATE_TOKEN  = import.meta.env.VITE_REPLICATE_TOKEN || ''
export const TOGETHER_TOKEN   = import.meta.env.VITE_TOGETHER_TOKEN || ''

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
const _h = (token) => ({
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${token || SUPABASE_KEY}`,
  'Prefer': 'return=representation'
})

export const sb = {
  signUp: async (email, password, role = 'customer') => {
    try {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json','apikey':SUPABASE_KEY },
        body: JSON.stringify({ email, password, data:{ role } })
      })
      return r.json()
    } catch { return { error:{ message:'Network error' } } }
  },
  signIn: async (email, password) => {
    try {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json','apikey':SUPABASE_KEY },
        body: JSON.stringify({ email, password })
      })
      return r.json()
    } catch { return { error:{ message:'Network error' } } }
  },
  signOut: async (token) => {
    try { await fetch(`${SUPABASE_URL}/auth/v1/logout`,{ method:'POST', headers:_h(token) }) } catch {}
  },
  select: async (table, filters='', token) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filters}`, { headers:_h(token) })
    return r.json()
  },
  insert: async (table, data, token) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method:'POST', headers:_h(token), body:JSON.stringify(data)
    })
    return r.json()
  },
  update: async (table, data, filters, token) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filters}`, {
      method:'PATCH', headers:_h(token), body:JSON.stringify(data)
    })
    return r.json()
  },
  delete: async (table, filters, token) => {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filters}`,{ method:'DELETE', headers:_h(token) })
  }
}

// ─── SEED DATA ────────────────────────────────────────────────────────────────
export const SEED_PATTERNS = [
  { id:'b1',  name:'Plain Body',        saree_part:'body',   style_type:'minimal',     richness_level:1, tags:['plain','minimal','linen','cotton'] },
  { id:'b2',  name:'Stripe Body',       saree_part:'body',   style_type:'classic',     richness_level:2, tags:['stripes','classic','office'] },
  { id:'b3',  name:'Check Body',        saree_part:'body',   style_type:'traditional', richness_level:2, tags:['checks','chettinad','cotton'] },
  { id:'b4',  name:'Floral Butta',      saree_part:'body',   style_type:'festive',     richness_level:3, tags:['floral','butta','silk','festive'] },
  { id:'b5',  name:'Ikat Diamond',      saree_part:'body',   style_type:'traditional', richness_level:3, tags:['ikat','diamond','pochampally'] },
  { id:'b6',  name:'Temple Motifs',     saree_part:'body',   style_type:'bridal',      richness_level:5, tags:['temple','kanchipuram','bridal','silk'] },
  { id:'b7',  name:'Peacock Grid',      saree_part:'body',   style_type:'festive',     richness_level:4, tags:['peacock','silk','festive','wedding'] },
  { id:'b8',  name:'Zari Dots',         saree_part:'body',   style_type:'festive',     richness_level:3, tags:['zari','dots','silk','party'] },
  { id:'b9',  name:'Bandhani',          saree_part:'body',   style_type:'traditional', richness_level:3, tags:['bandhani','rajasthani','tie-dye'] },
  { id:'b10', name:'Leheriya Wave',     saree_part:'body',   style_type:'traditional', richness_level:2, tags:['leheriya','wave','rajasthani'] },
  { id:'b11', name:'Banarasi Jaal',     saree_part:'body',   style_type:'bridal',      richness_level:5, tags:['jaal','banarasi','bridal','brocade'] },
  { id:'b12', name:'Geometric',         saree_part:'body',   style_type:'modern',      richness_level:3, tags:['geometric','modern','designer'] },
  { id:'b13', name:'Lotus Pattern',     saree_part:'body',   style_type:'traditional', richness_level:4, tags:['lotus','bengal','silk'] },
  { id:'b14', name:'Warli Art',         saree_part:'body',   style_type:'folk',        richness_level:2, tags:['warli','folk','tribal'] },
  { id:'b15', name:'Kashmiri Floral',   saree_part:'body',   style_type:'traditional', richness_level:4, tags:['kashmiri','floral','pashmina'] },
  { id:'b16', name:'Pinstripe',         saree_part:'body',   style_type:'modern',      richness_level:1, tags:['pinstripe','office','linen'] },
  { id:'b17', name:'Meenakari',         saree_part:'body',   style_type:'festive',     richness_level:5, tags:['meenakari','enamel','jaipur','festive'] },
  { id:'br1', name:'Single Kasavu',     saree_part:'border', style_type:'traditional', richness_level:2, tags:['kasavu','kerala','cotton'] },
  { id:'br2', name:'Double Kasavu',     saree_part:'border', style_type:'traditional', richness_level:3, tags:['kasavu','kerala','silk'] },
  { id:'br3', name:'Temple Border',     saree_part:'border', style_type:'bridal',      richness_level:5, tags:['temple','kanchipuram','bridal'] },
  { id:'br4', name:'Mango Border',      saree_part:'border', style_type:'traditional', richness_level:4, tags:['mango','paisley','traditional'] },
  { id:'br5', name:'Peacock Border',    saree_part:'border', style_type:'festive',     richness_level:4, tags:['peacock','festive','silk'] },
  { id:'br6', name:'Broad Zari',        saree_part:'border', style_type:'bridal',      richness_level:5, tags:['zari','bridal','heavy','gold'] },
  { id:'br7', name:'Thin Gold Line',    saree_part:'border', style_type:'minimal',     richness_level:1, tags:['thin','minimal','office','linen'] },
  { id:'br8', name:'Floral Chain',      saree_part:'border', style_type:'festive',     richness_level:3, tags:['floral','chain','georgette'] },
  { id:'br9', name:'Geo Steps',         saree_part:'border', style_type:'traditional', richness_level:3, tags:['geometric','steps','cotton'] },
  { id:'br10',name:'Wave Border',       saree_part:'border', style_type:'modern',      richness_level:2, tags:['wave','modern','casual'] },
  { id:'br11',name:'Diamond Chain',     saree_part:'border', style_type:'traditional', richness_level:4, tags:['diamond','chain','traditional'] },
  { id:'br12',name:'Lotus Row',         saree_part:'border', style_type:'festive',     richness_level:4, tags:['lotus','row','festive'] },
  { id:'p1',  name:'Rich Zari Pallu',   saree_part:'pallu',  style_type:'bridal',      richness_level:5, tags:['zari','rich','bridal','heavy'] },
  { id:'p2',  name:'Contrast Pallu',    saree_part:'pallu',  style_type:'classic',     richness_level:3, tags:['contrast','classic','silk'] },
  { id:'p3',  name:'Peacock Pallu',     saree_part:'pallu',  style_type:'bridal',      richness_level:5, tags:['peacock','pallu','bridal','wedding'] },
  { id:'p4',  name:'Floral Pallu',      saree_part:'pallu',  style_type:'festive',     richness_level:4, tags:['floral','pallu','festival','silk'] },
  { id:'p5',  name:'Minimal Pallu',     saree_part:'pallu',  style_type:'minimal',     richness_level:1, tags:['minimal','pallu','linen','office'] },
  { id:'p6',  name:'Gopuram Panel',     saree_part:'pallu',  style_type:'traditional', richness_level:4, tags:['temple','gopuram','kanchipuram'] },
  { id:'p7',  name:'Kadwa Jaal Floral', saree_part:'pallu',  style_type:'bridal',      richness_level:5, tags:['kadwa','jaal','banarasi','bridal'] },
  { id:'p8',  name:'Butta Scatter',     saree_part:'pallu',  style_type:'festive',     richness_level:3, tags:['butta','scatter','festival'] },
  { id:'p9',  name:'Stripe Pallu',      saree_part:'pallu',  style_type:'modern',      richness_level:2, tags:['stripe','modern','casual'] },
  { id:'p10', name:'Embroidered Vines', saree_part:'pallu',  style_type:'designer',    richness_level:4, tags:['embroidered','vines','designer','party'] },
  { id:'p11', name:'Kashmiri Pallu',    saree_part:'pallu',  style_type:'traditional', richness_level:4, tags:['kashmiri','floral','traditional'] },
  { id:'p12', name:'Geometric Pallu',   saree_part:'pallu',  style_type:'modern',      richness_level:3, tags:['geometric','modern','designer'] },
]

export const SEED_PALETTES = [
  { id:'pal1', name:'Royal Kanchipuram', primary_color:'#8B0000', secondary_color:'#C9A843', accent_color:'#FFD700', occasion:'wedding' },
  { id:'pal2', name:'Kerala Gold',       primary_color:'#F5F5DC', secondary_color:'#C9A843', accent_color:'#8B6914', occasion:'festival' },
  { id:'pal3', name:'Mysore Ivory',      primary_color:'#FFFAF0', secondary_color:'#C9A843', accent_color:'#556B2F', occasion:'wedding' },
  { id:'pal4', name:'Pastel Rose',       primary_color:'#8B3A4E', secondary_color:'#E8C0C8', accent_color:'#C9A843', occasion:'party' },
  { id:'pal5', name:'Banarasi Blue',     primary_color:'#191970', secondary_color:'#C9A843', accent_color:'#87CEEB', occasion:'wedding' },
  { id:'pal6', name:'Chettinad Classic', primary_color:'#2F4F4F', secondary_color:'#8FBC8F', accent_color:'#C9A843', occasion:'casual' },
  { id:'pal7', name:'Office Linen',      primary_color:'#D2B48C', secondary_color:'#F5F5DC', accent_color:'#8B7355', occasion:'office' },
  { id:'pal8', name:'Festival Emerald',  primary_color:'#006400', secondary_color:'#C9A843', accent_color:'#90EE90', occasion:'festival' },
]

export const SEED_TEMPLATES = [
  { id:'t1', name:'Classic Bridal Kanjivaram',  subtitle:'Traditional red silk, heavy gold zari',       badge:'Most Popular', body_pattern_id:'b6',  border_pattern_id:'br3',  pallu_pattern_id:'p6',  palette_id:'pal1' },
  { id:'t2', name:'Festive Banarasi Royal',      subtitle:'Deep blue with peacock brocade pallu',        badge:'Trending',     body_pattern_id:'b11', border_pattern_id:'br6',  pallu_pattern_id:'p7',  palette_id:'pal5' },
  { id:'t3', name:'Contemporary Linen Office',   subtitle:'Minimalist linen, double-line border',        badge:'New',          body_pattern_id:'b16', border_pattern_id:'br7',  pallu_pattern_id:'p9',  palette_id:'pal7' },
  { id:'t4', name:'Rajasthani Bandhani Gala',    subtitle:'Bandhani dots, zigzag border, festive pallu', badge:'Folk Art',     body_pattern_id:'b9',  border_pattern_id:'br9',  pallu_pattern_id:'p8',  palette_id:'pal8' },
  { id:'t5', name:'Zardozi Bridal Midnight',     subtitle:'Star-field body, rose garland, mandala pallu',badge:'Luxury',      body_pattern_id:'b8',  border_pattern_id:'br4',  pallu_pattern_id:'p11', palette_id:'pal5' },
  { id:'t6', name:'Meenakari Festive Jaipur',    subtitle:'Enamel body, lotus chain, sunburst pallu',    badge:'Heritage',     body_pattern_id:'b17', border_pattern_id:'br12', pallu_pattern_id:'p12', palette_id:'pal8' },
]

// ─── QUESTIONNAIRE ────────────────────────────────────────────────────────────
export const QUESTIONS = [
  {
    id: 'occasionAndWearer',
    section: 'Occasion',
    icon: '✨',
    text: 'Who is wearing this, and for what occasion?',
    subtext: 'This shapes richness, formality, and the entire design direction.',
    options: [
      { value:'Bridal - Bride herself',  desc:'Wedding day — maximum richness, bridal weight silk' },
      { value:'Bridal - Family / Guest', desc:'Wedding attendee — festive, not outshining the bride' },
      { value:'Festival / Puja',         desc:'Diwali, Onam, Pongal, temple visits' },
      { value:'Party / Reception',       desc:'Evening celebrations, receptions, get-togethers' },
      { value:'Office / Daily Wear',     desc:'Professional elegance, comfortable for all-day wear' },
    ]
  },
  {
    id: 'fabricAndStyle',
    section: 'Fabric & Heritage',
    icon: '🧵',
    text: 'Which fabric tradition speaks to you?',
    subtext: 'Fabric defines drape, sheen, weight, and cultural identity.',
    options: [
      { value:'Kanchipuram Silk', desc:'Heavyweight silk, stiff drape, temple motifs — South India royalty' },
      { value:'Banarasi Silk',    desc:'Mughal brocade, intricate gold weave, rich North Indian heritage' },
      { value:'Mysore Silk',      desc:'Lightweight silk, smooth drape, subtle sheen — everyday elegance' },
      { value:'Cotton / Linen',   desc:'Breathable, earthy, handloom textures — casual to office' },
      { value:'Georgette / Organza', desc:'Sheer, flowy, party-ready — modern drape, embellished borders' },
    ]
  },
  {
    id: 'bodyAndRichness',
    section: 'Body & Richness',
    icon: '🌺',
    text: 'How rich and detailed should the body design be?',
    subtext: 'Sets the visual weight and complexity of the main fabric area.',
    options: [
      { value:'Plain body, minimal embellishment',      desc:'Clean, quiet body — all attention on border and pallu' },
      { value:'Subtle texture, balanced elegance',      desc:'Light stripes or checks — understated but not bare' },
      { value:'Floral buttas, moderate richness',       desc:'Scattered motifs — tasteful richness without overwhelm' },
      { value:'Temple / Peacock motifs, rich grandeur', desc:'Bold traditional motifs covering most of the body' },
      { value:'Mughal / Geometric, maximum opulence',   desc:'All-over brocade or embroidery — statement-level grandeur' },
    ]
  },
  {
    id: 'borderAndPallu',
    section: 'Border & Pallu',
    icon: '🪡',
    text: 'What style of border and pallu do you prefer?',
    subtext: 'The border frames the body; the pallu is the showpiece draped over the shoulder.',
    options: [
      { value:'Thin gold line, minimal pallu',    desc:'Barely-there border, plain pallu — very restrained' },
      { value:'Double kasavu, clean pallu',       desc:'Two gold bands, light pallu — traditional but subtle' },
      { value:'Temple border, floral pallu',      desc:'Architectural border, lush floral pallu — classical balance' },
      { value:'Peacock border, peacock pallu',    desc:'Matching peacock motifs all round — symmetrical grandeur' },
      { value:'Broad zari border, mughal pallu',  desc:'Wide gold border, ornate Mughal pallu — maximum richness' },
    ]
  },
  {
    id: 'colorAndAccent',
    section: 'Colour',
    icon: '🎨',
    text: 'What colour palette speaks to you?',
    subtext: 'Primary body colour. The AI will select complementary secondary and accent tones.',
    options: [
      { value:'Deep Red / Maroon',      desc:'Classic bridal — auspicious, powerful, traditional' },
      { value:'Royal Blue / Midnight',  desc:'Regal and modern — suits most occasions and complexions' },
      { value:'Forest Green / Emerald', desc:'Fresh and festive — Navratri, Onam, daytime weddings' },
      { value:'Mustard / Turmeric',     desc:'Warm earthy tone — harvest festivals, folk occasions' },
      { value:'Cream / Off-White',      desc:'Soft and luminous — Kerala kasavu, daytime weddings' },
      { value:'Magenta / Pink',         desc:'Vibrant and celebratory — receptions, parties' },
      { value:'Black',                  desc:'Bold and contemporary — evening events, fashion-forward' },
      { value:'Pastel / Soft tones',    desc:'Gentle, romantic — garden parties, day functions' },
    ]
  },
]

// ─── DESIGN MAPPING ───────────────────────────────────────────────────────────
const COLOR_MAP = {
  'Deep Red / Maroon':      { primary:'#8B0000', secondary:'#F5F5DC', accent:'#C9A843' },
  'Royal Blue / Midnight':  { primary:'#191970', secondary:'#C9A843', accent:'#87CEEB' },
  'Forest Green / Emerald': { primary:'#006400', secondary:'#C9A843', accent:'#90EE90' },
  'Mustard / Turmeric':     { primary:'#B8860B', secondary:'#FFF8E1', accent:'#C9A843' },
  'Cream / Off-White':      { primary:'#F5F5DC', secondary:'#C9A843', accent:'#8B6914' },
  'Magenta / Pink':         { primary:'#C2185B', secondary:'#FCE4EC', accent:'#C9A843' },
  'Black':                  { primary:'#1A1A1A', secondary:'#F5F0DC', accent:'#D4AF37' },
  'Pastel / Soft tones':    { primary:'#7B5EA7', secondary:'#FFF9C4', accent:'#C9A843' },
}

const BODY_MAP = {
  'Plain body, minimal embellishment':       'b1',
  'Subtle texture, balanced elegance':       'b2',
  'Floral buttas, moderate richness':        'b4',
  'Temple / Peacock motifs, rich grandeur':  'b6',
  'Mughal / Geometric, maximum opulence':    'b11',
}

const BORDER_PALLU_MAP = {
  'Thin gold line, minimal pallu':    { border:'br7', pallu:'p5'  },
  'Double kasavu, clean pallu':       { border:'br2', pallu:'p9'  },
  'Temple border, floral pallu':      { border:'br3', pallu:'p4'  },
  'Peacock border, peacock pallu':    { border:'br5', pallu:'p3'  },
  'Broad zari border, mughal pallu':  { border:'br6', pallu:'p7'  },
}

const FABRIC_ADJUSTMENTS = {
  'Kanchipuram Silk':   { bodyPush:'b6',  borderPush:'br3', palluPush:'p6'  },
  'Banarasi Silk':      { bodyPush:'b11', borderPush:'br6', palluPush:'p7'  },
  'Mysore Silk':        { bodyPush:null,  borderPush:'br2', palluPush:null  },
  'Cotton / Linen':     { bodyPush:'b2',  borderPush:'br1', palluPush:'p5'  },
  'Georgette / Organza':{ bodyPush:null,  borderPush:'br8', palluPush:'p4'  },
}

const RICHNESS_LAYER = {
  'Plain body, minimal embellishment':    { borderPush:'br7', palluPush:'p5' },
  'Mughal / Geometric, maximum opulence': { borderPush:'br6', palluPush:'p1' },
}

export function buildDesignFromAnswers(answers) {
  const colorKey = answers.colorAndAccent || 'Deep Red / Maroon'
  const colors   = COLOR_MAP[colorKey] || COLOR_MAP['Deep Red / Maroon']

  const bodyKey  = answers.bodyAndRichness || 'Plain body, minimal embellishment'
  let body       = BODY_MAP[bodyKey] || 'b1'

  const bpKey    = answers.borderAndPallu || 'Double kasavu, clean pallu'
  const bp       = BORDER_PALLU_MAP[bpKey] || { border:'br2', pallu:'p9' }
  let border     = bp.border
  let pallu      = bp.pallu

  const fabKey   = answers.fabricAndStyle || ''
  const fabAdj   = Object.entries(FABRIC_ADJUSTMENTS).find(([k]) => fabKey.startsWith(k))
  if (fabAdj) {
    const adj = fabAdj[1]
    if (adj.bodyPush   && body  === 'b1') body   = adj.bodyPush
    if (adj.borderPush) border = adj.borderPush
    if (adj.palluPush  && pallu === 'p9') pallu  = adj.palluPush
  }

  const richAdj = RICHNESS_LAYER[bodyKey]
  if (richAdj) {
    if (richAdj.borderPush) border = richAdj.borderPush
    if (richAdj.palluPush)  pallu  = richAdj.palluPush
  }

  const occ = answers.occasionAndWearer || ''
  if (occ === 'Bridal - Bride herself') {
    if (body === 'b1' || body === 'b2') body = 'b6'
    border = 'br6'; pallu = 'p1'
  }
  if (occ === 'Office / Daily Wear') {
    if (border === 'br6') border = 'br7'
    if (pallu  === 'p1')  pallu  = 'p5'
    if (body   === 'b11') body   = 'b2'
  }

  const secondary = colorKey === 'Cream / Off-White' ? '#C9A843' : colors.secondary
  return { primaryColor:colors.primary, secondaryColor:secondary, accentColor:colors.accent, bodyPattern:body, borderPattern:border, palluPattern:pallu }
}

export function generateRecommendations(answers) {
  const occ  = answers.occasionAndWearer || ''
  const fab  = answers.fabricAndStyle    || ''
  const body = answers.bodyAndRichness   || ''

  const primaryDesign  = buildDesignFromAnswers(answers)
  const varA = { ...answers, fabricAndStyle: fab.includes('Kanchipuram') ? 'Banarasi Silk' : fab.includes('Banarasi') ? 'Kanchipuram Silk' : fab.includes('Cotton') ? 'Mysore Silk' : 'Kanchipuram Silk' }
  const variantA_design = buildDesignFromAnswers(varA)
  const varB = { ...answers }
  if (body.includes('maximum') || body.includes('rich grandeur')) {
    varB.bodyAndRichness = 'Floral buttas, moderate richness'
    varB.borderAndPallu  = 'Temple border, floral pallu'
  } else {
    varB.bodyAndRichness = 'Temple / Peacock motifs, rich grandeur'
    varB.borderAndPallu  = 'Peacock border, peacock pallu'
  }
  const variantB_design = buildDesignFromAnswers(varB)

  const isBridal = occ.includes('Bridal')
  if (isBridal && fab.includes('Kanchipuram')) return [
    { name:'Classic Kanchipuram Bridal',  score:97, budget:'₹40K–₹1.2L', description:'Heavy temple-motif silk with grand zari border.', design:primaryDesign  },
    { name:'Banarasi Grand Bridal',       score:84, budget:'₹35K–₹1L',   description:'Mughal brocade richness with intricate gold weave.', design:variantA_design },
    { name:'Rich Floral Silk',            score:76, budget:'₹20K–₹60K',  description:'Softer floral pallu with peacock border.', design:variantB_design },
  ]
  if (isBridal && fab.includes('Banarasi')) return [
    { name:'Banarasi Grand Bridal',       score:97, budget:'₹35K–₹1L',   description:'Mughal brocade splendour with deep gold zari weave.', design:primaryDesign  },
    { name:'Kanchipuram Bridal',          score:85, budget:'₹40K–₹1.2L', description:'South Indian temple-motif silk.', design:variantA_design },
    { name:'Designer Floral Bridal',      score:74, budget:'₹25K–₹70K',  description:'Lush floral pallu on silk base.', design:variantB_design },
  ]
  if (occ.includes('Festival')) return [
    { name:'Kerala Kasavu Festival',      score:94, budget:'₹5K–₹20K',   description:'Cream and gold kasavu — quintessential festival saree.', design:primaryDesign  },
    { name:'Silk Festive Elegance',       score:86, budget:'₹12K–₹35K',  description:'Vibrant silk with peacock motifs.', design:variantA_design },
    { name:'Chanderi Festival',           score:78, budget:'₹8K–₹22K',   description:'Lightweight with gold zari.', design:variantB_design },
  ]
  if (occ.includes('Office')) return [
    { name:'Crisp Linen Office Classic',  score:95, budget:'₹3K–₹12K',   description:'Minimal border, clean body — professional elegance.', design:primaryDesign  },
    { name:'Mysore Silk Light',           score:86, budget:'₹8K–₹25K',   description:'Lightweight silk for office to evening.', design:variantA_design },
    { name:'Handloom Cotton',             score:79, budget:'₹2K–₹8K',    description:'Artisan-woven — comfortable for long hours.', design:variantB_design },
  ]
  if (occ.includes('Party')) return [
    { name:'Georgette Evening Drape',     score:93, budget:'₹6K–₹20K',   description:'Flowy georgette with embellished border.', design:primaryDesign  },
    { name:'Organza Shimmer',             score:85, budget:'₹8K–₹25K',   description:'Sheer organza with delicate embroidery.', design:variantA_design },
    { name:'Designer Printed Silk',       score:77, budget:'₹10K–₹30K',  description:'Contemporary print silk.', design:variantB_design },
  ]
  return [
    { name:(fab||'Silk')+' Classic',     score:90, budget:'₹10K–₹35K',  description:'Crafted from your choices — a balanced saree.', design:primaryDesign  },
    { name:'Heritage Silk Variant',      score:80, budget:'₹15K–₹50K',  description:'Same palette in a different silk heritage.', design:variantA_design },
    { name:'Contemporary Alternative',  score:72, budget:'₹8K–₹25K',   description:'A lighter, more relaxed version.', design:variantB_design },
  ]
}

// Pattern human-readable names (used in SavePanel)
export const PATTERN_NAMES = {
  b1:'Plain', b2:'Stripes', b3:'Checks', b4:'Floral Butta', b5:'Ikat Diamond',
  b6:'Temple Motifs', b7:'Peacock Grid', b8:'Zari Dots', b9:'Bandhani',
  b10:'Leheriya', b11:'Banarasi Jaal', b12:'Geometric', b13:'Lotus',
  b14:'Warli', b15:'Kashmiri', b16:'Pinstripe', b17:'Meenakari',
  br1:'Single Kasavu', br2:'Double Kasavu', br3:'Temple', br4:'Mango',
  br5:'Peacock', br6:'Broad Zari', br7:'Thin Gold', br8:'Floral Chain',
  br9:'Geo Steps', br10:'Wave', br11:'Diamond', br12:'Lotus Row',
  p1:'Rich Zari', p2:'Contrast', p3:'Peacock', p4:'Floral', p5:'Minimal',
  p6:'Gopuram Panel', p7:'Kadwa Jaal Floral', p8:'Butta Scatter', p9:'Stripe',
  p10:'Vines', p11:'Kashmiri', p12:'Geometric',
}