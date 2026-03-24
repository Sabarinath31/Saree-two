// ─── canvas.jsx ──────────────────────────────────────────────────────────────
// PatternRenderer (50 SVG patterns) + SareeCanvas + exportSareeAsPNG
import { T } from './theme.jsx'

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
          {/* Shadow */}
          <ellipse rx={4} ry={6} fill="rgba(0,0,0,0.22)" transform="translate(0.4,0.6)" />
          {/* Outer petal — metallic gold */}
          <ellipse rx={4} ry={6} fill={a} opacity={0.75} />
          {/* Inner highlight */}
          <ellipse rx={2.5} ry={4} fill="rgba(255,255,255,0.2)" />
          {/* Centre */}
          <ellipse rx={2} ry={3} fill={c} opacity={0.92} />
          <ellipse rx={1} ry={1.5} fill={a} opacity={0.8} />
        </g>
      ))).flat()}
    </>,
    b5: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/24)}, (_,x) => Array.from({length: Math.ceil(height/24)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*24+12},${y*24+12})`}>
          <polygon points="0,-8 8,0 0,8 -8,0" fill="none" stroke={a} strokeWidth={1} opacity={0.6} />
          <polygon points="0,-4 4,0 0,4 -4,0" fill={a} opacity={0.4} />
        </g>
      ))).flat()}
    </>,
    b6: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/28)}, (_,x) => Array.from({length: Math.ceil(height/28)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*28+14},${y*28+14})`}>
          {/* Shadow layer */}
          <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="rgba(0,0,0,0.25)" transform="translate(0.5,0.8)" />
          {/* Main motif with metallic fill */}
          <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill={a} opacity={0.72} />
          {/* Highlight stroke for 3D look */}
          <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={0.5} />
        </g>
      ))).flat()}
    </>,
    b7: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/32)}, (_,x) => Array.from({length: Math.ceil(height/32)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*32+16},${y*32+16})`}>
          {/* Drop shadow */}
          <path d="M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z" fill="rgba(0,0,0,0.2)" transform="translate(0.6,0.8)" />
          {/* Peacock body */}
          <path d="M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z" fill={a} opacity={0.68} />
          {/* Inner highlight */}
          <path d="M0,-8 C3,-5 7,-2 5,0 C7,2 3,5 0,8 C-3,5 -7,2 -5,0 C-7,-2 -3,-5 0,-8Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={0.6} />
          {/* Centre eye */}
          <circle r={3} fill={c} />
          <circle r={1.5} fill={a} opacity={0.9} />
        </g>
      ))).flat()}
    </>,
    b8: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/18)}, (_,x) => Array.from({length: Math.ceil(height/18)}, (_,y) => (
        <circle key={`${x}-${y}`} cx={x*18+9} cy={y*18+9} r={3} fill={a} opacity={0.7} />
      ))).flat()}
    </>,
    b9: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/14)}, (_,x) => Array.from({length: Math.ceil(height/14)}, (_,y) => (
        <circle key={`${x}-${y}`} cx={x*14+7} cy={y*14+7} r={4} fill="none" stroke={a} strokeWidth={1.5} opacity={0.6} />
      ))).flat()}
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
      ))).flat()}
    </>,
    b12: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/20)}, (_,x) => Array.from({length: Math.ceil(height/20)}, (_,y) => (
        <rect key={`${x}-${y}`} x={x*20+4} y={y*20+4} width={12} height={12} fill="none" stroke={a} strokeWidth={1} opacity={0.5} transform={`rotate(45, ${x*20+10}, ${y*20+10})`} />
      ))).flat()}
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
      ))).flat()}
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
      ))).flat()}
    </>,
    b15: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/22)}, (_,x) => Array.from({length: Math.ceil(height/22)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*22+11},${y*22+11})`}>
          <path d={`M0,-9 C5,-9 9,-5 9,0 C9,5 5,9 0,9 C-5,9 -9,5 -9,0`} fill="none" stroke={a} strokeWidth={1} opacity={0.5} />
          <path d={`M0,-9 C-5,-9 -9,-5 -9,0`} fill="none" stroke={a} strokeWidth={1} opacity={0.3} />
        </g>
      ))).flat()}
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
      ))).flat()}
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
      {/* Metallic sheen on gold border base */}
      <rect width={width} height={height} fill="rgba(255,255,255,0.08)" />
      {Array.from({length: Math.ceil(width/16)}, (_,i) => (
        <g key={i} transform={`translate(${i*16+8}, ${height/2})`}>
          {/* Shadow */}
          <polygon points="0,-8 6,0 0,8 -6,0" fill="rgba(0,0,0,0.22)" transform="translate(0.5,0.6)" />
          {/* Main diamond */}
          <polygon points="0,-8 6,0 0,8 -6,0" fill={c} />
          {/* Gold centre */}
          <polygon points="0,-4 3,0 0,4 -3,0" fill={a} />
          {/* Highlight */}
          <polygon points="0,-4 3,0 0,4 -3,0" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={0.5} />
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
          {/* Peacock feather drop shadow */}
          <path d="M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z" fill="rgba(0,0,0,0.2)" transform="translate(0.6,0.8)" />
          {/* Feather body */}
          <path d={`M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z`} fill={a} opacity={0.72} />
          {/* Inner highlight */}
          <path d="M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={0.6} />
          {/* Spoke lines */}
          {[0,60,120,180,240,300].map(ang => (
            <line key={ang} x1={0} y1={0} x2={Math.cos(ang*Math.PI/180)*14} y2={Math.sin(ang*Math.PI/180)*14} stroke={a} strokeWidth={0.9} opacity={0.38} />
          ))}
          {/* Centre eye */}
          <circle r={3} fill={c} />
          <circle r={1.5} fill={a} opacity={0.9} />
        </g>
      ))).flat()}
    </>,
    p4: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/22)}, (_,x) => Array.from({length: Math.ceil(height/22)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*22+11},${y*22+11})`}>
          <ellipse rx={6} ry={9} fill={a} opacity={0.5} />
          <ellipse rx={3} ry={5} fill={c} />
          <ellipse rx={1} ry={2} fill={a} opacity={0.8} />
        </g>
      ))).flat()}
    </>,
    p5: <rect width={width} height={height} fill={c} />,
    p6: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/26)}, (_,x) => Array.from({length: Math.ceil(height/32)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*26+13},${y*32+16})`}>
          <path d={`M0,-14 C6,-14 12,-6 12,0 C12,6 6,14 0,14 C-6,14 -12,6 -12,0 C-12,-6 -6,-14 0,-14Z`} fill="none" stroke={a} strokeWidth={1.2} opacity={0.6} />
          <polygon points="0,-8 4,-4 4,4 0,8 -4,4 -4,-4" fill={a} opacity={0.3} />
        </g>
      ))).flat()}
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
      ))).flat()}
    </>,
    p8: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/20)}, (_,x) => Array.from({length: Math.ceil(height/20)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*20+10},${y*20+10})`}>
          <ellipse rx={5} ry={7} fill={a} opacity={0.5} />
          <ellipse rx={2} ry={3} fill={c} />
        </g>
      ))).flat()}
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
      ))).flat()}
    </>,
    p12: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/18)}, (_,x) => Array.from({length: Math.ceil(height/18)}, (_,y) => (
        <rect key={`${x}-${y}`} x={x*18+3} y={y*18+3} width={12} height={12} fill="none" stroke={a} strokeWidth={1} opacity={0.5} />
      ))).flat()}
    </>,
  }

  const part = patternId?.startsWith('br') ? border_patterns : patternId?.startsWith('p') ? pallu_patterns : patterns
  const isBorder = patternId?.startsWith('br')
  const isPallu  = patternId?.startsWith('p')

  // ── Silk & zari colour helpers ──────────────────────────────────────────────
  // Lighten a hex colour by amt (0–255)
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
  const aLight = hexLight(a, 55)   // bright zari highlight
  const aDark  = hexDark(a, 30)    // deep zari shadow

  // Unique IDs per instance to avoid defs collision when multiple SVGs render
  const uid = (patternId||'x') + '_' + width + '_' + height

  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
      <defs>
        {/* ── Silk sheen gradient (diagonal, simulates light catching fabric) ── */}
        <linearGradient id={`silk_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={cLight}  stopOpacity="0.9" />
          <stop offset="30%"  stopColor={c}        stopOpacity="1"   />
          <stop offset="55%"  stopColor={cDark}    stopOpacity="1"   />
          <stop offset="75%"  stopColor={c}        stopOpacity="1"   />
          <stop offset="100%" stopColor={cLight}   stopOpacity="0.85"/>
        </linearGradient>

        {/* ── Zari metallic gradient (gold with bright specular highlight) ── */}
        <linearGradient id={`zari_${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={aLight}  stopOpacity="1"  />
          <stop offset="25%"  stopColor={a}        stopOpacity="1"  />
          <stop offset="50%"  stopColor={aDark}   stopOpacity="1"  />
          <stop offset="75%"  stopColor={a}        stopOpacity="1"  />
          <stop offset="100%" stopColor={aLight}  stopOpacity="0.9"/>
        </linearGradient>

        {/* ── Weave texture: ultra-fine crosshatch via feTurbulence ── */}
        <filter id={`weave_${uid}`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65 0.65"
            numOctaves="4"
            seed="2"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
          <feBlend in="SourceGraphic" in2="grey" mode="soft-light" result="blended" />
          <feComposite in="blended" in2="SourceGraphic" operator="in" />
        </filter>

        {/* ── Thread texture: fine horizontal weft lines ── */}
        <pattern id={`weft_${uid}`} x="0" y="0" width={width} height="3" patternUnits="userSpaceOnUse">
          <line x1="0" y1="1.5" x2={width} y2="1.5" stroke={cDark} strokeWidth="0.4" opacity="0.18" />
        </pattern>

        {/* ── Fold shadow: soft dark band simulating cloth drape ── */}
        <linearGradient id={`fold_${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.18" />
          <stop offset="15%"  stopColor="#000" stopOpacity="0"    />
          <stop offset="45%"  stopColor="#000" stopOpacity="0.06" />
          <stop offset="60%"  stopColor="#000" stopOpacity="0"    />
          <stop offset="82%"  stopColor="#000" stopOpacity="0.1"  />
          <stop offset="100%" stopColor="#000" stopOpacity="0.2"  />
        </linearGradient>

        {/* ── Edge vignette: subtle darkening at top/bottom ── */}
        <linearGradient id={`vignette_${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.2"  />
          <stop offset="12%"  stopColor="#000" stopOpacity="0"    />
          <stop offset="88%"  stopColor="#000" stopOpacity="0"    />
          <stop offset="100%" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>

        {/* ── Pallu shimmer: diagonal light sweep ── */}
        <linearGradient id={`shimmer_${uid}`} x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%"   stopColor="#fff" stopOpacity="0"    />
          <stop offset="40%"  stopColor="#fff" stopOpacity="0"    />
          <stop offset="52%"  stopColor="#fff" stopOpacity="0.07" />
          <stop offset="64%"  stopColor="#fff" stopOpacity="0"    />
          <stop offset="100%" stopColor="#fff" stopOpacity="0"    />
        </linearGradient>
      </defs>

      {/* ── Base pattern (unchanged) ── */}
      <g filter={`url(#weave_${uid})`}>
        {part[patternId] || <rect width={width} height={height} fill={c} />}
      </g>

      {/* ── Silk sheen overlay (replaces flat fill look) ── */}
      <rect
        width={width} height={height}
        fill={`url(#silk_${uid})`}
        opacity={isBorder ? 0.35 : isPallu ? 0.45 : 0.4}
        style={{mixBlendMode:'overlay'}}
        pointerEvents="none"
      />

      {/* ── Weft thread lines (barely visible fabric grain) ── */}
      <rect
        width={width} height={height}
        fill={`url(#weft_${uid})`}
        pointerEvents="none"
      />

      {/* ── Cloth fold shadows ── */}
      <rect
        width={width} height={height}
        fill={`url(#fold_${uid})`}
        pointerEvents="none"
      />

      {/* ── Edge vignette ── */}
      <rect
        width={width} height={height}
        fill={`url(#vignette_${uid})`}
        pointerEvents="none"
      />

      {/* ── Pallu shimmer (light sweep effect) ── */}
      {isPallu && (
        <rect
          width={width} height={height}
          fill={`url(#shimmer_${uid})`}
          pointerEvents="none"
        />
      )}
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
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      width: w
    }}>
      {/* Label */}
      <div style={{
        width: '100%', padding: '4px 0', textAlign: 'center',
        background: 'rgba(255,255,255,0.06)', fontSize: 8, letterSpacing: 2,
        textTransform: 'uppercase', color: T.textLight, fontWeight: 600
      }}>Pallu</div>

      {/* Pallu */}
      <div style={{width: w, height: palluH, overflow:'hidden', position:'relative'}}>
        <PatternRenderer patternId={design.palluPattern} color={design.primaryColor} accentColor={design.accentColor} width={w} height={palluH} />
        {/* Silk light sweep */}
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(120deg,transparent 30%,rgba(255,255,255,0.11) 48%,transparent 66%)',pointerEvents:'none'}} />
        {/* Top edge shadow */}
        <div style={{position:'absolute',top:0,left:0,right:0,height:Math.round(12*scale),background:'linear-gradient(180deg,rgba(0,0,0,0.22),transparent)',pointerEvents:'none'}} />
        {/* Zari top strip */}
        <div style={{position:'absolute',top:0,left:0,right:0,height:Math.round(3*scale),background:`linear-gradient(90deg,${design.accentColor}44,${design.accentColor}cc,${design.accentColor}44)`,pointerEvents:'none'}} />
      </div>

      {/* Top border */}
      <div style={{width: w, height: borderH, overflow:'hidden', position:'relative'}}>
        <PatternRenderer patternId={design.borderPattern} color={design.secondaryColor} accentColor={design.accentColor} width={w} height={borderH} />
        {/* Zari sheen on border */}
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:`linear-gradient(180deg,rgba(255,255,255,0.12),transparent 40%,transparent 60%,rgba(0,0,0,0.1))`,pointerEvents:'none'}} />
      </div>

      {/* Label */}
      <div style={{
        width: '100%', padding: '3px 0', textAlign: 'center',
        background: 'rgba(255,255,255,0.04)', fontSize: 7, letterSpacing: 2,
        textTransform: 'uppercase', color: T.textLight, fontWeight: 600
      }}>Body</div>

      {/* Body with zari borders */}
      <div style={{width: w, height: bodyH, overflow:'hidden', position:'relative'}}>
        <PatternRenderer patternId={design.bodyPattern} color={design.primaryColor} accentColor={design.accentColor} width={w} height={bodyH} />
        {/* Left zari strip — metallic 3-stop gradient */}
        <div style={{position:'absolute',top:0,left:0,bottom:0,width:Math.round(14*scale),background:`linear-gradient(90deg,${design.accentColor}cc,${design.accentColor}ff,${design.accentColor}88,${design.accentColor}33)`,boxShadow:`inset -2px 0 4px rgba(0,0,0,0.2)`,pointerEvents:'none'}} />
        {/* Left zari highlight line */}
        <div style={{position:'absolute',top:0,left:Math.round(4*scale),bottom:0,width:Math.round(2*scale),background:`linear-gradient(180deg,transparent,rgba(255,255,255,0.45),transparent)`,pointerEvents:'none'}} />
        {/* Right zari strip */}
        <div style={{position:'absolute',top:0,right:0,bottom:0,width:Math.round(14*scale),background:`linear-gradient(270deg,${design.accentColor}cc,${design.accentColor}ff,${design.accentColor}88,${design.accentColor}33)`,boxShadow:`inset 2px 0 4px rgba(0,0,0,0.2)`,pointerEvents:'none'}} />
        {/* Right zari highlight line */}
        <div style={{position:'absolute',top:0,right:Math.round(4*scale),bottom:0,width:Math.round(2*scale),background:`linear-gradient(180deg,transparent,rgba(255,255,255,0.45),transparent)`,pointerEvents:'none'}} />
        {/* Diagonal silk sheen across body */}
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(160deg,rgba(255,255,255,0.06) 0%,transparent 40%,rgba(0,0,0,0.06) 70%,transparent 100%)',pointerEvents:'none'}} />
        {/* Subtle vertical fold lines */}
        <div style={{position:'absolute',top:0,left:'28%',bottom:0,width:Math.round(scale),background:'linear-gradient(180deg,transparent,rgba(0,0,0,0.08),transparent)',pointerEvents:'none'}} />
        <div style={{position:'absolute',top:0,left:'62%',bottom:0,width:Math.round(scale),background:'linear-gradient(180deg,transparent,rgba(0,0,0,0.07),transparent)',pointerEvents:'none'}} />
      </div>

      {/* Bottom border */}
      <div style={{width: w, height: borderH, overflow:'hidden', position:'relative'}}>
        <PatternRenderer patternId={design.borderPattern} color={design.secondaryColor} accentColor={design.accentColor} width={w} height={borderH} />
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:`linear-gradient(180deg,rgba(255,255,255,0.12),transparent 40%,transparent 60%,rgba(0,0,0,0.1))`,pointerEvents:'none'}} />
      </div>

      {/* Blouse */}
      <div style={{width: w, height: blouseH, overflow:'hidden', position:'relative'}}>
        <PatternRenderer patternId={design.bodyPattern} color={design.secondaryColor} accentColor={design.accentColor} width={w} height={blouseH} />
        {/* Silk sheen */}
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(160deg,rgba(255,255,255,0.1) 0%,transparent 50%,rgba(0,0,0,0.07) 100%)',pointerEvents:'none'}} />
        {/* Hem zari band with metallic gradient */}
        <div style={{
          position:'absolute',bottom:0,left:0,right:0,height:Math.round(14*scale),
          background:`linear-gradient(180deg,${design.accentColor}55,${design.accentColor}ee)`,
          pointerEvents:'none'
        }} />
        {/* Hem highlight */}
        <div style={{
          position:'absolute',bottom:Math.round(10*scale),left:0,right:0,height:Math.round(2*scale),
          background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)`,
          pointerEvents:'none'
        }} />
      </div>
      <div style={{
        width: '100%', padding: '4px 0', textAlign: 'center',
        background: 'rgba(255,255,255,0.06)', fontSize: 8, letterSpacing: 2,
        textTransform: 'uppercase', color: T.textLight, fontWeight: 600
      }}>Blouse</div>
    </div>
  )
}

// ─── HIGH-RES PREVIEW DATA URL ────────────────────────────────────────────────
// Returns a Promise<string> (data URL) of the saree at 4× scale.
// Called by the Generate button in components.jsx — no external API needed.
export function generateSareeDataURL(design) {
  return new Promise((resolve, reject) => {
    const SCALE   = 4
    const W       = 200 * SCALE
    const palluH  = 160 * SCALE
    const borderH =  22 * SCALE
    const bodyH   = 260 * SCALE
    const blouseH =  55 * SCALE
    const labelH  =  14 * SCALE
    const H = palluH + borderH * 2 + bodyH + blouseH + labelH * 3

    const { primaryColor: pc, secondaryColor: sc, accentColor: ac,
            bodyPattern, borderPattern, palluPattern } = design

    // ── colour helpers ──────────────────────────────────────────────────────
    const hexAdd = (hex, amt) => {
      const h = (hex || '#888').replace('#', '')
      const r = Math.min(255, Math.max(0, parseInt(h.slice(0,2), 16) + amt))
      const g = Math.min(255, Math.max(0, parseInt(h.slice(2,4), 16) + amt))
      const b = Math.min(255, Math.max(0, parseInt(h.slice(4,6), 16) + amt))
      return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('')
    }
    const L = (h, a) => hexAdd(h, a)
    const D = (h, a) => hexAdd(h, -a)

    // ── SVG defs for silk/zari/texture (inline, used per section) ──────────
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

    // ── pattern shapes (enhanced with shadows + highlights) ─────────────────
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
        b7:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/32)},(_,x)=>Array.from({length:Math.ceil(h/32)},(_,y)=>`<g transform="translate(${x*32+16},${y*32+16})"><path d="M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z" fill="rgba(0,0,0,0.2)" transform="translate(0.6,0.8)"/><path d="M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z" fill="${accent}" opacity="0.68"/><path d="M0,-8 C3,-5 7,-2 5,0 C7,2 3,5 0,8 C-3,5 -7,2 -5,0 C-7,-2 -3,-5 0,-8Z" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.6"/><circle r="3" fill="${color}"/><circle r="1.5" fill="${accent}" opacity="0.9"/></g>`).join('')).join('')}`,
        b8:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/18)},(_,x)=>Array.from({length:Math.ceil(h/18)},(_,y)=>`<circle cx="${x*18+9}" cy="${y*18+9}" r="3.5" fill="${accent}" opacity="0.7"/>`).join('')).join('')}`,
        b9:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/14)},(_,x)=>Array.from({length:Math.ceil(h/14)},(_,y)=>`<circle cx="${x*14+7}" cy="${y*14+7}" r="4" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.65"/><circle cx="${x*14+7}" cy="${y*14+7}" r="1.5" fill="${accent}" opacity="0.55"/>`).join('')).join('')}`,
        b10: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(h/10)},(_,i)=>`<path d="M0,${i*10} Q${w/4},${i*10-5} ${w/2},${i*10} Q${3*w/4},${i*10+5} ${w},${i*10}" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.5"/>`).join('')}`,
        b11: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/36)},(_,x)=>Array.from({length:Math.ceil(h/40)},(_,y)=>`<g transform="translate(${x*36+18},${y*40+20})"><path d="M0,-16 C8,-16 14,-8 14,0 C14,8 8,16 0,16 C-8,16 -14,8 -14,0 C-14,-8 -8,-16 0,-16Z" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.55"/><line x1="0" y1="-16" x2="0" y2="16" stroke="${accent}" stroke-width="0.5" opacity="0.3"/></g>`).join('')).join('')}`,
        b12: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/28)},(_,x)=>Array.from({length:Math.ceil(h/28)},(_,y)=>`<g transform="translate(${x*28+14},${y*28+14})"><polygon points="0,-10 4,-4 10,0 4,4 0,10 -4,4 -10,0 -4,-4" fill="rgba(0,0,0,0.18)" transform="translate(0.4,0.6)"/><polygon points="0,-10 4,-4 10,0 4,4 0,10 -4,4 -10,0 -4,-4" fill="${accent}" opacity="0.5"/></g>`).join('')).join('')}`,
        b13: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/24)},(_,x)=>Array.from({length:Math.ceil(h/24)},(_,y)=>`<g transform="translate(${x*24+12},${y*24+12})">${[0,45,90,135,180,225,270,315].map(a=>`<ellipse cx="${Math.round(7*Math.cos(a*Math.PI/180))}" cy="${Math.round(7*Math.sin(a*Math.PI/180))}" rx="2.5" ry="4.5" fill="${accent}" opacity="0.55" transform="rotate(${a} ${Math.round(7*Math.cos(a*Math.PI/180))} ${Math.round(7*Math.sin(a*Math.PI/180))})" />`).join('')}<circle r="2.5" fill="${accent}" opacity="0.75"/></g>`).join('')).join('')}`,
        b14: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/20)},(_,x)=>Array.from({length:Math.ceil(h/24)},(_,y)=>`<g transform="translate(${x*20+10},${y*24+12})"><circle cy="-8" r="3" fill="${accent}" opacity="0.5"/><line x1="0" y1="-5" x2="0" y2="4" stroke="${accent}" stroke-width="1.5" opacity="0.5"/><line x1="-5" y1="-1" x2="5" y2="-1" stroke="${accent}" stroke-width="1.2" opacity="0.45"/><line x1="0" y1="4" x2="-4" y2="9" stroke="${accent}" stroke-width="1.2" opacity="0.45"/><line x1="0" y1="4" x2="4" y2="9" stroke="${accent}" stroke-width="1.2" opacity="0.45"/></g>`).join('')).join('')}`,
        b15: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/24)},(_,x)=>Array.from({length:Math.ceil(h/24)},(_,y)=>`<g transform="translate(${x*24+12},${y*24+12})"><path d="M0,-10 C4,-8 8,-4 6,0 C8,4 4,8 0,10 C-4,8 -8,4 -6,0 C-8,-4 -4,-8 0,-10Z" fill="${accent}" opacity="0.45"/><path d="M0,-10 C4,-8 8,-4 6,0 C8,4 4,8 0,10 C-4,8 -8,4 -6,0 C-8,-4 -4,-8 0,-10Z" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="0.5"/></g>`).join('')).join('')}`,
        b16: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/8)},(_,i)=>`<line x1="${i*8}" y1="0" x2="${i*8}" y2="${h}" stroke="${accent}" stroke-width="${i%3===0?1.2:0.6}" opacity="${i%3===0?0.5:0.25}"/>`).join('')}`,
        b17: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/22)},(_,x)=>Array.from({length:Math.ceil(h/22)},(_,y)=>`<g transform="translate(${x*22+11},${y*22+11})">${[0,60,120,180,240,300].map(a=>`<ellipse cx="${Math.round(6*Math.cos(a*Math.PI/180))}" cy="${Math.round(6*Math.sin(a*Math.PI/180))}" rx="3" ry="5" fill="${accent}" opacity="0.55" transform="rotate(${a} ${Math.round(6*Math.cos(a*Math.PI/180))} ${Math.round(6*Math.sin(a*Math.PI/180))})" />`).join('')}<circle r="2" fill="${accent}" opacity="0.85"/></g>`).join('')).join('')}`,
        br1: `<rect width="${w}" height="${h}" fill="url(#zariG${uid})"/>`,
        br2: `<rect width="${w}" height="${h}" fill="url(#zariG${uid})"/><rect x="0" y="${h*0.38}" width="${w}" height="${h*0.24}" fill="${color}" opacity="0.3"/>`,
        br3: `<rect width="${w}" height="${h}" fill="url(#zariG${uid})"/>${Array.from({length:Math.ceil(w/16)},(_,i)=>`<g transform="translate(${i*16+8},${h/2})"><polygon points="0,-8 6,0 0,8 -6,0" fill="rgba(0,0,0,0.22)" transform="translate(0.5,0.6)"/><polygon points="0,-8 6,0 0,8 -6,0" fill="${color}" opacity="0.85"/><polygon points="0,-4 3,0 0,4 -3,0" fill="${accent}"/><polygon points="0,-4 3,0 0,4 -3,0" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.5"/></g>`).join('')}`,
        br4: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/16)},(_,i)=>`<path d="M${i*16+8},2 C${i*16+14},2 ${i*16+14},${h*0.6} ${i*16+8},${h*0.6} C${i*16+2},${h*0.6} ${i*16+2},2 ${i*16+8},2Z" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.7"/><path d="M${i*16+8},2 C${i*16+14},2 ${i*16+14},${h*0.6} ${i*16+8},${h*0.6} C${i*16+2},${h*0.6} ${i*16+2},2 ${i*16+8},2Z" fill="${accent}" opacity="0.4"/>`).join('')}`,
        br5: `<rect width="${w}" height="${h}" fill="url(#zariG${uid})"/>${Array.from({length:Math.ceil(w/20)},(_,i)=>`<g transform="translate(${i*20+10},${h/2})"><path d="M0,-${h/2-1} C4,-${h/4} 5,0 3,${h/4} C1,${h/3} -1,${h/3} -3,${h/4} C-5,0 -4,-${h/4} 0,-${h/2-1}Z" fill="${color}" opacity="0.8"/></g>`).join('')}`,
        br6: `<rect width="${w}" height="${h}" fill="url(#zariG${uid})"/><rect x="0" y="1" width="${w}" height="${h-2}" fill="rgba(255,255,255,0.06)"/>`,
        br7: `<rect width="${w}" height="${h}" fill="${color}"/><rect x="0" y="${h/2-1.5}" width="${w}" height="3" fill="url(#zariG${uid})"/>`,
        br8: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/14)},(_,i)=>`<circle cx="${i*14+7}" cy="${h/2}" r="${h/2-1}" fill="none" stroke="${accent}" stroke-width="1" opacity="0.65"/>`).join('')}`,
        br9: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/12)},(_,i)=>`<polygon points="${i*12},${h} ${i*12+6},0 ${i*12+12},${h}" fill="${accent}" opacity="0.5"/>`).join('')}`,
        br10:`<rect width="${w}" height="${h}" fill="${color}"/><rect x="0" y="${h*0.3}" width="${w}" height="${h*0.4}" fill="${accent}" opacity="0.6"/><path d="M0,${h/2} ${Array.from({length:Math.ceil(w/16)},(_,i)=>`Q${i*16+8},${h*0.05} ${(i+1)*16},${h/2}`).join(' ')}" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>`,
        br11:`<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/14)},(_,i)=>`<polygon points="${i*14+7},1 ${i*14+13},${h/2} ${i*14+7},${h-1} ${i*14+1},${h/2}" fill="${accent}" opacity="0.6"/>`).join('')}`,
        br12:`<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/16)},(_,i)=>`<g transform="translate(${i*16+8},${h/2})"><ellipse rx="4" ry="${h/2-1}" fill="${accent}" opacity="0.5"/><ellipse rx="2" ry="${h/4}" fill="${accent}" opacity="0.4"/></g>`).join('')}`,
        p1:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/20)},(_,x)=>Array.from({length:Math.ceil(h/20)},(_,y)=>`<g transform="translate(${x*20+10},${y*20+10})"><polygon points="0,-8 3,-3 8,-3 4,2 6,8 0,4 -6,8 -4,2 -8,-3 -3,-3" fill="rgba(0,0,0,0.2)" transform="translate(0.3,0.5)"/><polygon points="0,-8 3,-3 8,-3 4,2 6,8 0,4 -6,8 -4,2 -8,-3 -3,-3" fill="${accent}" opacity="0.75"/></g>`).join('')).join('')}`,
        p2:  `<rect width="${w}" height="${h/2}" fill="${color}"/><rect x="0" y="${h/2}" width="${w}" height="${h/2}" fill="url(#zariG${uid})" opacity="0.8"/>`,
        p3:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/30)},(_,x)=>Array.from({length:Math.ceil(h/30)},(_,y)=>`<g transform="translate(${x*30+15},${y*30+15})"><path d="M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z" fill="rgba(0,0,0,0.2)" transform="translate(0.6,0.8)"/><path d="M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z" fill="${accent}" opacity="0.72"/><path d="M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="0.6"/>${[0,60,120,180,240,300].map(a=>`<line x1="0" y1="0" x2="${Math.round(14*Math.cos(a*Math.PI/180))}" y2="${Math.round(14*Math.sin(a*Math.PI/180))}" stroke="${accent}" stroke-width="0.9" opacity="0.38"/>`).join('')}<circle r="3" fill="${color}"/><circle r="1.5" fill="${accent}" opacity="0.9"/></g>`).join('')).join('')}`,
        p4:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/22)},(_,x)=>Array.from({length:Math.ceil(h/22)},(_,y)=>`<g transform="translate(${x*22+11},${y*22+11})"><ellipse rx="6" ry="9" fill="rgba(0,0,0,0.2)" transform="translate(0.4,0.6)"/><ellipse rx="6" ry="9" fill="${accent}" opacity="0.55"/><ellipse rx="3" ry="5" fill="${color}"/><ellipse rx="1.5" ry="2.5" fill="${accent}" opacity="0.8"/></g>`).join('')).join('')}`,
        p5:  `<rect width="${w}" height="${h}" fill="${color}"/>`,
        p6:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/32)},(_,x)=>Array.from({length:Math.ceil(h/32)},(_,y)=>`<g transform="translate(${x*32+16},${y*32+16})"><rect x="-12" y="-12" width="24" height="24" fill="none" stroke="${accent}" stroke-width="0.8" opacity="0.4"/><polygon points="0,-8 4,-4 8,0 4,4 0,8 -4,4 -8,0 -4,-4" fill="${accent}" opacity="0.35"/><circle r="2" fill="${accent}" opacity="0.7"/></g>`).join('')).join('')}`,
        p7:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/36)},(_,x)=>Array.from({length:Math.ceil(h/36)},(_,y)=>`<g transform="translate(${x*36+18},${y*36+18})"><path d="M0,-14 C6,-8 14,-6 14,0 C14,6 6,10 0,14 C-6,10 -14,6 -14,0 C-14,-6 -6,-8 0,-14Z" fill="${accent}" opacity="0.28"/><polygon points="0,-8 3,-3 8,-3 4,2 6,8 0,4 -6,8 -4,2 -8,-3 -3,-3" fill="${accent}" opacity="0.45"/></g>`).join('')).join('')}`,
        p8:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/22)},(_,x)=>Array.from({length:Math.ceil(h/22)},(_,y)=>`<g transform="translate(${x*22+11},${y*22+11})"><circle r="5.5" fill="rgba(0,0,0,0.15)" transform="translate(0.4,0.5)"/><circle r="5" fill="${accent}" opacity="0.4"/><circle r="2.5" fill="${accent}" opacity="0.6"/></g>`).join('')).join('')}`,
        p9:  `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:Math.ceil(w/16)},(_,i)=>`<rect x="${i*16}" y="0" width="6" height="${h}" fill="${accent}" opacity="${i%3===0?0.4:0.2}"/>`).join('')}`,
        p10: `<rect width="${w}" height="${h}" fill="${color}"/>${Array.from({length:4},(_,j)=>`<path d="M${j*w/4},0 Q${j*w/4+w/8},${h/2} ${j*w/4},${h}" fill="none" stroke="${accent}" stroke-width="1.8" opacity="0.55"/>`).join('')}${Array.from({length:Math.ceil(h/20)},(_,i)=>`<circle cx="${(i%2)*w/2+w/4}" cy="${i*20+10}" r="3.5" fill="${accent}" opacity="0.45"/>`).join('')}`,
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

    // ── assemble full saree SVG ───────────────────────────────────────────────
    let y = 0
    const secs = []

    // Pallu label
    secs.push(`<rect x="0" y="${y}" width="${W}" height="${labelH}" fill="#0e0c09"/>`)
    secs.push(`<text x="${W/2}" y="${y+labelH*0.72}" text-anchor="middle" font-size="${labelH*0.55}" fill="#9C8A6A" letter-spacing="3" font-family="serif">PALLU</text>`)
    y += labelH

    // Pallu section
    secs.push(`<svg x="0" y="${y}" width="${W}" height="${palluH}">${pat(palluPattern, pc, ac, W, palluH)}`)
    secs.push(`<rect width="${W}" height="${palluH}" fill="linear-gradient(120deg,transparent 30%,rgba(255,255,255,0.09) 48%,transparent 66%)"/>`)
    secs.push(`<rect width="${W}" height="${labelH}" fill="rgba(0,0,0,0.22)"/>`) // top shadow
    secs.push(`<rect y="${palluH-4}" width="${W}" height="4" fill="${ac}" opacity="0.5"/>`) // bottom zari strip
    secs.push(`</svg>`)
    y += palluH

    // Top border
    secs.push(`<svg x="0" y="${y}" width="${W}" height="${borderH}">${pat(borderPattern, sc, ac, W, borderH)}`)
    secs.push(`<rect width="${W}" height="${borderH}" fill="rgba(255,255,255,0.07)"/>`)
    secs.push(`</svg>`)
    y += borderH

    // Body label
    secs.push(`<rect x="0" y="${y}" width="${W}" height="${labelH}" fill="#0e0c09"/>`)
    secs.push(`<text x="${W/2}" y="${y+labelH*0.72}" text-anchor="middle" font-size="${labelH*0.55}" fill="#9C8A6A" letter-spacing="3" font-family="serif">BODY</text>`)
    y += labelH

    // Body
    const zW = Math.round(14 * SCALE)
    secs.push(`<svg x="0" y="${y}" width="${W}" height="${bodyH}">${pat(bodyPattern, pc, ac, W, bodyH)}`)
    // Left zari strip metallic
    secs.push(`<defs><linearGradient id="lz" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${ac}" stop-opacity="0.8"/><stop offset="50%" stop-color="${ac}" stop-opacity="1"/><stop offset="100%" stop-color="${ac}" stop-opacity="0.2"/></linearGradient><linearGradient id="rz" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="${ac}" stop-opacity="0.8"/><stop offset="50%" stop-color="${ac}" stop-opacity="1"/><stop offset="100%" stop-color="${ac}" stop-opacity="0.2"/></linearGradient></defs>`)
    secs.push(`<rect x="0" y="0" width="${zW}" height="${bodyH}" fill="url(#lz)"/>`)
    secs.push(`<rect x="${W-zW}" y="0" width="${zW}" height="${bodyH}" fill="url(#rz)"/>`)
    // Highlight lines on zari
    secs.push(`<rect x="${Math.round(4*SCALE)}" y="0" width="${Math.round(2*SCALE)}" height="${bodyH}" fill="rgba(255,255,255,0.4)"/>`)
    secs.push(`<rect x="${W-Math.round(6*SCALE)}" y="0" width="${Math.round(2*SCALE)}" height="${bodyH}" fill="rgba(255,255,255,0.4)"/>`)
    // Diagonal body sheen
    secs.push(`<rect width="${W}" height="${bodyH}" fill="rgba(255,255,255,0)" style="background:linear-gradient(160deg,rgba(255,255,255,0.05),transparent 50%)"/>`)
    secs.push(`</svg>`)
    y += bodyH

    // Bottom border
    secs.push(`<svg x="0" y="${y}" width="${W}" height="${borderH}">${pat(borderPattern, sc, ac, W, borderH)}`)
    secs.push(`<rect width="${W}" height="${borderH}" fill="rgba(255,255,255,0.07)"/>`)
    secs.push(`</svg>`)
    y += borderH

    // Body label (blouse)
    secs.push(`<rect x="0" y="${y}" width="${W}" height="${labelH}" fill="#0e0c09"/>`)
    secs.push(`<text x="${W/2}" y="${y+labelH*0.72}" text-anchor="middle" font-size="${labelH*0.55}" fill="#9C8A6A" letter-spacing="3" font-family="serif">BLOUSE</text>`)
    y += labelH

    // Blouse
    secs.push(`<svg x="0" y="${y}" width="${W}" height="${blouseH}">${pat(bodyPattern, sc, ac, W, blouseH)}`)
    secs.push(`<rect width="${W}" height="${blouseH}" fill="rgba(255,255,255,0.06)"/>`)
    secs.push(`<rect y="${blouseH - Math.round(14*SCALE)}" width="${W}" height="${Math.round(14*SCALE)}" fill="${ac}" opacity="0.8"/>`)
    secs.push(`<rect y="${blouseH - Math.round(16*SCALE)}" width="${W}" height="${Math.round(2*SCALE)}" fill="rgba(255,255,255,0.5)"/>`)
    secs.push(`</svg>`)

    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${secs.join('')}</svg>`

    // Render SVG → Canvas → dataURL
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
// Renders the full saree design into an offscreen SVG, serialises it,
// and draws it onto a Canvas element so it can be saved as PNG.
// All patterns are procedural SVG so they serialise perfectly.

export function exportSareeAsPNG(design, filename = 'saree-design') {
  const scale   = 2          // 2x for retina quality
  const W       = 200 * scale
  const palluH  = 160 * scale
  const borderH =  18 * scale
  const bodyH   = 260 * scale
  const blouseH =  55 * scale
  const labelH  =  18 * scale
  const H       = palluH + borderH * 2 + bodyH + blouseH + labelH * 3

  const { primaryColor: pc, secondaryColor: sc, accentColor: ac,
          bodyPattern, borderPattern, palluPattern } = design

  // ── colour helpers for export (mirrors PatternRenderer logic) ──────────────
  const hexA = (hex, amt) => {
    const n = parseInt((hex||'#888').replace('#',''),16)
    const r = Math.min(255,Math.max(0,(n>>16)+amt))
    const g = Math.min(255,Math.max(0,((n>>8)&0xff)+amt))
    const b = Math.min(255,Math.max(0,(n&0xff)+amt))
    return '#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)
  }

  // Helper: inline SVG for each section — matches live PatternRenderer quality
  const buildSectionSVG = (patternId, color, accent, w, h) => {
    const c = color, a = accent
    const cL = hexA(c,28), cD = hexA(c,-22), cVD = hexA(c,-40)
    const aL = hexA(a,55), aD = hexA(a,-30)
    const uid = patternId + w + h

    // ── shared defs: silk sheen + zari metallic + weave noise + folds ────────
    const defs = `<defs>
      <filter id="wv${uid}" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65 0.65" numOctaves="4" seed="2" result="noise"/>
        <feColorMatrix type="saturate" values="0" in="noise" result="grey"/>
        <feBlend in="SourceGraphic" in2="grey" mode="soft-light" result="out"/>
        <feComposite in="out" in2="SourceGraphic" operator="in"/>
      </filter>
      <linearGradient id="sk${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="${cL}" stop-opacity="1"/>
        <stop offset="20%"  stop-color="${c}"   stop-opacity="1"/>
        <stop offset="42%"  stop-color="${cD}"  stop-opacity="1"/>
        <stop offset="58%"  stop-color="${cL}"  stop-opacity="1"/>
        <stop offset="78%"  stop-color="${c}"   stop-opacity="1"/>
        <stop offset="100%" stop-color="${cD}"  stop-opacity="1"/>
      </linearGradient>
      <linearGradient id="zr${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stop-color="${aL}" stop-opacity="1"/>
        <stop offset="25%"  stop-color="${a}"   stop-opacity="1"/>
        <stop offset="50%"  stop-color="${aD}"  stop-opacity="1"/>
        <stop offset="75%"  stop-color="${a}"   stop-opacity="1"/>
        <stop offset="100%" stop-color="${aL}"  stop-opacity="0.9"/>
      </linearGradient>
      <pattern id="wt${uid}" x="0" y="0" width="${w}" height="3" patternUnits="userSpaceOnUse">
        <line x1="0" y1="1.5" x2="${w}" y2="1.5" stroke="${cD}" stroke-width="0.4" opacity="0.18"/>
      </pattern>
      <linearGradient id="fd${uid}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#000" stop-opacity="0.18"/>
        <stop offset="12%"  stop-color="#000" stop-opacity="0"/>
        <stop offset="30%"  stop-color="#000" stop-opacity="0.07"/>
        <stop offset="38%"  stop-color="#000" stop-opacity="0"/>
        <stop offset="58%"  stop-color="#000" stop-opacity="0.05"/>
        <stop offset="65%"  stop-color="#000" stop-opacity="0"/>
        <stop offset="83%"  stop-color="#000" stop-opacity="0.09"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.2"/>
      </linearGradient>
      <linearGradient id="vg${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stop-color="#000" stop-opacity="0.2"/>
        <stop offset="12%"  stop-color="#000" stop-opacity="0"/>
        <stop offset="88%"  stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.18"/>
      </linearGradient>
      <linearGradient id="sh${uid}" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%"   stop-color="#fff" stop-opacity="0"/>
        <stop offset="36%"  stop-color="#fff" stop-opacity="0"/>
        <stop offset="48%"  stop-color="#fff" stop-opacity="0.09"/>
        <stop offset="60%"  stop-color="#fff" stop-opacity="0"/>
        <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>`

    // overlays applied after every pattern
    const overlays = `
      <rect width="${w}" height="${h}" fill="url(#sk${uid})" opacity="0.55" style="mix-blend-mode:overlay"/>
      <rect width="${w}" height="${h}" fill="url(#wt${uid})"/>
      <rect width="${w}" height="${h}" fill="url(#fd${uid})"/>
      <rect width="${w}" height="${h}" fill="url(#vg${uid})"/>
      <rect width="${w}" height="${h}" fill="url(#sh${uid})"/>`

    const patterns = {
      // ── BODY ──────────────────────────────────────────────────────────────
      b1: `<rect width="${w}" height="${h}" fill="url(#sk${uid})"/>${Array.from({length:Math.ceil(w/3)},(_,i)=>`<line x1="${i*3}" y1="0" x2="${i*3}" y2="${h}" stroke="${cD}" stroke-width="0.4" opacity="0.12"/>`).join('')}${Array.from({length:Math.ceil(h/3)},(_,i)=>`<line x1="0" y1="${i*3}" x2="${w}" y2="${i*3}" stroke="${cL}" stroke-width="0.4" opacity="0.08"/>`).join('')}`,

      b2: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/2)},(_,i)=>`<line x1="${i*2}" y1="0" x2="${i*2}" y2="${h}" stroke="${cD}" stroke-width="0.5" opacity="0.1"/>`).join('')}${Array.from({length:Math.ceil(w/20)},(_,i)=>`<rect x="${i*20}" y="0" width="8" height="${h}" fill="url(#zr${uid})" opacity="0.7"/><rect x="${i*20+1}" y="0" width="1" height="${h}" fill="${aL}" opacity="0.45"/><rect x="${i*20+6}" y="0" width="1" height="${h}" fill="${aL}" opacity="0.45"/>`).join('')}`,

      b3: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(h/18)},(_,i)=>`<rect x="0" y="${i*18}" width="${w}" height="7" fill="${a}" opacity="${i%3===0?0.28:0.14}"/>`).join('')}${Array.from({length:Math.ceil(w/18)},(_,i)=>`<rect x="${i*18}" y="0" width="7" height="${h}" fill="${a}" opacity="${i%3===0?0.28:0.14}"/>`).join('')}${Array.from({length:Math.ceil(h/18)},(_,i)=>Array.from({length:Math.ceil(w/18)},(_,j)=>`<rect x="${j*18}" y="${i*18}" width="7" height="7" fill="${a}" opacity="${i%3===0&&j%3===0?0.42:0.2}"/>`).join('')).join('')}`,

      b4: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/3)},(_,i)=>`<line x1="${i*3}" y1="0" x2="${i*3}" y2="${h}" stroke="${cD}" stroke-width="0.35" opacity="0.13"/>`).join('')}${Array.from({length:Math.ceil(w/28)},(_,x)=>Array.from({length:Math.ceil(h/28)},(_,y)=>{const cx=x*28+14+(y%2===0?0:14),cy=y*28+14;return`<g transform="translate(${cx},${cy})"><ellipse rx="6" ry="9" fill="rgba(0,0,0,0.28)" transform="translate(0.5,0.9)"/><ellipse rx="6" ry="9" fill="${a}" opacity="0.82"/><ellipse rx="4" ry="6.5" fill="${aL}" opacity="0.3"/><ellipse rx="2.8" ry="4.5" fill="${c}" opacity="0.9"/><ellipse rx="1.4" ry="2.2" fill="${a}" opacity="0.95"/><ellipse rx="1.2" ry="1.8" cx="-0.5" cy="-2" fill="rgba(255,255,255,0.4)"/><path d="M0,-9 C1.5,-12 3.5,-11 2.5,-9" fill="none" stroke="${a}" stroke-width="1.1" opacity="0.85"/><circle cx="2.5" cy="-9" r="1.1" fill="${a}" opacity="0.9"/><circle cx="-4.5" cy="-1" r="1" fill="${a}" opacity="0.5"/><circle cx="4.5" cy="-1" r="1" fill="${a}" opacity="0.5"/></g>`}).join('')).join('')}`,

      b5: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/22)},(_,x)=>Array.from({length:Math.ceil(h/22)},(_,y)=>{const cx=x*22+11+(y%2===0?0:11),cy=y*22+11;return`<g transform="translate(${cx},${cy})"><polygon points="0,-10 10,0 0,10 -10,0" fill="${a}" opacity="0.18"/><polygon points="0,-7 7,0 0,7 -7,0" fill="${a}" opacity="0.35"/><polygon points="0,-5 5,0 0,5 -5,0" fill="${a}" opacity="0.55"/><polygon points="0,-3 3,0 0,3 -3,0" fill="${a}" opacity="0.8"/><circle r="1.2" fill="${aL}" opacity="0.9"/></g>`}).join('')).join('')}`,

      b6: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/3)},(_,i)=>`<line x1="${i*3}" y1="0" x2="${i*3}" y2="${h}" stroke="${cD}" stroke-width="0.3" opacity="0.12"/>`).join('')}${Array.from({length:Math.ceil(w/28)},(_,x)=>Array.from({length:Math.ceil(h/34)},(_,y)=>`<g transform="translate(${x*28+14},${y*34+17})"><polygon points="0,-14 5,-9 5,3 7,7 0,11 -7,7 -5,3 -5,-9" fill="${a}" opacity="0.75"/><polygon points="0,-13 3,-10 3,-5 0,-3 -3,-5 -3,-10" fill="${c}" opacity="0.85"/><rect x="-7" y="7" width="14" height="3" fill="${a}" opacity="0.6" rx="0.5"/><circle cy="-15" r="2" fill="${aL}" opacity="1"/><line x1="0" y1="-17" x2="0" y2="-20" stroke="${a}" stroke-width="1" opacity="0.8"/></g>`).join('')).join('')}`,

      b7: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/32)},(_,x)=>Array.from({length:Math.ceil(h/32)},(_,y)=>{const cx=x*32+16+(y%2===0?0:16),cy=y*32+16;const quills=[0,30,60,90,120,150,180,210,240,270,300,330].map(ang=>`<line x1="${(Math.cos(ang*Math.PI/180)*5).toFixed(1)}" y1="${(Math.sin(ang*Math.PI/180)*5).toFixed(1)}" x2="${(Math.cos(ang*Math.PI/180)*13).toFixed(1)}" y2="${(Math.sin(ang*Math.PI/180)*13).toFixed(1)}" stroke="${a}" stroke-width="0.9" opacity="0.45"/>`).join('');return`<g transform="translate(${cx},${cy})">${quills}<ellipse rx="5" ry="6" fill="${a}" opacity="0.2"/><ellipse rx="3.5" ry="4" fill="${a}" opacity="0.45"/><ellipse rx="2" ry="2.5" fill="${a}" opacity="0.7"/><ellipse rx="1" ry="1.2" fill="${c}" opacity="1"/><circle r="0.5" fill="${aL}" opacity="1"/></g>`}).join('')).join('')}`,

      b8: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/15)},(_,x)=>Array.from({length:Math.ceil(h/15)},(_,y)=>{const cx=x*15+7.5+(y%2===0?0:7.5),cy=y*15+7.5;return`<circle cx="${cx}" cy="${cy}" r="4" fill="${a}" opacity="0.2"/><circle cx="${cx}" cy="${cy}" r="3" fill="${a}" opacity="0.5"/><circle cx="${cx}" cy="${cy}" r="2" fill="${a}" opacity="0.9"/><circle cx="${cx}" cy="${cy}" r="1" fill="${c}" opacity="0.7"/>`}).join('')).join('')}`,

      b9: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/13)},(_,x)=>Array.from({length:Math.ceil(h/13)},(_,y)=>{const cx=x*13+6.5+(y%2===0?0:6.5),cy=y*13+6.5;return`<circle cx="${cx}" cy="${cy}" r="5.5" fill="none" stroke="${a}" stroke-width="1.5" opacity="0.2"/><circle cx="${cx}" cy="${cy}" r="4" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.32"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="${a}" opacity="0.4"/><circle cx="${cx}" cy="${cy}" r="1.2" fill="${a}" opacity="0.85"/><circle cx="${cx}" cy="${cy}" r="0.5" fill="${c}" opacity="1"/>`}).join('')).join('')}`,

      b10: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil((w+h)/7)},(_,i)=>`<line x1="${i*7-h}" y1="0" x2="${i*7}" y2="${h}" stroke="${a}" stroke-width="${i%4===0?2:i%2===0?1:0.6}" opacity="${i%4===0?0.65:i%2===0?0.35:0.18}"/>`).join('')}`,

      b11: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/28)},(_,x)=>Array.from({length:Math.ceil(h/34)},(_,y)=>`<g transform="translate(${x*28+14},${y*34+17})"><path d="M-11,14 L-11,-4 C-11,-16 11,-16 11,-4 L11,14" fill="none" stroke="${a}" stroke-width="1.8" opacity="0.65"/><path d="M-7,14 L-7,-2 C-7,-10 7,-10 7,-2 L7,14" fill="none" stroke="${a}" stroke-width="1" opacity="0.45"/><circle cy="-17" r="2.5" fill="${a}" opacity="0.75"/><circle cy="-17" r="1.2" fill="${c}" opacity="1"/><line x1="-11" y1="14" x2="11" y2="14" stroke="${a}" stroke-width="1.4" opacity="0.65"/></g>`).join('')).join('')}`,

      b12: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/26)},(_,x)=>Array.from({length:Math.ceil(h/26)},(_,y)=>`<g transform="translate(${x*26+13},${y*26+13})"><polygon points="0,-11 2.8,-2.8 11,0 2.8,2.8 0,11 -2.8,2.8 -11,0 -2.8,-2.8" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.7"/><polygon points="0,-7 1.8,-1.8 7,0 1.8,1.8 0,7 -1.8,1.8 -7,0 -1.8,-1.8" fill="${a}" opacity="0.25"/><circle r="2.5" fill="${a}" opacity="0.7"/><circle r="1.2" fill="${c}" opacity="1"/></g>`).join('')).join('')}`,

      b13: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/30)},(_,x)=>Array.from({length:Math.ceil(h/30)},(_,y)=>{const cx=x*30+15+(y%2===0?0:15),cy=y*30+15;const petals=[0,45,90,135,180,225,270,315].map(ang=>`<ellipse cx="${(Math.cos((ang-90)*Math.PI/180)*7).toFixed(1)}" cy="${(Math.sin((ang-90)*Math.PI/180)*7).toFixed(1)}" rx="2.5" ry="5.2" fill="${a}" opacity="0.65" transform="rotate(${ang},${(Math.cos((ang-90)*Math.PI/180)*7).toFixed(1)},${(Math.sin((ang-90)*Math.PI/180)*7).toFixed(1)})"/>`).join('');return`<g transform="translate(${cx},${cy})">${petals}<circle r="3.5" fill="${a}" opacity="0.85"/><circle r="2" fill="${aL}" opacity="0.8"/><circle r="1" fill="${c}" opacity="1"/></g>`}).join('')).join('')}`,

      b14: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/34)},(_,x)=>Array.from({length:Math.ceil(h/34)},(_,y)=>`<g transform="translate(${x*34+17},${y*34+17})"><circle r="13" fill="none" stroke="${a}" stroke-width="0.5" opacity="0.2"/><circle cy="-9" r="2" fill="${a}" opacity="0.7"/><line x1="0" y1="-5.5" x2="0" y2="3" stroke="${a}" stroke-width="1.4" opacity="0.85"/><line x1="-7" y1="-1" x2="0" y2="-3" stroke="${a}" stroke-width="1.2" opacity="0.8"/><line x1="0" y1="-3" x2="7" y2="-1" stroke="${a}" stroke-width="1.2" opacity="0.8"/><line x1="0" y1="3" x2="-5" y2="11" stroke="${a}" stroke-width="1.2" opacity="0.8"/><line x1="0" y1="3" x2="5" y2="11" stroke="${a}" stroke-width="1.2" opacity="0.8"/></g>`).join('')).join('')}`,

      b15: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/28)},(_,x)=>Array.from({length:Math.ceil(h/28)},(_,y)=>{const cx=x*28+14+(y%2===0?0:14),cy=y*28+14;return`<g transform="translate(${cx},${cy})"><path d="M0,-11 C3,-7 9,-5 7,0 C9,5 3,8 0,11 C-3,8 -9,5 -7,0 C-9,-5 -3,-7 0,-11Z" fill="none" stroke="${a}" stroke-width="1.4" opacity="0.75"/><line x1="0" y1="-11" x2="0" y2="11" stroke="${a}" stroke-width="0.8" opacity="0.5"/><circle r="2" fill="${a}" opacity="0.7"/><circle r="1" fill="${aL}" opacity="0.9"/></g>`}).join('')).join('')}`,

      b16: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/9)},(_,i)=>i%3===0?`<rect x="${i*9}" y="0" width="2" height="${h}" fill="${a}" opacity="0.65"/><rect x="${i*9+0.5}" y="0" width="0.7" height="${h}" fill="${aL}" opacity="0.4"/>`:`<rect x="${i*9}" y="0" width="0.8" height="${h}" fill="${a}" opacity="0.2"/>`).join('')}`,

      b17: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/24)},(_,x)=>Array.from({length:Math.ceil(h/24)},(_,y)=>{const cx=x*24+12,cy=y*24+12;const petals=[0,60,120,180,240,300].map(ang=>`<ellipse cx="${(Math.cos(ang*Math.PI/180)*6.5).toFixed(1)}" cy="${(Math.sin(ang*Math.PI/180)*6.5).toFixed(1)}" rx="2.2" ry="3.8" fill="${a}" opacity="0.65" transform="rotate(${ang},${(Math.cos(ang*Math.PI/180)*6.5).toFixed(1)},${(Math.sin(ang*Math.PI/180)*6.5).toFixed(1)})"/>`).join('');return`<g transform="translate(${cx},${cy})"><circle r="10" fill="none" stroke="${a}" stroke-width="2" opacity="0.65"/>${petals}<circle r="3.5" fill="${a}" opacity="0.7"/><circle r="1.5" fill="${c}" opacity="1"/></g>`}).join('')).join('')}`,

      // ── BORDERS ───────────────────────────────────────────────────────────
      br1: `<rect width="${w}" height="${h}" fill="${c}"/><rect y="${h*0.15}" width="${w}" height="${h*0.7}" fill="url(#zr${uid})" opacity="0.9"/><rect y="${h*0.18}" width="${w}" height="${h*0.06}" fill="${aL}" opacity="0.5"/>`,

      br2: `<rect width="${w}" height="${h}" fill="${c}"/><rect y="0" width="${w}" height="${h*0.3}" fill="url(#zr${uid})" opacity="0.9"/><rect y="${h*0.7}" width="${w}" height="${h*0.3}" fill="url(#zr${uid})" opacity="0.9"/><rect y="${h*0.02}" width="${w}" height="${h*0.06}" fill="${aL}" opacity="0.45"/>`,

      br3: `<rect width="${w}" height="${h}" fill="url(#zr${uid})"/>${Array.from({length:Math.ceil(w/3)},(_,i)=>`<line x1="${i*3}" y1="0" x2="${i*3}" y2="${h}" stroke="${c}" stroke-width="0.5" opacity="0.1"/>`).join('')}${Array.from({length:Math.ceil(w/14)},(_,i)=>`<g transform="translate(${i*14+7},${h/2})"><ellipse rx="2" ry="${h/2-1}" fill="rgba(0,0,0,0.22)" transform="translate(0.4,0.5)"/><ellipse rx="2" ry="${h/2-1}" fill="${c}" opacity="0.75"/><ellipse rx="1" ry="${h/2-2.5}" fill="${c}" opacity="0.5"/></g>`).join('')}<rect y="0" width="${w}" height="1.5" fill="${aL}" opacity="0.7"/><rect y="${h-1.5}" width="${w}" height="1.5" fill="${aL}" opacity="0.7"/><rect y="${h*0.35}" width="${w}" height="${h*0.3}" fill="rgba(255,255,255,0.09)"/>`,

      br4: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/20)},(_,i)=>`<g transform="translate(${i*20+10},${h/2})"><path d="M0,-${h/2-1} C${h/3.5},-${h/3.5} ${h/3},${h*0.1} 0,${h/3} C-${h/9},${h/3} -${h/4},${h*0.1} 0,-${h/2-1}Z" fill="rgba(0,0,0,0.2)" transform="translate(0.4,0.5)"/><path d="M0,-${h/2-1} C${h/3.5},-${h/3.5} ${h/3},${h*0.1} 0,${h/3} C-${h/9},${h/3} -${h/4},${h*0.1} 0,-${h/2-1}Z" fill="${a}" opacity="0.8"/><circle cy="${h/3+1}" r="1.5" fill="${a}" opacity="0.9"/></g>`).join('')}`,

      br5: `<rect width="${w}" height="${h}" fill="url(#zr${uid})"/>${Array.from({length:Math.ceil(w/26)},(_,i)=>`<g transform="translate(${i*26+13},${h/2})"><ellipse rx="7" ry="4.5" fill="${c}" opacity="0.92"/><path d="M4,-4 C5,-8 7,-11 6,-13" fill="none" stroke="${c}" stroke-width="2.2" opacity="0.92"/><circle cx="6" cy="-14" r="3" fill="${c}" opacity="0.92"/></g>`).join('')}<line x1="0" y1="1" x2="${w}" y2="1" stroke="${aL}" stroke-width="0.8" opacity="0.5"/><line x1="0" y1="${h-1}" x2="${w}" y2="${h-1}" stroke="${aL}" stroke-width="0.8" opacity="0.5"/>`,

      br6: `<rect width="${w}" height="${h}" fill="url(#zr${uid})"/>${Array.from({length:Math.ceil(w/3)},(_,i)=>`<line x1="${i*3}" y1="0" x2="${i*3}" y2="${h}" stroke="${c}" stroke-width="0.5" opacity="0.1"/>`).join('')}${Array.from({length:Math.ceil(h/3)},(_,i)=>`<line x1="0" y1="${i*3}" x2="${w}" y2="${i*3}" stroke="${aL}" stroke-width="0.3" opacity="0.12"/>`).join('')}<rect y="0" width="${w}" height="2" fill="${aL}" opacity="0.8"/><rect y="${h-2}" width="${w}" height="2" fill="${aL}" opacity="0.8"/><rect y="${h*0.3}" width="${w}" height="${h*0.4}" fill="rgba(255,255,255,0.1)"/>`,

      br7: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(h/2)},(_,i)=>`<line x1="0" y1="${i*2}" x2="${w}" y2="${i*2}" stroke="${cD}" stroke-width="0.3" opacity="0.05"/>`).join('')}<rect y="${h*0.32}" width="${w}" height="${h*0.36}" fill="${a}" opacity="0.88"/><rect y="${h*0.34}" width="${w}" height="${h*0.08}" fill="${aL}" opacity="0.5"/>`,

      br8: `<rect width="${w}" height="${h}" fill="${c}"/><path d="M0,${h/2} ${Array.from({length:Math.ceil(w/18)+1},(_,i)=>`C${i*18+4},${h*0.15} ${i*18+14},${h*0.15} ${(i+1)*18},${h/2} C${(i+1)*18+4},${h*0.85} ${(i+1)*18+14},${h*0.85} ${(i+2)*18},${h/2}`).join(' ')}" fill="none" stroke="${a}" stroke-width="1.5" opacity="0.75"/>${Array.from({length:Math.ceil(w/18)},(_,i)=>`<circle cx="${i*18+9}" cy="${h*0.15}" r="3.5" fill="${a}" opacity="0.75"/><circle cx="${i*18+9}" cy="${h*0.15}" r="2" fill="${c}" opacity="0.8"/><circle cx="${i*18+9}" cy="${h*0.85}" r="3.5" fill="${a}" opacity="0.75"/><circle cx="${i*18+9}" cy="${h*0.85}" r="2" fill="${c}" opacity="0.8"/>`).join('')}`,

      br9:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/13)},(_,i)=>`<rect x="${i*13}" y="0" width="11" height="${h*0.28}" fill="${a}" opacity="0.75"/><rect x="${i*13+1}" y="${h*0.28}" width="9" height="${h*0.44}" fill="${a}" opacity="0.55"/><rect x="${i*13+2}" y="${h*0.72}" width="7" height="${h*0.28}" fill="${a}" opacity="0.38"/>`).join('')}`,

      br10: `<rect width="${w}" height="${h}" fill="${c}"/><path d="M0,${h*0.65} ${Array.from({length:Math.ceil(w/22)+1},(_,i)=>`Q${i*22+11},${-h*0.3} ${(i+1)*22},${h*0.65}`).join(' ')}" fill="${a}" opacity="0.65"/><path d="M0,${h*0.72} ${Array.from({length:Math.ceil(w/22)+1},(_,i)=>`Q${i*22+11},${h*0.1} ${(i+1)*22},${h*0.72}`).join(' ')}" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.5"/>`,

      br11: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/17)},(_,i)=>`<g transform="translate(${i*17+8.5},${h/2})"><polygon points="0,-${h/2-1} ${h/2-1},0 0,${h/2-1} -${h/2-1},0" fill="none" stroke="${a}" stroke-width="1.4" opacity="0.8"/><polygon points="0,-${h/3} ${h/3},0 0,${h/3} -${h/3},0" fill="${a}" opacity="0.35"/><circle r="2.2" fill="${a}" opacity="0.9"/></g>`).join('')}`,

      br12: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/19)},(_,i)=>`<g transform="translate(${i*19+9.5},${h/2})"><ellipse cx="-4.5" cy="-${h*0.18}" rx="3.8" ry="${h*0.4}" fill="${a}" opacity="0.5"/><ellipse cx="0" cy="-${h*0.18}" rx="3.8" ry="${h*0.4}" fill="${a}" opacity="0.55"/><ellipse cx="4.5" cy="-${h*0.18}" rx="3.8" ry="${h*0.4}" fill="${a}" opacity="0.5"/><circle cy="-${h*0.35}" r="2.5" fill="${a}" opacity="0.9"/><circle r="3" fill="${a}" opacity="0.65"/></g>`).join('')}`,

      // ── PALLU ─────────────────────────────────────────────────────────────
      p1: `<rect width="${w}" height="${h}" fill="url(#zr${uid})"/>${Array.from({length:Math.ceil(w/4)},(_,i)=>`<line x1="${i*4}" y1="0" x2="${i*4}" y2="${h}" stroke="${c}" stroke-width="0.6" opacity="0.14"/>`).join('')}${Array.from({length:Math.ceil(w/22)},(_,x)=>Array.from({length:Math.ceil(h/22)},(_,y)=>`<g transform="translate(${x*22+11},${y*22+11})"><polygon points="0,-9 2.2,-2.2 9,0 2.2,2.2 0,9 -2.2,2.2 -9,0 -2.2,-2.2" fill="${c}" opacity="0.38"/><circle r="2.5" fill="${c}" opacity="0.55"/></g>`).join('')).join('')}`,

      p2: `<rect width="${w}" height="${h}" fill="url(#zr${uid})"/><rect width="${w}" height="${h*0.52}" fill="${c}" opacity="0.95"/>${Array.from({length:Math.ceil(w/16)},(_,i)=>`<g transform="translate(${i*16+8},${h*0.52})"><polygon points="0,-9 7,0 0,9 -7,0" fill="${a}" opacity="0.88"/><polygon points="0,-5 4,0 0,5 -4,0" fill="${c}" opacity="0.85"/><circle r="1.5" fill="${a}" opacity="0.9"/></g>`).join('')}`,

      p3: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/36)},(_,x)=>Array.from({length:Math.ceil(h/40)},(_,y)=>{const cx=x*36+18+(y%2===0?0:18),cy=y*40+20;const spokes=[0,24,48,72,96,120,144,168,192,216,240,264,288,312,336].map(ang=>`<path d="M0,0 C${(Math.cos(ang*Math.PI/180)*7).toFixed(1)},${(Math.sin(ang*Math.PI/180)*7).toFixed(1)} ${(Math.cos(ang*Math.PI/180)*13).toFixed(1)},${(Math.sin(ang*Math.PI/180)*13).toFixed(1)} ${(Math.cos(ang*Math.PI/180)*16).toFixed(1)},${(Math.sin(ang*Math.PI/180)*16).toFixed(1)}" fill="none" stroke="${a}" stroke-width="0.9" opacity="0.45"/>`).join('');return`<g transform="translate(${cx},${cy})">${spokes}<circle r="9" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.4"/><circle r="5" fill="${a}" opacity="0.3"/><circle r="3.5" fill="${a}" opacity="0.55"/><circle r="2" fill="${c}" opacity="1"/><circle r="0.9" fill="${a}" opacity="1"/></g>`}).join('')).join('')}`,

      p4: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/3)},(_,i)=>`<line x1="${i*3}" y1="0" x2="${i*3}" y2="${h}" stroke="${cD}" stroke-width="0.35" opacity="0.13"/>`).join('')}${Array.from({length:Math.ceil(w/26)},(_,x)=>Array.from({length:Math.ceil(h/26)},(_,y)=>{const cx=x*26+13+(y%2===0?0:13),cy=y*26+13;return`<g transform="translate(${cx},${cy})"><ellipse rx="6.5" ry="10" fill="rgba(0,0,0,0.25)" transform="translate(0.5,0.8)"/><ellipse rx="6.5" ry="10" fill="${a}" opacity="0.78"/><ellipse rx="4.5" ry="7" fill="${aL}" opacity="0.28"/><ellipse rx="3" ry="4.8" fill="${c}" opacity="0.88"/><ellipse rx="1.5" ry="2.4" fill="${a}" opacity="0.92"/><ellipse rx="1.2" ry="1.8" cx="-0.5" cy="-2.5" fill="rgba(255,255,255,0.38)"/><path d="M0,-10 C1.8,-13.5 4,-12 3,-10" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.88"/><circle cx="3" cy="-10" r="1.2" fill="${a}" opacity="0.9"/><circle cx="-5" cy="-1" r="1.1" fill="${a}" opacity="0.5"/><circle cx="5" cy="-1" r="1.1" fill="${a}" opacity="0.5"/></g>`}).join('')).join('')}`,

      p5: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/3)},(_,i)=>`<line x1="${i*3}" y1="0" x2="${i*3}" y2="${h}" stroke="${cD}" stroke-width="0.35" opacity="0.09"/>`).join('')}${Array.from({length:Math.ceil(h/3)},(_,i)=>`<line x1="0" y1="${i*3}" x2="${w}" y2="${i*3}" stroke="${cL}" stroke-width="0.35" opacity="0.07"/>`).join('')}`,

      p6: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/3)},(_,i)=>`<line x1="${i*3}" y1="0" x2="${i*3}" y2="${h}" stroke="${cD}" stroke-width="0.3" opacity="0.1"/>`).join('')}${Array.from({length:Math.ceil(w/32)},(_,x)=>Array.from({length:Math.ceil(h/38)},(_,y)=>`<g transform="translate(${x*32+16},${y*38+19})"><path d="M-13,16 L-13,-5 C-13,-21 13,-21 13,-5 L13,16" fill="none" stroke="${a}" stroke-width="2" opacity="0.75"/><path d="M-8,16 L-8,-3 C-8,-13 8,-13 8,-3 L8,16" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.5"/><rect x="-15" y="13" width="5" height="4" fill="${a}" opacity="0.5"/><rect x="10" y="13" width="5" height="4" fill="${a}" opacity="0.5"/><circle cy="-22" r="3" fill="${a}" opacity="0.8"/><circle cy="-22" r="1.5" fill="${aL}" opacity="0.9"/></g>`).join('')).join('')}`,

      p7: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil((w+h)/16)},(_,i)=>`<line x1="${i*16-h}" y1="0" x2="${i*16}" y2="${h}" stroke="${a}" stroke-width="0.8" opacity="0.2"/><line x1="${w-i*16+h}" y1="0" x2="${w-i*16}" y2="${h}" stroke="${a}" stroke-width="0.8" opacity="0.2"/>`).join('')}${Array.from({length:Math.ceil(w/28)},(_,x)=>Array.from({length:Math.ceil(h/28)},(_,y)=>{const cx=x*28+14+(y%2===0?0:14),cy=y*28+14;const petals=[0,45,90,135,180,225,270,315].map(ang=>`<ellipse cx="${(Math.cos((ang-90)*Math.PI/180)*5).toFixed(1)}" cy="${(Math.sin((ang-90)*Math.PI/180)*5).toFixed(1)}" rx="2" ry="4" fill="${a}" opacity="0.5" transform="rotate(${ang},${(Math.cos((ang-90)*Math.PI/180)*5).toFixed(1)},${(Math.sin((ang-90)*Math.PI/180)*5).toFixed(1)})"/>`).join('');return`<g transform="translate(${cx},${cy})">${petals}<circle r="2.8" fill="${a}" opacity="0.75"/><circle r="0.6" fill="${c}" opacity="1"/></g>`}).join('')).join('')}`,

      p8: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/22)},(_,x)=>Array.from({length:Math.ceil(h/22)},(_,y)=>{const cx=x*22+11+(y%2===0?0:11),cy=y*22+11;return`<g transform="translate(${cx},${cy})"><path d="M0,-9 C5,-5 5,2 2.5,6 C0,8 -2.5,8 -2.5,6 C-5,2 -5,-5 0,-9Z" fill="${a}" opacity="0.75"/><path d="M0,-6 C3,-3 3,1 1.5,4 C0,5.5 -1.5,5.5 -1.5,4 C-3,1 -3,-3 0,-6Z" fill="${c}" opacity="0.85"/><path d="M0,-9 C2,-12 4,-11 3,-9" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.8"/></g>`}).join('')).join('')}`,

      p9: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/22)},(_,i)=>`<rect x="${i*22}" y="0" width="${i%4===0?10:i%2===0?5:2.5}" height="${h}" fill="${a}" opacity="${i%4===0?0.72:i%2===0?0.48:0.26}"/>${i%4===0?`<rect x="${i*22+1}" y="0" width="1.5" height="${h}" fill="${aL}" opacity="0.45"/>`:''}`).join('')}`,

      p10: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:3},(_,j)=>`<path d="M${j*w/3},0 C${j*w/3+w/5},${h/4} ${j*w/3-w/6},${h/2} ${j*w/3},${h*0.78}" fill="none" stroke="${a}" stroke-width="1.6" opacity="0.55"/>`).join('')}${Array.from({length:Math.ceil(h/20)},(_,i)=>`<g transform="translate(${w/6+Math.sin(i*1.1)*15},${i*20+10}) rotate(${i*25})"><ellipse rx="6" ry="3.5" fill="${a}" opacity="0.5"/></g>`).join('')}`,

      p11: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/30)},(_,x)=>Array.from({length:Math.ceil(h/30)},(_,y)=>{const cx=x*30+15+(y%2===0?0:15),cy=y*30+15;const outer=[0,45,90,135,180,225,270,315].map(ang=>`<path d="M0,0 C${(Math.cos((ang-20)*Math.PI/180)*7).toFixed(1)},${(Math.sin((ang-20)*Math.PI/180)*7).toFixed(1)} ${(Math.cos((ang+20)*Math.PI/180)*7).toFixed(1)},${(Math.sin((ang+20)*Math.PI/180)*7).toFixed(1)} ${(Math.cos(ang*Math.PI/180)*13).toFixed(1)},${(Math.sin(ang*Math.PI/180)*13).toFixed(1)}" fill="${a}" opacity="0.35"/>`).join('');const inner=[22,67,112,157,202,247,292,337].map(ang=>`<path d="M0,0 C${(Math.cos((ang-15)*Math.PI/180)*4).toFixed(1)},${(Math.sin((ang-15)*Math.PI/180)*4).toFixed(1)} ${(Math.cos((ang+15)*Math.PI/180)*4).toFixed(1)},${(Math.sin((ang+15)*Math.PI/180)*4).toFixed(1)} ${(Math.cos(ang*Math.PI/180)*8).toFixed(1)},${(Math.sin(ang*Math.PI/180)*8).toFixed(1)}" fill="${a}" opacity="0.55"/>`).join('');return`<g transform="translate(${cx},${cy})">${outer}${inner}<circle r="4" fill="${a}" opacity="0.75"/><circle r="1.2" fill="${c}" opacity="1"/></g>`}).join('')).join('')}`,
      p12: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil((w+h)/18)},(_,i)=>`<line x1="${i*18-h}" y1="0" x2="${i*18}" y2="${h}" stroke="${a}" stroke-width="0.8" opacity="0.22"/><line x1="${w-i*18+h}" y1="0" x2="${w-i*18}" y2="${h}" stroke="${a}" stroke-width="0.8" opacity="0.22"/>`).join('')}${Array.from({length:Math.ceil(w/20)},(_,x)=>Array.from({length:Math.ceil(h/20)},(_,y)=>{const cx=x*20+10+(y%2===0?0:10),cy=y*20+10;return`<g transform="translate(${cx},${cy})"><polygon points="0,-6 6,0 0,6 -6,0" fill="none" stroke="${a}" stroke-width="1" opacity="0.6"/><polygon points="0,-3.5 3.5,0 0,3.5 -3.5,0" fill="${a}" opacity="0.3"/><circle r="1.5" fill="${a}" opacity="0.8"/></g>`}).join('')).join('')}`,
    }

    const shape = patterns[patternId] || patterns['b1']
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${defs}<g filter="url(#wv${uid})">${shape}</g>${overlays}</svg>`
  }

  // ── silk + fold sheen overlay strings for section assembly ─────────────────
  const mkSilk = (w, h, id) => {
    const foldGrad = `fd_sec_${id}`
    const sheenGrad = `sh_sec_${id}`
    return `<defs>
      <linearGradient id="${foldGrad}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#000" stop-opacity="0.18"/>
        <stop offset="12%"  stop-color="#000" stop-opacity="0"/>
        <stop offset="30%"  stop-color="#000" stop-opacity="0.07"/>
        <stop offset="38%"  stop-color="#000" stop-opacity="0"/>
        <stop offset="58%"  stop-color="#000" stop-opacity="0.05"/>
        <stop offset="65%"  stop-color="#000" stop-opacity="0"/>
        <stop offset="83%"  stop-color="#000" stop-opacity="0.09"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.2"/>
      </linearGradient>
      <linearGradient id="${sheenGrad}" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%"   stop-color="#fff" stop-opacity="0"/>
        <stop offset="36%"  stop-color="#fff" stop-opacity="0"/>
        <stop offset="48%"  stop-color="#fff" stop-opacity="0.13"/>
        <stop offset="60%"  stop-color="#fff" stop-opacity="0"/>
        <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#${foldGrad})"/>
    <rect width="${w}" height="${h}" fill="url(#${sheenGrad})"/>`
  }

  // Build full SVG string
  let y = 0
  const sections = []
  const zW = Math.round(16 * scale)    // zari strip width
  const zHW = Math.round(2.5 * scale)  // zari highlight width

  // Label: Pallu
  sections.push(`<rect x="0" y="${y}" width="${W}" height="${labelH}" fill="rgba(0,0,0,0.45)"/>`)
  sections.push(`<text x="${W/2}" y="${y + labelH*0.72}" text-anchor="middle" font-size="${labelH*0.55}" fill="#C9A843" letter-spacing="3" font-family="sans-serif" font-weight="600">PALLU</text>`)
  y += labelH

  // Pallu — with silk overlays
  sections.push(`<svg x="0" y="${y}" width="${W}" height="${palluH}">${buildSectionSVG(palluPattern, pc, ac, W, palluH)}${mkSilk(W,palluH,'pallu')}</svg>`)
  y += palluH

  // Top border
  sections.push(`<svg x="0" y="${y}" width="${W}" height="${borderH}">${buildSectionSVG(borderPattern, sc, ac, W, borderH)}<rect width="${W}" height="${borderH}" fill="rgba(255,255,255,0.07)"/></svg>`)
  y += borderH

  // Label: Body
  sections.push(`<rect x="0" y="${y}" width="${W}" height="${labelH}" fill="rgba(0,0,0,0.28)"/>`)
  sections.push(`<text x="${W/2}" y="${y + labelH*0.72}" text-anchor="middle" font-size="${labelH*0.55}" fill="#C9A843" letter-spacing="3" font-family="sans-serif" font-weight="600">BODY</text>`)
  y += labelH

  // Body — with silk overlays + premium zari strips
  sections.push(`<svg x="0" y="${y}" width="${W}" height="${bodyH}">`)
  sections.push(buildSectionSVG(bodyPattern, pc, ac, W, bodyH))
  sections.push(mkSilk(W, bodyH, 'body'))
  // Left zari strip
  sections.push(`<defs><linearGradient id="lz${scale}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${ac}" stop-opacity="0.85"/><stop offset="55%" stop-color="${ac}" stop-opacity="0.6"/><stop offset="100%" stop-color="${ac}" stop-opacity="0"/></linearGradient><linearGradient id="rz${scale}" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="${ac}" stop-opacity="0.85"/><stop offset="55%" stop-color="${ac}" stop-opacity="0.6"/><stop offset="100%" stop-color="${ac}" stop-opacity="0"/></linearGradient></defs>`)
  sections.push(`<rect x="0" y="0" width="${zW}" height="${bodyH}" fill="url(#lz${scale})"/>`)
  sections.push(`<rect x="${zHW}" y="0" width="${zHW}" height="${bodyH}" fill="rgba(255,255,255,0.5)"/>`)
  sections.push(`<rect x="${W-zW}" y="0" width="${zW}" height="${bodyH}" fill="url(#rz${scale})"/>`)
  sections.push(`<rect x="${W-zHW*2}" y="0" width="${zHW}" height="${bodyH}" fill="rgba(255,255,255,0.5)"/>`)
  sections.push(`</svg>`)
  y += bodyH

  // Bottom border
  sections.push(`<svg x="0" y="${y}" width="${W}" height="${borderH}">${buildSectionSVG(borderPattern, sc, ac, W, borderH)}<rect width="${W}" height="${borderH}" fill="rgba(255,255,255,0.07)"/></svg>`)
  y += borderH

  // Blouse — with silk overlays + hem band
  sections.push(`<svg x="0" y="${y}" width="${W}" height="${blouseH}">`)
  sections.push(buildSectionSVG(bodyPattern, sc, ac, W, blouseH))
  sections.push(mkSilk(W, blouseH, 'blouse'))
  sections.push(`<rect x="0" y="0" width="${W}" height="${blouseH}" fill="rgba(0,0,0,0.12)"/>`)
  sections.push(`<rect x="0" y="${blouseH - Math.round(16*scale)}" width="${W}" height="${Math.round(16*scale)}" fill="${ac}" opacity="0.75"/>`)
  sections.push(`<rect x="0" y="${blouseH - Math.round(18*scale)}" width="${W}" height="${Math.round(2*scale)}" fill="rgba(255,255,255,0.55)"/>`)
  sections.push(`</svg>`)
  y += blouseH

  // Label: Blouse
  sections.push(`<rect x="0" y="${y}" width="${W}" height="${labelH}" fill="rgba(0,0,0,0.45)"/>`)
  sections.push(`<text x="${W/2}" y="${y + labelH*0.72}" text-anchor="middle" font-size="${labelH*0.55}" fill="#C9A843" letter-spacing="3" font-family="sans-serif" font-weight="600">BLOUSE</text>`)

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${sections.join('')}</svg>`

  // Draw SVG onto canvas via Image
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