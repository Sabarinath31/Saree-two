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
          <ellipse rx={4} ry={6} fill={a} opacity={0.7} />
          <ellipse rx={2} ry={3} fill={c} opacity={0.9} />
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
          <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill={a} opacity={0.5} />
        </g>
      ))).flat()}
    </>,
    b7: <>
      <rect width={width} height={height} fill={c} />
      {Array.from({length: Math.ceil(width/32)}, (_,x) => Array.from({length: Math.ceil(height/32)}, (_,y) => (
        <g key={`${x}-${y}`} transform={`translate(${x*32+16},${y*32+16})`}>
          <path d={`M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z`} fill={a} opacity={0.5} />
          <circle r={3} fill={c} />
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
      {Array.from({length: Math.ceil(width/16)}, (_,i) => (
        <g key={i} transform={`translate(${i*16+8}, ${height/2})`}>
          <polygon points="0,-8 6,0 0,8 -6,0" fill={c} />
          <polygon points="0,-4 3,0 0,4 -3,0" fill={a} />
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
          <path d={`M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z`} fill={a} opacity={0.6} />
          <circle r={3} fill={c} />
          {[0,60,120,180,240,300].map(ang => (
            <line key={ang} x1={0} y1={0} x2={Math.cos(ang*Math.PI/180)*14} y2={Math.sin(ang*Math.PI/180)*14} stroke={a} strokeWidth={0.8} opacity={0.3} />
          ))}
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
  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
      {part[patternId] || <rect width={width} height={height} fill={c} />}
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
        {/* shimmer overlay */}
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,transparent 40%,rgba(255,255,255,0.08) 50%,transparent 60%)',pointerEvents:'none'}} />
      </div>

      {/* Top border */}
      <div style={{width: w, height: borderH, overflow:'hidden'}}>
        <PatternRenderer patternId={design.borderPattern} color={design.secondaryColor} accentColor={design.accentColor} width={w} height={borderH} />
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
        {/* Left zari border */}
        <div style={{position:'absolute',top:0,left:0,bottom:0,width:Math.round(14*scale),background:`linear-gradient(90deg,${design.accentColor}99,${design.accentColor}33)`,pointerEvents:'none'}} />
        {/* Right zari border */}
        <div style={{position:'absolute',top:0,right:0,bottom:0,width:Math.round(14*scale),background:`linear-gradient(270deg,${design.accentColor}99,${design.accentColor}33)`,pointerEvents:'none'}} />
      </div>

      {/* Bottom border */}
      <div style={{width: w, height: borderH, overflow:'hidden'}}>
        <PatternRenderer patternId={design.borderPattern} color={design.secondaryColor} accentColor={design.accentColor} width={w} height={borderH} />
      </div>

      {/* Blouse */}
      <div style={{width: w, height: blouseH, overflow:'hidden', position:'relative'}}>
        <PatternRenderer patternId={design.bodyPattern} color={design.secondaryColor} accentColor={design.accentColor} width={w} height={blouseH} />
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'rgba(255,255,255,0.06)',pointerEvents:'none'}} />
        <div style={{
          position:'absolute',bottom:0,left:0,right:0,height:Math.round(16*scale),
          background:`linear-gradient(90deg,${design.accentColor}66,${design.accentColor}CC,${design.accentColor}66)`,
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

  // Helper: inline SVG for each section
  const buildSectionSVG = (patternId, color, accent, w, h) => {
    const c = color; const a = accent
    const patterns = {
      // ─ body ─
      b1:  `<rect width="${w}" height="${h}" fill="${c}"/>`,
      b2:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/12)},(_,i)=>`<line x1="${i*12}" y1="0" x2="${i*12}" y2="${h}" stroke="${a}" stroke-width="0.8" opacity="0.5"/>`).join('')}`,
      b3:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(h/16)},(_,i)=>`<line x1="0" y1="${i*16}" x2="${w}" y2="${i*16}" stroke="${a}" stroke-width="0.8" opacity="0.4"/>`).join('')}${Array.from({length:Math.ceil(w/16)},(_,i)=>`<line x1="${i*16}" y1="0" x2="${i*16}" y2="${h}" stroke="${a}" stroke-width="0.8" opacity="0.4"/>`).join('')}`,
      b4:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/20)},(_,x)=>Array.from({length:Math.ceil(h/20)},(_,y)=>`<g transform="translate(${x*20+10},${y*20+10})"><ellipse rx="4" ry="6" fill="${a}" opacity="0.7"/><ellipse rx="2" ry="3" fill="${c}" opacity="0.9"/></g>`).join('')).join('')}`,
      b5:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/24)},(_,x)=>Array.from({length:Math.ceil(h/24)},(_,y)=>`<g transform="translate(${x*24+12},${y*24+12})"><polygon points="0,-8 8,0 0,8 -8,0" fill="none" stroke="${a}" stroke-width="1" opacity="0.6"/><polygon points="0,-4 4,0 0,4 -4,0" fill="${a}" opacity="0.4"/></g>`).join('')).join('')}`,
      b6:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/28)},(_,x)=>Array.from({length:Math.ceil(h/28)},(_,y)=>`<g transform="translate(${x*28+14},${y*28+14})"><polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="${a}" opacity="0.5"/></g>`).join('')).join('')}`,
      b7:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/32)},(_,x)=>Array.from({length:Math.ceil(h/32)},(_,y)=>`<g transform="translate(${x*32+16},${y*32+16})"><path d="M0,-12 C6,-8 12,-4 8,0 C12,4 6,8 0,12 C-6,8 -12,4 -8,0 C-12,-4 -6,-8 0,-12Z" fill="${a}" opacity="0.5"/><circle r="3" fill="${c}"/></g>`).join('')).join('')}`,
      b8:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/18)},(_,x)=>Array.from({length:Math.ceil(h/18)},(_,y)=>`<circle cx="${x*18+9}" cy="${y*18+9}" r="3" fill="${a}" opacity="0.7"/>`).join('')).join('')}`,
      b9:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/14)},(_,x)=>Array.from({length:Math.ceil(h/14)},(_,y)=>`<circle cx="${x*14+7}" cy="${y*14+7}" r="4" fill="none" stroke="${a}" stroke-width="0.8" opacity="0.6"/><circle cx="${x*14+7}" cy="${y*14+7}" r="1.5" fill="${a}" opacity="0.5"/>`).join('')).join('')}`,
      b10: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(h/16)},(_,i)=>`<path d="M0,${i*16} Q${w/4},${i*16-6} ${w/2},${i*16} Q${3*w/4},${i*16+6} ${w},${i*16}" fill="none" stroke="${a}" stroke-width="1" opacity="0.5"/>`).join('')}`,
      b11: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/36)},(_,x)=>Array.from({length:Math.ceil(h/36)},(_,y)=>`<g transform="translate(${x*36+18},${y*36+18})"><path d="M0,-14 C8,-14 14,-8 14,0 C14,6 8,10 0,14 C-8,10 -14,6 -14,0 C-14,-8 -8,-14 0,-14Z" fill="none" stroke="${a}" stroke-width="1" opacity="0.4"/><path d="M0,-8 L4,-4 8,0 4,4 0,8 -4,4 -8,0 -4,-4Z" fill="${a}" opacity="0.35"/></g>`).join('')).join('')}`,
      b12: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/20)},(_,x)=>Array.from({length:Math.ceil(h/20)},(_,y)=>`<rect x="${x*20+4}" y="${y*20+4}" width="12" height="12" fill="none" stroke="${a}" stroke-width="0.8" opacity="0.5" transform="rotate(45,${x*20+10},${y*20+10})"/>`).join('')).join('')}`,
      b13: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/26)},(_,x)=>Array.from({length:Math.ceil(h/26)},(_,y)=>`<g transform="translate(${x*26+13},${y*26+13})"><ellipse rx="5" ry="8" fill="${a}" opacity="0.4"/><ellipse rx="3" ry="5" fill="${a}" opacity="0.3"/><ellipse rx="1" ry="2" fill="${a}" opacity="0.6"/></g>`).join('')).join('')}`,
      b14: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/30)},(_,x)=>Array.from({length:Math.ceil(h/30)},(_,y)=>`<g transform="translate(${x*30+15},${y*30+15})"><circle r="2" fill="${a}" opacity="0.5"/><line x1="-8" y1="0" x2="8" y2="0" stroke="${a}" stroke-width="0.8" opacity="0.4"/><line x1="0" y1="-8" x2="0" y2="8" stroke="${a}" stroke-width="0.8" opacity="0.4"/></g>`).join('')).join('')}`,
      b15: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/28)},(_,x)=>Array.from({length:Math.ceil(h/28)},(_,y)=>`<g transform="translate(${x*28+14},${y*28+14})"><path d="M0,-10 C4,-6 10,-4 10,0 C10,4 4,8 0,10 C-4,8 -10,4 -10,0 C-10,-4 -4,-6 0,-10Z" fill="${a}" opacity="0.3"/></g>`).join('')).join('')}`,
      b16: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/6)},(_,i)=>i%4===0?`<line x1="${i*6}" y1="0" x2="${i*6}" y2="${h}" stroke="${a}" stroke-width="1.2" opacity="0.6"/>`:`<line x1="${i*6}" y1="0" x2="${i*6}" y2="${h}" stroke="${a}" stroke-width="0.4" opacity="0.25"/>`).join('')}`,
      b17: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/22)},(_,x)=>Array.from({length:Math.ceil(h/22)},(_,y)=>`<g transform="translate(${x*22+11},${y*22+11})"><polygon points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2" fill="${a}" opacity="0.6"/></g>`).join('')).join('')}`,
      // ─ borders ─
      br1: `<rect width="${w}" height="${h}" fill="${c}"/><rect x="0" y="0" width="${w}" height="${Math.round(h*0.35)}" fill="${a}" opacity="0.8"/><rect x="0" y="${Math.round(h*0.65)}" width="${w}" height="${Math.round(h*0.35)}" fill="${a}" opacity="0.8"/>`,
      br2: `<rect width="${w}" height="${h}" fill="${c}"/><rect x="0" y="0" width="${w}" height="${Math.round(h*0.22)}" fill="${a}" opacity="0.8"/><rect x="0" y="${Math.round(h*0.35)}" width="${w}" height="${Math.round(h*0.1)}" fill="${a}" opacity="0.5"/><rect x="0" y="${Math.round(h*0.65)}" width="${w}" height="${Math.round(h*0.1)}" fill="${a}" opacity="0.5"/><rect x="0" y="${Math.round(h*0.78)}" width="${w}" height="${Math.round(h*0.22)}" fill="${a}" opacity="0.8"/>`,
      br3: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/12)},(_,i)=>`<rect x="${i*12+2}" y="2" width="8" height="${h-4}" rx="2" fill="${a}" opacity="0.5"/>`).join('')}`,
      br4: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/16)},(_,i)=>`<path d="M${i*16+8},2 C${i*16+14},2 ${i*16+14},${h/2} ${i*16+8},${h/2} C${i*16+2},${h/2} ${i*16+2},2 ${i*16+8},2Z" fill="${a}" opacity="0.6"/>`).join('')}`,
      br5: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/20)},(_,i)=>`<g transform="translate(${i*20+10},${h/2})"><path d="M0,-${h/2-1} C4,-${h/4} 6,0 4,${h/4} C2,${h/3} -2,${h/3} -4,${h/4} C-6,0 -4,-${h/4} 0,-${h/2-1}Z" fill="${a}" opacity="0.5"/></g>`).join('')}`,
      br6: `<rect width="${w}" height="${h}" fill="${a}"/>${Array.from({length:Math.ceil(w/10)},(_,i)=>`<diamond/><rect x="${i*10+2}" y="1" width="6" height="${h-2}" rx="1" fill="${c}" opacity="0.3"/>`).join('')}`,
      br7: `<rect width="${w}" height="${h}" fill="${c}"/><rect x="0" y="${Math.round(h/2-1)}" width="${w}" height="2" fill="${a}" opacity="0.9"/>`,
      br8: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/14)},(_,i)=>`<circle cx="${i*14+7}" cy="${h/2}" r="${h/2-1}" fill="none" stroke="${a}" stroke-width="0.8" opacity="0.6"/>`).join('')}`,
      br9: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/12)},(_,i)=>`<polygon points="${i*12},${h} ${i*12+6},0 ${i*12+12},${h}" fill="${a}" opacity="0.4"/>`).join('')}`,
      br10:`<rect width="${w}" height="${h}" fill="${c}"/><path d="M0,${h/2} ${Array.from({length:Math.ceil(w/16)},(_,i)=>`Q${i*16+8},0 ${(i+1)*16},${h/2}`).join(' ')}" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.7"/>`,
      br11:`<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/14)},(_,i)=>`<polygon points="${i*14+7},1 ${i*14+13},${h/2} ${i*14+7},${h-1} ${i*14+1},${h/2}" fill="${a}" opacity="0.5"/>`).join('')}`,
      br12:`<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/16)},(_,i)=>`<g transform="translate(${i*16+8},${h/2})"><ellipse rx="4" ry="${h/2-1}" fill="${a}" opacity="0.4"/><ellipse rx="2" ry="${h/4}" fill="${a}" opacity="0.3"/></g>`).join('')}`,
      // ─ pallu ─
      p1:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/20)},(_,x)=>Array.from({length:Math.ceil(h/20)},(_,y)=>`<g transform="translate(${x*20+10},${y*20+10})"><polygon points="0,-8 3,-3 8,-3 4,2 6,8 0,4 -6,8 -4,2 -8,-3 -3,-3" fill="${a}"/></g>`).join('')).join('')}`,
      p2:  `<rect width="${w}" height="${h/2}" fill="${c}"/><rect x="0" y="${h/2}" width="${w}" height="${h/2}" fill="${a}" opacity="0.7"/>`,
      p3:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/40)},(_,x)=>Array.from({length:Math.ceil(h/40)},(_,y)=>`<g transform="translate(${x*40+20},${y*40+20})"><path d="M0,-16 C8,-12 16,-6 12,0 C16,6 8,12 0,16 C-8,12 -16,6 -12,0 C-16,-6 -8,-12 0,-16Z" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.6"/><circle r="4" fill="${a}" opacity="0.5"/></g>`).join('')).join('')}`,
      p4:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/24)},(_,x)=>Array.from({length:Math.ceil(h/24)},(_,y)=>`<g transform="translate(${x*24+12},${y*24+12})"><path d="M0,-10 C5,-5 10,0 5,5 C0,10 -5,5 -10,0 C-5,-5 0,-10 0,-10Z" fill="${a}" opacity="0.4"/></g>`).join('')).join('')}`,
      p5:  `<rect width="${w}" height="${h}" fill="${c}"/>`,
      p6:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/32)},(_,x)=>Array.from({length:Math.ceil(h/32)},(_,y)=>`<g transform="translate(${x*32+16},${y*32+16})"><rect x="-12" y="-12" width="24" height="24" fill="none" stroke="${a}" stroke-width="0.8" opacity="0.4"/><polygon points="0,-8 4,-4 8,0 4,4 0,8 -4,4 -8,0 -4,-4" fill="${a}" opacity="0.3"/></g>`).join('')).join('')}`,
      p7:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/36)},(_,x)=>Array.from({length:Math.ceil(h/36)},(_,y)=>`<g transform="translate(${x*36+18},${y*36+18})"><path d="M0,-14 C6,-8 14,-6 14,0 C14,6 6,10 0,14 C-6,10 -14,6 -14,0 C-14,-6 -6,-8 0,-14Z" fill="${a}" opacity="0.25"/><polygon points="0,-8 3,-3 8,-3 4,2 6,8 0,4 -6,8 -4,2 -8,-3 -3,-3" fill="${a}" opacity="0.4"/></g>`).join('')).join('')}`,
      p8:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/22)},(_,x)=>Array.from({length:Math.ceil(h/22)},(_,y)=>`<circle cx="${x*22+11}" cy="${y*22+11}" r="5" fill="${a}" opacity="0.35"/>`).join('')).join('')}`,
      p9:  `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/16)},(_,i)=>`<rect x="${i*16}" y="0" width="6" height="${h}" fill="${a}" opacity="${i%3===0?0.35:0.15}"/>`).join('')}`,
      p10: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:4},(_,j)=>`<path d="M${j*w/4},0 Q${j*w/4+w/8},${h/2} ${j*w/4},${h}" fill="none" stroke="${a}" stroke-width="1.5" opacity="0.5"/>`).join('')}${Array.from({length:Math.ceil(h/20)},(_,i)=>`<circle cx="${(i%2)*w/2+w/4}" cy="${i*20+10}" r="3" fill="${a}" opacity="0.4"/>`).join('')}`,
      p11: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/28)},(_,x)=>Array.from({length:Math.ceil(h/28)},(_,y)=>`<g transform="translate(${x*28+14},${y*28+14})"><path d="M0,-12 C6,-6 12,0 6,6 C0,12 -6,6 -12,0 C-6,-6 0,-12 0,-12Z" fill="${a}" opacity="0.3"/><circle r="2" fill="${a}" opacity="0.5"/></g>`).join('')).join('')}`,
      p12: `<rect width="${w}" height="${h}" fill="${c}"/>${Array.from({length:Math.ceil(w/18)},(_,x)=>Array.from({length:Math.ceil(h/18)},(_,y)=>`<polygon points="${x*18+9},${y*18+2} ${x*18+16},${y*18+9} ${x*18+9},${y*18+16} ${x*18+2},${y*18+9}" fill="none" stroke="${a}" stroke-width="0.8" opacity="0.45"/>`).join('')).join('')}`,
    }
    return patterns[patternId] || patterns['b1']
  }

  // Build full SVG string
  let y = 0
  const sections = []

  // Label: Pallu
  sections.push(`<rect x="0" y="${y}" width="${W}" height="${labelH}" fill="rgba(0,0,0,0.35)"/>`)
  sections.push(`<text x="${W/2}" y="${y + labelH*0.72}" text-anchor="middle" font-size="${labelH*0.55}" fill="#9C8A6A" letter-spacing="3" font-family="sans-serif">PALLU</text>`)
  y += labelH

  // Pallu
  sections.push(`<svg x="0" y="${y}" width="${W}" height="${palluH}">${buildSectionSVG(palluPattern, pc, ac, W, palluH)}</svg>`)
  y += palluH

  // Top border
  sections.push(`<svg x="0" y="${y}" width="${W}" height="${borderH}">${buildSectionSVG(borderPattern, sc, ac, W, borderH)}</svg>`)
  y += borderH

  // Label: Body
  sections.push(`<rect x="0" y="${y}" width="${W}" height="${labelH}" fill="rgba(0,0,0,0.2)"/>`)
  sections.push(`<text x="${W/2}" y="${y + labelH*0.72}" text-anchor="middle" font-size="${labelH*0.55}" fill="#9C8A6A" letter-spacing="3" font-family="sans-serif">BODY</text>`)
  y += labelH

  // Body
  sections.push(`<svg x="0" y="${y}" width="${W}" height="${bodyH}">${buildSectionSVG(bodyPattern, pc, ac, W, bodyH)}`)
  // Zari sides
  sections.push(`<rect x="0" y="0" width="${Math.round(14*scale)}" height="${bodyH}" fill="${ac}" opacity="0.35"/>`)
  sections.push(`<rect x="${W - Math.round(14*scale)}" y="0" width="${Math.round(14*scale)}" height="${bodyH}" fill="${ac}" opacity="0.35"/>`)
  sections.push(`</svg>`)
  y += bodyH

  // Bottom border
  sections.push(`<svg x="0" y="${y}" width="${W}" height="${borderH}">${buildSectionSVG(borderPattern, sc, ac, W, borderH)}</svg>`)
  y += borderH

  // Blouse
  sections.push(`<svg x="0" y="${y}" width="${W}" height="${blouseH}">${buildSectionSVG(bodyPattern, sc, ac, W, blouseH)}<rect x="0" y="0" width="${W}" height="${blouseH}" fill="rgba(0,0,0,0.12)"/><rect x="0" y="${blouseH - Math.round(10*scale)}" width="${W}" height="${Math.round(10*scale)}" fill="${ac}" opacity="0.5"/></svg>`)
  y += blouseH

  // Label: Blouse
  sections.push(`<rect x="0" y="${y}" width="${W}" height="${labelH}" fill="rgba(0,0,0,0.35)"/>`)
  sections.push(`<text x="${W/2}" y="${y + labelH*0.72}" text-anchor="middle" font-size="${labelH*0.55}" fill="#9C8A6A" letter-spacing="3" font-family="sans-serif">BLOUSE</text>`)

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
