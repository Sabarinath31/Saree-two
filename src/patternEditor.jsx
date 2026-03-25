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
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileErr('Only JPG, PNG, SVG are supported')
      return
    }
    setFileErr('')
    setPickedFileName(file.name || '')
    setImageDataUrl(await toDataUrl(file))
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
          <option value="Wedding">Wedding</option><option value="Festival">Festival</option>
          <option value="Party">Party</option><option value="Office">Office</option>
          <option value="Casual">Casual</option><option value="Reception">Reception</option>
        </select>
        <select className="input-field" value={section} onChange={e => setSection(e.target.value)}>
          <option value="body">Body</option><option value="border">Border</option><option value="pallu">Pallu</option>
        </select>
        <input className="input-field" type="file"
          accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
          onChange={pickFile} />
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
export function ControlPanel({ state, onChange }) {
  const row = (label, child) => (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8, alignItems: 'center' }}>
      <span style={{ fontSize: 11, color: T.textLight }}>{label}</span>{child}
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {row('Section',
        <select className="input-field" value={state.section} onChange={e => onChange({ section: e.target.value })}>
          <option value="body">Body</option><option value="border">Border</option><option value="pallu">Pallu</option>
        </select>
      )}
      {row('Repeat',
        <select className="input-field" value={state.repeatStyle} onChange={e => onChange({ repeatStyle: e.target.value })}>
          <option value="grid">Grid</option><option value="mirror">Mirror</option><option value="offset">Offset</option>
        </select>
      )}
      {row('Opacity',
        <input type="range" min="0.8" max="0.9" step="0.01" value={state.opacity}
          onChange={e => onChange({ opacity: Number(e.target.value) })} />
      )}
      {row('Density',
        <input type="range" min="0.5" max="2" step="0.05" value={state.density}
          onChange={e => onChange({ density: Number(e.target.value) })} />
      )}
      {row('Size',
        <input type="range" min="0.4" max="2.5" step="0.05" value={state.zoom}
          onChange={e => onChange({ zoom: Number(e.target.value) })} />
      )}
      {row('Spacing',
        <input type="range" min="0.6" max="2.4" step="0.05" value={state.spacing}
          onChange={e => onChange({ spacing: Number(e.target.value) })} />
      )}
      {row('Rotate',
        <input type="range" min="-180" max="180" step="1" value={state.rotation}
          onChange={e => onChange({ rotation: Number(e.target.value) })} />
      )}
      {row('Remove BG',
        <input type="checkbox" checked={state.removeBg}
          onChange={e => onChange({ removeBg: e.target.checked })} />
      )}
    </div>
  )
}

// ─── PATTERN OVERLAY (renders custom image over the saree canvas) ──────────────
function PatternOverlay({ pattern, scale }) {
  const w       = Math.round(220 * scale)
  const palluH  = Math.round(175 * scale)
  const borderH = Math.round(32 * scale)
  const bodyH   = Math.round(270 * scale)
  const blouseH = Math.round(65 * scale)

  const top = pattern.section === 'pallu' ? 0
    : pattern.section === 'border' ? palluH
    : palluH + borderH

  const h = pattern.section === 'pallu' ? palluH
    : pattern.section === 'border' ? borderH
    : bodyH

  const tile = 120 / (pattern.density * pattern.zoom)
  const pw   = tile * pattern.spacing
  const ph   = tile * pattern.spacing
  const pid  = `up_pat_${Math.round(pw)}_${Math.round(ph)}_${pattern.section}`
  const transform = `translate(${pattern.x} ${pattern.y}) rotate(${pattern.rotation})`
  const preserve = pattern.removeBg ? 'xMidYMid slice' : 'none'

  return (
    <svg
      width={w}
      height={palluH + borderH + bodyH + borderH + blouseH}
      style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
    >
      <defs>
        <pattern id={pid} patternUnits="userSpaceOnUse" width={pw} height={ph} patternTransform={transform}>
          <image href={pattern.imageDataUrl} x="0" y="0" width={tile} height={tile}
            preserveAspectRatio={preserve} />
          {pattern.repeatStyle === 'mirror' && (
            <image href={pattern.imageDataUrl} x={tile} y="0" width={tile} height={tile}
              transform={`scale(-1,1) translate(${-tile * 2},0)`} preserveAspectRatio={preserve} />
          )}
          {pattern.repeatStyle === 'offset' && (
            <image href={pattern.imageDataUrl} x={tile / 2} y={tile / 2} width={tile} height={tile}
              preserveAspectRatio={preserve} />
          )}
        </pattern>
      </defs>
      <rect x="0" y={top} width={w} height={h} fill={`url(#${pid})`} opacity={pattern.opacity} />
    </svg>
  )
}

// ─── UPDATED SAREE CANVAS (with draggable pattern overlay) ────────────────────
export function UpdatedSareeCanvas({ design, patternState, onDrag }) {
  const scale    = 0.9
  const dragRef  = useRef(null)
  const start    = useRef(null)

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
    <div
      ref={dragRef}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      style={{ position: 'relative', display: 'inline-block', cursor: 'grab' }}
    >
      <SareeCanvas design={design} scale={scale} />
      {patternState?.imageDataUrl && <PatternOverlay pattern={patternState} scale={scale} />}
    </div>
  )
}

// ─── PATTERN EDITOR MODAL (admin) ─────────────────────────────────────────────
export function PatternEditor({ open, design, pattern, onClose, onSave }) {
  const [state, setState] = useState(pattern?.editor || buildPatternState())
  const merged = useMemo(() => ({
    ...buildPatternState(), ...state,
    imageDataUrl: pattern?.imageDataUrl || '',
  }), [state, pattern])

  if (!open || !pattern) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div className="card" style={{ width: 'min(980px,96vw)', padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: 22, color: T.text }}>
            PatternEditor — {pattern.name}
          </h3>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 14 }}>
          <ControlPanel state={merged} onChange={p => setState(s => ({ ...s, ...p }))} />
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: 520, background: T.surfaceAlt, border: `1px solid ${T.border}`
          }}>
            <UpdatedSareeCanvas
              design={design}
              patternState={merged}
              onDrag={(dx, dy) => setState(s => ({ ...s, x: s.x + dx, y: s.y + dy }))}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave(merged)}>Save Pattern Settings</button>
        </div>
      </div>
    </div>
  )
}

// ─── CUSTOMER UPLOAD WIZARD ───────────────────────────────────────────────────
// 3-step wizard: (1) Upload file + metadata → (2) Adjust pattern → (3) Save
// This replaces CustomerDesignUploadPage for a richer experience.

const PREVIEW_DESIGN = {
  primaryColor: '#8B0000', secondaryColor: '#F5F5DC',
  accentColor: '#C9A843', bodyPattern: 'b4',
  borderPattern: 'br3', palluPattern: 'p4',
}

export function CustomerUploadWizard({ user, token, notify, onLibraryChanged, onBack, onSaved }) {
  const [step, setStep] = useState(1)  // 1 = info, 2 = editor, 3 = saving

  // Step 1 form
  const [form, setForm] = useState({
    id: '',
    name: '',
    occasion: 'Wedding',
    part: 'body',
  })
  const [fileDataUrl, setFileDataUrl] = useState('')
  const [fileName, setFileName]       = useState('')
  const [fileErr, setFileErr]         = useState('')

  // Step 2 editor
  const [editorState, setEditorState] = useState({
    ...buildPatternState(),
    section: 'body',
  })

  // ── Step 1 file pick ──────────────────────────────────────────────────────
  const handleFile = async (file) => {
    if (!file) return
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileErr('Only JPG, PNG, SVG files are supported')
      return
    }
    setFileErr('')
    setFileName(file.name || '')
    const url = await toDataUrl(file)
    setFileDataUrl(url)
  }

  const goToEditor = () => {
    if (!form.name.trim()) { notify('Please enter a design name', 'error'); return }
    if (!fileDataUrl)      { notify('Please choose an image file', 'error'); return }
    // Sync part → section in editor
    setEditorState(s => ({ ...s, section: form.part, imageDataUrl: fileDataUrl }))
    setStep(2)
  }

  // ── Step 2 merged state ───────────────────────────────────────────────────
  const merged = useMemo(() => ({
    ...buildPatternState(),
    ...editorState,
    imageDataUrl: fileDataUrl,
  }), [editorState, fileDataUrl])

  // ── Step 3 save ───────────────────────────────────────────────────────────
  const saveDesign = useCallback(async () => {
    setStep(3)
    try {
      const pid = (form.id.trim() || `up_${Date.now()}`)
      const editor = {
        opacity:     merged.opacity,
        density:     merged.density,
        zoom:        merged.zoom,
        spacing:     merged.spacing,
        rotation:    merged.rotation,
        x:           merged.x,
        y:           merged.y,
        repeatStyle: merged.repeatStyle,
        removeBg:    merged.removeBg,
      }

      const designData = {
        primaryColor:   '#8B0000',
        secondaryColor: '#F5F5DC',
        accentColor:    '#C9A843',
        bodyPattern:    form.part === 'body'   ? pid : 'b4',
        borderPattern:  form.part === 'border' ? pid : 'br3',
        palluPattern:   form.part === 'pallu'  ? pid : 'p4',
        uploadMeta: {
          custom_id:     pid,
          occasion:      form.occasion,
          part:          form.part,
          file_name:     fileName,
          file_data_url: fileDataUrl,
          editor,
        },
      }

      const ins = await (await import('./data.jsx')).sb.insert('saved_designs', {
        user_id: user.id,
        name:    form.name.trim(),
        design_data: designData,
        thumbnail_colors: ['#8B0000', '#F5F5DC', '#C9A843'],
        status: 'draft',
      }, token)

      if (ins && !Array.isArray(ins) && (ins.code || ins.message)) {
        notify(ins.message || ins.hint || 'Upload failed', 'error')
        setStep(2)
        return
      }

      onLibraryChanged && await onLibraryChanged()
      notify('Pattern saved to your library!', 'success')
      onSaved && onSaved()
    } catch (e) {
      console.error(e)
      notify('Failed to save — check console', 'error')
      setStep(2)
    }
  }, [form, fileDataUrl, fileName, merged, user, token, notify, onLibraryChanged, onSaved])

  // ── Step indicator ────────────────────────────────────────────────────────
  const StepDots = () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24 }}>
      {['Upload', 'Adjust', 'Save'].map((label, i) => {
        const n = i + 1
        const active = step === n
        const done   = step > n
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
              background: done  ? T.goldDark
                        : active ? `linear-gradient(135deg,${T.goldDark},${T.gold})`
                        : T.surfaceAlt,
              border: `1.5px solid ${active || done ? T.gold : T.border}`,
              color: active || done ? '#0E0C09' : T.textLight,
            }}>
              {done ? '✓' : n}
            </div>
            <span style={{
              fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
              color: active ? T.gold : T.textLight, fontWeight: active ? 600 : 400,
            }}>{label}</span>
            {i < 2 && <div style={{ width: 24, height: 1, background: T.border, margin: '0 4px' }} />}
          </div>
        )
      })}
    </div>
  )

  // ── STEP 1 — Info + File ──────────────────────────────────────────────────
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
            <select className="input-field" value={form.occasion}
              onChange={e => setForm(v => ({ ...v, occasion: e.target.value }))}>
              <option value="Wedding">Wedding</option>
              <option value="Festival">Festival</option>
              <option value="Party">Party</option>
              <option value="Office">Office</option>
              <option value="Casual">Casual</option>
              <option value="Reception">Reception</option>
            </select>
          </div>
          <div>
            <p className="label-xs" style={{ marginBottom: 6 }}>Apply to</p>
            <select className="input-field" value={form.part}
              onChange={e => setForm(v => ({ ...v, part: e.target.value }))}>
              <option value="body">Body</option>
              <option value="border">Border</option>
              <option value="pallu">Pallu</option>
            </select>
          </div>
        </div>

        {/* File drop zone */}
        <div>
          <p className="label-xs" style={{ marginBottom: 6 }}>Pattern Image *</p>
          <label style={{
            display: 'block', border: `2px dashed ${fileDataUrl ? T.gold : T.border}`,
            borderRadius: 4, padding: '28px 16px', textAlign: 'center',
            background: fileDataUrl ? 'rgba(201,168,67,0.04)' : T.surfaceAlt,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {fileDataUrl ? (
              <div>
                <img src={fileDataUrl} alt="preview"
                  style={{ maxHeight: 120, maxWidth: '100%', objectFit: 'contain',
                    borderRadius: 3, marginBottom: 8 }} />
                <p style={{ fontSize: 11, color: T.gold }}>{fileName} ✓</p>
                <p style={{ fontSize: 10, color: T.textLight, marginTop: 2 }}>Tap to change</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🖼️</div>
                <p style={{ fontSize: 13, color: T.textMid, marginBottom: 3,
                  fontFamily: 'Cormorant Garamond' }}>Choose your pattern image</p>
                <p style={{ fontSize: 10, color: T.textLight }}>JPG · PNG · SVG</p>
              </div>
            )}
            <input type="file" accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files?.[0])} />
          </label>
          {fileErr && <p style={{ fontSize: 11, color: T.error, marginTop: 6 }}>{fileErr}</p>}
        </div>

        {/* Info box */}
        <div style={{
          padding: '12px 14px', background: T.surfaceAlt, borderRadius: 3,
          border: `1px solid ${T.border}`
        }}>
          <p className="label-xs" style={{ marginBottom: 8 }}>What happens next</p>
          {[
            'Live preview of your pattern on a saree',
            'Adjust scale, density, spacing, rotation',
            'Remove white background if needed',
            'Pattern saves to your personal library',
          ].map(t => (
            <div key={t} style={{ fontSize: 11, color: T.textMid, padding: '3px 0',
              display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: T.gold }}>✦</span> {t}
            </div>
          ))}
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: 14 }}
          onClick={goToEditor}>
          Continue to Pattern Editor →
        </button>
      </div>
    </div>
  )

  // ── STEP 2 — Pattern Editor ───────────────────────────────────────────────
  if (step === 2) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

    return (
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => setStep(1)} className="btn-ghost" style={{ padding: '6px 12px', fontSize: 10 }}>
            ← Back
          </button>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 22, fontWeight: 400, color: T.text }}>
            Adjust Pattern
          </h2>
          <div style={{ marginLeft: 'auto', fontSize: 12, color: T.textLight, fontStyle: 'italic' }}>
            Drag the canvas to reposition
          </div>
        </div>

        <StepDots />

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '300px 1fr',
          gap: 16,
        }}>
          {/* Controls */}
          <div className="card" style={{ padding: 16 }}>
            <p className="label-xs" style={{ marginBottom: 14 }}>Pattern Settings</p>

            {/* Section */}
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 10, color: T.textLight, marginBottom: 6, letterSpacing: 1 }}>APPLY TO</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['body', 'border', 'pallu'].map(s => (
                  <button key={s} onClick={() => setEditorState(st => ({ ...st, section: s }))} style={{
                    flex: 1, padding: '7px 4px', border: `1px solid ${editorState.section === s ? T.gold : T.border}`,
                    background: editorState.section === s ? T.surfaceHov : T.surfaceAlt,
                    color: editorState.section === s ? T.goldDark : T.textMid,
                    borderRadius: 2, cursor: 'pointer', fontSize: 10,
                    fontWeight: editorState.section === s ? 600 : 300,
                    textTransform: 'capitalize', letterSpacing: 0.5, transition: 'all 0.2s',
                  }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Repeat style */}
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 10, color: T.textLight, marginBottom: 6, letterSpacing: 1 }}>REPEAT STYLE</p>
              <select className="input-field" value={editorState.repeatStyle}
                onChange={e => setEditorState(s => ({ ...s, repeatStyle: e.target.value }))}>
                <option value="grid">Grid (uniform repeat)</option>
                <option value="mirror">Mirror (flip alternate)</option>
                <option value="offset">Offset (brick pattern)</option>
              </select>
            </div>

            <div className="divider" style={{ margin: '14px 0' }} />

            {/* Sliders */}
            {[
              { key: 'opacity',  label: 'Opacity',  min: 0.8,   max: 0.9,  step: 0.01, fmt: v => `${Math.round(v*100)}%` },
              { key: 'density',  label: 'Density',  min: 0.5,   max: 2,    step: 0.05, fmt: v => v.toFixed(2) },
              { key: 'zoom',     label: 'Size',     min: 0.4,   max: 2.5,  step: 0.05, fmt: v => v.toFixed(2) },
              { key: 'spacing',  label: 'Spacing',  min: 0.6,   max: 2.4,  step: 0.05, fmt: v => v.toFixed(2) },
              { key: 'rotation', label: 'Rotation', min: -180,  max: 180,  step: 1,    fmt: v => `${v}°` },
            ].map(({ key, label, min, max, step, fmt }) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: T.textLight }}>{label}</span>
                  <code style={{ fontSize: 10, color: T.gold }}>{fmt(editorState[key] ?? buildPatternState()[key])}</code>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={editorState[key] ?? buildPatternState()[key]}
                  onChange={e => setEditorState(s => ({ ...s, [key]: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: T.gold }} />
              </div>
            ))}

            <div className="divider" style={{ margin: '14px 0' }} />

            {/* Remove BG toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', background: T.surfaceAlt, borderRadius: 3,
              border: `1px solid ${editorState.removeBg ? T.gold + '88' : T.border}`, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 12, color: T.text, fontWeight: 500, marginBottom: 2 }}>Remove Background</div>
                <div style={{ fontSize: 10, color: T.textLight }}>Strip white/light background from tile</div>
              </div>
              <label style={{ cursor: 'pointer', position: 'relative', width: 40, height: 22, display: 'block' }}>
                <input type="checkbox" checked={!!editorState.removeBg}
                  onChange={e => setEditorState(s => ({ ...s, removeBg: e.target.checked }))}
                  style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: 11,
                  background: editorState.removeBg ? T.gold : T.border,
                  transition: 'background 0.2s',
                }} />
                <span style={{
                  position: 'absolute', top: 2, left: editorState.removeBg ? 20 : 2,
                  width: 18, height: 18, borderRadius: '50%', background: 'white',
                  transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }} />
              </label>
            </div>

            {/* Reset */}
            <button className="btn-ghost" style={{ width: '100%', fontSize: 10, padding: '7px 0', marginBottom: 6 }}
              onClick={() => setEditorState(s => ({ ...buildPatternState(), section: s.section, imageDataUrl: fileDataUrl }))}>
              Reset to Defaults
            </button>

            {/* Tip */}
            <div style={{ padding: '10px 12px', background: T.surfaceAlt, borderRadius: 3,
              border: `1px solid ${T.border}`, marginTop: 8 }}>
              <p style={{ fontSize: 10, color: T.textLight, lineHeight: 1.6 }}>
                💡 <strong style={{ color: T.gold }}>Tip:</strong> Drag the canvas preview to reposition the pattern tile offset.
              </p>
            </div>
          </div>

          {/* Canvas preview */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minHeight: 500,
            background: `radial-gradient(ellipse at center, ${T.surfaceAlt}, ${T.bg})`,
            borderRadius: 4, border: `1px solid ${T.border}`, padding: 24, gap: 16,
          }}>
            <p style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
              color: T.textLight, marginBottom: 8 }}>Live Preview — drag to reposition</p>

            <UpdatedSareeCanvas
              design={PREVIEW_DESIGN}
              patternState={merged}
              onDrag={(dx, dy) => setEditorState(s => ({ ...s, x: s.x + dx, y: s.y + dy }))}
            />

            <p style={{ fontSize: 10, color: T.textLight, fontStyle: 'italic', textAlign: 'center', maxWidth: 260 }}>
              Pattern shown on the <strong style={{ color: T.gold }}>{editorState.section}</strong> section.
              Change "Apply to" in controls to preview other parts.
            </p>
          </div>
        </div>

        {/* Action bar */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button className="btn-ghost" style={{ padding: '12px 20px' }} onClick={() => setStep(1)}>
            ← Back
          </button>
          <button className="btn-primary" style={{ flex: 1, padding: '13px 0', fontSize: 12 }}
            onClick={saveDesign}>
            ✦ Save Pattern to My Library
          </button>
        </div>
      </div>
    )
  }

  // ── STEP 3 — Saving ───────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: 20, padding: 40 }}>
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `3px solid ${T.border}`, borderTopColor: T.gold,
          animation: 'spin 1s linear infinite',
        }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 24 }}>🧵</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 22, color: T.text,
          fontStyle: 'italic', marginBottom: 6 }}>Saving your pattern...</p>
        <p style={{ fontSize: 10, color: T.textLight, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Uploading to your library
        </p>
      </div>
    </div>
  )
}