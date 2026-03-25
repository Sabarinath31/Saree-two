import { useMemo, useRef, useState, useCallback } from 'react'
import { SareeCanvas } from './canvas.jsx'
import { T } from './theme.jsx'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml']

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

// ── FIX #3: Convert raster (JPG/PNG) → SVG data-url ─────────────────────────
// Wraps the image in an <svg><image> so the saree engine can apply color
// overlays and filter effects consistently. Also handles removeBg inline.
function rasterToSvgDataUrl(dataUrl, removeBg = false) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const W = img.naturalWidth  || 256
      const H = img.naturalHeight || 256
      let finalDataUrl = dataUrl

      if (removeBg) {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = W; canvas.height = H
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          const imageData = ctx.getImageData(0, 0, W, H)
          const d = imageData.data
          for (let i = 0; i < d.length; i += 4) {
            if (d[i] > 220 && d[i+1] > 220 && d[i+2] > 220) d[i+3] = 0
          }
          ctx.putImageData(imageData, 0, 0)
          finalDataUrl = canvas.toDataURL('image/png')
        } catch (_) { /* tainted canvas — skip */ }
      }

      const svg = [
        `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"`,
        ` width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`,
        `<defs><filter id="colorize" color-interpolation-filters="sRGB">`,
        `<feColorMatrix type="saturate" values="0.7"/></filter></defs>`,
        `<image x="0" y="0" width="${W}" height="${H}" xlink:href="${finalDataUrl}"`,
        ` filter="url(#colorize)" preserveAspectRatio="xMidYMid meet"/>`,
        `</svg>`
      ].join('')

      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

function buildPatternState() {
  return {
    imageDataUrl: '',
    opacity: 0.86,
    density: 1,
    spacing: 1,
    rotation: 0,
    x: 0,
    y: 0,
    repeatStyle: 'grid',
    section: 'body',
    zoom: 1,
    removeBg: false,
  }
}

// ─── UPLOAD PATTERN (admin CMS) ───────────────────────────────────────────────
export function UploadPattern({ onUpload }) {
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [occasion, setOccasion] = useState('Wedding')
  const [section, setSection] = useState('body')
  const [fileErr, setFileErr] = useState('')
  const [fileName, setFileName] = useState('')
  const [imageDataUrl, setImageDataUrl] = useState('')
  const [pickedFileName, setPickedFileName] = useState('')

  const pickFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!ACCEPTED_TYPES.includes(file.type)) { setFileErr('Only JPG, PNG, SVG are supported'); return }
    setFileErr('')
    setPickedFileName(file.name || '')
    const raw = await toDataUrl(file)
    const final = (file.type !== 'image/svg+xml') ? await rasterToSvgDataUrl(raw) : raw
    setImageDataUrl(final)
  }

  const submitUpload = () => {
    if (!imageDataUrl) { setFileErr('Choose an image file first'); return }
    const pid = (id || '').trim() || `up_${Date.now()}`
    const nm = (name || '').trim() || (pickedFileName ? pickedFileName.replace(/\.[^.]+$/, '') : 'Uploaded pattern')
    onUpload({
      id: pid, name: nm, occasion, saree_part: section, style_type: 'uploaded',
      imageDataUrl, fileName: pickedFileName || fileName || '',
      editor: buildPatternState(),
    })
    setFileName(pickedFileName || nm)
  }

  return (
    <div className="card" style={{ padding: 14, marginBottom: 16 }}>
      <p className="label-xs" style={{ marginBottom: 10 }}>UploadPattern</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <input className="input-field" placeholder="Design ID" value={id} onChange={e => setId(e.target.value)} />
        <input className="input-field" placeholder="Pattern name" value={name} onChange={e => setName(e.target.value)} />
        <select className="input-field" value={occasion} onChange={e => setOccasion(e.target.value)}>
          <option>Wedding</option><option>Festival</option><option>Party</option>
          <option>Office</option><option>Casual</option><option>Reception</option>
        </select>
        <select className="input-field" value={section} onChange={e => setSection(e.target.value)}>
          <option value="body">Body</option><option value="border">Border</option><option value="pallu">Pallu</option>
        </select>
        <input className="input-field" type="file"
          accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml" onChange={pickFile} />
        <button type="button" className="btn-primary" style={{ gridColumn: '1 / -1' }} onClick={submitUpload}>
          Upload pattern to library
        </button>
      </div>
      {(pickedFileName || fileName) && (
        <p style={{ fontSize: 11, color: T.textLight, marginTop: 8 }}>
          Ready: {pickedFileName || fileName}{imageDataUrl ? ' ✓' : ''}
        </p>
      )}
      {fileErr && <p style={{ fontSize: 11, color: T.error, marginTop: 8 }}>{fileErr}</p>}
    </div>
  )
}

// ─── CONTROL PANEL ────────────────────────────────────────────────────────────
export function ControlPanel({ state, onChange, hideSection = false }) {
  const row = (label, child) => (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8, alignItems: 'center' }}>
      <span style={{ fontSize: 11, color: T.textLight }}>{label}</span>{child}
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {!hideSection && row('Section',
        <select className="input-field" value={state.section} onChange={e => onChange({ section: e.target.value })}>
          <option value="body">Body</option><option value="border">Border</option><option value="pallu">Pallu</option>
        </select>
      )}
      {row('Repeat',
        <select className="input-field" value={state.repeatStyle} onChange={e => onChange({ repeatStyle: e.target.value })}>
          <option value="grid">Grid</option><option value="mirror">Mirror</option><option value="offset">Offset</option>
        </select>
      )}
      {row('Opacity', <input type="range" min="0.8" max="0.9" step="0.01" value={state.opacity} onChange={e => onChange({ opacity: Number(e.target.value) })} />)}
      {row('Density', <input type="range" min="0.5" max="2" step="0.05" value={state.density} onChange={e => onChange({ density: Number(e.target.value) })} />)}
      {row('Size',    <input type="range" min="0.4" max="2.5" step="0.05" value={state.zoom} onChange={e => onChange({ zoom: Number(e.target.value) })} />)}
      {row('Spacing', <input type="range" min="0.6" max="2.4" step="0.05" value={state.spacing} onChange={e => onChange({ spacing: Number(e.target.value) })} />)}
      {row('Rotate',  <input type="range" min="-180" max="180" step="1" value={state.rotation} onChange={e => onChange({ rotation: Number(e.target.value) })} />)}
      {row('Remove BG', <input type="checkbox" checked={!!state.removeBg} onChange={e => onChange({ removeBg: e.target.checked })} />)}
    </div>
  )
}

// ─── PATTERN OVERLAY ─────────────────────────────────────────────────────────
// Overlays a custom uploaded image tile on top of SareeCanvas in the editor.
// Dimensions must match the new vertical SareeCanvas layout (scale=0.9).
function PatternOverlay({ pattern, scale }) {
  const sw      = Math.round(200 * scale)   // saree width
  const palluH  = Math.round(130 * scale)
  const borderH = Math.round(28 * scale)
  const bodyH   = Math.round(340 * scale)
  const labelH  = Math.round(16 * scale)    // label bars

  // Total height of the saree column only (no blouse panel — that's beside it)
  const totalH  = labelH + palluH + borderH + labelH + bodyH + borderH

  // Correct Y offset per section (accounting for label bars)
  const top = pattern.section === 'pallu'  ? labelH
    : pattern.section === 'border' ? labelH + palluH
    : labelH + palluH + borderH + labelH   // body

  const h = pattern.section === 'pallu'  ? palluH
    : pattern.section === 'border' ? borderH * 2
    : bodyH

  const tile = Math.max(12, 120 / ((pattern.density || 1) * (pattern.zoom || 1)))
  const pw   = Math.max(12, tile * (pattern.spacing || 1))
  const ph   = pw
  const pid  = `up_pat_${pattern.section}_${Math.round(pw)}_${Math.round(ph)}`
  const transform = `translate(${pattern.x || 0} ${pattern.y || 0}) rotate(${pattern.rotation || 0})`

  return (
    <svg width={sw} height={totalH}
      style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <defs>
        <pattern id={pid} patternUnits="userSpaceOnUse" width={pw} height={ph} patternTransform={transform}>
          <image href={pattern.imageDataUrl} x="0" y="0" width={tile} height={tile} preserveAspectRatio="xMidYMid meet" />
          {pattern.repeatStyle === 'mirror' && (
            <image href={pattern.imageDataUrl} x={tile} y="0" width={tile} height={tile}
              transform={`scale(-1,1) translate(${-tile * 2},0)`} preserveAspectRatio="xMidYMid meet" />
          )}
          {pattern.repeatStyle === 'offset' && (
            <image href={pattern.imageDataUrl} x={tile / 2} y={tile / 2} width={tile} height={tile}
              preserveAspectRatio="xMidYMid meet" />
          )}
        </pattern>
      </defs>
      <rect x="0" y={top} width={sw} height={h} fill={`url(#${pid})`} opacity={pattern.opacity || 0.86} />
    </svg>
  )
}

// ─── UPDATED SAREE CANVAS ────────────────────────────────────────────────────
export function UpdatedSareeCanvas({ design, patternState, patternMap = {}, onDrag }) {
  const scale   = 0.9
  const start   = useRef(null)

  const onDown = (e) => { start.current = { x: e.clientX, y: e.clientY } }
  const onMove = (e) => {
    if (!start.current) return
    const dx = e.clientX - start.current.x
    const dy = e.clientY - start.current.y
    start.current = { x: e.clientX, y: e.clientY }
    onDrag(dx, dy)
  }
  const onUp = () => { start.current = null }

  return (
    <div onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      style={{ position: 'relative', display: 'inline-block', cursor: 'grab' }}>
      <SareeCanvas design={design} scale={scale} patternMap={patternMap} />
      {patternState?.imageDataUrl && <PatternOverlay pattern={patternState} scale={scale} />}
    </div>
  )
}

// ─── PATTERN EDITOR MODAL (admin) — works for ALL patterns ───────────────────
export function PatternEditor({ open, design, pattern, patternMap = {}, onClose, onSave }) {
  const [state, setState] = useState(buildPatternState())

  useMemo(() => {
    if (pattern) setState({ ...buildPatternState(), ...(pattern.editor || {}), section: pattern.saree_part || 'body' })
  }, [pattern?.id])

  const merged = useMemo(() => ({
    ...buildPatternState(), ...state,
    imageDataUrl: pattern?.imageDataUrl || pattern?.image_data_url || '',
    section: state.section || pattern?.saree_part || 'body',
  }), [state, pattern])

  // Build a patternMap that always includes the current pattern so the preview renders it
  const effectivePatternMap = useMemo(() => {
    if (!pattern) return patternMap
    return { ...patternMap, [pattern.id]: { ...pattern, editor: merged } }
  }, [patternMap, pattern, merged])

  if (!open || !pattern) return null

  const isUploaded = !!(pattern?.imageDataUrl || pattern?.image_data_url)

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: 'min(980px,96vw)', maxHeight: '94vh', overflow: 'auto', padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: 22, color: T.text }}>
              Pattern Editor — <em style={{ color: T.gold }}>{pattern.name}</em>
            </h3>
            <p style={{ fontSize: 10, color: T.textLight, marginTop: 3 }}>
              {pattern.id} · {pattern.saree_part} · {pattern.style_type}
              {!isUploaded && <span style={{ marginLeft: 8, color: T.goldDark }}>SVG pattern — sliders affect overlay behaviour for uploaded variants</span>}
            </p>
          </div>
          <button className="btn-ghost" onClick={onClose}>✕ Close</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 14 }}>
          <div>
            <ControlPanel state={merged} onChange={p => setState(s => ({ ...s, ...p }))} />
            <button className="btn-ghost" style={{ width: '100%', marginTop: 12, fontSize: 10, padding: '7px 0' }}
              onClick={() => setState({ ...buildPatternState(), section: merged.section })}>
              Reset to Defaults
            </button>
            {/* Show current editor values */}
            <div style={{ marginTop: 12, padding: '10px 12px', background: T.surfaceAlt,
              borderRadius: 3, border: `1px solid ${T.border}` }}>
              <p style={{ fontSize: 9, color: T.textLight, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Current Values</p>
              {[
                ['opacity',  merged.opacity?.toFixed(2)],
                ['density',  merged.density?.toFixed(2)],
                ['zoom',     merged.zoom?.toFixed(2)],
                ['spacing',  merged.spacing?.toFixed(2)],
                ['rotation', merged.rotation + '°'],
                ['repeat',   merged.repeatStyle],
              ].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:10, padding:'2px 0', color:T.textMid }}>
                  <span style={{ color: T.textLight }}>{k}</span>
                  <code style={{ color: T.gold }}>{v}</code>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            minHeight: 520, background: T.surfaceAlt, border: `1px solid ${T.border}`, gap: 10, padding: 16 }}>
            <p style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: T.textLight }}>
              Live Preview — {merged.section} section
            </p>
            <UpdatedSareeCanvas design={design} patternState={isUploaded ? merged : null}
              patternMap={effectivePatternMap}
              onDrag={(dx, dy) => setState(s => ({ ...s, x: (s.x||0)+dx, y: (s.y||0)+dy }))} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave(merged)}>✦ Save Pattern Settings</button>
        </div>
      </div>
    </div>
  )
}

// ─── FIX #1: INLINE PATTERN EDITOR for pre-uploaded patterns in DesignerCanvas ─
// Opened via "Edit ✦" button that appears on uploaded pattern cards in the grid.
export function InlinePatternEditor({ open, pattern, design, onClose, onSave }) {
  const [state, setState] = useState(buildPatternState())

  useMemo(() => {
    if (pattern) {
      setState({
        ...buildPatternState(),
        ...(pattern.editor || {}),
        section: pattern.saree_part || 'body',
        imageDataUrl: pattern.image_data_url || pattern.imageDataUrl || '',
      })
    }
  }, [pattern?.id])

  const merged = useMemo(() => ({ ...buildPatternState(), ...state }), [state])

  if (!open || !pattern) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ width: 'min(960px,98vw)', maxHeight: '96vh', overflow: 'auto', padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: 20, color: T.text }}>
              Pattern Editor — <em style={{ color: T.gold }}>{pattern.name}</em>
            </h3>
            <p style={{ fontSize: 10, color: T.textLight, marginTop: 2 }}>
              Adjust how this uploaded pattern sits on the saree
            </p>
          </div>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 14 }}>
          <div className="card" style={{ padding: 14 }}>
            <p className="label-xs" style={{ marginBottom: 10 }}>
              Section: <span style={{ color: T.gold, textTransform: 'capitalize' }}>{state.section}</span>
            </p>

            <div style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 10, color: T.textLight, marginBottom: 5 }}>REPEAT STYLE</p>
              <select className="input-field" value={state.repeatStyle}
                onChange={e => setState(s => ({ ...s, repeatStyle: e.target.value }))}>
                <option value="grid">Grid (uniform)</option>
                <option value="mirror">Mirror (flip alternate)</option>
                <option value="offset">Offset (brick)</option>
              </select>
            </div>

            <div className="divider" style={{ margin: '10px 0' }} />

            {[
              { key: 'opacity',  label: 'Opacity',  min: 0.8,  max: 0.9,  step: 0.01, fmt: v => `${Math.round(v*100)}%` },
              { key: 'density',  label: 'Density',  min: 0.5,  max: 2,    step: 0.05, fmt: v => v.toFixed(2) },
              { key: 'zoom',     label: 'Size',     min: 0.4,  max: 2.5,  step: 0.05, fmt: v => v.toFixed(2) },
              { key: 'spacing',  label: 'Spacing',  min: 0.6,  max: 2.4,  step: 0.05, fmt: v => v.toFixed(2) },
              { key: 'rotation', label: 'Rotation', min: -180, max: 180,  step: 1,    fmt: v => `${v}°`     },
            ].map(({ key, label, min, max, step, fmt }) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: T.textLight }}>{label}</span>
                  <code style={{ fontSize: 10, color: T.gold }}>{fmt(state[key] ?? buildPatternState()[key])}</code>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={state[key] ?? buildPatternState()[key]}
                  onChange={e => setState(s => ({ ...s, [key]: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: T.gold }} />
              </div>
            ))}

            <div className="divider" style={{ margin: '10px 0' }} />

            {/* Remove BG toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 11px', background: T.surfaceAlt, borderRadius: 3,
              border: `1px solid ${state.removeBg ? T.gold+'88' : T.border}`, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: T.text, fontWeight: 500 }}>Remove Background</div>
                <div style={{ fontSize: 9, color: T.textLight }}>Strip white/light bg from tile</div>
              </div>
              <label style={{ cursor: 'pointer', position: 'relative', width: 38, height: 20, flexShrink: 0 }}>
                <input type="checkbox" checked={!!state.removeBg}
                  onChange={e => setState(s => ({ ...s, removeBg: e.target.checked }))}
                  style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', inset: 0, borderRadius: 10,
                  background: state.removeBg ? T.gold : T.border, transition: 'background 0.2s' }} />
                <span style={{ position: 'absolute', top: 2, left: state.removeBg ? 19 : 2,
                  width: 16, height: 16, borderRadius: '50%', background: 'white',
                  transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
              </label>
            </div>

            <button className="btn-ghost" style={{ width: '100%', fontSize: 10, padding: '6px 0' }}
              onClick={() => setState(s => ({ ...buildPatternState(), section: s.section, imageDataUrl: s.imageDataUrl }))}>
              Reset to Defaults
            </button>

            <div style={{ padding: '9px 11px', background: T.surfaceAlt, borderRadius: 3,
              border: `1px solid ${T.border}`, marginTop: 10 }}>
              <p style={{ fontSize: 10, color: T.textLight, lineHeight: 1.5 }}>
                💡 Drag the preview to reposition tile offset
              </p>
            </div>
          </div>

          {/* Live preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 460, background: `radial-gradient(ellipse at center,${T.surfaceAlt},${T.bg})`,
            borderRadius: 4, border: `1px solid ${T.border}`, padding: 20, gap: 10 }}>
            <p style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: T.textLight }}>
              Live Preview — drag to reposition
            </p>
            <UpdatedSareeCanvas design={design} patternState={merged}
              patternMap={pattern ? { [pattern.id]: { ...pattern, editor: merged } } : {}}
              onDrag={(dx, dy) => setState(s => ({ ...s, x: (s.x||0)+dx, y: (s.y||0)+dy }))} />
            <p style={{ fontSize: 10, color: T.textLight, fontStyle: 'italic', textAlign: 'center' }}>
              Pattern on <strong style={{ color: T.gold }}>{state.section}</strong> section
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave(merged)}>
            ✦ Save Pattern Settings
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── CUSTOMER UPLOAD WIZARD ───────────────────────────────────────────────────
const PREVIEW_DESIGN = {
  primaryColor: '#8B0000', secondaryColor: '#F5F5DC',
  accentColor: '#C9A843', bodyPattern: 'b4', borderPattern: 'br3', palluPattern: 'p4',
}

export function CustomerUploadWizard({ user, token, notify, onLibraryChanged, onBack, onSaved }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', occasion: 'Wedding', part: 'body' })
  const [fileDataUrl, setFileDataUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileErr, setFileErr] = useState('')
  const [converting, setConverting] = useState(false)
  const [editorState, setEditorState] = useState({ ...buildPatternState(), section: 'body' })

  // FIX #3: raster → SVG on file pick
  const handleFile = async (file) => {
    if (!file) return
    if (!ACCEPTED_TYPES.includes(file.type)) { setFileErr('Only JPG, PNG, SVG files are supported'); return }
    setFileErr('')
    setFileName(file.name || '')
    setConverting(true)
    try {
      const raw = await toDataUrl(file)
      const final = (file.type !== 'image/svg+xml') ? await rasterToSvgDataUrl(raw) : raw
      setFileDataUrl(final)
    } catch (e) {
      setFileErr('Could not process image. Try a different file.')
    }
    setConverting(false)
  }

  const goToEditor = () => {
    if (!form.name.trim()) { notify('Please enter a design name', 'error'); return }
    if (!fileDataUrl)      { notify('Please choose an image file', 'error'); return }
    // FIX #2: sync form.part → editorState.section
    setEditorState(s => ({ ...s, section: form.part }))
    setStep(2)
  }

  const merged = useMemo(() => ({
    ...buildPatternState(), ...editorState, imageDataUrl: fileDataUrl,
  }), [editorState, fileDataUrl])

  // FIX #2 + FIX #4: save uses editorState.section as saree_part; onSaved goes home
  const saveDesign = useCallback(async () => {
    setStep(3)
    try {
      const { sb } = await import('./data.jsx')
      const pid  = `up_${Date.now()}`
      const part = editorState.section   // FIX #2: authoritative section from editor

      const editor = {
        opacity: merged.opacity, density: merged.density, zoom: merged.zoom,
        spacing: merged.spacing, rotation: merged.rotation,
        x: merged.x, y: merged.y, repeatStyle: merged.repeatStyle, removeBg: merged.removeBg,
      }

      const designData = {
        primaryColor: '#8B0000', secondaryColor: '#F5F5DC', accentColor: '#C9A843',
        bodyPattern:   part === 'body'   ? pid : 'b4',
        borderPattern: part === 'border' ? pid : 'br3',
        palluPattern:  part === 'pallu'  ? pid : 'p4',
        uploadMeta: { custom_id: pid, occasion: form.occasion, part, file_name: fileName, file_data_url: fileDataUrl, editor },
      }

      const ins = await sb.insert('saved_designs', {
        user_id: user.id, name: form.name.trim(),
        design_data: designData,
        thumbnail_colors: ['#8B0000', '#F5F5DC', '#C9A843'],
        status: 'draft',
      }, token)

      if (ins && !Array.isArray(ins) && (ins.code || ins.message)) {
        notify(ins.message || ins.hint || 'Upload failed', 'error')
        setStep(2); return
      }

      onLibraryChanged && await onLibraryChanged()
      notify('Pattern saved to your library!', 'success')
      onSaved && onSaved()   // FIX #4: App.jsx passes ()=>setPage('home')
    } catch (e) {
      console.error(e)
      notify('Failed to save — check console', 'error')
      setStep(2)
    }
  }, [form, fileDataUrl, fileName, merged, editorState.section, user, token, notify, onLibraryChanged, onSaved])

  const StepDots = () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24 }}>
      {['Upload', 'Adjust', 'Save'].map((label, i) => {
        const n = i + 1
        const active = step === n, done = step > n
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600,
              background: done  ? T.goldDark : active ? `linear-gradient(135deg,${T.goldDark},${T.gold})` : T.surfaceAlt,
              border: `1.5px solid ${active || done ? T.gold : T.border}`,
              color: active || done ? '#0E0C09' : T.textLight,
            }}>{done ? '✓' : n}</div>
            <span style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
              color: active ? T.gold : T.textLight, fontWeight: active ? 600 : 400 }}>{label}</span>
            {i < 2 && <div style={{ width: 20, height: 1, background: T.border, margin: '0 2px' }} />}
          </div>
        )
      })}
    </div>
  )

  // ── STEP 1 ────────────────────────────────────────────────────────────────
  if (step === 1) return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button onClick={onBack} className="btn-ghost" style={{ padding: '6px 12px', fontSize: 10 }}>← Back</button>
        <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 24, fontWeight: 400, color: T.text }}>
          Upload New Pattern
        </h2>
      </div>
      <StepDots />
      <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <p className="label-xs" style={{ marginBottom: 6 }}>Design Name *</p>
          <input className="input-field" placeholder="e.g. My Floral Motif"
            value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <p className="label-xs" style={{ marginBottom: 6 }}>Occasion</p>
            <select className="input-field" value={form.occasion} onChange={e => setForm(v => ({ ...v, occasion: e.target.value }))}>
              <option>Wedding</option><option>Festival</option><option>Party</option>
              <option>Office</option><option>Casual</option><option>Reception</option>
            </select>
          </div>
          <div>
            <p className="label-xs" style={{ marginBottom: 6 }}>Default section</p>
            <select className="input-field" value={form.part} onChange={e => setForm(v => ({ ...v, part: e.target.value }))}>
              <option value="body">Body</option>
              <option value="border">Border</option>
              <option value="pallu">Pallu</option>
            </select>
          </div>
        </div>

        <div>
          <p className="label-xs" style={{ marginBottom: 6 }}>
            Pattern Image *{' '}
            <span style={{ color: T.textLight, fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 9 }}>
              JPG/PNG auto-converted to SVG
            </span>
          </p>
          <label style={{
            display: 'block', border: `2px dashed ${fileDataUrl ? T.gold : T.border}`,
            borderRadius: 4, padding: '28px 16px', textAlign: 'center',
            background: fileDataUrl ? 'rgba(201,168,67,0.04)' : T.surfaceAlt, cursor: 'pointer',
          }}>
            {converting ? (
              <div>
                <div style={{ width: 32, height: 32, borderRadius: '50%',
                  border: `2px solid ${T.border}`, borderTopColor: T.gold,
                  animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
                <p style={{ fontSize: 11, color: T.textLight }}>Converting to SVG...</p>
              </div>
            ) : fileDataUrl ? (
              <div>
                <img src={fileDataUrl} alt="preview"
                  style={{ maxHeight: 110, maxWidth: '100%', objectFit: 'contain', borderRadius: 3, marginBottom: 8 }} />
                <p style={{ fontSize: 11, color: T.gold }}>{fileName} ✓</p>
                <p style={{ fontSize: 10, color: T.textLight, marginTop: 2 }}>Tap to change</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🖼️</div>
                <p style={{ fontSize: 13, color: T.textMid, fontFamily: 'Cormorant Garamond', marginBottom: 3 }}>
                  Choose your pattern image
                </p>
                <p style={{ fontSize: 10, color: T.textLight }}>JPG · PNG · SVG</p>
              </div>
            )}
            <input type="file" accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
              style={{ display: 'none' }} onChange={e => handleFile(e.target.files?.[0])} />
          </label>
          {fileErr && <p style={{ fontSize: 11, color: T.error, marginTop: 6 }}>{fileErr}</p>}
        </div>

        <div style={{ padding: '12px 14px', background: T.surfaceAlt, borderRadius: 3, border: `1px solid ${T.border}` }}>
          <p className="label-xs" style={{ marginBottom: 8 }}>What happens next</p>
          {[
            'JPG/PNG auto-converted to SVG for color compatibility',
            'Live preview on a full saree canvas',
            'Adjust scale, density, spacing, rotation & remove background',
            'Saved to your personal pattern library — not the catalog',
          ].map(t => (
            <div key={t} style={{ fontSize: 11, color: T.textMid, padding: '3px 0', display: 'flex', gap: 8 }}>
              <span style={{ color: T.gold, flexShrink: 0 }}>✦</span>{t}
            </div>
          ))}
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: 14 }}
          disabled={converting || !fileDataUrl} onClick={goToEditor}>
          Continue to Pattern Editor →
        </button>
      </div>
    </div>
  )

  // ── STEP 2 ────────────────────────────────────────────────────────────────
  if (step === 2) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    return (
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => setStep(1)} className="btn-ghost" style={{ padding: '6px 12px', fontSize: 10 }}>← Back</button>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 22, fontWeight: 400, color: T.text }}>Adjust Pattern</h2>
          <div style={{ marginLeft: 'auto', fontSize: 11, color: T.textLight, fontStyle: 'italic' }}>Drag preview to reposition</div>
        </div>
        <StepDots />

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', gap: 16 }}>
          <div className="card" style={{ padding: 16 }}>
            <p className="label-xs" style={{ marginBottom: 14 }}>Pattern Settings</p>

            {/* FIX #2: section picker — this is what determines saree_part on save */}
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 10, color: T.textLight, marginBottom: 6, letterSpacing: 1 }}>APPLY TO SECTION</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['body', 'border', 'pallu'].map(s => (
                  <button key={s} onClick={() => setEditorState(st => ({ ...st, section: s }))} style={{
                    flex: 1, padding: '7px 4px',
                    border: `1px solid ${editorState.section === s ? T.gold : T.border}`,
                    background: editorState.section === s ? T.surfaceHov : T.surfaceAlt,
                    color: editorState.section === s ? T.goldDark : T.textMid,
                    borderRadius: 2, cursor: 'pointer', fontSize: 10,
                    fontWeight: editorState.section === s ? 600 : 300,
                    textTransform: 'capitalize', transition: 'all 0.2s',
                  }}>{s}</button>
                ))}
              </div>
              <p style={{ fontSize: 9, color: T.textLight, marginTop: 5, lineHeight: 1.4 }}>
                This sets which section your pattern goes to in the library.
              </p>
            </div>

            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 10, color: T.textLight, marginBottom: 6, letterSpacing: 1 }}>REPEAT STYLE</p>
              <select className="input-field" value={editorState.repeatStyle}
                onChange={e => setEditorState(s => ({ ...s, repeatStyle: e.target.value }))}>
                <option value="grid">Grid (uniform repeat)</option>
                <option value="mirror">Mirror (flip alternate)</option>
                <option value="offset">Offset (brick pattern)</option>
              </select>
            </div>

            <div className="divider" style={{ margin: '12px 0' }} />

            {[
              { key: 'opacity',  label: 'Opacity',  min: 0.8,  max: 0.9,  step: 0.01, fmt: v => `${Math.round(v*100)}%` },
              { key: 'density',  label: 'Density',  min: 0.5,  max: 2,    step: 0.05, fmt: v => v.toFixed(2) },
              { key: 'zoom',     label: 'Size',     min: 0.4,  max: 2.5,  step: 0.05, fmt: v => v.toFixed(2) },
              { key: 'spacing',  label: 'Spacing',  min: 0.6,  max: 2.4,  step: 0.05, fmt: v => v.toFixed(2) },
              { key: 'rotation', label: 'Rotation', min: -180, max: 180,  step: 1,    fmt: v => `${v}°`     },
            ].map(({ key, label, min, max, step, fmt }) => (
              <div key={key} style={{ marginBottom: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: T.textLight }}>{label}</span>
                  <code style={{ fontSize: 10, color: T.gold }}>{fmt(editorState[key] ?? buildPatternState()[key])}</code>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={editorState[key] ?? buildPatternState()[key]}
                  onChange={e => setEditorState(s => ({ ...s, [key]: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: T.gold }} />
              </div>
            ))}

            <div className="divider" style={{ margin: '12px 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 11px', background: T.surfaceAlt, borderRadius: 3,
              border: `1px solid ${editorState.removeBg ? T.gold+'88' : T.border}`, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: T.text, fontWeight: 500, marginBottom: 2 }}>Remove Background</div>
                <div style={{ fontSize: 9, color: T.textLight }}>Strip white/light bg from tile</div>
              </div>
              <label style={{ cursor: 'pointer', position: 'relative', width: 38, height: 20, flexShrink: 0 }}>
                <input type="checkbox" checked={!!editorState.removeBg}
                  onChange={e => setEditorState(s => ({ ...s, removeBg: e.target.checked }))}
                  style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', inset: 0, borderRadius: 10,
                  background: editorState.removeBg ? T.gold : T.border, transition: 'background 0.2s' }} />
                <span style={{ position: 'absolute', top: 2, left: editorState.removeBg ? 19 : 2,
                  width: 16, height: 16, borderRadius: '50%', background: 'white',
                  transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
              </label>
            </div>

            <button className="btn-ghost" style={{ width: '100%', fontSize: 10, padding: '6px 0', marginBottom: 8 }}
              onClick={() => setEditorState(s => ({ ...buildPatternState(), section: s.section }))}>
              Reset to Defaults
            </button>
            <div style={{ padding: '9px 11px', background: T.surfaceAlt, borderRadius: 3, border: `1px solid ${T.border}` }}>
              <p style={{ fontSize: 10, color: T.textLight, lineHeight: 1.5 }}>
                💡 Drag preview canvas to shift tile position
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 500, background: `radial-gradient(ellipse at center,${T.surfaceAlt},${T.bg})`,
            borderRadius: 4, border: `1px solid ${T.border}`, padding: 24, gap: 12 }}>
            <p style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: T.textLight }}>Live Preview</p>
            <UpdatedSareeCanvas design={PREVIEW_DESIGN} patternState={merged}
              onDrag={(dx, dy) => setEditorState(s => ({ ...s, x: (s.x||0)+dx, y: (s.y||0)+dy }))} />
            <p style={{ fontSize: 10, color: T.textLight, fontStyle: 'italic', textAlign: 'center', maxWidth: 260 }}>
              Showing on <strong style={{ color: T.gold }}>{editorState.section}</strong> section.
              Switch above to preview other parts.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button className="btn-ghost" style={{ padding: '12px 20px' }} onClick={() => setStep(1)}>← Back</button>
          <button className="btn-primary" style={{ flex: 1, padding: '13px 0', fontSize: 12 }} onClick={saveDesign}>
            ✦ Save Pattern to My Library
          </button>
        </div>
      </div>
    )
  }

  // ── STEP 3 ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: 20, padding: 40 }}>
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
          border: `3px solid ${T.border}`, borderTopColor: T.gold, animation: 'spin 1s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 24 }}>🧵</div>
      </div>
      <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 22, color: T.text, fontStyle: 'italic' }}>
        Saving your pattern...
      </p>
    </div>
  )
}