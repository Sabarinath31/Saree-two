# 🧵 AI Saree Designer Studio — Full Project Overview

---

## 1. What Is This Project?

**AI Saree Designer Studio** is a full-stack web application that allows customers and designers to **design traditional Indian sarees digitally using AI**. It combines:

- A **visual saree design canvas** (rendered entirely in SVG in the browser)
- An **AI-powered design assistant** powered by **Google Gemini** (text prompts + image analysis)
- A **voice questionnaire** system that speaks questions and listens to answers
- A **pattern and template library** stored in **Supabase** (PostgreSQL cloud database)
- A **two-role user system** — Customers (design/save) and Designers/Admins (manage the library)

The application is deployed and accessible as a modern progressive web app (PWA-ready via Vite).

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 (with JSX) |
| Build Tool | Vite 5 |
| Styling | Vanilla CSS-in-JS (inline styles + global CSS component) |
| Typography | Google Fonts — Cormorant Garamond + Jost |
| Backend / Database | Supabase (PostgreSQL + Auth + REST API) |
| AI Text Generation | Google Gemini 2.5 Flash API |
| AI Image Analysis | Google Gemini Vision API |
| SVG Rendering | React + SVG (no canvas library) |
| PNG Export | HTML Canvas API |
| Voice Input | Web Speech API (SpeechRecognition) |
| Text-to-Speech | Web Speech API (SpeechSynthesis) |
| Deployment | Vercel |

---

## 3. Project File Structure

```
Saree-two/
├── index.html              ← HTML shell (single page app)
├── vite.config.js          ← Vite config with React plugin
├── package.json            ← Dependencies: React 18, Vite 5
├── vercel.json             ← Deployment config (SPA routing)
├── .env                    ← API keys (Gemini, etc.)
└── src/
    ├── main.jsx            ← React entry point
    ├── App.jsx             ← Root component, page router, auth state
    ├── theme.jsx           ← Design tokens + GlobalStyles component
    ├── data.jsx            ← Supabase client, seed data, AI logic
    ├── components.jsx      ← AuthPage, CustomerHome, DesignerCanvas,
    │                          VoiceQuestionnaire, ImageUploadPage,
    │                          CustomerDesignUploadPage, Notification
    ├── pages.jsx           ← AIModePage, MyDesignsPage, DesignerDashboard, TopNav
    ├── canvas.jsx          ← PatternRenderer (50 SVG patterns), SareeCanvas,
    │                          exportSareeAsPNG, MannequinCanvas
    └── patternEditor.jsx   ← UploadPattern, PatternEditor, InlinePatternEditor,
                               CustomerUploadWizard, ControlPanel
```

---

## 4. Application Pages and User Flows

### 4.1 Authentication Page (AuthPage in components.jsx)
- Sign In / Sign Up with two roles: Customer and Designer
- Role is stored in Supabase `user_metadata.role`
- On successful login, JWT token is saved to `sessionStorage`
- On desktop: shows a live saree canvas preview on the left side

### 4.2 Customer Home Page (CustomerHome in components.jsx)
- Shows featured templates (from Supabase `ai_design_templates` table)
- Quick action cards: AI Mode, Image Upload, Upload Pattern, My Designs
- Shows featured palette swatches

### 4.3 AI Mode Page (AIModePage in pages.jsx)
Two sub-modes:
- **Voice Questionnaire** — 5 guided questions, spoken aloud to the user
- **Text Prompt** — free-text description generates a saree via Gemini AI

### 4.4 Designer Canvas (DesignerCanvas in components.jsx)
- Full-screen interactive saree editor
- Left panel: Pattern library filtered by section (Body / Border / Pallu / Blouse)
- Right panel: Color pickers (primary, secondary, accent)
- Center: Live SVG saree preview
- Save design to Supabase, export as PNG, submit for review

### 4.5 My Designs / Catalogue (MyDesignsPage in pages.jsx)
- Grid of all saved designs
- Search + filter by status (Draft, Submitted, Under Review, Approved, Production)
- Click to open detail modal with full saree preview

### 4.6 Image Upload Page (ImageUploadPage in components.jsx)
- Upload a photo of a saree (JPG/PNG/WEBP)
- Gemini Vision analyzes it → extracts colors and maps to pattern IDs
- Falls back to pixel-sampling if no API key

### 4.7 Customer Design Upload (CustomerUploadWizard in patternEditor.jsx)
- 3-step wizard: Upload → Adjust → Save
- Converts raster (JPG/PNG) to SVG for rendering consistency
- Adjustable: opacity, density, zoom, spacing, rotation, repeat style

### 4.8 Designer Dashboard / Admin CMS (DesignerDashboard in pages.jsx)
- Tab 1 — Patterns: View, edit, delete, download patterns; upload new image patterns
- Tab 2 — Palettes: View all color palettes
- Tab 3 — Templates: Create, edit, delete saree templates

---

## 5. Database Schema (Supabase Tables)

| Table | Purpose |
|---|---|
| `design_patterns` | All pattern definitions (id, name, saree_part, style_type, richness_level, tags, image_data_url) |
| `color_palettes` | Color palettes (id, name, primary_color, secondary_color, accent_color, occasion) |
| `ai_design_templates` | Preset saree templates (id, name, body_pattern_id, border_pattern_id, pallu_pattern_id, palette_id) |
| `saved_designs` | User-saved designs with full design_data JSON, status workflow |

---

## 6. Core Features

### 6.1 SVG Pattern Rendering Engine
- PatternRenderer in canvas.jsx contains 50 hand-coded SVG patterns
- 17 body patterns (b1-b17), 12 border patterns (br1-br12), 12 pallu patterns (p1-p12)
- Each pattern is a React JSX fragment that draws using SVG primitives
- SVG defs define reusable gradients: silk sheen, zari shimmer, weave texture filter

### 6.2 Saree Canvas Layout
SareeCanvas lays out the saree as a vertical column:
- [Label] Pallu section → [Label] Border → [Label] Body → Border → [Blouse panel beside]
- Each section renders its PatternRenderer at the right dimensions
- A fabric fold gradient and vignette overlay is applied for realism

### 6.3 AI Text-to-Design (Gemini)
- Sends a structured system prompt + user text to gemini-2.5-flash
- Response: JSON with 3 recommendations, each with colors + pattern IDs
- Fallback: keyword matching in promptFallback() — works without any API key

### 6.4 AI Image Analysis (Gemini Vision)
- Sends image as base64 + expert prompt to Gemini Vision
- Extracts: detected style, colors, similar styles, design config
- Fallback: pixel sampling using HTML Canvas to extract dominant colors

### 6.5 Voice Questionnaire
- Uses SpeechRecognition API for voice input
- Uses SpeechSynthesis API to speak each question aloud
- 5 questions: Occasion, Fabric, Body Richness, Border & Pallu, Color
- Answers are mapped via buildDesignFromAnswers() to actual pattern IDs

### 6.6 Design Mapping Logic (data.jsx)
Maps answers → pattern IDs via lookup tables:
- COLOR_MAP → hex colors
- BODY_MAP → body pattern ID
- BORDER_PALLU_MAP → border + pallu IDs
- FABRIC_ADJUSTMENTS → override patterns per fabric
- Occasion overrides (bridal/office) as final step

### 6.7 Custom Supabase Client (data.jsx)
- Lightweight REST client using native fetch() — no Supabase SDK
- Functions: signUp, signIn, signOut, select, insert, update, delete
- Auth header: Bearer JWT token for authenticated requests

### 6.8 PNG Export
- exportSareeAsPNG() uses renderToStaticMarkup to serialize the React SVG to string
- Creates a Blob URL, loads into an img element, draws on canvas, downloads

### 6.9 Theme System (theme.jsx)
- Single T object with all design tokens
- GlobalStyles component injects CSS: Google Fonts, keyframe animations, reusable classes

### 6.10 Pattern Upload System
- rasterToSvgDataUrl() converts JPG/PNG → SVG image wrapper
- removeBg toggle: strips near-white pixels using canvas pixel manipulation
- Repeat styles: Grid, Mirror (flipped tiles), Offset (brick pattern)

---

## 7. Seed Data Strategy
- Falls back to hardcoded SEED_PATTERNS, SEED_PALETTES, SEED_TEMPLATES if Supabase is empty
- On load: fetches from Supabase in parallel via Promise.all()
- Customer's uploaded patterns are merged into the live pattern list per session

---

## 8. Design and Aesthetic Philosophy

The application uses a Dark Antique / Luxury Heritage theme:
- Background: Near-black parchment (#0E0C09)
- Gold accent: Metallic gold (#C9A843) — inspired by zari thread
- Typography: Cormorant Garamond (editorial serif) + Jost (clean sans-serif)
- Animations: Shimmer text, spinning loader, pulse, waveform bars for voice
- Card styles with subtle gold border glows

---

## 9. User Roles Summary

| Feature | Customer | Designer (Admin) |
|---|---|---|
| Design sarees on canvas | Yes | Yes |
| AI Mode (text and voice) | Yes | Yes |
| Upload image for analysis | Yes | Yes |
| Upload custom patterns | Yes (personal library) | Yes (shared library) |
| Manage patterns/palettes/templates | No | Yes |
| View all users' designs | No | Yes |
| Download pattern PNGs | No | Yes |

---

## 10. Deployment

- Platform: Vercel
- vercel.json: Configures SPA routing (all routes → index.html)
- Environment Variables: VITE_GEMINI_KEY, VITE_HF_TOKEN, VITE_REPLICATE_TOKEN
- Build: npm run build → outputs to dist/
