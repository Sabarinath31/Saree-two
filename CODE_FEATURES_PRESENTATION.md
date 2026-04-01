# 🧵 AI Saree Designer Studio — Code Features Presentation Guide

> This document explains the KEY technical features of the project with actual code snippets.
> Use this for your presentation to explain "how the code does what it does."

---

## FEATURE 1: Custom Supabase REST Client (No SDK)
**File:** `src/data.jsx` | Lines 17–68

Instead of installing the full Supabase JS SDK, the project uses a hand-written fetch-based REST client. This keeps the bundle size small.

```js
// Headers factory — injects API key and JWT auth token
const _h = (token) => ({
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${token || SUPABASE_KEY}`,
  'Prefer': 'return=representation'
})

// The full Supabase client in 8 functions
export const sb = {
  signUp:  async (email, password, role = 'customer') => { /* POST /auth/v1/signup */ },
  signIn:  async (email, password) => { /* POST /auth/v1/token?grant_type=password */ },
  signOut: async (token) => { /* POST /auth/v1/logout */ },
  select:  async (table, filters='', token) => { /* GET /rest/v1/{table}?{filters} */ },
  insert:  async (table, data, token) => { /* POST /rest/v1/{table} */ },
  update:  async (table, data, filters, token) => { /* PATCH */ },
  delete:  async (table, filters, token) => { /* DELETE */ }
}
```

**Why this matters:** No `npm install @supabase/supabase-js` needed. All backend communication is done with the browser's native `fetch` API.

---

## FEATURE 2: Role-Based Authentication & Session Persistence
**File:** `src/App.jsx` | Lines 66–130

When a user logs in, the JWT token and user object are saved to `sessionStorage`. On reload, the app restores the session automatically.

```js
// Restore session on app load
useEffect(() => {
  const t = sessionStorage.getItem('sb_token')
  const u = sessionStorage.getItem('sb_user')
  if (t && u) {
    const parsedUser = JSON.parse(u)
    setToken(t); setUser(parsedUser)
    setUserRole(parsedUser?.user_metadata?.role || 'customer')  // role from Supabase user_metadata
  }
  setAuthLoading(false)
}, [])

// On sign-out: clear everything
const handleSignOut = async () => {
  if (token) await sb.signOut(token)
  sessionStorage.removeItem('sb_token')
  sessionStorage.removeItem('sb_user')
  setUser(null); setToken(null); setUserRole('customer')
}
```

**Key point:** Role is set at signup time inside `user_metadata.role`. The app reads this on login to decide which UI to show — Customer Home vs Designer Dashboard.

---

## FEATURE 3: Supabase Fallback to Seed Data
**File:** `src/App.jsx` | Lines 79–111

If Supabase is unreachable or the tables are empty, the app falls back to hardcoded seed data silently.

```js
// Try to load from Supabase, fallback to seeds
useEffect(() => {
  const loadFromSupabase = async () => {
    try {
      const [pats, pals, tmps] = await Promise.all([
        sb.select('design_patterns', 'order=id.asc'),
        sb.select('color_palettes', 'order=id.asc'),
        sb.select('ai_design_templates', 'order=id.asc'),
      ])
      if (Array.isArray(pats) && pats.length > 0) setDbPatterns(pats)
      // ... same for palettes and templates
    } catch(e) {
      console.warn('Supabase load failed, using seed data:', e)
    }
  }
  loadFromSupabase()
}, [])

// Merge: database takes priority, seeds as fallback
const basePatterns = dbPatterns.length > 0 ? dbPatterns : SEED_PATTERNS
```

**Why this matters:** The app works even offline or without a Supabase connection. The seed data in `data.jsx` is a full, functional dataset.

---

## FEATURE 4: Design Mapping — Answers to Pattern IDs
**File:** `src/data.jsx` | Lines 212–293

The core intelligence that converts questionnaire answers into a real design. It uses lookup tables and override rules.

```js
const COLOR_MAP = {
  'Deep Red / Maroon':  { primary:'#8B0000', secondary:'#F5F5DC', accent:'#C9A843' },
  'Royal Blue / Midnight': { primary:'#191970', secondary:'#C9A843', accent:'#87CEEB' },
  // ... 8 colors total
}

const BODY_MAP = {
  'Plain body, minimal embellishment':     'b1',
  'Subtle texture, balanced elegance':     'b2',
  'Temple / Peacock motifs, rich grandeur':'b6',
  'Mughal / Geometric, maximum opulence':  'b11',
}

export function buildDesignFromAnswers(answers) {
  let body   = BODY_MAP[answers.bodyAndRichness]
  let border = BORDER_PALLU_MAP[answers.borderAndPallu].border
  let pallu  = BORDER_PALLU_MAP[answers.borderAndPallu].pallu

  // Fabric overrides (e.g. Kanchipuram always gets temple motif)
  const fabAdj = FABRIC_ADJUSTMENTS[answers.fabricAndStyle]
  if (fabAdj?.bodyPush && body === 'b1') body = fabAdj.bodyPush

  // Occasion overrides (bridal always gets max richness)
  if (answers.occasionAndWearer === 'Bridal - Bride herself') {
    body = 'b6'; border = 'br6'; pallu = 'p1'
  }
  if (answers.occasionAndWearer === 'Office / Daily Wear') {
    if (border === 'br6') border = 'br7'  // downgrade heavy border for office
    if (body === 'b11')   body = 'b2'    // downgrade mughal to stripes
  }

  return { primaryColor, secondaryColor, accentColor, bodyPattern:body, borderPattern:border, palluPattern:pallu }
}
```

**Key insight:** The layered override system (color → body → fabric → richness → occasion) ensures that bridal designs always become maximum-richness and office designs become minimal, regardless of other choices.

---

## FEATURE 5: Gemini AI Text-to-Design
**File:** `src/pages.jsx` | Lines 30–80

The app sends the user's text prompt to Google Gemini and asks for a structured JSON response specifying pattern IDs.

```js
const generateFromPrompt = async () => {
  const sysPrompt = `You are a saree design expert. Return ONLY valid JSON:
{"recommendations":[
  {"name":"...","description":"...","matchScore":90,
   "design":{"primaryColor":"#hex","bodyPattern":"b6","borderPattern":"br3","palluPattern":"p6"}}
], ...}
Pattern IDs — body: b1-b17, border: br1-br12, pallu: p1-p12. Return exactly 3 recommendations.`

  const res = await fetch(
    `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role:'user', parts:[{ text: sysPrompt + '\n\n' + prompt }] }],
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
      })
    }
  )
  const data = await res.json()
  const text   = data.candidates[0].content.parts[0].text
  const clean  = text.replace(/```json|```/g, '').trim()  // strip markdown
  const parsed = JSON.parse(clean)
  setResults(parsed)
}
```

**Key technique:** The system prompt is engineered to constrain Gemini to only return valid JSON with the specific pattern IDs the app understands. The `replace(/```json|```/g, '')` strips any markdown that Gemini adds around the JSON.

**Fallback (no API key):** `promptFallback()` does keyword matching on the text — `includes('peacock')` → `b7`, `includes('blue')` → `#191970`, etc. Zero API dependency.

---

## FEATURE 6: Gemini Vision — Image Analysis
**File:** `src/components.jsx` | Lines 449–517

The user uploads a saree photo. Gemini Vision reads it and returns colors + pattern IDs.

```js
const analyzeImage = async () => {
  // Send image as base64 multimodal input
  const res = await fetch(GEMINI_API_URL + '/' + GEMINI_MODEL + ':generateContent?key=' + GEMINI_KEY, {
    method: 'POST',
    body: JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: mediaType, data: base64Data } },  // image part
          { text: sysPrompt }  // instruction part
        ]
      }],
      generationConfig: { maxOutputTokens: 1000, temperature: 0.15 }  // low temp = precise
    })
  })
  // Parse and return design config
  const parsed = JSON.parse(clean)
  setResult(parsed)
  // result.designConfig has primaryColor, bodyPattern, borderPattern, palluPattern
}
```

**Fallback — Pixel Color Sampling:**
```js
const sampleImageColors = (img) => {
  const canvas = document.createElement('canvas')
  canvas.width = 120; canvas.height = 120
  ctx.drawImage(img, 0, 0, 120, 120)
  const data = ctx.getImageData(0, 0, 120, 120).data

  // Sample 3 horizontal bands:
  // Top third   → pallu color
  // Middle third → body color (dominant)
  // Bottom third → border color
  const palluColor  = avgColor(0, 40)
  const bodyColor   = avgColor(40, 80)
  const borderColor = avgColor(80, 120)

  // Map color hue to patterns using HSL conversion
  const hsl   = hexToHsl(primary)
  const isWarm = hsl.h < 60 || hsl.h > 300  // red/magenta hues
  const bodySet = isWarm ? ['b4','b6','b8','b13','b17'] : ['b11','b7','b15','b5','b12']
}
```

**Key insight:** Even without any API key, the app intelligently reads actual pixel colors from the uploaded image, separates pallu/body/border zones, and selects culturally appropriate patterns based on warm vs cool hues.

---

## FEATURE 7: Voice Questionnaire (Web Speech API)
**File:** `src/components.jsx` | Lines 34–307

The app speaks questions aloud and can listen to voice answers.

```js
// Text-to-speech: app speaks each question
const speak = useCallback((text) => {
  const u = new SpeechSynthesisUtterance(text)
  u.rate = 0.88; u.pitch = 1.05
  u.onstart = () => setIsSpeaking(true)
  u.onend   = () => setIsSpeaking(false)
  window.speechSynthesis.speak(u)
}, [])

// Speak question every time the question index changes
useEffect(() => {
  if (q) { speak(q.text) }
}, [currentIdx, speak])

// Voice recognition: listen to user's answer
const startListening = () => {
  const rec = new SpeechRecognition()
  rec.continuous = false; rec.lang = 'en-IN'  // Indian English
  rec.onresult = (e) => {
    const t = Array.from(e.results).map(r => r[0].transcript).join('')
    // Match spoken word to the closest option
    const match = q.options.find(o =>
      t.toLowerCase().includes(o.value.toLowerCase().split(' ')[0])
    )
    if (match) handleAnswer(match.value)
  }
  rec.start()
}
```

**Dual input:** User can tap the mic button (push-to-talk) OR click on one of the displayed option cards. Both trigger `handleAnswer()` which advances to the next question and stores the answer.

**Visual feedback:** While the AI avatar is speaking, animated waveform bars (CSS `@keyframes waveform`) show audio activity.

---

## FEATURE 8: SVG Pattern Rendering Engine
**File:** `src/canvas.jsx` | Lines 14–726

Every saree pattern is hand-coded as SVG in React JSX. No external pattern library is used.

```js
// Example: b6 — Temple Motifs (Kanchipuram 8-petal medallion)
b6: <>
  <rect width={W} height={H} fill={c} />
  {Array.from({length: Math.ceil(W/54)}, (_, x) =>
    Array.from({length: Math.ceil(H/54)}, (_, y) => {
      const cx = x*54 + (y%2===0 ? 27 : 54)  // offset alternate rows
      const cy = y*54 + 27
      return (
        <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          <circle r="10" fill="none" stroke={a} strokeWidth="1.2" opacity="0.65"/>
          {[0,45,90,135,180,225,270,315].map(ang => (
            <ellipse key={ang}
              cx={(Math.cos((ang-90)*Math.PI/180)*5.5).toFixed(1)}
              cy={(Math.sin((ang-90)*Math.PI/180)*5.5).toFixed(1)}
              rx="2.2" ry="3.8" fill={a} opacity="0.7"
              transform={`rotate(${ang},...)`}
            />
          ))}
          <circle r="3" fill={a} opacity="0.9"/>   {/* center */}
          <circle r="1.5" fill={c} opacity="1"/>   {/* inner */}
          <circle r="0.6" fill={aLight} opacity="1"/> {/* highlight */}
        </g>
      )
    })
  ).flat()}
</>
```

**How it works:**
- Each pattern takes `color` (primary) and `accentColor` (zari/gold) as props
- `hexLight()` and `hexDark()` utility functions create lighter/darker shade variants
- Patterns tile across the full canvas using `Array.from({length: Math.ceil(W/tileSize)})`
- Alternate rows are offset by half a tile for realistic textile layouts

**SVG Filters:** The canvas uses SVG filter effects for realism:
- `feTurbulence` + `feBlend` = fabric weave texture (fractal noise subtle overlay)
- `linearGradient` with opacity stops = silk sheen, fabric fold shadows, vignette

---

## FEATURE 9: SareeCanvas Layout System
**File:** `src/canvas.jsx` | Lines 800+

The saree is composed of multiple `PatternRenderer` sections stacked vertically.

```js
// Saree = Pallu + 2× Border + Body + Blouse (side panel)
<div style={{ display:'flex', gap: 8 }}>

  {/* Main saree column */}
  <div style={{ display:'flex', flexDirection:'column' }}>
    {/* PALLU section */}
    <PatternRenderer patternId={palluPattern} color={primary} accentColor={accent}
      width={sareeW} height={palluH} svgInstanceKey="pallu" />

    {/* BORDER (top) */}
    <PatternRenderer patternId={borderPattern}
      width={sareeW} height={borderH} svgInstanceKey="border_top" />

    {/* BODY section */}
    <PatternRenderer patternId={bodyPattern}
      width={sareeW} height={bodyH} svgInstanceKey="body" />

    {/* BORDER (bottom) */}
    <PatternRenderer patternId={borderPattern}
      width={sareeW} height={borderH} svgInstanceKey="border_bot" />
  </div>

  {/* BLOUSE side panel */}
  <div>
    <PatternRenderer patternId={blousePattern}
      width={blouseW} height={blouseH} svgInstanceKey="blouse" />
  </div>
</div>
```

**Key detail:** Each `PatternRenderer` gets a unique `svgInstanceKey` so that SVG `<defs>` IDs (gradients, filters) don't clash between sections in the same DOM page.

---

## FEATURE 10: PNG Export (SVG → Canvas → PNG)
**File:** `src/canvas.jsx` | `exportSareeAsPNG` function

```js
export function exportSareeAsPNG(design, filename) {
  // 1. Render the React component to a static HTML string
  const svgString = renderToStaticMarkup(
    <SareeCanvas design={design} scale={1} />
  )

  // 2. Create a Blob from the SVG string
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url  = URL.createObjectURL(blob)

  // 3. Load SVG into an Image element
  const img = new Image()
  img.onload = () => {
    // 4. Draw onto an HTML canvas
    const canvas = document.createElement('canvas')
    canvas.width  = img.width
    canvas.height = img.height
    canvas.getContext('2d').drawImage(img, 0, 0)
    URL.revokeObjectURL(url)

    // 5. Download as PNG
    const a = document.createElement('a')
    a.href     = canvas.toDataURL('image/png')
    a.download = filename + '.png'
    a.click()
  }
  img.src = url
}
```

**Why `renderToStaticMarkup`?** This is from `react-dom/server` and converts a React component tree into a plain HTML/SVG string. It allows the live component to be "screenshot" as a PNG without any third-party library.

---

## FEATURE 11: Raster-to-SVG Pattern Conversion
**File:** `src/patternEditor.jsx` | Lines 19–61

When a user uploads a JPG or PNG as a pattern, it's wrapped inside an SVG `<image>` tag. This ensures it renders consistently with the rest of the SVG canvas.

```js
function rasterToSvgDataUrl(dataUrl, removeBg = false) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const W = img.naturalWidth, H = img.naturalHeight
      let finalDataUrl = dataUrl

      // Optional: strip white/near-white background pixels
      if (removeBg) {
        const canvas = document.createElement('canvas')
        canvas.width = W; canvas.height = H
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, W, H)
        const d = imageData.data
        for (let i = 0; i < d.length; i += 4) {
          // If R, G, B all > 220 (near white) → make transparent
          if (d[i] > 220 && d[i+1] > 220 && d[i+2] > 220) d[i+3] = 0
        }
        ctx.putImageData(imageData, 0, 0)
        finalDataUrl = canvas.toDataURL('image/png')
      }

      // Wrap in SVG <image> tag
      const svg = `<svg xmlns="..." width="${W}" height="${H}">
        <image x="0" y="0" width="${W}" height="${H}" href="${finalDataUrl}" />
      </svg>`

      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    }
    img.src = dataUrl
  })
}
```

**The remove-background trick:** By iterating over every pixel and setting `alpha = 0` for near-white pixels, pattern images with white backgrounds become transparent overlays when placed on the colored saree canvas.

---

## FEATURE 12: Live Pattern Overlay (PatternOverlay)
**File:** `src/patternEditor.jsx` | Lines 171–218

When a user adjusts an uploaded pattern, the editor shows a real-time overlay on the saree preview using SVG `<pattern>` tiling.

```js
function PatternOverlay({ pattern, scale }) {
  const tile = Math.max(12, 120 / (pattern.density * pattern.zoom))  // tile size
  const pw   = Math.max(12, tile * pattern.spacing)  // with spacing

  return (
    <svg width={sw} height={totalH} style={{ position:'absolute', left:0, top:0 }}>
      <defs>
        <pattern id={pid} patternUnits="userSpaceOnUse" width={pw} height={pw}
          patternTransform={`translate(${x} ${y}) rotate(${rotation})`}>

          <image href={pattern.imageDataUrl} width={tile} height={tile} />

          {/* Mirror mode: flip alternate columns */}
          {pattern.repeatStyle === 'mirror' && (
            <image href={pattern.imageDataUrl} x={tile}
              transform={`scale(-1,1) translate(${-tile*2},0)`} />
          )}

          {/* Offset mode: brick pattern (half-offset) */}
          {pattern.repeatStyle === 'offset' && (
            <image href={pattern.imageDataUrl} x={tile/2} y={tile/2} />
          )}
        </pattern>
      </defs>
      <rect x="0" y={top} width={sw} height={h}
        fill={`url(#${pid})`} opacity={pattern.opacity} />
    </svg>
  )
}
```

**How it works:** SVG's `<pattern>` element natively tiles an image across any region. The `patternTransform` attribute allows rotation and offset of the entire tile grid with a single attribute change — making real-time slider updates instantaneous.

---

## FEATURE 13: Design Status Workflow
**File:** `src/pages.jsx` | Lines 350–356

Saved designs follow a multi-stage approval workflow similar to a production pipeline.

```js
const STATUS_MAP = {
  draft:      { label:'Draft',            cls:'status-draft'      },
  submitted:  { label:'Submitted',        cls:'status-submitted'  },
  review:     { label:'Under Review',     cls:'status-review'     },
  approved:   { label:'Approved',         cls:'status-approved'   },
  production: { label:'Production Ready', cls:'status-production' },
}
```

Customers save designs as `draft`. They submit for review. Designers can approve and move to production. The status is stored in the `saved_designs` table and color-coded in the UI via CSS classes.

---

## FEATURE 14: Theme as a Code Module
**File:** `src/theme.jsx` | Lines 1–225

The entire design system is a single JavaScript object. No CSS files.

```js
export const T = {
  bg:         '#0E0C09',  // near-black parchment
  surface:    '#1A1710',  // dark surface panel
  gold:       '#C9A843',  // metallic gold (zari)
  goldLight:  '#E8C97A',  // lighter gold highlight
  text:       '#F0E6C8',  // warm parchment text
  textMid:    '#B8A878',  // mid tone text
}

// GlobalStyles injects everything: fonts, animations, utility classes
export const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/...');

    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position:  200% 0; }
    }

    .shimmer-text {
      background: linear-gradient(90deg, ${T.goldDark}, ${T.goldLight}, ${T.gold});
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 3s linear infinite;
    }

    .btn-primary {
      background: linear-gradient(135deg, ${T.goldDark}, ${T.gold});
      color: #0E0C09;
      /* ... */
    }
  `}</style>
)
```

**Why CSS-in-JS?** Embedding the design token values (`T.gold`, `T.goldDark`) directly in the CSS string means the CSS and component code stay in sync — one source of truth.

---

## FEATURE 15: Customer Design Library Merge
**File:** `src/App.jsx` | Lines 24–64

Customers can upload custom patterns. These are stored in `saved_designs` and extracted as pattern entries that get merged into the live pattern grid.

```js
const refreshLibraryData = async () => {
  // Load all saved designs for this user
  const mine = await sb.select('saved_designs',
    `user_id=eq.${user.id}&order=created_at.desc`, token)

  // Extract uploaded pattern metadata from each saved design's design_data.uploadMeta
  const uploadPats = mine.flatMap((d) => {
    const u = d?.design_data?.uploadMeta
    if (!u?.file_data_url || !u?.custom_id) return []
    return [{
      id:             u.custom_id,
      name:           d.name || 'My Upload',
      saree_part:     u.part,
      style_type:     'uploaded',
      image_data_url: u.file_data_url,
      editor:         u.editor,
    }]
  })

  // Deduplicate (in case of duplicate saves)
  const seen = new Set()
  const uniq = uploadPats.filter(p => !seen.has(p.id) && seen.add(p.id))

  setDbUserUploadPatterns(uniq)
}

// Merge customer uploads into the global pattern list
const patterns = userRole === 'customer'
  ? [...basePatterns, ...dbUserUploadPatterns.filter(p => !basePatterns.some(b => b.id === p.id))]
  : basePatterns
```

**Smart merge:** Customer's personal uploads are appended to the base library without duplicating any patterns that already exist (checked by ID). This combined list is then passed down to the DesignerCanvas as a single unified `patterns` prop.

---

## Summary: Key Technical Choices

| Choice | Rationale |
|---|---|
| **No Supabase SDK** | Smaller bundle; full control over fetch calls |
| **SVG for patterns** | Resolution-independent; editable with code; easy to animate |
| **Web Speech API** | No external library; works in Chrome natively |
| **Gemini 2.5 Flash** | Fast, cheap, multimodal (text + vision) in one API |
| **CSS-in-JS via GlobalStyles** | Design tokens in JS, not separate CSS files |
| **renderToStaticMarkup for PNG export** | Converts React component to SVG string for canvas drawing |
| **Session storage for auth** | Simple; cleared on tab close; no cookie management |
| **Seed data fallback** | App works without internet or database connection |
