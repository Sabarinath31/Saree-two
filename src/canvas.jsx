// ─── canvas.jsx ──────────────────────────────────────────────────────────────
// PatternRenderer (50 SVG patterns) + SareeCanvas + exportSareeAsPNG
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { T } from './theme.jsx'

/** Exact same markup as live <PatternRenderer /> (used for PNG export). */
function staticPatternSvgString(patternId, customPattern, color, accent, w, h, svgInstanceKey = 'def') {
  return renderToStaticMarkup(
    <PatternRenderer patternId={patternId} customPattern={customPattern ?? null} color={color} accentColor={accent} width={w} height={h} svgInstanceKey={svgInstanceKey} />
  )
}

function PatternRenderer({ patternId, color = '#8B0000', accentColor = '#C9A843', width = 200, height = 200, customPattern = null, svgInstanceKey = '0' }) {
  const c = color
  const a = accentColor

  // ── Colour helpers — must be defined before patterns object ──────────────────
  const hexLight = (hex, amt) => {
    const n = parseInt((hex||'#888888').replace('#',''), 16)
    const r = Math.min(255, (n>>16)+amt)
    const g = Math.min(255, ((n>>8)&0xff)+amt)
    const b = Math.min(255, (n&0xff)+amt)
    return '#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)
  }
  const hexDark  = (hex, amt) => hexLight(hex, -amt)
  const cLight = hexLight(c, 28)
  const cDark  = hexDark(c, 22)
  const cVDark = hexDark(c, 40)
  const aLight = hexLight(a, 55)
  const aDark  = hexDark(a, 30)

  // ── spacing helpers ───────────────────────────────────────────────────────────
  const W = width, H = height
  // Mango/paisley path at given size (s = half-height)
  const mangoPath = (s) => `M0,${-s} C${s*0.6},${-s*0.9} ${s*0.9},${-s*0.3} ${s*0.5},${s*0.3} C${s*0.8},${s*0.7} ${s*0.3},${s} 0,${s} C${-s*0.4},${s} ${-s*0.5},${s*0.5} ${-s*0.4},${s*0.2} C${-s*0.3},${-s*0.4} ${-s*0.4},${-s*0.8} 0,${-s}Z`
  // 5-petal flower path
  const flowerPetal = (r, ir) => [0,72,144,216,288].map(ang => {
    const x1=(Math.cos((ang-90)*Math.PI/180)*r).toFixed(2), y1=(Math.sin((ang-90)*Math.PI/180)*r).toFixed(2)
    const x2=(Math.cos((ang+36-90)*Math.PI/180)*ir).toFixed(2), y2=(Math.sin((ang+36-90)*Math.PI/180)*ir).toFixed(2)
    const x3=(Math.cos((ang+72-90)*Math.PI/180)*r).toFixed(2), y3=(Math.sin((ang+72-90)*Math.PI/180)*r).toFixed(2)
    return `${ang===0?'M':'L'}${x1},${y1} Q${x2},${y2} ${x3},${y3}`
  }).join(' ')+'Z'

  const patterns = {
    // b1 — Plain Silk: smooth base with subtle weft grain
    b1: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(H/4)},(_,i)=>(
        <line key={i} x1={0} y1={i*4+2} x2={W} y2={i*4+2} stroke={cVDark} strokeWidth="0.3" opacity="0.06"/>
      ))}
    </>,

    // b2 — Stripes: broad zari stripes alternating with body colour, typical Banarasi
    b2: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/24)},(_,i)=>(
        <g key={i}>
          <rect x={i*24} y={0} width={10} height={H} fill={a} opacity="0.55"/>
          <rect x={i*24+1} y={0} width={2} height={H} fill={aLight} opacity="0.4"/>
          <rect x={i*24+7} y={0} width={1} height={H} fill={aLight} opacity="0.25"/>
        </g>
      ))}
    </>,

    // b3 — Checks: Chettinad-style woven checks
    b3: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/20)},(_,i)=>(
        <rect key={`v${i}`} x={i*20} y={0} width={10} height={H} fill={a} opacity="0.18"/>
      ))}
      {Array.from({length:Math.ceil(H/20)},(_,i)=>(
        <rect key={`h${i}`} x={0} y={i*20} width={W} height={10} fill={a} opacity="0.18"/>
      ))}
      {Array.from({length:Math.ceil(W/20)},(_,x)=>Array.from({length:Math.ceil(H/20)},(_,y)=>(
        <rect key={`c${x}-${y}`} x={x*20} y={y*20} width={10} height={10} fill={a} opacity="0.22"/>
      ))).flat()}
      {Array.from({length:Math.ceil(W/20)},(_,i)=>(
        <line key={`vl${i}`} x1={i*20+10} y1={0} x2={i*20+10} y2={H} stroke={a} strokeWidth="0.6" opacity="0.3"/>
      ))}
      {Array.from({length:Math.ceil(H/20)},(_,i)=>(
        <line key={`hl${i}`} x1={0} y1={i*20+10} x2={W} y2={i*20+10} stroke={a} strokeWidth="0.6" opacity="0.3"/>
      ))}
    </>,
    // b4 — Floral Butta: classic mango/teardrop butta in offset rows (Kanjivaram)
    b4: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/40)},(_,x)=>Array.from({length:Math.ceil(H/44)},(_,y)=>{
        const cx=x*40+(y%2===0?20:40), cy=y*44+22, s=8.6
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          <path d={mangoPath(s)} fill={a} opacity="0.82"/>
          <path d={mangoPath(s*0.62)} fill={c} opacity="0.78"/>
          <path d={mangoPath(s*0.35)} fill={a} opacity="0.9"/>
          <circle r="1.5" fill={aLight} opacity="0.95"/>
          <path d={`M0,${-s} C1.2,${-s-3} 3,${-s-2} 2,${-s}`} fill="none" stroke={a} strokeWidth="1" opacity="0.8"/>
        </g>
      })).flat()}
    </>,

    // b5 — Ikat Diamond: Pochampally staggered diamond
    b5: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/28)},(_,x)=>Array.from({length:Math.ceil(H/28)},(_,y)=>{
        const cx=x*28+(y%2===0?14:28), cy=y*28+14
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          <polygon points="0,-9 9,0 0,9 -9,0" fill={a} opacity="0.55"/>
          <polygon points="0,-6 6,0 0,6 -6,0" fill={c} opacity="0.9"/>
          <polygon points="0,-3.5 3.5,0 0,3.5 -3.5,0" fill={a} opacity="0.75"/>
          <line x1="0" y1="-9" x2="0" y2="9" stroke={a} strokeWidth="0.4" opacity="0.3"/>
          <line x1="-9" y1="0" x2="9" y2="0" stroke={a} strokeWidth="0.4" opacity="0.3"/>
        </g>
      })).flat()}
    </>,

    // b6 — Temple Motifs: Kanjivaram 8-petal temple medallion
    b6: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/54)},(_,x)=>Array.from({length:Math.ceil(H/54)},(_,y)=>{
        const cx=x*54+(y%2===0?27:54), cy=y*54+27
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          <circle r="10" fill="none" stroke={a} strokeWidth="1.2" opacity="0.65"/>
          {[0,45,90,135,180,225,270,315].map(ang=>(
            <ellipse key={ang}
              cx={(Math.cos((ang-90)*Math.PI/180)*5.5).toFixed(1)}
              cy={(Math.sin((ang-90)*Math.PI/180)*5.5).toFixed(1)}
              rx="2.2" ry="3.8" fill={a} opacity="0.7"
              transform={`rotate(${ang},${(Math.cos((ang-90)*Math.PI/180)*5.5).toFixed(1)},${(Math.sin((ang-90)*Math.PI/180)*5.5).toFixed(1)})`}
            />
          ))}
          <circle r="3" fill={a} opacity="0.9"/>
          <circle r="1.5" fill={c} opacity="1"/>
          <circle r="0.6" fill={aLight} opacity="1"/>
        </g>
      })).flat()}
    </>,

    // b7 — Peacock Grid: standing peacock with fanned tail (Paithani)
    b7: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/44)},(_,x)=>Array.from({length:Math.ceil(H/46)},(_,y)=>{
        const cx=x*44+(y%2===0?22:44), cy=y*46+23
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          {[-3,-2,-1,0,1,2,3].map(i=>(
            <path key={i} d={`M0,2 C${i*4},${-8+i*i*0.5} ${i*5+2},${-14} ${i*3},${-16}`}
              fill="none" stroke={a} strokeWidth="1.2" opacity={0.55+Math.abs(i)*0.04}/>
          ))}
          {[-2,-1,0,1,2].map(i=>(
            <circle key={i} cx={i*3} cy={-14-i*i*0.4} r="1.2" fill={a} opacity="0.8"/>
          ))}
          <ellipse rx="3.5" ry="5" cy="4" fill={a} opacity="0.8"/>
          <ellipse rx="2" ry="3" cy="4" fill={c} opacity="0.85"/>
          <circle cx="0" cy="-1" r="2.5" fill={a} opacity="0.85"/>
          <circle cx="0" cy="-1" r="1.2" fill={c} opacity="0.9"/>
          <path d="M0,-3.5 C-1,-6 0,-7 1,-6 C2,-5 1,-3.5 0,-3.5Z" fill={a} opacity="0.9"/>
          <circle cx="0" cy="-7" r="1" fill={a} opacity="0.95"/>
          <path d="M1.5,-1 L3.5,-0.5" stroke={a} strokeWidth="0.8" opacity="0.9"/>
          <path d="M-1.5,9 L-2,13 M1.5,9 L2,13" stroke={a} strokeWidth="0.8" opacity="0.6" strokeLinecap="round"/>
        </g>
      })).flat()}
    </>,

    // b8 — Zari Dots: diamond butti scatter in zari
    b8: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/34)},(_,x)=>Array.from({length:Math.ceil(H/34)},(_,y)=>{
        const cx=x*34+(y%2===0?17:34), cy=y*34+17
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          <polygon points="0,-5 5,0 0,5 -5,0" fill={a} opacity="0.75"/>
          <polygon points="0,-3 3,0 0,3 -3,0" fill={c} opacity="0.9"/>
          <polygon points="0,-1.5 1.5,0 0,1.5 -1.5,0" fill={a} opacity="0.9"/>
        </g>
      })).flat()}
    </>,

    // b9 — Bandhani: resist-dye dot clusters in offset grid
    b9: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/36)},(_,x)=>Array.from({length:Math.ceil(H/36)},(_,y)=>{
        const cx=x*36+(y%2===0?18:36), cy=y*36+18
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          <circle r="3.5" fill="none" stroke={a} strokeWidth="1" opacity="0.25"/>
          <circle r="2" fill={a} opacity="0.5"/>
          <circle r="1" fill={c} opacity="0.9"/>
          {[0,90,180,270].map(ang=>(
            <circle key={ang} cx={(Math.cos(ang*Math.PI/180)*4).toFixed(1)} cy={(Math.sin(ang*Math.PI/180)*4).toFixed(1)} r="1.2" fill={a} opacity="0.65"/>
          ))}
        </g>
      })).flat()}
    </>,

    // b10 — Leheriya Wave: diagonal chevron wave stripes (Rajasthani)
    b10: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil((W+H)/14)},(_,i)=>(
        <path key={`d1${i}`} d={`M${i*14-H},0 L${i*14},${H}`}
          fill="none" stroke={a} strokeWidth={i%3===0?1.8:0.8} opacity={i%3===0?0.6:0.3}/>
      ))}
      {Array.from({length:Math.ceil((W+H)/28)},(_,i)=>(
        <path key={`d2${i}`} d={`M${W-i*28+H},0 L${W-i*28},${H}`}
          fill="none" stroke={a} strokeWidth="1.5" opacity="0.45"/>
      ))}
    </>,

    // b11 — Mughal Arch: jaal lattice of pointed arches (Banarasi)
    b11: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/46)},(_,x)=>Array.from({length:Math.ceil(H/48)},(_,y)=>{
        const cx=x*46+23, cy=y*48+24
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          <path d="M-10,12 L-10,-2 C-10,-14 10,-14 10,-2 L10,12"
            fill="none" stroke={a} strokeWidth="1.4" opacity="0.65"/>
          <path d="M-6,12 L-6,0 C-6,-8 6,-8 6,0 L6,12"
            fill="none" stroke={a} strokeWidth="0.7" opacity="0.35"/>
          <polygon points="0,-14 3,-10 0,-8 -3,-10" fill={a} opacity="0.8"/>
          <circle cy="4" r="2.5" fill={a} opacity="0.4"/>
          <circle cy="4" r="1.2" fill={c} opacity="0.9"/>
        </g>
      })).flat()}
    </>,

    // b12 — Geometric: diagonal trellis jaali (Chanderi)
    b12: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil((W+H)/22)},(_,i)=>(
        <line key={`d1${i}`} x1={i*22-H} y1={0} x2={i*22} y2={H} stroke={a} strokeWidth="1" opacity="0.45"/>
      ))}
      {Array.from({length:Math.ceil((W+H)/22)},(_,i)=>(
        <line key={`d2${i}`} x1={W-i*22+H} y1={0} x2={W-i*22} y2={H} stroke={a} strokeWidth="1" opacity="0.45"/>
      ))}
      {Array.from({length:Math.ceil(W/22)},(_,x)=>Array.from({length:Math.ceil(H/22)},(_,y)=>(
        <circle key={`${x}-${y}`} cx={x*22+(y%2===0?0:11)} cy={y*22} r="1.5" fill={a} opacity="0.7"/>
      ))).flat()}
    </>,

    // b13 — Lotus Pattern: 8-petal lotus medallion (Bengal jamdani)
    b13: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/40)},(_,x)=>Array.from({length:Math.ceil(H/40)},(_,y)=>{
        const cx=x*40+(y%2===0?20:40), cy=y*40+20
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          {[0,45,90,135,180,225,270,315].map(ang=>(
            <path key={ang}
              d={`M0,0 C${(Math.cos((ang-20)*Math.PI/180)*5).toFixed(1)},${(Math.sin((ang-20)*Math.PI/180)*5).toFixed(1)} ${(Math.cos((ang-10)*Math.PI/180)*11).toFixed(1)},${(Math.sin((ang-10)*Math.PI/180)*11).toFixed(1)} ${(Math.cos(ang*Math.PI/180)*13).toFixed(1)},${(Math.sin(ang*Math.PI/180)*13).toFixed(1)} C${(Math.cos((ang+10)*Math.PI/180)*11).toFixed(1)},${(Math.sin((ang+10)*Math.PI/180)*11).toFixed(1)} ${(Math.cos((ang+20)*Math.PI/180)*5).toFixed(1)},${(Math.sin((ang+20)*Math.PI/180)*5).toFixed(1)} 0,0Z`}
              fill={a} opacity="0.55"/>
          ))}
          {[22,67,112,157,202,247,292,337].map(ang=>(
            <path key={ang}
              d={`M0,0 C${(Math.cos((ang-15)*Math.PI/180)*3).toFixed(1)},${(Math.sin((ang-15)*Math.PI/180)*3).toFixed(1)} ${(Math.cos(ang*Math.PI/180)*7).toFixed(1)},${(Math.sin(ang*Math.PI/180)*7).toFixed(1)} ${(Math.cos(ang*Math.PI/180)*8).toFixed(1)},${(Math.sin(ang*Math.PI/180)*8).toFixed(1)} C${(Math.cos((ang+15)*Math.PI/180)*3).toFixed(1)},${(Math.sin((ang+15)*Math.PI/180)*3).toFixed(1)} 0,0 0,0Z`}
              fill={a} opacity="0.8"/>
          ))}
          <circle r="3" fill={a} opacity="0.9"/>
          <circle r="1.5" fill={c} opacity="1"/>
          <circle r="0.6" fill={aLight} opacity="1"/>
        </g>
      })).flat()}
    </>,

    // b14 — Warli Art: tribal stick figures
    b14: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/40)},(_,x)=>Array.from({length:Math.ceil(H/40)},(_,y)=>{
        const cx=x*40+(y%2===0?20:40), cy=y*40+20
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          <circle cy="-9" r="2.8" fill={a} opacity="0.75"/>
          <polygon points="0,-6 -4,2 4,2" fill={a} opacity="0.65"/>
          <line x1="-4" y1="-2" x2="-9" y2="-5" stroke={a} strokeWidth="1.2" opacity="0.7" strokeLinecap="round"/>
          <line x1="4" y1="-2" x2="9" y2="-5" stroke={a} strokeWidth="1.2" opacity="0.7" strokeLinecap="round"/>
          <line x1="-2" y1="2" x2="-4" y2="9" stroke={a} strokeWidth="1.2" opacity="0.7" strokeLinecap="round"/>
          <line x1="2" y1="2" x2="4" y2="9" stroke={a} strokeWidth="1.2" opacity="0.7" strokeLinecap="round"/>
        </g>
      })).flat()}
    </>,

    // b15 — Kashmiri Floral: 5-petal chinar flower (sozni)
    b15: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/36)},(_,x)=>Array.from({length:Math.ceil(H/36)},(_,y)=>{
        const cx=x*36+(y%2===0?18:36), cy=y*36+18
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          {[0,72,144,216,288].map(ang=>(
            <path key={ang}
              d={`M0,0 C${(Math.cos((ang-25-90)*Math.PI/180)*4).toFixed(1)},${(Math.sin((ang-25-90)*Math.PI/180)*4).toFixed(1)} ${(Math.cos((ang-90)*Math.PI/180)*10).toFixed(1)},${(Math.sin((ang-90)*Math.PI/180)*10).toFixed(1)} ${(Math.cos((ang-90)*Math.PI/180)*11).toFixed(1)},${(Math.sin((ang-90)*Math.PI/180)*11).toFixed(1)} C${(Math.cos((ang+25-90)*Math.PI/180)*4).toFixed(1)},${(Math.sin((ang+25-90)*Math.PI/180)*4).toFixed(1)} 0,0 0,0Z`}
              fill={a} opacity="0.7"/>
          ))}
          {[36,108,180,252,324].map(ang=>(
            <line key={ang} x1="0" y1="0" x2={(Math.cos((ang-90)*Math.PI/180)*9).toFixed(1)} y2={(Math.sin((ang-90)*Math.PI/180)*9).toFixed(1)} stroke={a} strokeWidth="0.6" opacity="0.3"/>
          ))}
          <circle r="2.5" fill={a} opacity="0.9"/>
          <circle r="1.2" fill={c} opacity="1"/>
        </g>
      })).flat()}
    </>,

    // b16 — Pinstripe: fine warp pin stripes (linen/office)
    b16: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/8)},(_,i)=>(
        <g key={i}>
          <rect x={i*8} y={0} width={i%4===0?2:0.8} height={H} fill={a} opacity={i%4===0?0.55:0.2}/>
          {i%4===0 && <rect x={i*8+0.5} y={0} width={0.5} height={H} fill={aLight} opacity="0.35"/>}
        </g>
      ))}
    </>,

    // b17 — Meenakari: enamel-jewel rosette (Jaipur)
    b17: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/36)},(_,x)=>Array.from({length:Math.ceil(H/36)},(_,y)=>{
        const cx=x*36+(y%2===0?18:36), cy=y*36+18
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          <circle r="11" fill="none" stroke={a} strokeWidth="1.5" opacity="0.7"/>
          {[0,60,120,180,240,300].map(ang=>(
            <g key={ang} transform={`rotate(${ang})`}>
              <ellipse cy="-7" rx="2.2" ry="3.5" fill={a} opacity="0.72"/>
              <ellipse cy="-7" rx="1.2" ry="2" fill={c} opacity="0.9"/>
              <circle cy="-9.5" r="1" fill={aLight} opacity="0.9"/>
            </g>
          ))}
          <circle r="3.5" fill={a} opacity="0.85"/>
          <circle r="2" fill={c} opacity="1"/>
          <circle r="0.8" fill={aLight} opacity="1"/>
        </g>
      })).flat()}
    </>,
  }

  const border_patterns = {
    // br1 — Single Kasavu: Kerala single gold band
    br1: <>
      <rect width={W} height={H} fill={c} />
      <rect y={H*0.22} width={W} height={H*0.56} fill={a} opacity="0.85"/>
      <rect y={H*0.22} width={W} height={H*0.06} fill={aLight} opacity="0.55"/>
      <rect y={H*0.72} width={W} height={H*0.06} fill={aLight} opacity="0.45"/>
    </>,

    // br2 — Double Kasavu: two Kerala gold bands
    br2: <>
      <rect width={W} height={H} fill={c} />
      <rect y={0} width={W} height={H*0.28} fill={a} opacity="0.85"/>
      <rect y={H*0.72} width={W} height={H*0.28} fill={a} opacity="0.85"/>
      <rect y={0} width={W} height={H*0.05} fill={aLight} opacity="0.55"/>
      <rect y={H*0.23} width={W} height={H*0.05} fill={aLight} opacity="0.45"/>
      <rect y={H*0.72} width={W} height={H*0.05} fill={aLight} opacity="0.55"/>
      <rect y={H*0.95} width={W} height={H*0.05} fill={aLight} opacity="0.45"/>
    </>,

    // br3 — Temple Border: repeating gopuram arch silhouettes on gold
    br3: <>
      <rect width={W} height={H} fill={a} />
      {Array.from({length:Math.ceil(W/3)},(_,i)=>(
        <line key={`v${i}`} x1={i*3} y1={0} x2={i*3} y2={H} stroke={cVDark} strokeWidth="0.35" opacity="0.1"/>
      ))}
      {Array.from({length:Math.ceil(W/20)},(_,i)=>{
        const cx=i*20+10, top=H*0.05, base=H*0.95, ht=H*0.9
        return <g key={i} transform={`translate(${cx},0)`}>
          <path d={`M-5,${base} L-5,${top+ht*0.35} C-5,${top} 5,${top} 5,${top+ht*0.35} L5,${base}Z`} fill={c} opacity="0.78"/>
          <path d={`M-3,${base} L-3,${top+ht*0.42} C-3,${top+H*0.08} 3,${top+H*0.08} 3,${top+ht*0.42} L3,${base}`} fill="none" stroke={c} strokeWidth="0.5" opacity="0.4"/>
          <polygon points={`0,${top-H*0.04} 2.5,${top+H*0.1} -2.5,${top+H*0.1}`} fill={c} opacity="0.9"/>
          <circle cy={top-H*0.08} r="1.5" fill={c} opacity="0.9"/>
        </g>
      })}
      <rect y={0} width={W} height="2.5" fill={aLight} opacity="0.7"/>
      <rect y={H-2.5} width={W} height="2.5" fill={aLight} opacity="0.7"/>
    </>,

    // br4 — Mango Border: proper paisley mango motifs in a row
    br4: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/22)},(_,i)=>{
        const cx=i*22+11, s=H*0.42
        return <g key={i} transform={`translate(${cx},${H/2})`}>
          <path d={mangoPath(s)} fill={a} opacity="0.78"/>
          <path d={mangoPath(s*0.62)} fill={c} opacity="0.8"/>
          <path d={mangoPath(s*0.35)} fill={a} opacity="0.85"/>
          <circle r="1.8" fill={aLight} opacity="0.9"/>
          <path d={`M0,${-s} C1,${-s-H*0.12} 2.5,${-s-H*0.1} 2,${-s}`} fill="none" stroke={a} strokeWidth="0.9" opacity="0.8"/>
        </g>
      })}
      <line x1={0} y1={H*0.06} x2={W} y2={H*0.06} stroke={a} strokeWidth="0.8" opacity="0.4"/>
      <line x1={0} y1={H*0.94} x2={W} y2={H*0.94} stroke={a} strokeWidth="0.8" opacity="0.4"/>
    </>,

    // br5 — Peacock Border: walking peacock silhouette row
    br5: <>
      <rect width={W} height={H} fill={c} />
      <line x1={0} y1={H*0.1} x2={W} y2={H*0.1} stroke={a} strokeWidth="0.7" opacity="0.4"/>
      <line x1={0} y1={H*0.9} x2={W} y2={H*0.9} stroke={a} strokeWidth="0.7" opacity="0.4"/>
      {Array.from({length:Math.ceil(W/38)},(_,i)=>{
        const cx=i*38+19, cy=H/2
        return <g key={i} transform={`translate(${cx},${cy})`}>
          {[-2,-1,0,1,2].map(j=>(
            <path key={j} d={`M-2,0 C${j*3-1},${-H*0.28} ${j*4},${-H*0.38} ${j*3},${-H*0.42}`} fill="none" stroke={a} strokeWidth="1.1" opacity="0.6"/>
          ))}
          {[-2,-1,0,1,2].map(j=>(
            <circle key={j} cx={j*3} cy={-H*0.42} r="1.2" fill={a} opacity="0.8"/>
          ))}
          <ellipse cx="-1" cy="2" rx="4" ry="3" fill={a} opacity="0.8"/>
          <ellipse cx="-1" cy="2" rx="2.5" ry="3" fill={c} opacity="0.7"/>
          <path d="M1.5,-3 C2.5,-6 1,-9 0,-8" stroke={a} strokeWidth="1.4" fill="none" opacity="0.85" strokeLinecap="round"/>
          <circle cx="0" cy="-9" r="2" fill={a} opacity="0.85"/>
          <circle cx="0.5" cy="-9.5" r="0.7" fill={c} opacity="1"/>
          <path d="M0,-11 C0,-14 -1,-15 0.5,-14" fill="none" stroke={a} strokeWidth="0.8" opacity="0.8"/>
          <circle cx="0.5" cy="-14" r="0.8" fill={a} opacity="0.9"/>
          <line x1="-3" y1="5" x2="-4" y2={H*0.38} stroke={a} strokeWidth="0.8" opacity="0.65" strokeLinecap="round"/>
          <line x1="0" y1="5" x2="0" y2={H*0.38} stroke={a} strokeWidth="0.8" opacity="0.65" strokeLinecap="round"/>
        </g>
      })}
    </>,

    // br6 — Broad Zari: solid woven gold band
    br6: <>
      <rect width={W} height={H} fill={a} />
      {Array.from({length:Math.ceil(W/2.5)},(_,i)=>(
        <line key={`v${i}`} x1={i*2.5} y1={0} x2={i*2.5} y2={H} stroke={cVDark} strokeWidth="0.5" opacity="0.09"/>
      ))}
      {Array.from({length:Math.ceil(H/2.5)},(_,i)=>(
        <line key={`h${i}`} x1={0} y1={i*2.5} x2={W} y2={i*2.5} stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" opacity="0.18"/>
      ))}
      <rect y={H*0.28} width={W} height={H*0.44} fill="rgba(255,255,255,0.14)"/>
      <rect y={0} width={W} height="3" fill={aLight} opacity="0.85"/>
      <rect y="1" width={W} height="1" fill="rgba(255,255,255,0.6)"/>
      <rect y={H-3} width={W} height="3" fill={aLight} opacity="0.85"/>
      <rect y={H-2} width={W} height="1" fill="rgba(255,255,255,0.55)"/>
    </>,

    // br7 — Thin Gold Line: single fine gold line (office/linen)
    br7: <>
      <rect width={W} height={H} fill={c} />
      <rect y={H*0.35} width={W} height={H*0.3} fill={a} opacity="0.82"/>
      <rect y={H*0.35} width={W} height={H*0.07} fill={aLight} opacity="0.45"/>
    </>,

    // br8 — Floral Chain: S-vine with 5-petal flowers
    br8: <>
      <rect width={W} height={H} fill={c} />
      <path d={`M0,${H/2} ` + Array.from({length:Math.ceil(W/20)+1},(_,i)=>`C${i*20+5},${H*0.15} ${i*20+15},${H*0.85} ${(i+1)*20},${H/2}`).join(' ')}
        fill="none" stroke={a} strokeWidth="1.2" opacity="0.6"/>
      {Array.from({length:Math.ceil(W/20)},(_,i)=>(
        <g key={i} transform={`translate(${i*20+10},${i%2===0?H*0.18:H*0.82})`}>
          {[0,72,144,216,288].map(ang=>(
            <ellipse key={ang}
              cx={(Math.cos((ang-90)*Math.PI/180)*3.5).toFixed(1)}
              cy={(Math.sin((ang-90)*Math.PI/180)*3.5).toFixed(1)}
              rx="1.5" ry="2.5" fill={a} opacity="0.7"
              transform={`rotate(${ang},${(Math.cos((ang-90)*Math.PI/180)*3.5).toFixed(1)},${(Math.sin((ang-90)*Math.PI/180)*3.5).toFixed(1)})`}
            />
          ))}
          <circle r="1.5" fill={a} opacity="0.9"/>
          <circle r="0.7" fill={c} opacity="1"/>
        </g>
      ))}
      <line x1={0} y1={H*0.05} x2={W} y2={H*0.05} stroke={a} strokeWidth="0.6" opacity="0.35"/>
      <line x1={0} y1={H*0.95} x2={W} y2={H*0.95} stroke={a} strokeWidth="0.6" opacity="0.35"/>
    </>,

    // br9 — Geo Steps: stepped staircase geometric band
    br9: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/20)},(_,i)=>(
        <g key={i} transform={`translate(${i*20},0)`}>
          <rect x={0} y={0} width={17} height={H*0.3} fill={a} opacity="0.7"/>
          <rect x={2} y={H*0.3} width={13} height={H*0.4} fill={a} opacity="0.55"/>
          <rect x={4} y={H*0.7} width={9} height={H*0.3} fill={a} opacity="0.4"/>
        </g>
      ))}
    </>,

    // br10 — Wave Border: undulating wave
    br10: <>
      <rect width={W} height={H} fill={c} />
      <path d={`M0,${H*0.5} ` + Array.from({length:Math.ceil(W/20)+1},(_,i)=>`Q${i*20+10},${i%2===0?H*0.1:H*0.9} ${(i+1)*20},${H*0.5}`).join(' ')}
        fill={a} opacity="0.5"/>
      <path d={`M0,${H*0.5} ` + Array.from({length:Math.ceil(W/20)+1},(_,i)=>`Q${i*20+10},${i%2===0?H*0.1:H*0.9} ${(i+1)*20},${H*0.5}`).join(' ')}
        fill="none" stroke={a} strokeWidth="1.5" opacity="0.7"/>
    </>,

    // br11 — Diamond Chain: linked diamond chain
    br11: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/22)},(_,i)=>{
        const cx=i*22+11, hs=H*0.42
        return <g key={i} transform={`translate(${cx},${H/2})`}>
          <polygon points={`0,${-hs} ${hs},0 0,${hs} ${-hs},0`} fill="none" stroke={a} strokeWidth="1.3" opacity="0.75"/>
          <polygon points={`0,${-hs*0.55} ${hs*0.55},0 0,${hs*0.55} ${-hs*0.55},0`} fill={a} opacity="0.35"/>
          <circle r="2" fill={a} opacity="0.85"/>
          <circle r="0.9" fill={c} opacity="1"/>
        </g>
      })}
      <line x1={0} y1={H/2} x2={W} y2={H/2} stroke={a} strokeWidth="0.6" opacity="0.25"/>
    </>,

    // br12 — Lotus Row: side-profile lotus buds
    br12: <>
      <rect width={W} height={H} fill={c} />
      <line x1={0} y1={H*0.5} x2={W} y2={H*0.5} stroke={a} strokeWidth="0.7" opacity="0.3"/>
      {Array.from({length:Math.ceil(W/24)},(_,i)=>{
        const cx=i*24+12
        return <g key={i} transform={`translate(${cx},${H/2})`}>
          <line x1={0} y1={0} x2={0} y2={H*0.38} stroke={a} strokeWidth="0.9" opacity="0.5"/>
          <ellipse cx="-3.5" cy={-H*0.15} rx="2.5" ry={H*0.28} fill={a} opacity="0.55" transform="rotate(-15,-3.5,0)"/>
          <ellipse cx="3.5" cy={-H*0.15} rx="2.5" ry={H*0.28} fill={a} opacity="0.55" transform="rotate(15,3.5,0)"/>
          <ellipse cy={-H*0.2} rx="2.8" ry={H*0.33} fill={a} opacity="0.72"/>
          <circle cy={-H*0.32} r="2" fill={a} opacity="0.85"/>
          <circle cy={-H*0.32} r="1" fill={c} opacity="1"/>
        </g>
      })}
    </>,
  }

  const pallu_patterns = {
    // p1 — Rich Zari Pallu: gold brocade with star butti scatter
    p1: <>
      <rect width={W} height={H} fill={a} />
      {Array.from({length:Math.ceil(W/5)},(_,i)=>(
        <line key={`v${i}`} x1={i*5} y1={0} x2={i*5} y2={H} stroke={cVDark} strokeWidth="0.5" opacity="0.12"/>
      ))}
      {Array.from({length:Math.ceil(H/5)},(_,i)=>(
        <line key={`h${i}`} x1={0} y1={i*5} x2={W} y2={i*5} stroke="rgba(255,255,255,0.1)" strokeWidth="0.4" opacity="0.15"/>
      ))}
      {Array.from({length:Math.ceil(W/22)},(_,x)=>Array.from({length:Math.ceil(H/22)},(_,y)=>{
        const cx=x*22+(y%2===0?11:22), cy=y*22+11
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          {[0,45,90,135].map(ang=>(
            <line key={ang} x1={(Math.cos(ang*Math.PI/180)*6).toFixed(1)} y1={(Math.sin(ang*Math.PI/180)*6).toFixed(1)} x2={(Math.cos((ang+180)*Math.PI/180)*6).toFixed(1)} y2={(Math.sin((ang+180)*Math.PI/180)*6).toFixed(1)} stroke={c} strokeWidth="1" opacity="0.3"/>
          ))}
          <circle r="2" fill={c} opacity="0.4"/>
          <circle r="1" fill={c} opacity="0.7"/>
        </g>
      })).flat()}
      <rect y={0} width={W} height="3" fill={aLight} opacity="0.7"/>
      <rect y={H-3} width={W} height="3" fill={aLight} opacity="0.7"/>
    </>,

    // p2 — Contrast Pallu: body-colour top, gold bottom with mango transition
    p2: <>
      <rect width={W} height={H} fill={c} />
      <rect y={H*0.55} width={W} height={H*0.45} fill={a} opacity="0.92"/>
      {Array.from({length:Math.ceil(W/18)},(_,i)=>{
        const s=H*0.07
        return <g key={i} transform={`translate(${i*18+9},${H*0.55})`}>
          <path d={mangoPath(s)} fill={a} opacity="0.85"/>
          <path d={mangoPath(s*0.55)} fill={c} opacity="0.8"/>
        </g>
      })}
      {Array.from({length:Math.ceil(W/4)},(_,i)=>(
        <line key={i} x1={i*4} y1={H*0.55} x2={i*4} y2={H} stroke={cVDark} strokeWidth="0.4" opacity="0.1"/>
      ))}
    </>,

    // p3 — Peacock Pallu: large peacock feather eye (Paithani)
    p3: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/42)},(_,x)=>Array.from({length:Math.ceil(H/44)},(_,y)=>{
        const cx=x*42+(y%2===0?21:42), cy=y*44+22
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          {[0,20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,340].map(ang=>(
            <line key={ang}
              x1={(Math.cos((ang-90)*Math.PI/180)*4).toFixed(1)}
              y1={(Math.sin((ang-90)*Math.PI/180)*4).toFixed(1)}
              x2={(Math.cos((ang-90)*Math.PI/180)*14).toFixed(1)}
              y2={(Math.sin((ang-90)*Math.PI/180)*14).toFixed(1)}
              stroke={a} strokeWidth="0.7" opacity="0.4"/>
          ))}
          <circle r="14" fill="none" stroke={a} strokeWidth="1.2" opacity="0.5"/>
          <circle r="9" fill="none" stroke={a} strokeWidth="0.8" opacity="0.4"/>
          <circle r="5" fill={a} opacity="0.45"/>
          <circle r="3" fill={a} opacity="0.65"/>
          <circle r="1.8" fill={c} opacity="1"/>
          <circle r="0.7" fill={aLight} opacity="1"/>
        </g>
      })).flat()}
    </>,

    // p4 — Floral Pallu: diagonal vine with 5-petal flowers
    p4: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:3},(_,j)=>(
        <path key={j}
          d={`M${j*W/3-20},0 C${j*W/3+W/6},${H/4} ${j*W/3-W/8},${H/2} ${j*W/3+W/5},${H*0.75} C${j*W/3+W/3},${H} ${j*W/3+W/5},${H} ${j*W/3+W/3},${H}`}
          fill="none" stroke={a} strokeWidth="1.3" opacity="0.45"/>
      ))}
      {Array.from({length:Math.ceil(W/34)},(_,x)=>Array.from({length:Math.ceil(H/36)},(_,y)=>{
        const cx=x*34+(y%2===0?17:34), cy=y*36+18
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          {[0,72,144,216,288].map(ang=>(
            <ellipse key={ang}
              cx={(Math.cos((ang-90)*Math.PI/180)*5).toFixed(1)}
              cy={(Math.sin((ang-90)*Math.PI/180)*5).toFixed(1)}
              rx="2" ry="3.5" fill={a} opacity="0.65"
              transform={`rotate(${ang},${(Math.cos((ang-90)*Math.PI/180)*5).toFixed(1)},${(Math.sin((ang-90)*Math.PI/180)*5).toFixed(1)})`}
            />
          ))}
          <circle r="2" fill={a} opacity="0.9"/>
          <circle r="1" fill={c} opacity="1"/>
        </g>
      })).flat()}
    </>,

    // p5 — Minimal Pallu: plain woven grain (office/linen)
    p5: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(H/4)},(_,i)=>(
        <line key={i} x1={0} y1={i*4+2} x2={W} y2={i*4+2} stroke={cVDark} strokeWidth="0.35" opacity="0.07"/>
      ))}
      {Array.from({length:Math.ceil(W/4)},(_,i)=>(
        <line key={`v${i}`} x1={i*4+2} y1={0} x2={i*4+2} y2={H} stroke={cVDark} strokeWidth="0.25" opacity="0.05"/>
      ))}
    </>,

    // p6 — Temple Arch Pallu: column of gopuram spires
    p6: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/44)},(_,x)=>Array.from({length:Math.ceil(H/52)},(_,y)=>{
        const cx=x*44+22, cy=y*52+26
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          <path d={`M-10,36 L-10,8 C-10,-6 10,-6 10,8 L10,36`} fill="none" stroke={a} strokeWidth="1.5" opacity="0.65"/>
          <path d={`M-6,36 L-6,11 C-6,2 6,2 6,11 L6,36`} fill="none" stroke={a} strokeWidth="0.8" opacity="0.35"/>
          <rect x="-8" y="-2" width="16" height="4" fill={a} opacity="0.55" rx="1"/>
          <rect x="-6" y="-8" width="12" height="4" fill={a} opacity="0.55" rx="1"/>
          <rect x="-4" y="-14" width="8" height="4" fill={a} opacity="0.55" rx="1"/>
          <rect x="-2" y="-19" width="4" height="4" fill={a} opacity="0.55" rx="1"/>
          <circle cy="-22" r="2.5" fill={a} opacity="0.85"/>
          <circle cy="-22" r="1.2" fill={c} opacity="1"/>
        </g>
      })).flat()}
    </>,

    // p7 — Mughal Garden: Banarasi jaal trellis with rosettes
    p7: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil((W+H)/24)},(_,i)=>(
        <line key={`d1${i}`} x1={i*24-H} y1={0} x2={i*24} y2={H} stroke={a} strokeWidth="0.7" opacity="0.22"/>
      ))}
      {Array.from({length:Math.ceil((W+H)/24)},(_,i)=>(
        <line key={`d2${i}`} x1={W-i*24+H} y1={0} x2={W-i*24} y2={H} stroke={a} strokeWidth="0.7" opacity="0.22"/>
      ))}
      {Array.from({length:Math.ceil(W/34)},(_,x)=>Array.from({length:Math.ceil(H/34)},(_,y)=>{
        const cx=x*34+(y%2===0?0:17), cy=y*34
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          {[0,60,120,180,240,300].map(ang=>(
            <ellipse key={ang}
              cx={(Math.cos((ang-90)*Math.PI/180)*3.5).toFixed(1)}
              cy={(Math.sin((ang-90)*Math.PI/180)*3.5).toFixed(1)}
              rx="1.3" ry="2.2" fill={a} opacity="0.55"
              transform={`rotate(${ang},${(Math.cos((ang-90)*Math.PI/180)*3.5).toFixed(1)},${(Math.sin((ang-90)*Math.PI/180)*3.5).toFixed(1)})`}
            />
          ))}
          <circle r="1.8" fill={a} opacity="0.7"/>
          <circle r="0.8" fill={c} opacity="1"/>
        </g>
      })).flat()}
    </>,

    // p8 — Butta Scatter: dense mango butta in two alternating orientations
    p8: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/40)},(_,x)=>Array.from({length:Math.ceil(H/36)},(_,y)=>{
        const cx=x*40+(y%2===0?20:40), cy=y*36+18, s=6.2, flip=y%3===0?-1:1
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy}) scale(${flip},1)`}>
          <path d={mangoPath(s)} fill={a} opacity="0.75"/>
          <path d={mangoPath(s*0.58)} fill={c} opacity="0.8"/>
          <path d={mangoPath(s*0.32)} fill={a} opacity="0.85"/>
          <path d={`M0,${-s} C0.8,${-s-2.5} 2,${-s-2} 1.5,${-s}`} fill="none" stroke={a} strokeWidth="0.8" opacity="0.7"/>
        </g>
      })).flat()}
    </>,

    // p9 — Stripe Pallu: wide alternating body/zari stripes
    p9: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/20)},(_,i)=>(
        <g key={i}>
          <rect x={i*20} y={0} width={i%3===0?12:6} height={H} fill={a} opacity={i%3===0?0.65:0.35}/>
          {i%3===0 && <rect x={i*20+1} y={0} width={1.5} height={H} fill={aLight} opacity="0.4"/>}
        </g>
      ))}
    </>,

    // p10 — Embroidered Vines: S-vine with rotating leaves (designer)
    p10: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:2},(_,j)=>(
        <path key={j}
          d={`M${j*W/2},0 C${j*W/2+W/4},${H/5} ${j*W/2-W/6},${H*0.4} ${j*W/2+W/6},${H*0.6} C${j*W/2+W/4},${H*0.8} ${j*W/2},${H} ${j*W/2+W/4},${H}`}
          fill="none" stroke={a} strokeWidth="1.4" opacity="0.5"/>
      ))}
      {Array.from({length:Math.ceil(H/22)},(_,i)=>{
        const cx=W/4+Math.sin(i*1.3)*W/5, cy=i*22+11
        return <g key={i} transform={`translate(${cx},${cy}) rotate(${i*35})`}>
          <ellipse rx="5" ry="9" fill={a} opacity="0.5"/>
          <line x1="0" y1="-9" x2="0" y2="9" stroke={a} strokeWidth="0.7" opacity="0.5"/>
        </g>
      })}
    </>,

    // p11 — Kashmiri Pallu: 5-lobe chinar leaf clusters
    p11: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/38)},(_,x)=>Array.from({length:Math.ceil(H/38)},(_,y)=>{
        const cx=x*38+(y%2===0?19:38), cy=y*38+19
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          {[0,72,144,216,288].map(ang=>(
            <path key={ang}
              d={`M0,0 C${(Math.cos((ang-30-90)*Math.PI/180)*4).toFixed(1)},${(Math.sin((ang-30-90)*Math.PI/180)*4).toFixed(1)} ${(Math.cos((ang-90)*Math.PI/180)*11).toFixed(1)},${(Math.sin((ang-90)*Math.PI/180)*11).toFixed(1)} ${(Math.cos((ang-90)*Math.PI/180)*12).toFixed(1)},${(Math.sin((ang-90)*Math.PI/180)*12).toFixed(1)} C${(Math.cos((ang+30-90)*Math.PI/180)*4).toFixed(1)},${(Math.sin((ang+30-90)*Math.PI/180)*4).toFixed(1)} 0,0 0,0Z`}
              fill={a} opacity="0.55"/>
          ))}
          <circle r="2.5" fill={a} opacity="0.85"/>
          <circle r="1.2" fill={c} opacity="1"/>
        </g>
      })).flat()}
    </>,

    // p12 — Geometric Pallu: interlocking hexagonal trellis
    p12: <>
      <rect width={W} height={H} fill={c} />
      {Array.from({length:Math.ceil(W/26)},(_,x)=>Array.from({length:Math.ceil(H/24)},(_,y)=>{
        const cx=x*26+(y%2===0?0:13), cy=y*24, r=9
        const pts=[0,60,120,180,240,300].map(ang=>`${(Math.cos((ang-90)*Math.PI/180)*r).toFixed(1)},${(Math.sin((ang-90)*Math.PI/180)*r).toFixed(1)}`).join(' ')
        return <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
          <polygon points={pts} fill="none" stroke={a} strokeWidth="1" opacity="0.55"/>
          <circle r="2" fill={a} opacity="0.45"/>
          <circle r="0.9" fill={aLight} opacity="0.8"/>
        </g>
      })).flat()}
    </>,
  }

  const part = patternId?.startsWith('br') ? border_patterns : patternId?.startsWith('p') ? pallu_patterns : patterns
  const isBorder = patternId?.startsWith('br')
  const isPallu  = patternId?.startsWith('p')
  const customImageUrl = customPattern?.image_data_url || customPattern?.imageDataUrl || ''
  const editor = customPattern?.editor || {}
  const density = Number(editor.density || 1)
  const zoom = Number(editor.zoom || 1)
  const spacing = Number(editor.spacing || 1.18)
  const tile = Math.max(36, Math.round((90 / (density * zoom))))
  const tileW = Math.max(36, Math.round(tile * spacing))
  const tileH = Math.max(36, Math.round(tile * spacing))
  const opacity = Math.min(0.9, Math.max(0.8, Number(editor.opacity || 0.86)))

  const safePid = String(patternId || 'x').replace(/[^a-zA-Z0-9]/g, '_')
  const safeInst = String(svgInstanceKey || '0').replace(/[^a-zA-Z0-9]/g, '_')
  const uid = `${safePid}_${Math.round(width)}_${Math.round(height)}_${safeInst}`

  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
      <defs>
        <linearGradient id={`silk_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={cLight}  stopOpacity="0.9" />
          <stop offset="30%"  stopColor={c}        stopOpacity="1"   />
          <stop offset="55%"  stopColor={cDark}    stopOpacity="1"   />
          <stop offset="75%"  stopColor={c}        stopOpacity="1"   />
          <stop offset="100%" stopColor={cLight}   stopOpacity="0.85"/>
        </linearGradient>
        <linearGradient id={`zari_${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={aLight}  stopOpacity="1"  />
          <stop offset="25%"  stopColor={a}        stopOpacity="1"  />
          <stop offset="50%"  stopColor={aDark}   stopOpacity="1"  />
          <stop offset="75%"  stopColor={a}        stopOpacity="1"  />
          <stop offset="100%" stopColor={aLight}  stopOpacity="0.9"/>
        </linearGradient>
        <filter id={`weave_${uid}`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75 0.45" numOctaves="5" seed="8" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
          <feComponentTransfer in="grey" result="lightened">
            <feFuncA type="linear" slope="0.3" intercept="0"/>
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="lightened" mode="soft-light" result="blended" />
          <feComposite in="blended" in2="SourceGraphic" operator="in" />
        </filter>
        <pattern id={`weft_${uid}`} x="0" y="0" width={width} height="3" patternUnits="userSpaceOnUse">
          <line x1="0" y1="1.5" x2={width} y2="1.5" stroke={cDark} strokeWidth="0.4" opacity="0.18" />
        </pattern>
        <pattern id={`warp_${uid}`} x="0" y="0" width="3" height={height} patternUnits="userSpaceOnUse">
          <line x1="1.5" y1="0" x2="1.5" y2={height} stroke={cDark} strokeWidth="0.3" opacity="0.08" />
        </pattern>
        <linearGradient id={`fold_${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.18" />
          <stop offset="15%"  stopColor="#000" stopOpacity="0"    />
          <stop offset="45%"  stopColor="#000" stopOpacity="0.06" />
          <stop offset="60%"  stopColor="#000" stopOpacity="0"    />
          <stop offset="82%"  stopColor="#000" stopOpacity="0.1"  />
          <stop offset="100%" stopColor="#000" stopOpacity="0.2"  />
        </linearGradient>
        <linearGradient id={`vignette_${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.2"  />
          <stop offset="12%"  stopColor="#000" stopOpacity="0"    />
          <stop offset="88%"  stopColor="#000" stopOpacity="0"    />
          <stop offset="100%" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id={`shimmer_${uid}`} x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%"   stopColor="#fff" stopOpacity="0"    />
          <stop offset="40%"  stopColor="#fff" stopOpacity="0"    />
          <stop offset="52%"  stopColor="#fff" stopOpacity="0.07" />
          <stop offset="64%"  stopColor="#fff" stopOpacity="0"    />
          <stop offset="100%" stopColor="#fff" stopOpacity="0"    />
        </linearGradient>
      </defs>

      <g filter={`url(#weave_${uid})`}>
        {customImageUrl ? (
          <>
            <defs>
              <pattern id={`up_${uid}`} x="0" y="0" width={tileW} height={tileH} patternUnits="userSpaceOnUse">
                <image href={customImageUrl} x="0" y="0" width={tile} height={tile} preserveAspectRatio="xMidYMid slice" />
              </pattern>
            </defs>
            <rect width={width} height={height} fill={c} />
            <rect width={width} height={height} fill={`url(#up_${uid})`} opacity={opacity} />
          </>
        ) : (part[patternId] || <rect width={width} height={height} fill={c} />)}
      </g>

      <rect width={width} height={height} fill={`url(#warp_${uid})`} pointerEvents="none" />
      <rect width={width} height={height} fill={`url(#silk_${uid})`}
        opacity={isBorder ? 0.45 : isPallu ? 0.5 : 0.42}
        style={{mixBlendMode:'overlay'}} pointerEvents="none" />
      <rect width={width} height={height} fill={`url(#fold_${uid})`} pointerEvents="none" />
      <rect width={width} height={height} fill={`url(#vignette_${uid})`} pointerEvents="none" />
      {isPallu && (
        <rect width={width} height={height} fill={`url(#shimmer_${uid})`} pointerEvents="none" />
      )}
    </svg>
  )
}

// ─── SAREE CANVAS ─────────────────────────────────────────────────────────────
// ✅ FIX: Restored full saree length — palluH 160, bodyH 340 (matching export)
function SareeCanvas({ design, scale = 1, patternMap = {} }) {
  // ── Dimensions ──────────────────────────────────────────────────────────────
  const sw       = Math.round(200 * scale)  // saree width
  const palluH   = Math.round(160 * scale)  // ✅ restored: was 130, now 160
  const borderH  = Math.round(26 * scale)   // border band height
  const bodyH    = Math.round(340 * scale)  // ✅ restored: was 200, now 340
  const zW       = Math.round(16 * scale)   // zari side strip width
  const pleatBorderH = Math.round(18 * scale)

  // Blouse panel
  const blouseW  = Math.round(100 * scale)
  const blouseH  = Math.round(120 * scale)
  const gap      = Math.round(14 * scale)

  const ac       = design.accentColor || '#C9A843'
  const acDark   = '#8B6914'
  const pc       = design.primaryColor || '#8B0000'
  const sc       = design.secondaryColor || '#F5F5DC'

  const blousePatternId = design.blousePattern || design.bodyPattern
  const blouseColor     = design.blouseColor   || sc
  const blouseCustom    = patternMap?.[blousePatternId]

  const ZariStrip = ({ side, height }) => (
    <div style={{
      position: 'absolute', top: 0, [side]: 0, bottom: 0, width: zW,
      background: side === 'left'
        ? `linear-gradient(90deg,${acDark} 0%,${ac} 40%,${ac} 60%,${acDark} 100%)`
        : `linear-gradient(270deg,${acDark} 0%,${ac} 40%,${ac} 60%,${acDark} 100%)`,
      pointerEvents: 'none',
    }}>
      <svg width={zW} height={height} style={{ position: 'absolute', top: 0, left: 0 }}
        xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: Math.ceil(height / 4) }, (_, i) => (
          <line key={i} x1={0} y1={i * 4} x2={zW} y2={i * 4}
            stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
        ))}
        <rect
          x={side === 'left' ? Math.round(zW * 0.3) : Math.round(zW * 0.55)}
          y={0} width={Math.round(zW * 0.15)} height={height}
          fill="rgba(255,255,255,0.35)" />
      </svg>
    </div>
  )

  const BorderBand = ({ instanceKey, width = sw, height = borderH }) => (
    <div style={{ width, height, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
      <PatternRenderer
        patternId={design.borderPattern}
        customPattern={patternMap?.[design.borderPattern]}
        color={sc} accentColor={ac}
        width={width} height={height}
        svgInstanceKey={instanceKey}
      />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: Math.round(3 * scale),
        background: `linear-gradient(90deg,${acDark},${ac},rgba(255,255,255,0.8),${ac},${acDark})`,
        pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: Math.round(3 * scale),
        background: `linear-gradient(90deg,${acDark},${ac},rgba(255,255,255,0.7),${ac},${acDark})`,
        pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg,rgba(255,255,255,0.14) 0%,transparent 30%,transparent 70%,rgba(0,0,0,0.12) 100%)',
        pointerEvents: 'none' }} />
    </div>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap }}>

      {/* ══════════════ MAIN SAREE (vertical) ══════════════ */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        borderRadius: 3, overflow: 'hidden',
        boxShadow: '0 12px 50px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.4)',
        width: sw, background: '#0E0C09', flexShrink: 0,
      }}>

        {/* ── PALLU ── */}
        <div style={{
          width: sw, height: palluH,
          overflow: 'hidden', position: 'relative', flexShrink: 0,
        }}>
          <PatternRenderer
            patternId={design.palluPattern}
            customPattern={patternMap?.[design.palluPattern]}
            color={pc} accentColor={ac}
            width={sw} height={palluH}
            svgInstanceKey="pallu"
          />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(125deg,rgba(255,255,255,0.12) 0%,transparent 40%,rgba(0,0,0,0.06) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: Math.round(14 * scale),
            background: 'linear-gradient(0deg,rgba(0,0,0,0.22),transparent)', pointerEvents: 'none' }} />
        </div>

        {/* ── TOP BORDER ── */}
        <BorderBand instanceKey="borderT" />

        {/* ── BODY ── */}
        <div style={{ width: sw, height: bodyH, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
          <PatternRenderer
            patternId={design.bodyPattern}
            customPattern={patternMap?.[design.bodyPattern]}
            color={pc} accentColor={ac}
            width={sw} height={bodyH}
            svgInstanceKey="body"
          />
          <ZariStrip side="left" height={bodyH} />
          <ZariStrip side="right" height={bodyH} />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(150deg,rgba(255,255,255,0.09) 0%,transparent 35%,rgba(0,0,0,0.05) 65%,transparent 100%)' }} />
        </div>

        {/* ── BOTTOM BORDER ── */}
        <BorderBand instanceKey="borderB" />

      </div>

      {/* ══════════════ BLOUSE PANEL (right side) ══════════════ */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(4 * scale) }}>

        <div style={{ fontSize: Math.round(7 * scale), letterSpacing: 2, textTransform: 'uppercase',
          color: ac, fontWeight: 600, fontFamily: 'Jost,sans-serif' }}>Blouse</div>

        <div style={{ width: blouseW, height: blouseH, overflow: 'visible', position: 'relative',
          borderRadius: Math.round(3 * scale) }}>

          {/* Main blouse body */}
          <div style={{ width: blouseW, height: blouseH, overflow: 'hidden', position: 'relative',
            borderRadius: Math.round(3 * scale),
            border: `${Math.round(1.5 * scale)}px solid ${ac}88`,
            boxShadow: `0 4px 18px rgba(0,0,0,0.5)` }}>
            <PatternRenderer
              patternId={blousePatternId} customPattern={blouseCustom}
              color={blouseColor} accentColor={ac}
              width={blouseW} height={blouseH}
              svgInstanceKey="blouse"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.06)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0,
              background: 'linear-gradient(150deg,rgba(255,255,255,0.14) 0%,transparent 50%,rgba(0,0,0,0.06) 100%)',
              pointerEvents: 'none' }} />
            {/* Collar V */}
            <svg width={blouseW} height={Math.round(30 * scale)} style={{ position: 'absolute', top: 0, left: 0 }}
              xmlns="http://www.w3.org/2000/svg">
              <path d={`M0,0 L${Math.round(blouseW*0.35)},${Math.round(24*scale)} L${Math.round(blouseW*0.5)},${Math.round(19*scale)} L${Math.round(blouseW*0.65)},${Math.round(24*scale)} L${blouseW},0`}
                fill="rgba(0,0,0,0.20)" stroke={ac} strokeWidth={Math.round(1 * scale)} opacity="0.6" />
            </svg>
            {/* Bottom zari hem */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: Math.round(14 * scale),
              background: `linear-gradient(180deg,${acDark}88,${ac}cc,${acDark})`, pointerEvents: 'none' }}>
              <div style={{ height: Math.round(2 * scale),
                background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)' }} />
            </div>
          </div>

          {/* Left sleeve */}
          <div style={{ position: 'absolute', top: Math.round(10 * scale), left: -Math.round(14 * scale),
            width: Math.round(16 * scale), height: Math.round(38 * scale),
            overflow: 'hidden', borderRadius: Math.round(4 * scale),
            border: `1px solid ${ac}66`, boxShadow: `0 2px 8px rgba(0,0,0,0.4)` }}>
            <PatternRenderer patternId={blousePatternId} customPattern={blouseCustom}
              color={blouseColor} accentColor={ac}
              width={Math.round(16 * scale)} height={Math.round(38 * scale)}
              svgInstanceKey="blouseL" />
          </div>

          {/* Right sleeve */}
          <div style={{ position: 'absolute', top: Math.round(10 * scale), right: -Math.round(14 * scale),
            width: Math.round(16 * scale), height: Math.round(38 * scale),
            overflow: 'hidden', borderRadius: Math.round(4 * scale),
            border: `1px solid ${ac}66`, boxShadow: `0 2px 8px rgba(0,0,0,0.4)` }}>
            <PatternRenderer patternId={blousePatternId} customPattern={blouseCustom}
              color={blouseColor} accentColor={ac}
              width={Math.round(16 * scale)} height={Math.round(38 * scale)}
              svgInstanceKey="blouseR" />
          </div>
        </div>

        {/* Pattern tag */}
        <div style={{ fontSize: Math.round(7 * scale), color: ac, letterSpacing: 1,
          opacity: 0.75, fontFamily: 'Jost,sans-serif', marginTop: Math.round(2 * scale) }}>
          {blousePatternId?.toUpperCase()}
        </div>

        {/* Color swatches */}
        <div style={{ display: 'flex', gap: Math.round(4 * scale), marginTop: Math.round(2 * scale) }}>
          {[design.primaryColor, blouseColor, design.accentColor].map((col, i) => (
            <div key={i} title={['Body','Blouse','Accent'][i]} style={{
              width: Math.round(12 * scale), height: Math.round(12 * scale),
              borderRadius: '50%', background: col,
              border: `${i === 1 ? '2px' : '1px'} solid ${i === 1 ? ac : ac + '44'}`,
              boxShadow: i === 1 ? `0 0 0 1px ${ac}55` : 'none',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── HIGH-RES PREVIEW DATA URL ────────────────────────────────────────────────
export function generateSareeDataURL(design) {
  return new Promise((resolve, reject) => {
    const SCALE   = 4
    const W       = 200 * SCALE
    const palluH  = 160 * SCALE
    const borderH =  22 * SCALE
    const bodyH   = 340 * SCALE
    const blouseH =  55 * SCALE
    const labelH  =  14 * SCALE
    const H = palluH + borderH * 2 + bodyH + blouseH + labelH * 3

    const { primaryColor: pc, secondaryColor: sc, accentColor: ac,
            bodyPattern, borderPattern, palluPattern } = design

    const blousePattern = design.blousePattern || bodyPattern
    const blouseColor   = design.blouseColor   || sc

    const hexAdd = (hex, amt) => {
      const h = (hex || '#888').replace('#', '')
      const r = Math.min(255, Math.max(0, parseInt(h.slice(0,2), 16) + amt))
      const g = Math.min(255, Math.max(0, parseInt(h.slice(2,4), 16) + amt))
      const b = Math.min(255, Math.max(0, parseInt(h.slice(4,6), 16) + amt))
      return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('')
    }
    const L = (h, a) => hexAdd(h, a)
    const D = (h, a) => hexAdd(h, -a)

    const makeDefs = (color, accent, uid) => {
      const cL = L(color,28), cD = D(color,22), aL = L(accent,55), aD = D(accent,30)
      return `<defs>
        <linearGradient id="silk${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="${cL}" stop-opacity="0.9"/>
          <stop offset="30%"  stop-color="${color}" stop-opacity="1"/>
          <stop offset="55%"  stop-color="${cD}" stop-opacity="1"/>
          <stop offset="75%"  stop-color="${color}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${cL}" stop-opacity="0.85"/>
        </linearGradient>
        <pattern id="weft${uid}" x="0" y="0" width="${W}" height="3" patternUnits="userSpaceOnUse">
          <line x1="0" y1="1.5" x2="${W}" y2="1.5" stroke="${cD}" stroke-width="0.4" opacity="0.18"/>
        </pattern>
        <filter id="weave${uid}" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65 0.65" numOctaves="4" seed="2" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="grey"/>
          <feBlend in="SourceGraphic" in2="grey" mode="soft-light" result="blended"/>
          <feComposite in="blended" in2="SourceGraphic" operator="in"/>
        </filter>
        <linearGradient id="fold${uid}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#000" stop-opacity="0.18"/>
          <stop offset="15%"  stop-color="#000" stop-opacity="0"/>
          <stop offset="45%"  stop-color="#000" stop-opacity="0.06"/>
          <stop offset="60%"  stop-color="#000" stop-opacity="0"/>
          <stop offset="82%"  stop-color="#000" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.2"/>
        </linearGradient>
        <linearGradient id="vign${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="#000" stop-opacity="0.2"/>
          <stop offset="12%"  stop-color="#000" stop-opacity="0"/>
          <stop offset="88%"  stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.18"/>
        </linearGradient>
        <linearGradient id="zariG${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="${aL}" stop-opacity="1"/>
          <stop offset="25%"  stop-color="${accent}" stop-opacity="1"/>
          <stop offset="50%"  stop-color="${aD}" stop-opacity="1"/>
          <stop offset="75%"  stop-color="${accent}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${aL}" stop-opacity="0.9"/>
        </linearGradient>
      </defs>`
    }

    const pat = (patternId, color, accent, w, h) => {
      const uid = (patternId||'b1') + w + h
      const defs = makeDefs(color, accent, uid)
      const cD = D(color, 22)

      const shapes = {
        b1:  `<rect width="${w}" height="${h}" fill="${color}"/>`,
        b2:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/12)},(_,i)=>`<line x1="${i*12}" y1="0" x2="${i*12}" y2="${h}" stroke="${accent}" stroke-width="1.2" opacity="0.5"/>`).join('')}`,
        b3:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(h/16)},(_,i)=>`<line x1="0" y1="${i*16}" x2="${w}" y2="${i*16}" stroke="${accent}" stroke-width="0.8" opacity="0.4"/>`).join('')}${Array.from({length:Math.ceil(w/16)},(_,i)=>`<line x1="${i*16}" y1="0" x2="${i*16}" y2="${h}" stroke="${accent}" stroke-width="0.8" opacity="0.4"/>`).join('')}`,
        b4:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/20)},(_,x)=>Array.from({length:Math.ceil(h/20)},(_,y)=>`<g transform="translate(${x*20+10},${y*20+10})"><ellipse rx="4" ry="6" fill="rgba(0,0,0,0.22)" transform="translate(0.4,0.6)"/><ellipse rx="4" ry="6" fill="${accent}" opacity="0.75"/><ellipse rx="2.5" ry="4" fill="rgba(255,255,255,0.18)"/><ellipse rx="2" ry="3" fill="${color}" opacity="0.92"/><ellipse rx="1" ry="1.5" fill="${accent}" opacity="0.85"/></g>`).join('')).join('')}`,
        b5:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/24)},(_,x)=>Array.from({length:Math.ceil(h/24)},(_,y)=>`<g transform="translate(${x*24+12},${y*24+12})"><polygon points="0,-8 8,0 0,8 -8,0" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.6"/><polygon points="0,-4 4,0 0,4 -4,0" fill="${accent}" opacity="0.5"/></g>`).join('')).join('')}`,
        b6:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/28)},(_,x)=>Array.from({length:Math.ceil(h/28)},(_,y)=>`<g transform="translate(${x*28+14},${y*28+14})"><polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="rgba(0,0,0,0.25)" transform="translate(0.5,0.8)"/><polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="${accent}" opacity="0.72"/><polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.5"/></g>`).join('')).join('')}`,
        b7:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/32)},(_,x)=>Array.from({length:Math.ceil(h/32)},(_,y)=>`<g transform="translate(${x*32+16},${y*32+16})"><path d="M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z" fill="rgba(0,0,0,0.2)" transform="translate(0.6,0.8)"/><path d="M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z" fill="${accent}" opacity="0.68"/><circle r="3" fill="${color}"/><circle r="1.5" fill="${accent}" opacity="0.9"/></g>`).join('')).join('')}`,
        b8:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/18)},(_,x)=>Array.from({length:Math.ceil(h/18)},(_,y)=>`<circle cx="${x*18+9}" cy="${y*18+9}" r="3.5" fill="${accent}" opacity="0.7"/>`).join('')).join('')}`,
        b9:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/14)},(_,x)=>Array.from({length:Math.ceil(h/14)},(_,y)=>`<circle cx="${x*14+7}" cy="${y*14+7}" r="4" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.65"/><circle cx="${x*14+7}" cy="${y*14+7}" r="1.5" fill="${accent}" opacity="0.55"/>`).join('')).join('')}`,
        b10: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(h/10)},(_,i)=>`<path d="M0,${i*10} Q${w/4},${i*10-5} ${w/2},${i*10} Q${3*w/4},${i*10+5} ${w},${i*10}" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.5"/>`).join('')}`,
        b11: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/36)},(_,x)=>Array.from({length:Math.ceil(h/40)},(_,y)=>`<g transform="translate(${x*36+18},${y*40+20})"><path d="M0,-16 C8,-16 14,-8 14,0 C14,8 8,16 0,16 C-8,16 -14,8 -14,0 C-14,-8 -8,-16 0,-16Z" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.55"/></g>`).join('')).join('')}`,
        b12: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/28)},(_,x)=>Array.from({length:Math.ceil(h/28)},(_,y)=>`<g transform="translate(${x*28+14},${y*28+14})"><polygon points="0,-10 4,-4 10,0 4,4 0,10 -4,4 -10,0 -4,-4" fill="${accent}" opacity="0.5"/></g>`).join('')).join('')}`,
        b13: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/24)},(_,x)=>Array.from({length:Math.ceil(h/24)},(_,y)=>`<g transform="translate(${x*24+12},${y*24+12})">${[0,45,90,135,180,225,270,315].map(a=>`<ellipse cx="${Math.round(7*Math.cos(a*Math.PI/180))}" cy="${Math.round(7*Math.sin(a*Math.PI/180))}" rx="2.5" ry="4.5" fill="${accent}" opacity="0.55" transform="rotate(${a} ${Math.round(7*Math.cos(a*Math.PI/180))} ${Math.round(7*Math.sin(a*Math.PI/180))})" />`).join('')}<circle r="2.5" fill="${accent}" opacity="0.75"/></g>`).join('')).join('')}`,
        b14: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/20)},(_,x)=>Array.from({length:Math.ceil(h/24)},(_,y)=>`<g transform="translate(${x*20+10},${y*24+12})"><circle cy="-8" r="3" fill="${accent}" opacity="0.5"/><line x1="0" y1="-5" x2="0" y2="4" stroke="${accent}" stroke-width="1.5" opacity="0.5"/><line x1="-5" y1="-1" x2="5" y2="-1" stroke="${accent}" stroke-width="1.2" opacity="0.45"/><line x1="0" y1="4" x2="-4" y2="9" stroke="${accent}" stroke-width="1.2" opacity="0.45"/><line x1="0" y1="4" x2="4" y2="9" stroke="${accent}" stroke-width="1.2" opacity="0.45"/></g>`).join('')).join('')}`,
        b15: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/24)},(_,x)=>Array.from({length:Math.ceil(h/24)},(_,y)=>`<g transform="translate(${x*24+12},${y*24+12})"><path d="M0,-10 C4,-8 8,-4 6,0 C8,4 4,8 0,10 C-4,8 -8,4 -6,0 C-8,-4 -4,-8 0,-10Z" fill="${accent}" opacity="0.45"/></g>`).join('')).join('')}`,
        b16: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/8)},(_,i)=>`<line x1="${i*8}" y1="0" x2="${i*8}" y2="${h}" stroke="${accent}" stroke-width="${i%3===0?1.2:0.6}" opacity="${i%3===0?0.5:0.25}"/>`).join('')}`,
        b17: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/22)},(_,x)=>Array.from({length:Math.ceil(h/22)},(_,y)=>`<g transform="translate(${x*22+11},${y*22+11})">${[0,60,120,180,240,300].map(a=>`<ellipse cx="${Math.round(6*Math.cos(a*Math.PI/180))}" cy="${Math.round(6*Math.sin(a*Math.PI/180))}" rx="3" ry="5" fill="${accent}" opacity="0.55" transform="rotate(${a} ${Math.round(6*Math.cos(a*Math.PI/180))} ${Math.round(6*Math.sin(a*Math.PI/180))})" />`).join('')}<circle r="2" fill="${accent}" opacity="0.85"/></g>`).join('')).join('')}`,
        br1: `<rect width="${w}" height="${h}" fill="url(#zariG${uid})"/>`,
        br2: `<rect width="${w}" height="${h}" fill="url(#zariG${uid})"/><rect x="0" y="${h*0.38}" width="${w}" height="${h*0.24}" fill="${color}" opacity="0.3"/>`,
        br3: `<rect width="${w}" height="${h}" fill="url(#zariG${uid})"/>${Array.from({length:Math.ceil(w/16)},(_,i)=>`<g transform="translate(${i*16+8},${h/2})"><polygon points="0,-8 6,0 0,8 -6,0" fill="${color}" opacity="0.85"/><polygon points="0,-4 3,0 0,4 -3,0" fill="${accent}"/></g>`).join('')}`,
        br4: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/16)},(_,i)=>`<path d="M${i*16+8},2 C${i*16+14},2 ${i*16+14},${h*0.6} ${i*16+8},${h*0.6} C${i*16+2},${h*0.6} ${i*16+2},2 ${i*16+8},2Z" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.7"/><path d="M${i*16+8},2 C${i*16+14},2 ${i*16+14},${h*0.6} ${i*16+8},${h*0.6} C${i*16+2},${h*0.6} ${i*16+2},2 ${i*16+8},2Z" fill="${accent}" opacity="0.4"/>`).join('')}`,
        br5: `<rect width="${w}" height="${h}" fill="url(#zariG${uid})"/>${Array.from({length:Math.ceil(w/20)},(_,i)=>`<path d="M${i*20+10},1 C${i*20+16},1 ${i*20+16},${h-1} ${i*20+10},${h-1} C${i*20+4},${h-1} ${i*20+4},1 ${i*20+10},1Z" fill="${color}" opacity="0.8"/>`).join('')}`,
        br6: `<rect width="${w}" height="${h}" fill="url(#zariG${uid})"/>`,
        br7: `<rect width="${w}" height="${h}" fill="${color}"/><rect x="0" y="${h/2-1.5}" width="${w}" height="3" fill="url(#zariG${uid})"/>`,
        br8: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/14)},(_,i)=>`<circle cx="${i*14+7}" cy="${h/2}" r="${h/2-1}" fill="none" stroke="${accent}" stroke-width="1" opacity="0.65"/>`).join('')}`,
        br9: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/12)},(_,i)=>`<polygon points="${i*12},${h} ${i*12+6},0 ${i*12+12},${h}" fill="${accent}" opacity="0.5"/>`).join('')}`,
        br10:`<rect width="${w}" height="${h}" fill="${color}"/><rect x="0" y="${h*0.3}" width="${w}" height="${h*0.4}" fill="${accent}" opacity="0.6"/>`,
        br11:`<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/14)},(_,i)=>`<polygon points="${i*14+7},1 ${i*14+13},${h/2} ${i*14+7},${h-1} ${i*14+1},${h/2}" fill="${accent}" opacity="0.6"/>`).join('')}`,
        br12:`<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/16)},(_,i)=>`<g transform="translate(${i*16+8},${h/2})"><ellipse rx="4" ry="${h/2-1}" fill="${accent}" opacity="0.5"/></g>`).join('')}`,
        p1:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/20)},(_,x)=>Array.from({length:Math.ceil(h/20)},(_,y)=>`<g transform="translate(${x*20+10},${y*20+10})"><polygon points="0,-8 3,-3 8,-3 4,2 6,8 0,4 -6,8 -4,2 -8,-3 -3,-3" fill="${accent}" opacity="0.75"/></g>`).join('')).join('')}`,
        p2:  `<rect width="${w}" height="${h/2}" fill="${color}"/><rect x="0" y="${h/2}" width="${w}" height="${h/2}" fill="url(#zariG${uid})" opacity="0.8"/>`,
        p3:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/30)},(_,x)=>Array.from({length:Math.ceil(h/30)},(_,y)=>`<g transform="translate(${x*30+15},${y*30+15})"><path d="M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z" fill="${accent}" opacity="0.72"/><circle r="3" fill="${color}"/><circle r="1.5" fill="${accent}" opacity="0.9"/></g>`).join('')).join('')}`,
        p4:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/22)},(_,x)=>Array.from({length:Math.ceil(h/22)},(_,y)=>`<g transform="translate(${x*22+11},${y*22+11})"><ellipse rx="6" ry="9" fill="${accent}" opacity="0.55"/><ellipse rx="3" ry="5" fill="${color}"/><ellipse rx="1.5" ry="2.5" fill="${accent}" opacity="0.8"/></g>`).join('')).join('')}`,
        p5:  `<rect width="${w}" height="${h}" fill="${color}"/>`,
        p6:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/32)},(_,x)=>Array.from({length:Math.ceil(h/32)},(_,y)=>`<g transform="translate(${x*32+16},${y*32+16})"><polygon points="0,-8 4,-4 8,0 4,4 0,8 -4,4 -8,0 -4,-4" fill="${accent}" opacity="0.35"/><circle r="2" fill="${accent}" opacity="0.7"/></g>`).join('')).join('')}`,
        p7:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/36)},(_,x)=>Array.from({length:Math.ceil(h/36)},(_,y)=>`<g transform="translate(${x*36+18},${y*36+18})"><path d="M0,-14 C6,-8 14,-6 14,0 C14,6 6,10 0,14 C-6,10 -14,6 -14,0 C-14,-6 -6,-8 0,-14Z" fill="${accent}" opacity="0.28"/><polygon points="0,-8 3,-3 8,-3 4,2 6,8 0,4 -6,8 -4,2 -8,-3 -3,-3" fill="${accent}" opacity="0.45"/></g>`).join('')).join('')}`,
        p8:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/22)},(_,x)=>Array.from({length:Math.ceil(h/22)},(_,y)=>`<g transform="translate(${x*22+11},${y*22+11})"><circle r="5" fill="${accent}" opacity="0.4"/><circle r="2.5" fill="${accent}" opacity="0.6"/></g>`).join('')).join('')}`,
        p9:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/16)},(_,i)=>`<rect x="${i*16}" y="0" width="6" height="${h}" fill="${accent}" opacity="${i%3===0?0.4:0.2}"/>`).join('')}`,
        p10: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:4},(_,j)=>`<path d="M${j*w/4},0 Q${j*w/4+w/8},${h/2} ${j*w/4},${h}" fill="none" stroke="${accent}" stroke-width="1.8" opacity="0.55"/>`).join('')}`,
        p11: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/28)},(_,x)=>Array.from({length:Math.ceil(h/28)},(_,y)=>`<g transform="translate(${x*28+14},${y*28+14})"><path d="M0,-12 C6,-6 12,0 6,6 C0,12 -6,6 -12,0 C-6,-6 0,-12 0,-12Z" fill="${accent}" opacity="0.35"/><circle r="2.5" fill="${accent}" opacity="0.6"/></g>`).join('')).join('')}`,
        p12: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/18)},(_,x)=>Array.from({length:Math.ceil(h/18)},(_,y)=>`<polygon points="${x*18+9},${y*18+2} ${x*18+16},${y*18+9} ${x*18+9},${y*18+16} ${x*18+2},${y*18+9}" fill="none" stroke="${accent}" stroke-width="1" opacity="0.5"/>`).join('')).join('')}`,
      }
      const shape = shapes[patternId] || shapes.b1
      const overlay = `
        <rect width="${w}" height="${h}" fill="url(#silk${uid})" opacity="0.4" style="mix-blend-mode:overlay"/>
        <rect width="${w}" height="${h}" fill="url(#weft${uid})"/>
        <rect width="${w}" height="${h}" fill="url(#fold${uid})"/>
        <rect width="${w}" height="${h}" fill="url(#vign${uid})"/>
      `
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${defs}<g filter="url(#weave${uid})">${shape}</g>${overlay}</svg>`
    }

    let y = 0
    const secs = []

    secs.push(`<rect x="0" y="${y}" width="${W}" height="${labelH}" fill="#0e0c09"/>`)
    secs.push(`<text x="${W/2}" y="${y+labelH*0.72}" text-anchor="middle" font-size="${labelH*0.55}" fill="#9C8A6A" letter-spacing="3" font-family="serif">PALLU</text>`)
    y += labelH

    secs.push(`<svg x="0" y="${y}" width="${W}" height="${palluH}">${pat(palluPattern, pc, ac, W, palluH)}`)
    secs.push(`<rect y="${palluH-4}" width="${W}" height="4" fill="${ac}" opacity="0.5"/>`)
    secs.push(`</svg>`)
    y += palluH

    secs.push(`<svg x="0" y="${y}" width="${W}" height="${borderH}">${pat(borderPattern, sc, ac, W, borderH)}</svg>`)
    y += borderH

    secs.push(`<rect x="0" y="${y}" width="${W}" height="${labelH}" fill="#0e0c09"/>`)
    secs.push(`<text x="${W/2}" y="${y+labelH*0.72}" text-anchor="middle" font-size="${labelH*0.55}" fill="#9C8A6A" letter-spacing="3" font-family="serif">BODY</text>`)
    y += labelH

    const zW = Math.round(14 * SCALE)
    secs.push(`<svg x="0" y="${y}" width="${W}" height="${bodyH}">${pat(bodyPattern, pc, ac, W, bodyH)}`)
    secs.push(`<defs><linearGradient id="lz" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${ac}" stop-opacity="0.8"/><stop offset="50%" stop-color="${ac}" stop-opacity="1"/><stop offset="100%" stop-color="${ac}" stop-opacity="0.2"/></linearGradient><linearGradient id="rz" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="${ac}" stop-opacity="0.8"/><stop offset="50%" stop-color="${ac}" stop-opacity="1"/><stop offset="100%" stop-color="${ac}" stop-opacity="0.2"/></linearGradient></defs>`)
    secs.push(`<rect x="0" y="0" width="${zW}" height="${bodyH}" fill="url(#lz)"/>`)
    secs.push(`<rect x="${W-zW}" y="0" width="${zW}" height="${bodyH}" fill="url(#rz)"/>`)
    secs.push(`<rect x="${Math.round(4*SCALE)}" y="0" width="${Math.round(2*SCALE)}" height="${bodyH}" fill="rgba(255,255,255,0.4)"/>`)
    secs.push(`<rect x="${W-Math.round(6*SCALE)}" y="0" width="${Math.round(2*SCALE)}" height="${bodyH}" fill="rgba(255,255,255,0.4)"/>`)
    secs.push(`</svg>`)
    y += bodyH

    secs.push(`<svg x="0" y="${y}" width="${W}" height="${borderH}">${pat(borderPattern, sc, ac, W, borderH)}</svg>`)
    y += borderH

    secs.push(`<rect x="0" y="${y}" width="${W}" height="${labelH}" fill="#0e0c09"/>`)
    secs.push(`<text x="${W/2}" y="${y+labelH*0.72}" text-anchor="middle" font-size="${labelH*0.55}" fill="#9C8A6A" letter-spacing="3" font-family="serif">BLOUSE</text>`)
    y += labelH

    secs.push(`<svg x="0" y="${y}" width="${W}" height="${blouseH}">${pat(blousePattern, blouseColor, ac, W, blouseH)}`)
    secs.push(`<rect y="${blouseH - Math.round(14*SCALE)}" width="${W}" height="${Math.round(14*SCALE)}" fill="${ac}" opacity="0.8"/>`)
    secs.push(`</svg>`)

    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${secs.join('')}</svg>`

    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const img  = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width  = W
      canvas.height = H
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#0E0C09'
      ctx.fillRect(0, 0, W, H)
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(new Error('SVG render failed')) }
    img.src = url
  })
}

// ─── SVG-TO-PNG EXPORT ────────────────────────────────────────────────────────
export function exportSareeAsPNG(design, filename = 'saree-design', patternMap = {}) {
  const scale   = 3
  const SW      = 200 * scale
  const palluH  = 160 * scale  // ✅ matches live canvas
  const borderH =  28 * scale
  const bodyH   = 340 * scale  // ✅ matches live canvas
  const zW      =  16 * scale
  const labelH  =  16 * scale
  const sareeH  = labelH + palluH + borderH + labelH + bodyH + borderH

  const blouseW = 90 * scale
  const blouseH = 110 * scale
  const gap     = 12 * scale
  const W       = SW + gap + blouseW
  const H       = sareeH

  const { primaryColor: pc, secondaryColor: sc, accentColor: ac,
          bodyPattern, borderPattern, palluPattern } = design

  const blousePattern = design.blousePattern || bodyPattern
  const blouseColor   = design.blouseColor   || sc

  const acDark = '#8B6914'
  const gid = `exp_${W}_${H}`
  const t3  = Math.round(3 * scale)

  const overlayDefs = `<defs>
    <linearGradient id="palSheen_${gid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.13"/>
      <stop offset="38%" stop-color="#fff" stop-opacity="0"/>
      <stop offset="60%" stop-color="#000" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0.04"/>
    </linearGradient>
    <linearGradient id="bodySheen_${gid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.09"/>
      <stop offset="35%" stop-color="#fff" stop-opacity="0"/>
      <stop offset="65%" stop-color="#000" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="lzG_${gid}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${acDark}" stop-opacity="1"/>
      <stop offset="40%" stop-color="${ac}" stop-opacity="1"/>
      <stop offset="60%" stop-color="${ac}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${acDark}" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="rzG_${gid}" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="${acDark}" stop-opacity="1"/>
      <stop offset="40%" stop-color="${ac}" stop-opacity="1"/>
      <stop offset="60%" stop-color="${ac}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${acDark}" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="blSheen_${gid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.12"/>
      <stop offset="50%" stop-color="#fff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.06"/>
    </linearGradient>
    <linearGradient id="zariHi_${gid}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${acDark}"/>
      <stop offset="35%" stop-color="${ac}"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.8"/>
      <stop offset="65%" stop-color="${ac}"/>
      <stop offset="100%" stop-color="${acDark}"/>
    </linearGradient>
    <linearGradient id="zariLo_${gid}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${acDark}"/>
      <stop offset="35%" stop-color="${ac}"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.7"/>
      <stop offset="65%" stop-color="${ac}"/>
      <stop offset="100%" stop-color="${acDark}"/>
    </linearGradient>
  </defs>`

  let y = 0
  const sections = [overlayDefs]

  sections.push(`<rect width="${W}" height="${H}" fill="#0E0C09"/>`)

  sections.push(`<rect x="0" y="${y}" width="${SW}" height="${labelH}" fill="rgba(0,0,0,0.6)"/>`)
  sections.push(`<text x="${SW/2}" y="${y + labelH*0.72}" text-anchor="middle" font-size="${labelH*0.62}" fill="${ac}" letter-spacing="2" font-family="serif" font-weight="600">PALLU</text>`)
  y += labelH

  const scaledPat = (patternId, customPat, color, accent, fullW, fullH, key) => {
    const lw = Math.round(fullW / scale)
    const lh = Math.round(fullH / scale)
    const inner = staticPatternSvgString(patternId, customPat, color, accent, lw, lh, key)
    return `<g transform="scale(${scale})">${inner}</g>`
  }

  sections.push(`<g transform="translate(0,${y})">`)
  sections.push(scaledPat(palluPattern, patternMap?.[palluPattern], pc, ac, SW, palluH, 'pallu'))
  sections.push(`<rect width="${SW}" height="${palluH}" fill="url(#palSheen_${gid})"/>`)
  sections.push(`<rect y="${palluH - Math.round(14*scale)}" width="${SW}" height="${Math.round(14*scale)}" fill="rgba(0,0,0,0.28)"/>`)
  sections.push('</g>')
  y += palluH

  sections.push(`<g transform="translate(0,${y})">`)
  sections.push(scaledPat(borderPattern, patternMap?.[borderPattern], sc, ac, SW, borderH, 'borderT'))
  sections.push(`<rect y="0" width="${SW}" height="${t3}" fill="url(#zariHi_${gid})"/>`)
  sections.push(`<rect y="${borderH - t3}" width="${SW}" height="${t3}" fill="url(#zariLo_${gid})"/>`)
  sections.push('</g>')
  y += borderH

  sections.push(`<rect x="0" y="${y}" width="${SW}" height="${labelH}" fill="rgba(0,0,0,0.35)"/>`)
  sections.push(`<text x="${SW/2}" y="${y + labelH*0.72}" text-anchor="middle" font-size="${labelH*0.62}" fill="${ac}" letter-spacing="2" font-family="serif" font-weight="600">BODY</text>`)
  y += labelH

  const zHL = Math.round(zW * 0.32)
  sections.push(`<g transform="translate(0,${y})">`)
  sections.push(scaledPat(bodyPattern, patternMap?.[bodyPattern], pc, ac, SW, bodyH, 'body'))
  sections.push(`<rect width="${SW}" height="${bodyH}" fill="url(#bodySheen_${gid})"/>`)
  sections.push(`<rect x="0" y="0" width="${zW}" height="${bodyH}" fill="url(#lzG_${gid})"/>`)
  sections.push(`<rect x="${zHL}" y="0" width="${Math.round(zW*0.15)}" height="${bodyH}" fill="rgba(255,255,255,0.35)"/>`)
  sections.push(`<rect x="${SW - zW}" y="0" width="${zW}" height="${bodyH}" fill="url(#rzG_${gid})"/>`)
  sections.push(`<rect x="${SW - zHL - Math.round(zW*0.15)}" y="0" width="${Math.round(zW*0.15)}" height="${bodyH}" fill="rgba(255,255,255,0.35)"/>`)
  sections.push('</g>')
  y += bodyH

  sections.push(`<g transform="translate(0,${y})">`)
  sections.push(scaledPat(borderPattern, patternMap?.[borderPattern], sc, ac, SW, borderH, 'borderB'))
  sections.push(`<rect y="0" width="${SW}" height="${t3}" fill="url(#zariHi_${gid})"/>`)
  sections.push(`<rect y="${borderH - t3}" width="${SW}" height="${t3}" fill="url(#zariLo_${gid})"/>`)
  sections.push('</g>')

  const bx = SW + gap
  const by = Math.round(H * 0.12)

  sections.push(`<text x="${bx + blouseW/2}" y="${by - Math.round(8*scale)}" text-anchor="middle" font-size="${Math.round(7*scale)}" fill="${ac}" letter-spacing="2" font-family="serif" font-weight="600">BLOUSE</text>`)
  sections.push(`<g transform="translate(${bx},${by})">`)
  sections.push(scaledPat(blousePattern, patternMap?.[blousePattern], blouseColor, ac, blouseW, blouseH, 'blouse'))
  sections.push(`<rect width="${blouseW}" height="${blouseH}" fill="rgba(0,0,0,0.08)"/>`)
  sections.push(`<rect width="${blouseW}" height="${blouseH}" fill="url(#blSheen_${gid})"/>`)
  sections.push(`<path d="M0,0 L${Math.round(blouseW*0.35)},${Math.round(22*scale)} L${Math.round(blouseW*0.5)},${Math.round(18*scale)} L${Math.round(blouseW*0.65)},${Math.round(22*scale)} L${blouseW},0" fill="rgba(0,0,0,0.18)" stroke="${ac}" stroke-width="${t3*0.4}" opacity="0.55"/>`)
  sections.push(`<rect y="${blouseH - Math.round(12*scale)}" width="${blouseW}" height="${Math.round(12*scale)}" fill="${ac}" opacity="0.75"/>`)
  sections.push(`<rect width="${blouseW}" height="${blouseH}" fill="none" stroke="${ac}" stroke-width="${Math.round(1.5*scale)}" opacity="0.55"/>`)
  sections.push('</g>')

  const swatchY = by + blouseH + Math.round(10*scale)
  const swatchR = Math.round(6*scale)
  ;[pc, blouseColor, ac].forEach((c, i) => {
    sections.push(`<circle cx="${bx + blouseW/2 + (i-1)*Math.round(18*scale)}" cy="${swatchY + swatchR}" r="${swatchR}" fill="${c}" opacity="0.9"/>`)
  })

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${sections.join('')}</svg>`

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0E0C09'
    ctx.fillRect(0, 0, W, H)
    ctx.drawImage(img, 0, 0)
    URL.revokeObjectURL(url)
    const link = document.createElement('a')
    link.download = filename.replace(/\s/g, '-') + '.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
  img.onerror = () => { URL.revokeObjectURL(url); console.error('SVG export failed') }
  img.src = url
}

export { PatternRenderer, SareeCanvas }

// ─── MANNEQUIN CANVAS ────────────────────────────────────────────────────────
export function MannequinCanvas({ design, scale = 1, patternMap = {} }) {
  const W = Math.round(340 * scale)
  const H = Math.round(580 * scale)

  const ac    = design.accentColor  || '#C9A843'
  const acD   = '#8B6914'
  const pc    = design.primaryColor || '#8B0000'
  const sc    = design.secondaryColor || '#F5F5DC'
  const blouseColor = design.blouseColor || sc
  const blousePatternId = design.blousePattern || design.bodyPattern

  const s = (n) => Math.round(n * scale)

  const neckX = s(170), neckTopY = s(42), neckBotY = s(72)
  const neckW = s(28)

  const lShoulderX = s(82),  rShoulderX = s(258), shoulderY = s(78)
  const lArmpitX = s(94),    rArmpitX   = s(246), armpitY   = s(120)
  const lWaistX  = s(100),   rWaistX    = s(240), waistY    = s(220)
  const lHipX    = s(90),    rHipX      = s(250), hipY      = s(280)
  const lHemX    = s(96),    rHemX      = s(244), hemY      = s(530)
  const lFootX   = s(110),   rFootX     = s(230), footY     = s(570)

  const bodyPath = [
    `M ${neckX - neckW/2},${neckBotY}`,
    `C ${lShoulderX},${shoulderY} ${lArmpitX},${armpitY} ${lArmpitX},${armpitY}`,
    `L ${lWaistX},${waistY}`,
    `C ${lWaistX - s(4)},${hipY - s(20)} ${lHipX},${hipY} ${lHipX},${hipY}`,
    `L ${lHemX},${hemY}`,
    `C ${lHemX + s(2)},${footY - s(10)} ${lFootX},${footY} ${lFootX},${footY}`,
    `L ${rFootX},${footY}`,
    `C ${rHemX - s(2)},${footY - s(10)} ${rHemX},${hemY} ${rHemX},${hemY}`,
    `L ${rHipX},${hipY}`,
    `C ${rHipX + s(4)},${hipY - s(20)} ${rWaistX},${waistY} ${rWaistX},${waistY}`,
    `L ${rArmpitX},${armpitY}`,
    `C ${rArmpitX},${armpitY} ${rShoulderX},${shoulderY} ${neckX + neckW/2},${neckBotY}`,
    `C ${neckX + neckW*0.6},${neckBotY - s(6)} ${neckX + neckW*0.4},${neckTopY} ${neckX},${neckTopY}`,
    `C ${neckX - neckW*0.4},${neckTopY} ${neckX - neckW*0.6},${neckBotY - s(6)} ${neckX - neckW/2},${neckBotY}`,
    'Z'
  ].join(' ')

  const headCX = s(170), headCY = s(24), headR = s(20)

  const lSleeveP = `M ${lShoulderX},${shoulderY}
    C ${lShoulderX - s(22)},${shoulderY + s(4)} ${lShoulderX - s(28)},${armpitY - s(10)} ${lArmpitX - s(8)},${armpitY + s(4)}
    L ${lArmpitX},${armpitY}
    C ${lArmpitX - s(2)},${shoulderY + s(18)} ${lShoulderX - s(4)},${shoulderY + s(10)} ${lShoulderX},${shoulderY} Z`

  const rSleeveP = `M ${rShoulderX},${shoulderY}
    C ${rShoulderX + s(22)},${shoulderY + s(4)} ${rShoulderX + s(28)},${armpitY - s(10)} ${rArmpitX + s(8)},${armpitY + s(4)}
    L ${rArmpitX},${armpitY}
    C ${rArmpitX + s(2)},${shoulderY + s(18)} ${rShoulderX + s(4)},${shoulderY + s(10)} ${rShoulderX},${shoulderY} Z`

  const blouseTopY = s(78), blouseBotY = s(155)
  const blouseClip = `M ${lArmpitX},${blouseTopY}
    L ${rArmpitX},${blouseTopY}
    C ${rShoulderX},${shoulderY} ${rArmpitX},${armpitY} ${rArmpitX},${armpitY}
    L ${rWaistX - s(10)},${blouseBotY}
    L ${lWaistX + s(10)},${blouseBotY}
    L ${lArmpitX},${armpitY}
    C ${lArmpitX},${armpitY} ${lShoulderX},${shoulderY} ${lArmpitX},${blouseTopY} Z`

  const bodyClip = `M ${lArmpitX},${armpitY}
    L ${rWaistX - s(10)},${blouseBotY}
    C ${rWaistX},${waistY} ${rHipX - s(20)},${hipY} ${rHipX - s(20)},${hipY}
    L ${rHemX - s(20)},${hemY}
    L ${lHemX},${hemY}
    C ${lHipX},${hipY} ${lWaistX},${waistY} ${lWaistX},${waistY}
    L ${lArmpitX},${armpitY} Z`

  const borderH = s(38)
  const borderClip = `M ${lHipX},${hemY - borderH}
    L ${rHemX - s(20)},${hemY - borderH}
    L ${rHemX - s(20)},${hemY}
    L ${lHemX},${hemY}
    L ${lHipX},${hemY - borderH} Z`

  const palluTopY  = s(78),  palluBotY = s(480)
  const palluLeftX = s(218), palluRightX = s(306)
  const palluBotLeftX = s(214), palluBotRightX = s(308)
  const palluBorderH = s(42)
  const palluClipP = `M ${palluLeftX},${palluTopY}
    L ${palluRightX},${palluTopY}
    L ${palluBotRightX},${palluBotY}
    L ${palluBotLeftX},${palluBotY} Z`

  const palluBorderClipP = `M ${palluBotLeftX},${palluBotY - palluBorderH}
    L ${palluBotRightX},${palluBotY - palluBorderH}
    L ${palluBotRightX},${palluBotY}
    L ${palluBotLeftX},${palluBotY} Z`

  const palluTopBorderH = s(18)
  const lAnkleX = s(118), rAnkleX = s(222), ankleY = s(545)

  const FO = ({ id, patternId, customPattern, color, accent, px, py, pw, ph, instanceKey }) => (
    <foreignObject x={px} y={py} width={pw} height={ph}>
      <div xmlns="http://www.w3.org/1999/xhtml"
        style={{ width: pw, height: ph, overflow: 'hidden', display: 'block' }}>
        <PatternRenderer
          patternId={patternId}
          customPattern={customPattern}
          color={color}
          accentColor={accent}
          width={pw}
          height={ph}
          svgInstanceKey={instanceKey}
        />
      </div>
    </foreignObject>
  )

  const bodyFOW  = s(160), bodyFOH  = s(420)
  const blouseFOW = s(180), blouseFOH = s(100)
  const palluFOW  = s(100), palluFOH  = s(420)
  const borderFOW = s(180), borderFOH = borderH
  const palluBorderFOW = palluFOW, palluBorderFOH = palluBorderH

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        <clipPath id={`mn_body_${scale}`}><path d={bodyClip} /></clipPath>
        <clipPath id={`mn_blouse_${scale}`}><path d={blouseClip} /></clipPath>
        <clipPath id={`mn_lsleeve_${scale}`}><path d={lSleeveP} /></clipPath>
        <clipPath id={`mn_rsleeve_${scale}`}><path d={rSleeveP} /></clipPath>
        <clipPath id={`mn_border_${scale}`}><path d={borderClip} /></clipPath>
        <clipPath id={`mn_pallu_${scale}`}><path d={palluClipP} /></clipPath>
        <clipPath id={`mn_pallubdr_${scale}`}><path d={palluBorderClipP} /></clipPath>

        <linearGradient id={`mn_skin_${scale}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d4b896" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="#e8cdb0" stopOpacity="1"/>
          <stop offset="100%" stopColor="#c8a882" stopOpacity="0.9"/>
        </linearGradient>
        <linearGradient id={`mn_bodyshad_${scale}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.18"/>
          <stop offset="18%" stopColor="#000" stopOpacity="0"/>
          <stop offset="55%" stopColor="#000" stopOpacity="0.06"/>
          <stop offset="78%" stopColor="#fff" stopOpacity="0.06"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.12"/>
        </linearGradient>
        <linearGradient id={`mn_pallushad_${scale}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.15"/>
          <stop offset="40%" stopColor="#000" stopOpacity="0"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.25"/>
        </linearGradient>
        <linearGradient id={`mn_palluleft_${scale}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.28"/>
          <stop offset="30%" stopColor="#000" stopOpacity="0"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id={`mn_zari_${scale}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={ac} stopOpacity="0.9"/>
          <stop offset="45%" stopColor="#fff" stopOpacity="0.35"/>
          <stop offset="100%" stopColor={acD} stopOpacity="1"/>
        </linearGradient>
        <linearGradient id={`mn_blousesheen_${scale}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18"/>
          <stop offset="60%" stopColor="#000" stopOpacity="0"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.10"/>
        </linearGradient>
        <linearGradient id={`mn_zarih_${scale}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={acD}/>
          <stop offset="30%" stopColor={ac}/>
          <stop offset="50%" stopColor="#fff" stopOpacity="0.8"/>
          <stop offset="70%" stopColor={ac}/>
          <stop offset="100%" stopColor={acD}/>
        </linearGradient>
      </defs>

      <path d={bodyPath} fill={`url(#mn_skin_${scale})`} />
      <circle cx={headCX} cy={headCY} r={headR} fill={`url(#mn_skin_${scale})`} />
      <path d={lSleeveP} fill={`url(#mn_skin_${scale})`} />
      <path d={rSleeveP} fill={`url(#mn_skin_${scale})`} />
      <ellipse cx={lAnkleX} cy={ankleY} rx={s(14)} ry={s(16)} fill={`url(#mn_skin_${scale})`} />
      <ellipse cx={rAnkleX} cy={ankleY} rx={s(14)} ry={s(16)} fill={`url(#mn_skin_${scale})`} />

      <g clipPath={`url(#mn_body_${scale})`}>
        <FO id="body" patternId={design.bodyPattern} customPattern={patternMap?.[design.bodyPattern]}
          color={pc} accent={ac} px={lArmpitX - s(4)} py={blouseBotY - s(10)}
          pw={bodyFOW} ph={bodyFOH} instanceKey="mn_body" />
        <rect x={lArmpitX - s(4)} y={blouseBotY} width={bodyFOW} height={bodyFOH} fill={`url(#mn_bodyshad_${scale})`} />
      </g>

      <g clipPath={`url(#mn_border_${scale})`}>
        <FO id="border" patternId={design.borderPattern} customPattern={patternMap?.[design.borderPattern]}
          color={sc} accent={ac} px={lHipX} py={hemY - borderH}
          pw={borderFOW} ph={borderFOH} instanceKey="mn_border" />
        <rect x={lHipX} y={hemY - borderH} width={borderFOW} height={s(3)} fill={`url(#mn_zarih_${scale})`} />
      </g>

      <g clipPath={`url(#mn_blouse_${scale})`}>
        <FO id="blouse" patternId={blousePatternId} customPattern={patternMap?.[blousePatternId]}
          color={blouseColor} accent={ac} px={lArmpitX} py={blouseTopY}
          pw={blouseFOW} ph={blouseFOH} instanceKey="mn_blouse" />
        <rect x={lArmpitX} y={blouseTopY} width={blouseFOW} height={blouseFOH} fill={`url(#mn_blousesheen_${scale})`} />
      </g>

      <g clipPath={`url(#mn_lsleeve_${scale})`}>
        <FO id="lsleeve" patternId={blousePatternId} customPattern={patternMap?.[blousePatternId]}
          color={blouseColor} accent={ac} px={lShoulderX - s(30)} py={shoulderY}
          pw={s(60)} ph={s(60)} instanceKey="mn_lsleeve" />
      </g>
      <g clipPath={`url(#mn_rsleeve_${scale})`}>
        <FO id="rsleeve" patternId={blousePatternId} customPattern={patternMap?.[blousePatternId]}
          color={blouseColor} accent={ac} px={rShoulderX - s(30)} py={shoulderY}
          pw={s(60)} ph={s(60)} instanceKey="mn_rsleeve" />
      </g>

      <g clipPath={`url(#mn_pallu_${scale})`}>
        <FO id="pallu" patternId={design.palluPattern} customPattern={patternMap?.[design.palluPattern]}
          color={pc} accent={ac} px={palluLeftX} py={palluTopY}
          pw={palluFOW} ph={palluFOH} instanceKey="mn_pallu" />
        <rect x={palluLeftX} y={palluTopY} width={palluFOW} height={palluFOH} fill={`url(#mn_pallushad_${scale})`} />
        <rect x={palluLeftX} y={palluTopY} width={s(18)} height={palluFOH} fill={`url(#mn_palluleft_${scale})`} />
      </g>

      <g clipPath={`url(#mn_pallubdr_${scale})`}>
        <FO id="pallubdr" patternId={design.borderPattern} customPattern={patternMap?.[design.borderPattern]}
          color={sc} accent={ac} px={palluBotLeftX} py={palluBotY - palluBorderH}
          pw={palluBorderFOW} ph={palluBorderFOH} instanceKey="mn_pallubdr" />
        <rect x={palluBotLeftX} y={palluBotY - palluBorderH} width={palluBorderFOW} height={s(3)} fill={`url(#mn_zarih_${scale})`} />
      </g>

      <rect x={palluLeftX} y={palluTopY} width={palluFOW} height={palluTopBorderH} fill={ac} opacity="0.65" />
      <rect x={palluLeftX} y={palluTopY} width={palluFOW} height={s(2.5)} fill={`url(#mn_zarih_${scale})`} />
      <rect x={palluLeftX} y={palluTopY + palluTopBorderH - s(2.5)} width={palluFOW} height={s(2.5)} fill={`url(#mn_zarih_${scale})`} />

      <path d={bodyPath} fill="none" stroke="rgba(180,150,110,0.35)" strokeWidth={s(1)} />
      <circle cx={headCX} cy={headCY} r={headR} fill="none" stroke="rgba(180,150,110,0.35)" strokeWidth={s(1)} />
      <path d={lSleeveP} fill="none" stroke="rgba(180,150,110,0.25)" strokeWidth={s(0.8)} />
      <path d={rSleeveP} fill="none" stroke="rgba(180,150,110,0.25)" strokeWidth={s(0.8)} />

      <path d={`M ${lArmpitX + s(14)},${blouseTopY + s(6)} L ${neckX},${blouseBotY - s(20)} L ${rArmpitX - s(14)},${blouseTopY + s(6)}`}
        fill="none" stroke={ac} strokeWidth={s(1.2)} opacity="0.7" />

      <path d={`M ${rWaistX - s(10)},${blouseBotY} C ${s(190)},${s(200)} ${s(155)},${s(280)} ${lHipX + s(10)},${hemY - borderH}`}
        fill="none" stroke={ac} strokeWidth={s(2.5)} opacity="0.5" />
      <path d={`M ${rWaistX - s(10)},${blouseBotY} C ${s(190)},${s(200)} ${s(155)},${s(280)} ${lHipX + s(10)},${hemY - borderH}`}
        fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={s(1)} opacity="0.8" />

      <path d={palluClipP} fill="none" stroke={`${acD}88`} strokeWidth={s(1.2)} />
      <path d={palluBorderClipP} fill="none" stroke={`${ac}66`} strokeWidth={s(0.8)} />

      <line x1={lHipX} y1={hemY - borderH} x2={rHemX - s(20)} y2={hemY - borderH}
        stroke={ac} strokeWidth={s(1.5)} opacity="0.7" />
    </svg>
  )
}