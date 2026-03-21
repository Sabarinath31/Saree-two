// ─── canvas.jsx ──────────────────────────────────────────────────────────────
// PatternRenderer (50 rich SVG patterns) + SareeCanvas + exportSareeAsPNG
import { T } from './theme.jsx'

// ─── PATTERN RENDERER ────────────────────────────────────────────────────────
function PatternRenderer({ patternId, color = '#8B0000', accentColor = '#C9A843', width = 200, height = 200 }) {
  const c = color
  const a = accentColor

  // ── BODY PATTERNS (b1–b17) ────────────────────────────────────────────────
  const patterns = {

    // b1 — Plain Silk: rich solid with subtle woven sheen
    b1: <>
      <defs>
        <linearGradient id="b1g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c} stopOpacity="1"/>
          <stop offset="45%" stopColor={c} stopOpacity="0.85"/>
          <stop offset="100%" stopColor={c} stopOpacity="1"/>
        </linearGradient>
      </defs>
      <rect width={width} height={height} fill={`url(#b1g)`} />
      {Array.from({length: Math.ceil(height/4)}, (_,i) => (
        <line key={i} x1={0} y1={i*4} x2={width} y2={i*4} stroke={a} strokeWidth={0.3} opacity={0.08} />
      ))}
      {Array.from({length: Math.ceil(width/4)}, (_,i) => (
        <line key={`v${i}`} x1={i*4} y1={0} x2={i*4} y2={height} stroke={a} strokeWidth={0.3} opacity={0.05} />
      ))}
    </>,

    // b2 — Kanjipuram Stripes: bold zari stripes on silk
    b2: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/18)}, (_,i) => (
        <g key={i}>
          <rect x={i*18} y={0} width={6} height={height} fill={a} opacity={0.55} />
          <rect x={i*18+1} y={0} width={1} height={height} fill={a} opacity={0.9} />
          <rect x={i*18+4} y={0} width={1} height={height} fill={a} opacity={0.9} />
        </g>
      ))}
    </>,

    // b3 — Checks / Madras Plaid: fine woven check
    b3: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(height/16)}, (_,i) => (
        <rect key={`h${i}`} x={0} y={i*16} width={width} height={6} fill={a} opacity={0.22} />
      ))}
      {Array.from({length: Math.ceil(width/16)}, (_,i) => (
        <rect key={`v${i}`} x={i*16} y={0} width={6} height={height} fill={a} opacity={0.22} />
      ))}
      {Array.from({length: Math.ceil(height/16)}, (_,i) =>
        Array.from({length: Math.ceil(width/16)}, (_,j) => (
          <rect key={`c${i}-${j}`} x={j*16} y={i*16} width={6} height={6} fill={a} opacity={0.28} />
        ))
      ).flat()}
    </>,

    // b4 — Floral Butta: detailed mango-shaped floral motifs
    b4: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/22)}, (_,x) => Array.from({length: Math.ceil(height/22)}, (_,y) => {
        const cx = x*22+11, cy = y*22+11
        const offset = x%2===0 ? 0 : 11
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy+offset})`}>
            <ellipse rx={4} ry={7} fill={a} opacity={0.75} />
            <ellipse rx={2.5} ry={4.5} fill={c} opacity={1} />
            <ellipse rx={1} ry={1.8} fill={a} opacity={0.9} />
            <line x1={0} y1={-7} x2={-2} y2={-10} stroke={a} strokeWidth={0.8} opacity={0.7} />
            <circle cx={-2} cy={-10} r={1} fill={a} opacity={0.8} />
          </g>
        )
      })).flat()}
    </>,

    // b5 — Ikat Diamond: resist-dyed diamond pattern
    b5: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/20)}, (_,x) => Array.from({length: Math.ceil(height/20)}, (_,y) => {
        const cx = x*20+10 + (y%2===0?0:10), cy = y*20+10
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            <polygon points="0,-9 9,0 0,9 -9,0" fill="none" stroke={a} strokeWidth={1.2} opacity={0.7} />
            <polygon points="0,-5 5,0 0,5 -5,0" fill={a} opacity={0.5} />
            <circle r={1.5} fill={a} opacity={0.9} />
          </g>
        )
      })).flat()}
    </>,

    // b6 — Temple Motifs (Kanjipuram Temple Border body): rich temple gopuram motifs
    b6: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/26)}, (_,x) => Array.from({length: Math.ceil(height/30)}, (_,y) => {
        const cx = x*26+13, cy = y*30+15
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            {/* Gopuram tower shape */}
            <polygon points="0,-12 4,-8 4,2 6,6 0,10 -6,6 -4,2 -4,-8" fill={a} opacity={0.6} />
            <polygon points="0,-12 3,-9 3,-4 0,-2 -3,-4 -3,-9" fill={c} opacity={0.9} />
            <line x1={-6} y1={6} x2={6} y2={6} stroke={a} strokeWidth={1} opacity={0.8} />
            <circle cx={0} cy={-13} r={1.5} fill={a} opacity={0.9} />
          </g>
        )
      })).flat()}
    </>,

    // b7 — Peacock Grid: stylized peacock feather eyes
    b7: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/30)}, (_,x) => Array.from({length: Math.ceil(height/30)}, (_,y) => {
        const cx = x*30+15 + (y%2===0?0:15), cy = y*30+15
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            {/* Outer feather eye */}
            <ellipse rx={10} ry={12} fill="none" stroke={a} strokeWidth={1} opacity={0.5} />
            <ellipse rx={7} ry={9} fill={a} opacity={0.15} />
            <ellipse rx={4} ry={5} fill={a} opacity={0.4} />
            <ellipse rx={2} ry={2.5} fill={c} opacity={1} />
            <circle r={1} fill={a} opacity={0.9} />
            {/* Quill lines */}
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(ang => (
              <line key={ang}
                x1={Math.cos(ang*Math.PI/180)*5} y1={Math.sin(ang*Math.PI/180)*5}
                x2={Math.cos(ang*Math.PI/180)*10} y2={Math.sin(ang*Math.PI/180)*10}
                stroke={a} strokeWidth={0.6} opacity={0.4} />
            ))}
          </g>
        )
      })).flat()}
    </>,

    // b8 — Zari Dot Grid: fine zari dot trellis
    b8: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/14)}, (_,x) => Array.from({length: Math.ceil(height/14)}, (_,y) => {
        const cx = x*14+7 + (y%2===0?0:7), cy = y*14+7
        return (
          <g key={`${x}-${y}`}>
            <circle cx={cx} cy={cy} r={2.5} fill={a} opacity={0.8} />
            <circle cx={cx} cy={cy} r={1.2} fill={c} opacity={1} />
            <circle cx={cx} cy={cy} r={0.5} fill={a} opacity={1} />
          </g>
        )
      })).flat()}
    </>,

    // b9 — Bandhani Tie-Dye: authentic resist-dot clusters
    b9: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/12)}, (_,x) => Array.from({length: Math.ceil(height/12)}, (_,y) => {
        const cx = x*12+6 + (y%2===0?0:6), cy = y*12+6
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            <circle r={4} fill="none" stroke={a} strokeWidth={0.8} opacity={0.5} />
            <circle r={2.5} fill={a} opacity={0.35} />
            <circle r={1.2} fill={a} opacity={0.7} />
            <circle r={0.5} fill={c} opacity={1} />
          </g>
        )
      })).flat()}
    </>,

    // b10 — Leheriya Wave: Rajasthani diagonal waves
    b10: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil((width+height)/8)}, (_,i) => (
        <g key={i}>
          <line
            x1={i*8-height} y1={0} x2={i*8} y2={height}
            stroke={a} strokeWidth={i%3===0?1.8:0.8}
            opacity={i%3===0?0.7:0.3}
          />
        </g>
      ))}
      {Array.from({length: Math.ceil((width+height)/8)}, (_,i) => (
        i%5===0 && <line key={`b${i}`}
          x1={i*8-height} y1={0} x2={i*8} y2={height}
          stroke={a} strokeWidth={0.4} opacity={0.5}
          strokeDasharray="2,4"
        />
      ))}
    </>,

    // b11 — Mughal Arch / Jali: interlocking arch trellis
    b11: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/28)}, (_,x) => Array.from({length: Math.ceil(height/32)}, (_,y) => {
        const cx = x*28+14, cy = y*32+16
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            {/* Arch */}
            <path d={`M-10,12 L-10,-4 C-10,-14 10,-14 10,-4 L10,12`}
              fill="none" stroke={a} strokeWidth={1.2} opacity={0.65} />
            {/* Inner detail */}
            <path d={`M-6,12 L-6,-2 C-6,-9 6,-9 6,-2 L6,12`}
              fill="none" stroke={a} strokeWidth={0.7} opacity={0.4} />
            <circle cy={-14} r={2} fill={a} opacity={0.7} />
            <line x1={-10} y1={12} x2={10} y2={12} stroke={a} strokeWidth={1} opacity={0.6} />
          </g>
        )
      })).flat()}
    </>,

    // b12 — Geometric Star: interlocking 8-pointed stars
    b12: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/24)}, (_,x) => Array.from({length: Math.ceil(height/24)}, (_,y) => {
        const cx = x*24+12, cy = y*24+12
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            <polygon points="0,-10 2.5,-2.5 10,0 2.5,2.5 0,10 -2.5,2.5 -10,0 -2.5,-2.5"
              fill="none" stroke={a} strokeWidth={1} opacity={0.65} />
            <polygon points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2"
              fill={a} opacity={0.2} />
            <circle r={2} fill={a} opacity={0.7} />
          </g>
        )
      })).flat()}
    </>,

    // b13 — Lotus Pattern: sacred lotus blooms
    b13: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/28)}, (_,x) => Array.from({length: Math.ceil(height/28)}, (_,y) => {
        const cx = x*28+14 + (y%2===0?0:14), cy = y*28+14
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            {/* Petals */}
            {[0,45,90,135,180,225,270,315].map(ang => (
              <ellipse key={ang}
                cx={Math.cos((ang-90)*Math.PI/180)*6}
                cy={Math.sin((ang-90)*Math.PI/180)*6}
                rx={2.5} ry={5}
                fill={a} opacity={0.5}
                transform={`rotate(${ang})`}
              />
            ))}
            <circle r={3} fill={a} opacity={0.7} />
            <circle r={1.5} fill={c} opacity={1} />
          </g>
        )
      })).flat()}
    </>,

    // b14 — Warli Folk Art: tribal human and animal figures
    b14: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/32)}, (_,x) => Array.from({length: Math.ceil(height/32)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*32+16},${y*32+16})`}>
          {/* Human figure */}
          <circle cy={-9} r={3} fill="none" stroke={a} strokeWidth={1.2} opacity={0.8} />
          <line x1={0} y1={-6} x2={0} y2={2} stroke={a} strokeWidth={1.2} opacity={0.8} />
          <line x1={-6} y1={-3} x2={6} y2={-3} stroke={a} strokeWidth={1} opacity={0.7} />
          <line x1={0} y1={2} x2={-5} y2={10} stroke={a} strokeWidth={1} opacity={0.7} />
          <line x1={0} y1={2} x2={5} y2={10} stroke={a} strokeWidth={1} opacity={0.7} />
          {/* Ground line */}
          <line x1={-10} y1={12} x2={10} y2={12} stroke={a} strokeWidth={0.8} opacity={0.4} />
        </g>
      ))).flat()}
    </>,

    // b15 — Kashmiri Chinar: chinar leaf motifs
    b15: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/26)}, (_,x) => Array.from({length: Math.ceil(height/26)}, (_,y) => {
        const cx = x*26+13 + (y%2===0?0:13), cy = y*26+13
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            {/* 5-lobed chinar leaf */}
            <path d={`M0,-11 C4,-8 8,-4 6,0 C8,4 4,8 0,11 C-4,8 -8,4 -6,0 C-8,-4 -4,-8 0,-11Z`}
              fill="none" stroke={a} strokeWidth={1.2} opacity={0.7} />
            <path d={`M0,-6 L0,6 M-5,-2 L5,2 M-5,2 L5,-2`}
              fill="none" stroke={a} strokeWidth={0.7} opacity={0.5} />
            <circle r={1.5} fill={a} opacity={0.8} />
          </g>
        )
      })).flat()}
    </>,

    // b16 — Pinstripe Zari: fine zari pinstripes (suiting style)
    b16: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/8)}, (_,i) => (
        <g key={i}>
          {i%3===0
            ? <><rect x={i*8} y={0} width={2} height={height} fill={a} opacity={0.7} />
                <rect x={i*8+0.5} y={0} width={1} height={height} fill={a} opacity={0.5} /></>
            : <rect x={i*8} y={0} width={1} height={height} fill={a} opacity={0.25} />
          }
        </g>
      ))}
    </>,

    // b17 — Meenakari Enamel: rich jewelled enamel tile pattern
    b17: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/22)}, (_,x) => Array.from({length: Math.ceil(height/22)}, (_,y) => {
        const cx = x*22+11, cy = y*22+11
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            {/* Outer ring */}
            <circle r={9} fill="none" stroke={a} strokeWidth={1.5} opacity={0.6} />
            {/* Petal ring */}
            {[0,60,120,180,240,300].map(ang => (
              <ellipse key={ang}
                cx={Math.cos((ang)*Math.PI/180)*6}
                cy={Math.sin((ang)*Math.PI/180)*6}
                rx={2} ry={3.5}
                fill={a} opacity={0.55}
                transform={`rotate(${ang},${Math.cos(ang*Math.PI/180)*6},${Math.sin(ang*Math.PI/180)*6})`}
              />
            ))}
            <circle r={3} fill={a} opacity={0.7} />
            <circle r={1.5} fill={c} opacity={1} />
            <circle r={0.7} fill={a} opacity={1} />
          </g>
        )
      })).flat()}
    </>,
  }

  // ── BORDER PATTERNS (br1–br12) ────────────────────────────────────────────
  const border_patterns = {

    // br1 — Single Kasavu: Kerala gold kasavu
    br1: <>
      <rect width={width} height={height} fill={c} />
      <rect y={height*0.15} width={width} height={height*0.7} fill={a} opacity={0.9} />
      <rect y={height*0.15} width={width} height={height*0.08} fill={a} opacity={0.5} />
      <rect y={height*0.77} width={width} height={height*0.08} fill={a} opacity={0.5} />
      {Array.from({length: Math.ceil(width/6)}, (_,i) => (
        <line key={i} x1={i*6} y1={height*0.15} x2={i*6} y2={height*0.85}
          stroke={c} strokeWidth={0.5} opacity={0.25} />
      ))}
    </>,

    // br2 — Double Kasavu: two gold bands
    br2: <>
      <rect width={width} height={height} fill={c} />
      <rect y={0} width={width} height={height*0.28} fill={a} opacity={0.9} />
      <rect y={height*0.72} width={width} height={height*0.28} fill={a} opacity={0.9} />
      <rect y={height*0.35} width={width} height={height*0.3} fill={a} opacity={0.55} />
      <line x1={0} y1={height*0.5} x2={width} y2={height*0.5} stroke={a} strokeWidth={1.5} opacity={0.8} />
    </>,

    // br3 — Temple Arch: repeating gopuram shapes
    br3: <>
      <rect width={width} height={height} fill={a} />
      {Array.from({length: Math.ceil(width/14)}, (_,i) => (
        <g key={i} transform={`translate(${i*14+7}, 0)`}>
          <path d={`M-5,${height} L-5,${height*0.5} C-5,${height*0.1} 5,${height*0.1} 5,${height*0.5} L5,${height}`}
            fill={c} opacity={0.85} />
          <circle cy={height*0.1} r={2} fill={c} opacity={0.9} />
          <line x1={0} y1={height*0.1} x2={0} y2={0} stroke={c} strokeWidth={1} opacity={0.7} />
        </g>
      ))}
      <line x1={0} y1={height*0.92} x2={width} y2={height*0.92} stroke={c} strokeWidth={1.5} opacity={0.4} />
    </>,

    // br4 — Mango Paisley: classic mango / buta shapes
    br4: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/18)}, (_,i) => (
        <g key={i} transform={`translate(${i*18+9},${height/2})`}>
          <path d={`M0,-${height/2-1} C${height/4},-${height/4} ${height/4},0 0,${height/4} C-${height/8},${height/4} -${height/4},0 0,-${height/2-1}Z`}
            fill={a} opacity={0.75} />
          <path d={`M0,-${height/2-3} C${height/6},-${height/4} ${height/6},0 0,${height/6} C-${height/10},${height/6} -${height/6},0 0,-${height/2-3}Z`}
            fill={c} opacity={1} />
          <circle r={2} fill={a} opacity={0.9} />
          <path d={`M0,-${height/2-1} C-3,-${height/2-4} -2,-${height/2+2} 0,-${height/2+1}`}
            fill="none" stroke={a} strokeWidth={1} opacity={0.8} />
        </g>
      ))}
    </>,

    // br5 — Peacock Procession: peacock silhouettes
    br5: <>
      <rect width={width} height={height} fill={a} />
      {Array.from({length: Math.ceil(width/24)}, (_,i) => (
        <g key={i} transform={`translate(${i*24+12},${height/2})`}>
          {/* Body */}
          <ellipse rx={6} ry={4} fill={c} opacity={0.9} />
          {/* Neck */}
          <path d={`M3,-4 C4,-8 6,-10 5,-12`} fill="none" stroke={c} strokeWidth={2} opacity={0.9} />
          {/* Head */}
          <circle cx={5} cy={-12} r={2.5} fill={c} opacity={0.9} />
          {/* Crown */}
          <path d={`M4,-14 L5,-17 M5,-14 L5.5,-17 M6,-14 L7,-17`}
            fill="none" stroke={c} strokeWidth={0.8} opacity={0.8} />
          {/* Tail feather */}
          <path d={`M-5,-3 C-10,-8 -10,4 -5,0`} fill="none" stroke={c} strokeWidth={1} opacity={0.6} />
          <path d={`M-5,-2 C-12,-4 -12,2 -5,1`} fill="none" stroke={c} strokeWidth={0.7} opacity={0.5} />
        </g>
      ))}
    </>,

    // br6 — Broad Zari: heavy zari weave band
    br6: <>
      <rect width={width} height={height} fill={a} />
      {Array.from({length: Math.ceil(width/8)}, (_,i) => (
        <rect key={i} x={i*8} y={0} width={5} height={height} fill={c} opacity={0.12} />
      ))}
      {Array.from({length: Math.ceil(height/6)}, (_,i) => (
        <rect key={`h${i}`} x={0} y={i*6} width={width} height={3} fill={c} opacity={0.08} />
      ))}
      <rect y={0} width={width} height={2} fill={c} opacity={0.4} />
      <rect y={height-2} width={width} height={2} fill={c} opacity={0.4} />
      {Array.from({length: Math.ceil(width/10)}, (_,i) => (
        <polygon key={i}
          points={`${i*10+5},2 ${i*10+9},${height/2} ${i*10+5},${height-2} ${i*10+1},${height/2}`}
          fill={c} opacity={0.18} />
      ))}
    </>,

    // br7 — Thin Gold Line: minimal elegant gold line
    br7: <>
      <rect width={width} height={height} fill={c} />
      <rect y={height*0.3} width={width} height={height*0.4} fill={a} opacity={0.85} />
      <rect y={height*0.35} width={width} height={height*0.08} fill={c} opacity={0.3} />
      <rect y={height*0.57} width={width} height={height*0.08} fill={c} opacity={0.3} />
    </>,

    // br8 — Floral Chain: continuous floral vine
    br8: <>
      <rect width={width} height={height} fill={c} />
      <path d={`M0,${height/2} ` + Array.from({length: Math.ceil(width/16)}, (_,i) =>
        `C${i*16+4},${height*0.15} ${i*16+12},${height*0.15} ${(i+1)*16},${height/2} C${(i+1)*16+4},${height*0.85} ${(i+1)*16+12},${height*0.85} ${(i+2)*16},${height/2}`
      ).join(' ')} fill="none" stroke={a} strokeWidth={1.5} opacity={0.8} />
      {Array.from({length: Math.ceil(width/16)}, (_,i) => (
        <g key={i}>
          <circle cx={i*16+8} cy={height*0.15} r={2.5} fill={a} opacity={0.8} />
          <circle cx={i*16+8} cy={height*0.85} r={2.5} fill={a} opacity={0.8} />
          {[0,90,180,270].map(ang=>(
            <circle key={ang}
              cx={i*16+8 + Math.cos(ang*Math.PI/180)*2.5}
              cy={height*0.15 + Math.sin(ang*Math.PI/180)*2.5}
              r={0.8} fill={a} opacity={0.6} />
          ))}
        </g>
      ))}
    </>,

    // br9 — Geometric Steps: stepped pyramid border
    br9: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/12)}, (_,i) => (
        <g key={i}>
          <rect x={i*12} y={0} width={10} height={height*0.3} fill={a} opacity={0.7} />
          <rect x={i*12+1} y={height*0.3} width={8} height={height*0.4} fill={a} opacity={0.55} />
          <rect x={i*12+2} y={height*0.7} width={6} height={height*0.3} fill={a} opacity={0.4} />
        </g>
      ))}
    </>,

    // br10 — Wave Scallop: elegant wave / scallop pattern
    br10: <>
      <rect width={width} height={height} fill={c} />
      <path d={`M0,${height*0.7} ` + Array.from({length: Math.ceil(width/20)+1}, (_,i) =>
        `Q${i*20+10},${-height*0.3} ${(i+1)*20},${height*0.7}`
      ).join(' ')} fill={a} opacity={0.7} />
      <path d={`M0,${height*0.8} ` + Array.from({length: Math.ceil(width/20)+1}, (_,i) =>
        `Q${i*20+10},${height*0.1} ${(i+1)*20},${height*0.8}`
      ).join(' ')} fill="none" stroke={a} strokeWidth={1.2} opacity={0.6} />
    </>,

    // br11 — Diamond Chain: diamonds linked in chain
    br11: <>
      <rect width={width} height={height} fill={c} />
      <line x1={0} y1={height/2} x2={width} y2={height/2} stroke={a} strokeWidth={0.6} opacity={0.4} />
      {Array.from({length: Math.ceil(width/16)}, (_,i) => (
        <g key={i} transform={`translate(${i*16+8},${height/2})`}>
          <polygon points={`0,-${height/2-1} ${height/2-1},0 0,${height/2-1} -${height/2-1},0`}
            fill="none" stroke={a} strokeWidth={1.2} opacity={0.8} />
          <polygon points={`0,-${height/4} ${height/4},0 0,${height/4} -${height/4},0`}
            fill={a} opacity={0.55} />
          <circle r={2} fill={a} opacity={0.9} />
        </g>
      ))}
    </>,

    // br12 — Lotus Row: horizontal lotus row
    br12: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/18)}, (_,i) => (
        <g key={i} transform={`translate(${i*18+9},${height/2})`}>
          {/* Petals */}
          {[-1,0,1].map(p => (
            <ellipse key={p} cx={p*4} cy={-height*0.2}
              rx={3.5} ry={height*0.38}
              fill={a} opacity={0.5+p*0.1} />
          ))}
          {[-1,1].map(p => (
            <ellipse key={`s${p}`} cx={p*7} cy={0}
              rx={2.5} ry={height*0.28}
              fill={a} opacity={0.35} />
          ))}
          <circle cy={-height*0.35} r={2} fill={a} opacity={0.9} />
          <circle r={2.5} fill={a} opacity={0.6} />
          <line x1={0} y1={height/2-1} x2={0} y2={height*0.35}
            stroke={a} strokeWidth={1} opacity={0.5} />
        </g>
      ))}
    </>,
  }

  // ── PALLU PATTERNS (p1–p12) ───────────────────────────────────────────────
  const pallu_patterns = {

    // p1 — Rich Zari Field: heavy zari full-coverage weave
    p1: <>
      <rect width={width} height={height} fill={a} />
      {Array.from({length: Math.ceil(width/7)}, (_,i) => (
        <rect key={`v${i}`} x={i*7} y={0} width={4} height={height} fill={c} opacity={0.14} />
      ))}
      {Array.from({length: Math.ceil(height/7)}, (_,i) => (
        <rect key={`h${i}`} x={0} y={i*7} width={width} height={3} fill={c} opacity={0.1} />
      ))}
      {Array.from({length: Math.ceil(width/22)}, (_,x) => Array.from({length: Math.ceil(height/22)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*22+11},${y*22+11})`}>
          <polygon points="0,-8 3,-3 8,-3 4,2 6,8 0,4 -6,8 -4,2 -8,-3 -3,-3"
            fill={c} opacity={0.4} />
          <circle r={2} fill={c} opacity={0.6} />
        </g>
      ))).flat()}
    </>,

    // p2 — Contrast Split: dramatic contrast pallu
    p2: <>
      <rect width={width} height={height} fill={a} />
      <rect width={width} height={height*0.55} fill={c} opacity={0.95} />
      {/* Decorative transition row */}
      {Array.from({length: Math.ceil(width/16)}, (_,i) => (
        <g key={i} transform={`translate(${i*16+8},${height*0.55})`}>
          <polygon points="0,-8 6,0 0,8 -6,0" fill={a} opacity={0.85} />
          <polygon points="0,-4 3,0 0,4 -3,0" fill={c} opacity={0.9} />
        </g>
      ))}
      {Array.from({length: Math.ceil(width/10)}, (_,i) => (
        <g key={`b${i}`} transform={`translate(${i*10+5},${height*0.75})`}>
          <polygon points="0,-7 3,-3 7,-3 3,2 5,7 0,4 -5,7 -3,2 -7,-3 -3,-3"
            fill={c} opacity={0.5} />
        </g>
      ))}
    </>,

    // p3 — Peacock Pallu: full peacock display
    p3: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/34)}, (_,x) => Array.from({length: Math.ceil(height/38)}, (_,y) => {
        const cx = x*34+17 + (y%2===0?0:17), cy = y*38+19
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            {/* Tail fan */}
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(ang => (
              <path key={ang}
                d={`M0,0 C${Math.cos(ang*Math.PI/180)*8},${Math.sin(ang*Math.PI/180)*8} ${Math.cos(ang*Math.PI/180)*14},${Math.sin(ang*Math.PI/180)*14} ${Math.cos(ang*Math.PI/180)*16},${Math.sin(ang*Math.PI/180)*16}`}
                fill="none" stroke={a} strokeWidth={0.8} opacity={0.5} />
            ))}
            {/* Eye */}
            <circle r={8} fill="none" stroke={a} strokeWidth={1} opacity={0.4} />
            <circle r={5} fill={a} opacity={0.25} />
            <circle r={3} fill={a} opacity={0.5} />
            <circle r={1.5} fill={c} opacity={1} />
            <circle r={0.7} fill={a} opacity={1} />
          </g>
        )
      })).flat()}
    </>,

    // p4 — Floral Bouquet: scattered floral sprays
    p4: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/26)}, (_,x) => Array.from({length: Math.ceil(height/26)}, (_,y) => {
        const cx = x*26+13 + (y%2===0?0:13), cy = y*26+13
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            {/* Petals */}
            {[0,72,144,216,288].map(ang => (
              <ellipse key={ang}
                cx={Math.cos((ang-90)*Math.PI/180)*6}
                cy={Math.sin((ang-90)*Math.PI/180)*6}
                rx={3} ry={5.5}
                fill={a} opacity={0.6}
                transform={`rotate(${ang},${Math.cos((ang-90)*Math.PI/180)*6},${Math.sin((ang-90)*Math.PI/180)*6})`}
              />
            ))}
            <circle r={3.5} fill={a} opacity={0.8} />
            <circle r={1.8} fill={c} opacity={1} />
            {/* Leaves */}
            <path d={`M0,10 C4,14 -4,16 0,18`} fill="none" stroke={a} strokeWidth={0.8} opacity={0.5} />
            <path d={`M0,10 C-4,14 4,16 0,18`} fill="none" stroke={a} strokeWidth={0.8} opacity={0.5} />
          </g>
        )
      })).flat()}
    </>,

    // p5 — Minimal Silk: clean solid with subtle sheen
    p5: <>
      <defs>
        <linearGradient id="p5g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c} stopOpacity="1"/>
          <stop offset="50%" stopColor={c} stopOpacity="0.88"/>
          <stop offset="100%" stopColor={c} stopOpacity="1"/>
        </linearGradient>
      </defs>
      <rect width={width} height={height} fill={`url(#p5g)`} />
      {Array.from({length: Math.ceil(height/3)}, (_,i) => (
        <line key={i} x1={0} y1={i*3} x2={width} y2={i*3}
          stroke={a} strokeWidth={0.4} opacity={0.07} />
      ))}
    </>,

    // p6 — Temple Arch Pallu: grand temple arch repeats
    p6: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/30)}, (_,x) => Array.from({length: Math.ceil(height/34)}, (_,y) => {
        const cx = x*30+15, cy = y*34+17
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            {/* Outer arch */}
            <path d={`M-12,14 L-12,-4 C-12,-18 12,-18 12,-4 L12,14`}
              fill="none" stroke={a} strokeWidth={1.5} opacity={0.7} />
            {/* Inner arch */}
            <path d={`M-8,14 L-8,0 C-8,-10 8,-10 8,0 L8,14`}
              fill="none" stroke={a} strokeWidth={1} opacity={0.5} />
            {/* Spire */}
            <line x1={0} y1={-18} x2={0} y2={-24} stroke={a} strokeWidth={1.2} opacity={0.7} />
            <polygon points="0,-28 3,-22 -3,-22" fill={a} opacity={0.8} />
            {/* Base line */}
            <line x1={-12} y1={14} x2={12} y2={14} stroke={a} strokeWidth={1.2} opacity={0.7} />
            {/* Centre lotus */}
            <circle r={3} fill={a} opacity={0.6} />
            <circle r={1.5} fill={c} opacity={1} />
          </g>
        )
      })).flat()}
    </>,

    // p7 — Mughal Garden: jali lattice with garden motifs
    p7: <>
      <rect width={width} height={height} fill={c} />
      {/* Lattice */}
      {Array.from({length: Math.ceil((width+height)/20)}, (_,i) => (
        <g key={i}>
          <line x1={i*20-height} y1={0} x2={i*20} y2={height}
            stroke={a} strokeWidth={0.7} opacity={0.3} />
          <line x1={width-i*20+height} y1={0} x2={width-i*20} y2={height}
            stroke={a} strokeWidth={0.7} opacity={0.3} />
        </g>
      ))}
      {/* Flowers at intersections */}
      {Array.from({length: Math.ceil(width/28)}, (_,x) => Array.from({length: Math.ceil(height/28)}, (_,y) => {
        const cx = x*28+14 + (y%2===0?0:14), cy = y*28+14
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            {[0,45,90,135,180,225,270,315].map(ang => (
              <ellipse key={ang}
                cx={Math.cos((ang-90)*Math.PI/180)*5}
                cy={Math.sin((ang-90)*Math.PI/180)*5}
                rx={2} ry={4}
                fill={a} opacity={0.45}
                transform={`rotate(${ang},${Math.cos((ang-90)*Math.PI/180)*5},${Math.sin((ang-90)*Math.PI/180)*5})`}
              />
            ))}
            <circle r={2.5} fill={a} opacity={0.7} />
            <circle r={1} fill={c} opacity={1} />
          </g>
        )
      })).flat()}
    </>,

    // p8 — Butta Scatter: scattered buta/butta motifs
    p8: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/20)}, (_,x) => Array.from({length: Math.ceil(height/20)}, (_,y) => {
        const cx = x*20+10 + (y%2===0?0:10), cy = y*20+10
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            {/* Mango buta */}
            <path d={`M0,-8 C4,-4 4,2 2,5 C0,7 -2,7 -2,5 C-4,2 -4,-4 0,-8Z`}
              fill={a} opacity={0.7} />
            <path d={`M0,-5 C2,-2 2,2 1,4 C0,5 -1,5 -1,4 C-2,2 -2,-2 0,-5Z`}
              fill={c} opacity={1} />
            <circle r={1} fill={a} opacity={0.9} />
            {/* Curl */}
            <path d={`M0,-8 C-2,-10 -1,-12 1,-11`}
              fill="none" stroke={a} strokeWidth={0.9} opacity={0.8} />
          </g>
        )
      })).flat()}
    </>,

    // p9 — Stripe Pallu: bold stripe composition
    p9: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/20)}, (_,i) => {
        const w2 = i%4===0 ? 8 : i%2===0 ? 4 : 2
        const op = i%4===0 ? 0.7 : i%2===0 ? 0.45 : 0.25
        return <rect key={i} x={i*20} y={0} width={w2} height={height} fill={a} opacity={op} />
      })}
    </>,

    // p10 — Vine Creeper: flowing vine with leaves
    p10: <>
      <rect width={width} height={height} fill={c} />
      {/* Main vine stems */}
      {Array.from({length: 3}, (_,j) => (
        <path key={j}
          d={`M${j*width/3},0 C${j*width/3+width/6},${height/4} ${j*width/3-width/6},${height/2} ${j*width/3},${height*0.75} C${j*width/3+width/8},${height}`}
          fill="none" stroke={a} strokeWidth={1.5} opacity={0.6} />
      ))}
      {/* Leaves along vines */}
      {Array.from({length: Math.ceil(height/18)}, (_,i) => (
        <g key={i}>
          <ellipse cx={width/4 + Math.sin(i*1.2)*20} cy={i*18+9} rx={6} ry={4}
            fill={a} opacity={0.45}
            transform={`rotate(${i*30},${width/4 + Math.sin(i*1.2)*20},${i*18+9})`} />
          <ellipse cx={3*width/4 + Math.cos(i*1.2)*18} cy={i*18+5} rx={5} ry={3.5}
            fill={a} opacity={0.4}
            transform={`rotate(${-i*25},${3*width/4 + Math.cos(i*1.2)*18},${i*18+5})`} />
        </g>
      ))}
      {Array.from({length: Math.ceil(height/24)}, (_,i) => (
        <circle key={`f${i}`}
          cx={width/2 + Math.sin(i*2)*15} cy={i*24+12}
          r={3.5} fill={a} opacity={0.65} />
      ))}
    </>,

    // p11 — Kashmiri Garden: elaborate Kashmiri flower garden
    p11: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/30)}, (_,x) => Array.from({length: Math.ceil(height/30)}, (_,y) => {
        const cx = x*30+15 + (y%2===0?0:15), cy = y*30+15
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            {/* Outer petal ring */}
            {[0,45,90,135,180,225,270,315].map(ang => (
              <path key={ang}
                d={`M0,0 C${Math.cos((ang-30)*Math.PI/180)*6},${Math.sin((ang-30)*Math.PI/180)*6} ${Math.cos((ang+30)*Math.PI/180)*6},${Math.sin((ang+30)*Math.PI/180)*6} ${Math.cos(ang*Math.PI/180)*12},${Math.sin(ang*Math.PI/180)*12}`}
                fill={a} opacity={0.35} />
            ))}
            {/* Inner petals */}
            {[22,67,112,157,202,247,292,337].map(ang => (
              <path key={`i${ang}`}
                d={`M0,0 C${Math.cos((ang-20)*Math.PI/180)*4},${Math.sin((ang-20)*Math.PI/180)*4} ${Math.cos((ang+20)*Math.PI/180)*4},${Math.sin((ang+20)*Math.PI/180)*4} ${Math.cos(ang*Math.PI/180)*7},${Math.sin(ang*Math.PI/180)*7}`}
                fill={a} opacity={0.55} />
            ))}
            <circle r={3.5} fill={a} opacity={0.75} />
            <circle r={1.8} fill={c} opacity={1} />
            <circle r={0.8} fill={a} opacity={1} />
          </g>
        )
      })).flat()}
    </>,

    // p12 — Geometric Trellis: bold interlocking geometric
    p12: <>
      <rect width={width} height={height} fill={c} />
      {/* Diamond grid */}
      {Array.from({length: Math.ceil(width/20)}, (_,x) => Array.from({length: Math.ceil(height/20)}, (_,y) => {
        const cx = x*20+10 + (y%2===0?0:10), cy = y*20+10
        return (
          <g key={`${x}-${y}`} transform={`translate(${cx},${cy})`}>
            <polygon points="0,-9 9,0 0,9 -9,0"
              fill="none" stroke={a} strokeWidth={1.2} opacity={0.65} />
            <polygon points="0,-5 5,0 0,5 -5,0"
              fill={a} opacity={0.3} />
            <circle r={1.8} fill={a} opacity={0.8} />
          </g>
        )
      })).flat()}
      {/* Grid lines */}
      {Array.from({length: Math.ceil((width+height)/20)}, (_,i) => (
        <g key={`l${i}`}>
          <line x1={i*20-height} y1={0} x2={i*20} y2={height}
            stroke={a} strokeWidth={0.5} opacity={0.2} />
          <line x1={width-i*20+height} y1={0} x2={width-i*20} y2={height}
            stroke={a} strokeWidth={0.5} opacity={0.2} />
        </g>
      ))}
    </>,
  }

  const part = patternId?.startsWith('br') ? border_patterns
             : patternId?.startsWith('p')  ? pallu_patterns
             : patterns
  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
      {part[patternId] || <rect width={width} height={height} fill={c} />}
    </svg>
  )
}

// ─── SAREE CANVAS ─────────────────────────────────────────────────────────────
function SareeCanvas({ design, scale = 1 }) {
  const w       = Math.round(200 * scale)
  const palluH  = Math.round(160 * scale)
  const borderH = Math.round(22 * scale)
  const bodyH   = Math.round(260 * scale)
  const blouseH = Math.round(55 * scale)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      borderRadius: 4, overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
      width: w
    }}>
      {/* Label: PALLU */}
      <div style={{
        width:'100%', padding:'4px 0', textAlign:'center',
        background:'rgba(0,0,0,0.45)', fontSize: Math.max(7, Math.round(8*scale)),
        letterSpacing:2, textTransform:'uppercase', color:'#9C8A6A', fontWeight:600
      }}>Pallu</div>

      {/* Pallu */}
      <div style={{width:w, height:palluH, overflow:'hidden', position:'relative'}}>
        <PatternRenderer patternId={design.palluPattern} color={design.primaryColor} accentColor={design.accentColor} width={w} height={palluH} />
        {/* Silk sheen overlay */}
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,
          background:'linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 40%,rgba(255,255,255,0.06) 60%,transparent 100%)',
          pointerEvents:'none'}} />
      </div>

      {/* Top border */}
      <div style={{width:w, height:borderH, overflow:'hidden', position:'relative'}}>
        <PatternRenderer patternId={design.borderPattern} color={design.secondaryColor} accentColor={design.accentColor} width={w} height={borderH} />
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,
          background:'linear-gradient(180deg,rgba(0,0,0,0.12) 0%,transparent 30%,transparent 70%,rgba(0,0,0,0.12) 100%)',
          pointerEvents:'none'}} />
      </div>

      {/* Label: BODY */}
      <div style={{
        width:'100%', padding:'3px 0', textAlign:'center',
        background:'rgba(0,0,0,0.25)', fontSize: Math.max(6, Math.round(7*scale)),
        letterSpacing:2, textTransform:'uppercase', color:'#9C8A6A', fontWeight:600
      }}>Body</div>

      {/* Body with zari side borders */}
      <div style={{width:w, height:bodyH, overflow:'hidden', position:'relative'}}>
        <PatternRenderer patternId={design.bodyPattern} color={design.primaryColor} accentColor={design.accentColor} width={w} height={bodyH} />
        {/* Left zari strip */}
        <div style={{position:'absolute',top:0,left:0,bottom:0, width:Math.round(12*scale),
          background:`linear-gradient(90deg,${design.accentColor}BB,${design.accentColor}44)`,
          pointerEvents:'none'}} />
        {/* Right zari strip */}
        <div style={{position:'absolute',top:0,right:0,bottom:0, width:Math.round(12*scale),
          background:`linear-gradient(270deg,${design.accentColor}BB,${design.accentColor}44)`,
          pointerEvents:'none'}} />
        {/* Silk sheen */}
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,
          background:'linear-gradient(160deg,rgba(255,255,255,0.07) 0%,transparent 50%)',
          pointerEvents:'none'}} />
      </div>

      {/* Bottom border */}
      <div style={{width:w, height:borderH, overflow:'hidden', position:'relative'}}>
        <PatternRenderer patternId={design.borderPattern} color={design.secondaryColor} accentColor={design.accentColor} width={w} height={borderH} />
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,
          background:'linear-gradient(180deg,rgba(0,0,0,0.12) 0%,transparent 30%,transparent 70%,rgba(0,0,0,0.12) 100%)',
          pointerEvents:'none'}} />
      </div>

      {/* Blouse */}
      <div style={{width:w, height:blouseH, overflow:'hidden', position:'relative'}}>
        <PatternRenderer patternId={design.bodyPattern} color={design.secondaryColor} accentColor={design.accentColor} width={w} height={blouseH} />
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,
          background:'rgba(0,0,0,0.15)', pointerEvents:'none'}} />
        {/* Blouse hem band */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0, height:Math.round(14*scale),
          background:`linear-gradient(90deg,${design.accentColor}55,${design.accentColor}DD,${design.accentColor}55)`,
          pointerEvents:'none'
        }} />
      </div>

      {/* Label: BLOUSE */}
      <div style={{
        width:'100%', padding:'4px 0', textAlign:'center',
        background:'rgba(0,0,0,0.45)', fontSize: Math.max(7, Math.round(8*scale)),
        letterSpacing:2, textTransform:'uppercase', color:'#9C8A6A', fontWeight:600
      }}>Blouse</div>
    </div>
  )
}

// ─── SVG-TO-PNG EXPORT ────────────────────────────────────────────────────────
export function exportSareeAsPNG(design, filename = 'saree-design') {
  const scale   = 2
  const W       = 200 * scale
  const palluH  = 160 * scale
  const borderH =  22 * scale
  const bodyH   = 260 * scale
  const blouseH =  55 * scale
  const labelH  =  18 * scale
  const H       = palluH + borderH * 2 + bodyH + blouseH + labelH * 3

  const { primaryColor: pc, secondaryColor: sc, accentColor: ac,
          bodyPattern, borderPattern, palluPattern } = design

  const buildSectionSVG = (patternId, color, accent, w, h) => {
    const c = color; const a = accent
    const patterns = {
      b1:  `<defs><linearGradient id="eg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c}"/><stop offset="50%" stop-color="${c}" stop-opacity="0.88"/><stop offset="100%" stop-color="${c}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#eg1)"/>${Array.from({length:Math.ceil(h/4)},(_,i)=>`<line x1="0" y1="${i*4}" x2="${w}" y2="${i*4}" stroke="${a}" stroke-width="0.3" opacity="0.07"/>`).join('')}`,
      b2:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/18)},(_,i)=>`<rect x="${i*18}" y="0" width="6" height="${h}" fill="${a}" opacity="0.55"/><rect x="${i*18+1}" y="0" width="1" height="${h}" fill="${a}" opacity="0.9"/><rect x="${i*18+4}" y="0" width="1" height="${h}" fill="${a}" opacity="0.9"/>`).join('')}`,
      b3:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(h/16)},(_,i)=>`<rect x="0" y="${i*16}" width="${w}" height="6" fill="${a}" opacity="0.22"/>`).join('')}${Array.from({length:Math.ceil(w/16)},(_,i)=>`<rect x="${i*16}" y="0" width="6" height="${h}" fill="${a}" opacity="0.22"/>`).join('')}${Array.from({length:Math.ceil(h/16)},(_,i)=>Array.from({length:Math.ceil(w/16)},(_,j)=>`<rect x="${j*16}" y="${i*16}" width="6" height="6" fill="${a}" opacity="0.28"/>`).join('')).join('')}`,
      b4:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/22)},(_,x)=>Array.from({length:Math.ceil(h/22)},(_,y)=>{const cx=x*22+11,cy=y*22+11,off=x%2===0?0:11;return `<g transform="translate(${cx},${cy+off})"><ellipse rx="4" ry="7" fill="${a}" opacity="0.75"/><ellipse rx="2.5" ry="4.5" fill="${c}" opacity="1"/><ellipse rx="1" ry="1.8" fill="${a}" opacity="0.9"/><line x1="0" y1="-7" x2="-2" y2="-10" stroke="${a}" stroke-width="0.8" opacity="0.7"/><circle cx="-2" cy="-10" r="1" fill="${a}" opacity="0.8"/></g>`}).join('')).join('')}`,
      b5:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/20)},(_,x)=>Array.from({length:Math.ceil(h/20)},(_,y)=>{const cx=x*20+10+(y%2===0?0:10),cy=y*20+10;return `<g transform="translate(${cx},${cy})"><polygon points="0,-9 9,0 0,9 -9,0" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.7"/><polygon points="0,-5 5,0 0,5 -5,0" fill="${a}" opacity="0.5"/><circle r="1.5" fill="${a}" opacity="0.9"/></g>`}).join('')).join('')}`,
      b6:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/26)},(_,x)=>Array.from({length:Math.ceil(h/30)},(_,y)=>`<g transform="translate(${x*26+13},${y*30+15})"><polygon points="0,-12 4,-8 4,2 6,6 0,10 -6,6 -4,2 -4,-8" fill="${a}" opacity="0.6"/><polygon points="0,-12 3,-9 3,-4 0,-2 -3,-4 -3,-9" fill="${c}" opacity="0.9"/><line x1="-6" y1="6" x2="6" y2="6" stroke="${a}" stroke-width="1" opacity="0.8"/><circle cx="0" cy="-13" r="1.5" fill="${a}" opacity="0.9"/></g>`).join('')).join('')}`,
      b7:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/30)},(_,x)=>Array.from({length:Math.ceil(h/30)},(_,y)=>{const cx=x*30+15+(y%2===0?0:15),cy=y*30+15;return `<g transform="translate(${cx},${cy})"><ellipse rx="10" ry="12" fill="none" stroke="${a}" stroke-width="1" opacity="0.5"/><ellipse rx="7" ry="9" fill="${a}" opacity="0.15"/><ellipse rx="4" ry="5" fill="${a}" opacity="0.4"/><ellipse rx="2" ry="2.5" fill="${c}" opacity="1"/><circle r="1" fill="${a}" opacity="0.9"/></g>`}).join('')).join('')}`,
      b8:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/14)},(_,x)=>Array.from({length:Math.ceil(h/14)},(_,y)=>{const cx=x*14+7+(y%2===0?0:7),cy=y*14+7;return `<circle cx="${cx}" cy="${cy}" r="2.5" fill="${a}" opacity="0.8"/><circle cx="${cx}" cy="${cy}" r="1.2" fill="${c}" opacity="1"/><circle cx="${cx}" cy="${cy}" r="0.5" fill="${a}" opacity="1"/>`}).join('')).join('')}`,
      b9:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/12)},(_,x)=>Array.from({length:Math.ceil(h/12)},(_,y)=>{const cx=x*12+6+(y%2===0?0:6),cy=y*12+6;return `<g transform="translate(${cx},${cy})"><circle r="4" fill="none" stroke="${a}" stroke-width="0.8" opacity="0.5"/><circle r="2.5" fill="${a}" opacity="0.35"/><circle r="1.2" fill="${a}" opacity="0.7"/><circle r="0.5" fill="${c}" opacity="1"/></g>`}).join('')).join('')}`,
      b10: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil((w+h)/8)},(_,i)=>`<line x1="${i*8-h}" y1="0" x2="${i*8}" y2="${h}" stroke="${a}" stroke-width="${i%3===0?1.8:0.8}" opacity="${i%3===0?0.7:0.3}"/>`).join('')}`,
      b11: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/28)},(_,x)=>Array.from({length:Math.ceil(h/32)},(_,y)=>`<g transform="translate(${x*28+14},${y*32+16})"><path d="M-10,12 L-10,-4 C-10,-14 10,-14 10,-4 L10,12" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.65"/><path d="M-6,12 L-6,-2 C-6,-9 6,-9 6,-2 L6,12" fill="none" stroke="${a}" stroke-width="0.7" opacity="0.4"/><circle cy="-14" r="2" fill="${a}" opacity="0.7"/><line x1="-10" y1="12" x2="10" y2="12" stroke="${a}" stroke-width="1" opacity="0.6"/></g>`).join('')).join('')}`,
      b12: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/24)},(_,x)=>Array.from({length:Math.ceil(h/24)},(_,y)=>`<g transform="translate(${x*24+12},${y*24+12})"><polygon points="0,-10 2.5,-2.5 10,0 2.5,2.5 0,10 -2.5,2.5 -10,0 -2.5,-2.5" fill="none" stroke="${a}" stroke-width="1" opacity="0.65"/><polygon points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2" fill="${a}" opacity="0.2"/><circle r="2" fill="${a}" opacity="0.7"/></g>`).join('')).join('')}`,
      b13: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/28)},(_,x)=>Array.from({length:Math.ceil(h/28)},(_,y)=>{const cx=x*28+14+(y%2===0?0:14),cy=y*28+14;const petals=[0,45,90,135,180,225,270,315].map(ang=>`<ellipse cx="${Math.cos((ang-90)*Math.PI/180)*6}" cy="${Math.sin((ang-90)*Math.PI/180)*6}" rx="2.5" ry="5" fill="${a}" opacity="0.5" transform="rotate(${ang},${Math.cos((ang-90)*Math.PI/180)*6},${Math.sin((ang-90)*Math.PI/180)*6})"/>`).join('');return `<g transform="translate(${cx},${cy})">${petals}<circle r="3" fill="${a}" opacity="0.7"/><circle r="1.5" fill="${c}" opacity="1"/></g>`}).join('')).join('')}`,
      b14: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/32)},(_,x)=>Array.from({length:Math.ceil(h/32)},(_,y)=>`<g transform="translate(${x*32+16},${y*32+16})"><circle cy="-9" r="3" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.8"/><line x1="0" y1="-6" x2="0" y2="2" stroke="${a}" stroke-width="1.2" opacity="0.8"/><line x1="-6" y1="-3" x2="6" y2="-3" stroke="${a}" stroke-width="1" opacity="0.7"/><line x1="0" y1="2" x2="-5" y2="10" stroke="${a}" stroke-width="1" opacity="0.7"/><line x1="0" y1="2" x2="5" y2="10" stroke="${a}" stroke-width="1" opacity="0.7"/></g>`).join('')).join('')}`,
      b15: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/26)},(_,x)=>Array.from({length:Math.ceil(h/26)},(_,y)=>{const cx=x*26+13+(y%2===0?0:13),cy=y*26+13;return `<g transform="translate(${cx},${cy})"><path d="M0,-11 C4,-8 8,-4 6,0 C8,4 4,8 0,11 C-4,8 -8,4 -6,0 C-8,-4 -4,-8 0,-11Z" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.7"/><circle r="1.5" fill="${a}" opacity="0.8"/></g>`}).join('')).join('')}`,
      b16: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/8)},(_,i)=>i%3===0?`<rect x="${i*8}" y="0" width="2" height="${h}" fill="${a}" opacity="0.7"/><rect x="${i*8+0.5}" y="0" width="1" height="${h}" fill="${a}" opacity="0.5"/>`:`<rect x="${i*8}" y="0" width="1" height="${h}" fill="${a}" opacity="0.25"/>`).join('')}`,
      b17: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/22)},(_,x)=>Array.from({length:Math.ceil(h/22)},(_,y)=>{const cx=x*22+11,cy=y*22+11;const petals=[0,60,120,180,240,300].map(ang=>`<ellipse cx="${Math.cos(ang*Math.PI/180)*6}" cy="${Math.sin(ang*Math.PI/180)*6}" rx="2" ry="3.5" fill="${a}" opacity="0.55" transform="rotate(${ang},${Math.cos(ang*Math.PI/180)*6},${Math.sin(ang*Math.PI/180)*6})"/>`).join('');return `<g transform="translate(${cx},${cy})"><circle r="9" fill="none" stroke="${a}" stroke-width="1.5" opacity="0.6"/>${petals}<circle r="3" fill="${a}" opacity="0.7"/><circle r="1.5" fill="${c}" opacity="1"/></g>`}).join('')).join('')}`,
      br1: `<rect width="${w}" height="${h}" fill="${c}"/><rect y="${h*0.15}" width="${w}" height="${h*0.7}" fill="${a}" opacity="0.9"/><rect y="${h*0.15}" width="${w}" height="${h*0.08}" fill="${a}" opacity="0.5"/><rect y="${h*0.77}" width="${w}" height="${h*0.08}" fill="${a}" opacity="0.5"/>`,
      br2: `<rect width="${w}" height="${h}" fill="${c}"/><rect y="0" width="${w}" height="${h*0.28}" fill="${a}" opacity="0.9"/><rect y="${h*0.72}" width="${w}" height="${h*0.28}" fill="${a}" opacity="0.9"/><rect y="${h*0.35}" width="${w}" height="${h*0.3}" fill="${a}" opacity="0.55"/>`,
      br3: `<rect width="${w}" height="${h}" fill="${a}"/>${Array.from({length:Math.ceil(w/14)},(_,i)=>`<g transform="translate(${i*14+7},0)"><path d="M-5,${h} L-5,${h*0.5} C-5,${h*0.1} 5,${h*0.1} 5,${h*0.5} L5,${h}" fill="${c}" opacity="0.85"/><circle cy="${h*0.1}" r="2" fill="${c}" opacity="0.9"/></g>`).join('')}`,
      br4: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/18)},(_,i)=>`<g transform="translate(${i*18+9},${h/2})"><path d="M0,-${h/2-1} C${h/4},-${h/4} ${h/4},0 0,${h/4} C-${h/8},${h/4} -${h/4},0 0,-${h/2-1}Z" fill="${a}" opacity="0.75"/><path d="M0,-${h/2-3} C${h/6},-${h/4} ${h/6},0 0,${h/6} C-${h/10},${h/6} -${h/6},0 0,-${h/2-3}Z" fill="${c}" opacity="1"/><circle r="2" fill="${a}" opacity="0.9"/></g>`).join('')}`,
      br5: `<rect width="${w}" height="${h}" fill="${a}"/>${Array.from({length:Math.ceil(w/24)},(_,i)=>`<g transform="translate(${i*24+12},${h/2})"><ellipse rx="6" ry="4" fill="${c}" opacity="0.9"/><path d="M3,-4 C4,-8 6,-10 5,-12" fill="none" stroke="${c}" stroke-width="2" opacity="0.9"/><circle cx="5" cy="-12" r="2.5" fill="${c}" opacity="0.9"/></g>`).join('')}`,
      br6: `<rect width="${w}" height="${h}" fill="${a}"/>${Array.from({length:Math.ceil(w/8)},(_,i)=>`<rect x="${i*8}" y="0" width="5" height="${h}" fill="${c}" opacity="0.12"/>`).join('')}<rect y="0" width="${w}" height="2" fill="${c}" opacity="0.4"/><rect y="${h-2}" width="${w}" height="2" fill="${c}" opacity="0.4"/>`,
      br7: `<rect width="${w}" height="${h}" fill="${c}"/><rect y="${h*0.3}" width="${w}" height="${h*0.4}" fill="${a}" opacity="0.85"/><rect y="${h*0.35}" width="${w}" height="${h*0.08}" fill="${c}" opacity="0.3"/><rect y="${h*0.57}" width="${w}" height="${h*0.08}" fill="${c}" opacity="0.3"/>`,
      br8: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/16)},(_,i)=>`<circle cx="${i*16+8}" cy="${h*0.15}" r="2.5" fill="${a}" opacity="0.8"/><circle cx="${i*16+8}" cy="${h*0.85}" r="2.5" fill="${a}" opacity="0.8"/>`).join('')}<path d="M0,${h/2} ${Array.from({length:Math.ceil(w/16)},(_,i)=>`C${i*16+4},${h*0.15} ${i*16+12},${h*0.15} ${(i+1)*16},${h/2} C${(i+1)*16+4},${h*0.85} ${(i+1)*16+12},${h*0.85} ${(i+2)*16},${h/2}`).join(' ')}" fill="none" stroke="${a}" stroke-width="1.5" opacity="0.8"/>`,
      br9: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/12)},(_,i)=>`<rect x="${i*12}" y="0" width="10" height="${h*0.3}" fill="${a}" opacity="0.7"/><rect x="${i*12+1}" y="${h*0.3}" width="8" height="${h*0.4}" fill="${a}" opacity="0.55"/><rect x="${i*12+2}" y="${h*0.7}" width="6" height="${h*0.3}" fill="${a}" opacity="0.4"/>`).join('')}`,
      br10:`<rect width="${w}" height="${h}" fill="${c}"/><path d="M0,${h*0.7} ${Array.from({length:Math.ceil(w/20)+1},(_,i)=>`Q${i*20+10},${-h*0.3} ${(i+1)*20},${h*0.7}`).join(' ')}" fill="${a}" opacity="0.7"/>`,
      br11:`<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/16)},(_,i)=>`<g transform="translate(${i*16+8},${h/2})"><polygon points="0,-${h/2-1} ${h/2-1},0 0,${h/2-1} -${h/2-1},0" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.8"/><polygon points="0,-${h/4} ${h/4},0 0,${h/4} -${h/4},0" fill="${a}" opacity="0.55"/><circle r="2" fill="${a}" opacity="0.9"/></g>`).join('')}`,
      br12:`<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/18)},(_,i)=>`<g transform="translate(${i*18+9},${h/2})"><ellipse rx="3.5" ry="${h/2-1}" fill="${a}" opacity="0.5"/><ellipse rx="3.5" cy="-${h*0.2}" rx2="3.5" ry="${h*0.38}" fill="${a}" opacity="0.5"/><circle cy="-${h*0.35}" r="2" fill="${a}" opacity="0.9"/></g>`).join('')}`,
      p1:  `<rect width="${w}" height="${h}" fill="${a}"/>${Array.from({length:Math.ceil(w/7)},(_,i)=>`<rect x="${i*7}" y="0" width="4" height="${h}" fill="${c}" opacity="0.14"/>`).join('')}${Array.from({length:Math.ceil(w/22)},(_,x)=>Array.from({length:Math.ceil(h/22)},(_,y)=>`<g transform="translate(${x*22+11},${y*22+11})"><polygon points="0,-8 3,-3 8,-3 4,2 6,8 0,4 -6,8 -4,2 -8,-3 -3,-3" fill="${c}" opacity="0.4"/><circle r="2" fill="${c}" opacity="0.6"/></g>`).join('')).join('')}`,
      p2:  `<rect width="${w}" height="${h}" fill="${a}"/><rect width="${w}" height="${h*0.55}" fill="${c}" opacity="0.95"/>${Array.from({length:Math.ceil(w/16)},(_,i)=>`<g transform="translate(${i*16+8},${h*0.55})"><polygon points="0,-8 6,0 0,8 -6,0" fill="${a}" opacity="0.85"/></g>`).join('')}`,
      p3:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/34)},(_,x)=>Array.from({length:Math.ceil(h/38)},(_,y)=>{const cx=x*34+17+(y%2===0?0:17),cy=y*38+19;const spokes=[0,30,60,90,120,150,180,210,240,270,300,330].map(ang=>`<path d="M0,0 C${Math.cos(ang*Math.PI/180)*8},${Math.sin(ang*Math.PI/180)*8} ${Math.cos(ang*Math.PI/180)*14},${Math.sin(ang*Math.PI/180)*14} ${Math.cos(ang*Math.PI/180)*16},${Math.sin(ang*Math.PI/180)*16}" fill="none" stroke="${a}" stroke-width="0.8" opacity="0.5"/>`).join('');return `<g transform="translate(${cx},${cy})">${spokes}<circle r="8" fill="none" stroke="${a}" stroke-width="1" opacity="0.4"/><circle r="5" fill="${a}" opacity="0.25"/><circle r="3" fill="${a}" opacity="0.5"/><circle r="1.5" fill="${c}" opacity="1"/></g>`}).join('')).join('')}`,
      p4:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/26)},(_,x)=>Array.from({length:Math.ceil(h/26)},(_,y)=>{const cx=x*26+13+(y%2===0?0:13),cy=y*26+13;const petals=[0,72,144,216,288].map(ang=>`<ellipse cx="${Math.cos((ang-90)*Math.PI/180)*6}" cy="${Math.sin((ang-90)*Math.PI/180)*6}" rx="3" ry="5.5" fill="${a}" opacity="0.6" transform="rotate(${ang},${Math.cos((ang-90)*Math.PI/180)*6},${Math.sin((ang-90)*Math.PI/180)*6})"/>`).join('');return `<g transform="translate(${cx},${cy})">${petals}<circle r="3.5" fill="${a}" opacity="0.8"/><circle r="1.8" fill="${c}" opacity="1"/></g>`}).join('')).join('')}`,
      p5:  `<defs><linearGradient id="p5e" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c}"/><stop offset="50%" stop-color="${c}" stop-opacity="0.88"/><stop offset="100%" stop-color="${c}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#p5e)"/>${Array.from({length:Math.ceil(h/3)},(_,i)=>`<line x1="0" y1="${i*3}" x2="${w}" y2="${i*3}" stroke="${a}" stroke-width="0.4" opacity="0.07"/>`).join('')}`,
      p6:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/30)},(_,x)=>Array.from({length:Math.ceil(h/34)},(_,y)=>`<g transform="translate(${x*30+15},${y*34+17})"><path d="M-12,14 L-12,-4 C-12,-18 12,-18 12,-4 L12,14" fill="none" stroke="${a}" stroke-width="1.5" opacity="0.7"/><path d="M-8,14 L-8,0 C-8,-10 8,-10 8,0 L8,14" fill="none" stroke="${a}" stroke-width="1" opacity="0.5"/><line x1="0" y1="-18" x2="0" y2="-24" stroke="${a}" stroke-width="1.2" opacity="0.7"/><polygon points="0,-28 3,-22 -3,-22" fill="${a}" opacity="0.8"/><line x1="-12" y1="14" x2="12" y2="14" stroke="${a}" stroke-width="1.2" opacity="0.7"/><circle r="3" fill="${a}" opacity="0.6"/><circle r="1.5" fill="${c}" opacity="1"/></g>`).join('')).join('')}`,
      p7:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil((w+h)/20)},(_,i)=>`<line x1="${i*20-h}" y1="0" x2="${i*20}" y2="${h}" stroke="${a}" stroke-width="0.7" opacity="0.3"/><line x1="${w-i*20+h}" y1="0" x2="${w-i*20}" y2="${h}" stroke="${a}" stroke-width="0.7" opacity="0.3"/>`).join('')}${Array.from({length:Math.ceil(w/28)},(_,x)=>Array.from({length:Math.ceil(h/28)},(_,y)=>{const cx=x*28+14+(y%2===0?0:14),cy=y*28+14;const petals=[0,45,90,135,180,225,270,315].map(ang=>`<ellipse cx="${Math.cos((ang-90)*Math.PI/180)*5}" cy="${Math.sin((ang-90)*Math.PI/180)*5}" rx="2" ry="4" fill="${a}" opacity="0.45" transform="rotate(${ang},${Math.cos((ang-90)*Math.PI/180)*5},${Math.sin((ang-90)*Math.PI/180)*5})"/>`).join('');return `<g transform="translate(${cx},${cy})">${petals}<circle r="2.5" fill="${a}" opacity="0.7"/><circle r="1" fill="${c}" opacity="1"/></g>`}).join('')).join('')}`,
      p8:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/20)},(_,x)=>Array.from({length:Math.ceil(h/20)},(_,y)=>{const cx=x*20+10+(y%2===0?0:10),cy=y*20+10;return `<g transform="translate(${cx},${cy})"><path d="M0,-8 C4,-4 4,2 2,5 C0,7 -2,7 -2,5 C-4,2 -4,-4 0,-8Z" fill="${a}" opacity="0.7"/><path d="M0,-5 C2,-2 2,2 1,4 C0,5 -1,5 -1,4 C-2,2 -2,-2 0,-5Z" fill="${c}" opacity="1"/><circle r="1" fill="${a}" opacity="0.9"/></g>`}).join('')).join('')}`,
      p9:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/20)},(_,i)=>`<rect x="${i*20}" y="0" width="${i%4===0?8:i%2===0?4:2}" height="${h}" fill="${a}" opacity="${i%4===0?0.7:i%2===0?0.45:0.25}"/>`).join('')}`,
      p10: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:3},(_,j)=>`<path d="M${j*w/3},0 C${j*w/3+w/6},${h/4} ${j*w/3-w/6},${h/2} ${j*w/3},${h*0.75} C${j*w/3+w/8},${h}" fill="none" stroke="${a}" stroke-width="1.5" opacity="0.6"/>`).join('')}${Array.from({length:Math.ceil(h/18)},(_,i)=>`<ellipse cx="${w/4+Math.sin(i*1.2)*20}" cy="${i*18+9}" rx="6" ry="4" fill="${a}" opacity="0.45" transform="rotate(${i*30},${w/4+Math.sin(i*1.2)*20},${i*18+9})"/>`).join('')}`,
      p11: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/30)},(_,x)=>Array.from({length:Math.ceil(h/30)},(_,y)=>{const cx=x*30+15+(y%2===0?0:15),cy=y*30+15;const outer=[0,45,90,135,180,225,270,315].map(ang=>`<path d="M0,0 C${Math.cos((ang-30)*Math.PI/180)*6},${Math.sin((ang-30)*Math.PI/180)*6} ${Math.cos((ang+30)*Math.PI/180)*6},${Math.sin((ang+30)*Math.PI/180)*6} ${Math.cos(ang*Math.PI/180)*12},${Math.sin(ang*Math.PI/180)*12}" fill="${a}" opacity="0.35"/>`).join('');const inner=[22,67,112,157,202,247,292,337].map(ang=>`<path d="M0,0 C${Math.cos((ang-20)*Math.PI/180)*4},${Math.sin((ang-20)*Math.PI/180)*4} ${Math.cos((ang+20)*Math.PI/180)*4},${Math.sin((ang+20)*Math.PI/180)*4} ${Math.cos(ang*Math.PI/180)*7},${Math.sin(ang*Math.PI/180)*7}" fill="${a}" opacity="0.55"/>`).join('');return `<g transform="translate(${cx},${cy})">${outer}${inner}<circle r="3.5" fill="${a}" opacity="0.75"/><circle r="1.8" fill="${c}" opacity="1"/></g>`}).join('')).join('')}`,
      p12: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/20)},(_,x)=>Array.from({length:Math.ceil(h/20)},(_,y)=>{const cx=x*20+10+(y%2===0?0:10),cy=y*20+10;return `<g transform="translate(${cx},${cy})"><polygon points="0,-9 9,0 0,9 -9,0" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.65"/><polygon points="0,-5 5,0 0,5 -5,0" fill="${a}" opacity="0.3"/><circle r="1.8" fill="${a}" opacity="0.8"/></g>`}).join('')).join('')}${Array.from({length:Math.ceil((w+h)/20)},(_,i)=>`<line x1="${i*20-h}" y1="0" x2="${i*20}" y2="${h}" stroke="${a}" stroke-width="0.5" opacity="0.2"/><line x1="${w-i*20+h}" y1="0" x2="${w-i*20}" y2="${h}" stroke="${a}" stroke-width="0.5" opacity="0.2"/>`).join('')}`,
    }
    return patterns[patternId] || patterns['b1']
  }

  let y = 0
  const sections = []

  sections.push(`<rect x="0" y="${y}" width="${W}" height="${labelH}" fill="rgba(0,0,0,0.45)"/>`)
  sections.push(`<text x="${W/2}" y="${y + labelH*0.72}" text-anchor="middle" font-size="${labelH*0.55}" fill="#9C8A6A" letter-spacing="3" font-family="sans-serif">PALLU</text>`)
  y += labelH

  sections.push(`<svg x="0" y="${y}" width="${W}" height="${palluH}">${buildSectionSVG(palluPattern, pc, ac, W, palluH)}</svg>`)
  y += palluH

  sections.push(`<svg x="0" y="${y}" width="${W}" height="${borderH}">${buildSectionSVG(borderPattern, sc, ac, W, borderH)}</svg>`)
  y += borderH

  sections.push(`<rect x="0" y="${y}" width="${W}" height="${labelH}" fill="rgba(0,0,0,0.25)"/>`)
  sections.push(`<text x="${W/2}" y="${y + labelH*0.72}" text-anchor="middle" font-size="${labelH*0.55}" fill="#9C8A6A" letter-spacing="3" font-family="sans-serif">BODY</text>`)
  y += labelH

  sections.push(`<svg x="0" y="${y}" width="${W}" height="${bodyH}">${buildSectionSVG(bodyPattern, pc, ac, W, bodyH)}`)
  sections.push(`<rect x="0" y="0" width="${Math.round(12*scale)}" height="${bodyH}" fill="${ac}" opacity="0.35"/>`)
  sections.push(`<rect x="${W - Math.round(12*scale)}" y="0" width="${Math.round(12*scale)}" height="${bodyH}" fill="${ac}" opacity="0.35"/>`)
  sections.push(`</svg>`)
  y += bodyH

  sections.push(`<svg x="0" y="${y}" width="${W}" height="${borderH}">${buildSectionSVG(borderPattern, sc, ac, W, borderH)}</svg>`)
  y += borderH

  sections.push(`<svg x="0" y="${y}" width="${W}" height="${blouseH}">${buildSectionSVG(bodyPattern, sc, ac, W, blouseH)}<rect x="0" y="0" width="${W}" height="${blouseH}" fill="rgba(0,0,0,0.15)"/><rect x="0" y="${blouseH - Math.round(14*scale)}" width="${W}" height="${Math.round(14*scale)}" fill="${ac}" opacity="0.55"/></svg>`)
  y += blouseH

  sections.push(`<rect x="0" y="${y}" width="${W}" height="${labelH}" fill="rgba(0,0,0,0.45)"/>`)
  sections.push(`<text x="${W/2}" y="${y + labelH*0.72}" text-anchor="middle" font-size="${labelH*0.55}" fill="#9C8A6A" letter-spacing="3" font-family="sans-serif">BLOUSE</text>`)

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${sections.join('')}</svg>`

  const blob = new Blob([svgString], { type:'image/svg+xml;charset=utf-8' })
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
    const link = document.createElement('a')
    link.download = filename.replace(/\s/g,'-') + '.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
  img.onerror = () => { URL.revokeObjectURL(url); console.error('SVG export failed') }
  img.src = url
}

export { PatternRenderer, SareeCanvas }