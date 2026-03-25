import { useMemo, useRef, useState } from 'react'
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
    if (!imageDataUrl) {
      setFileErr('Choose an image file first')
      return
    }
    const pid = (id || '').trim() || `up_${Date.now()}`
    const nm = (name || '').trim() || (pickedFileName ? pickedFileName.replace(/\.[^.]+$/, '') : 'Uploaded pattern')
    onUpload({
      id: pid,
      name: nm,
      occasion,
      saree_part: section,
      style_type: 'uploaded',
      imageDataUrl,
      fileName: pickedFileName || fileName || '',
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
          <option value="Wedding">Wedding</option><option value="Festival">Festival</option><option value="Party">Party</option>
          <option value="Office">Office</option><option value="Casual">Casual</option><option value="Reception">Reception</option>
        </select>
        <select className="input-field" value={section} onChange={e => setSection(e.target.value)}>
          <option value="body">Body</option>
          <option value="border">Border</option>
          <option value="pallu">Pallu</option>
        </select>
        <input className="input-field" type="file" accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml" onChange={pickFile} />
        <button type="button" className="btn-primary" style={{ gridColumn: '1 / -1' }} onClick={submitUpload}>
          Upload pattern to library
        </button>
      </div>
      {(pickedFileName || fileName) && <p style={{ fontSize: 11, color: T.textLight, marginTop: 8 }}>Ready: {pickedFileName || fileName}{imageDataUrl ? ' ✓' : ''}</p>}
      {fileErr && <p style={{ fontSize: 11, color: T.error, marginTop: 8 }}>{fileErr}</p>}
    </div>
  )
}

export function ControlPanel({ state, onChange }) {
  const row = (label, child) => (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8, alignItems: 'center' }}>
      <span style={{ fontSize: 11, color: T.textLight }}>{label}</span>{child}
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {row('Section', <select className="input-field" value={state.section} onChange={e=>onChange({ section: e.target.value })}><option value="body">Body</option><option value="border">Border</option><option value="pallu">Pallu</option></select>)}
      {row('Repeat', <select className="input-field" value={state.repeatStyle} onChange={e=>onChange({ repeatStyle: e.target.value })}><option value="grid">Grid</option><option value="mirror">Mirror</option><option value="offset">Offset</option></select>)}
      {row('Opacity', <input type="range" min="0.8" max="0.9" step="0.01" value={state.opacity} onChange={e=>onChange({ opacity:Number(e.target.value) })} />)}
      {row('Density', <input type="range" min="0.5" max="2" step="0.05" value={state.density} onChange={e=>onChange({ density:Number(e.target.value) })} />)}
      {row('Size', <input type="range" min="0.4" max="2.5" step="0.05" value={state.zoom} onChange={e=>onChange({ zoom:Number(e.target.value) })} />)}
      {row('Spacing', <input type="range" min="0.6" max="2.4" step="0.05" value={state.spacing} onChange={e=>onChange({ spacing:Number(e.target.value) })} />)}
      {row('Rotate', <input type="range" min="-180" max="180" step="1" value={state.rotation} onChange={e=>onChange({ rotation:Number(e.target.value) })} />)}
      {row('Remove BG', <input type="checkbox" checked={state.removeBg} onChange={e=>onChange({ removeBg:e.target.checked })} />)}
    </div>
  )
}

function PatternOverlay({ pattern, scale }) {
  const w = Math.round(220 * scale)
  const palluH = Math.round(175 * scale)
  const borderH = Math.round(32 * scale)
  const bodyH = Math.round(270 * scale)
  const blouseH = Math.round(65 * scale)
  const top = pattern.section === 'pallu' ? 0 : pattern.section === 'border' ? palluH : palluH + borderH
  const h = pattern.section === 'pallu' ? palluH : pattern.section === 'border' ? borderH : bodyH
  const tile = 120 / (pattern.density * pattern.zoom)
  const pw = tile * pattern.spacing
  const ph = tile * pattern.spacing
  const pid = `up_pat_${Math.round(pw)}_${Math.round(ph)}`
  const transform = `translate(${pattern.x} ${pattern.y}) rotate(${pattern.rotation})`
  const preserve = pattern.removeBg ? 'xMidYMid slice' : 'none'

  return (
    <svg width={w} height={palluH + borderH + bodyH + borderH + blouseH} style={{ position:'absolute', left:0, top:0, pointerEvents:'none' }}>
      <defs>
        <pattern id={pid} patternUnits="userSpaceOnUse" width={pw} height={ph} patternTransform={transform}>
          <image href={pattern.imageDataUrl} x="0" y="0" width={tile} height={tile} preserveAspectRatio={preserve} />
          {pattern.repeatStyle === 'mirror' && <image href={pattern.imageDataUrl} x={tile} y="0" width={tile} height={tile} transform={`scale(-1,1) translate(${-tile*2},0)`} preserveAspectRatio={preserve} />}
          {pattern.repeatStyle === 'offset' && <image href={pattern.imageDataUrl} x={tile/2} y={tile/2} width={tile} height={tile} preserveAspectRatio={preserve} />}
        </pattern>
      </defs>
      <rect x="0" y={top} width={w} height={h} fill={`url(#${pid})`} opacity={pattern.opacity} />
    </svg>
  )
}

export function UpdatedSareeCanvas({ design, patternState, onDrag }) {
  const scale = 0.9
  const dragRef = useRef(null)
  const start = useRef(null)
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
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      style={{ position:'relative', display:'inline-block', cursor:'grab' }}
    >
      <SareeCanvas design={design} scale={scale} />
      {patternState?.imageDataUrl && <PatternOverlay pattern={patternState} scale={scale} />}
    </div>
  )
}

export function PatternEditor({ open, design, pattern, onClose, onSave }) {
  const [state, setState] = useState(pattern?.editor || buildPatternState())
  const merged = useMemo(() => ({ ...buildPatternState(), ...state, imageDataUrl: pattern?.imageDataUrl || '' }), [state, pattern])
  if (!open || !pattern) return null
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div className="card" style={{ width:'min(980px,96vw)', padding:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <h3 style={{ fontFamily:'Cormorant Garamond', fontSize:22, color:T.text }}>PatternEditor - {pattern.name}</h3>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:14 }}>
          <ControlPanel state={merged} onChange={(p)=>setState(s=>({ ...s, ...p }))} />
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:520, background:T.surfaceAlt, border:`1px solid ${T.border}` }}>
            <UpdatedSareeCanvas
              design={design}
              patternState={merged}
              onDrag={(dx,dy)=>setState(s=>({ ...s, x:s.x+dx, y:s.y+dy }))}
            />
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:12 }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={()=>onSave(merged)}>Save Pattern Settings</button>
        </div>
      </div>
    </div>
  )
}

