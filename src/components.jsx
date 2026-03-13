// ─── components.jsx ─────────────────────────────────────────────────────────
// PatternRenderer, SareeCanvas, Notification, VoiceQuestionnaire,
// ImageUploadPage, AuthPage, CustomerHome, DesignerCanvas
// Imported by App.jsx

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  T, sb, GlobalStyles,
  SEED_PATTERNS, SEED_PALETTES, SEED_TEMPLATES,
  QUESTIONS, COLOR_MAP, BODY_MAP, BORDER_PALLU_MAP,
  FABRIC_ADJUSTMENTS, RICHNESS_LAYER,
  buildDesignFromAnswers, generateRecommendations,
  CLAUDE_MODEL, ANTHROPIC_KEY,
} from './constants.jsx'

// ─── SVG PATTERN RENDERER ─────────────────────────────────────────────────────
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
      boxShadow: '0 8px 40px rgba(44,36,22,0.15)',
      width: w
    }}>
      {/* Label */}
      <div style={{
        width: '100%', padding: '4px 0', textAlign: 'center',
        background: 'rgba(44,36,22,0.06)', fontSize: 8, letterSpacing: 2,
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
        background: 'rgba(44,36,22,0.04)', fontSize: 7, letterSpacing: 2,
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
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'rgba(44,36,22,0.08)',pointerEvents:'none'}} />
        <div style={{
          position:'absolute',bottom:0,left:0,right:0,height:Math.round(16*scale),
          background:`linear-gradient(90deg,${design.accentColor}66,${design.accentColor}CC,${design.accentColor}66)`,
          pointerEvents:'none'
        }} />
      </div>
      <div style={{
        width: '100%', padding: '4px 0', textAlign: 'center',
        background: 'rgba(44,36,22,0.06)', fontSize: 8, letterSpacing: 2,
        textTransform: 'uppercase', color: T.textLight, fontWeight: 600
      }}>Blouse</div>
    </div>
  )
}

// ─── NOTIFICATION ─────────────────────────────────────────────────────────────
function Notification({ notification }) {
  if (!notification) return null
  const colors = {
    success: { bg: '#F0FFF4', border: '#9AE6B4', text: '#276749' },
    error: { bg: '#FFF5F5', border: '#FEB2B2', text: '#C53030' },
    info: { bg: '#EBF8FF', border: '#90CDF4', text: '#2B6CB0' },
  }
  const c = colors[notification.type] || colors.info
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      padding: '12px 20px', borderRadius: 4, fontSize: 13,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      animation: 'slideUp 0.3s ease',
      maxWidth: 320, fontWeight: 400
    }}>
      {notification.msg}
    </div>
  )
}

// ─── VOICE QUESTIONNAIRE ──────────────────────────────────────────────────────

function VoiceQuestionnaire({ onComplete, onBack }) {
  const [currentIdx, setCurrentIdx]   = useState(0)
  const [answers,    setAnswers]      = useState({})
  const [isListening, setIsListening] = useState(false)
  const [transcript,  setTranscript]  = useState('')
  const [isSpeaking,  setIsSpeaking]  = useState(false)
  const [isGenerating,setIsGenerating]= useState(false)
  const [animIn,      setAnimIn]      = useState(true)
  const recognitionRef = useRef(null)

  const q      = QUESTIONS[currentIdx]
  const totalQ = QUESTIONS.length

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.88; u.pitch = 1.05
    u.onstart = () => setIsSpeaking(true)
    u.onend   = () => setIsSpeaking(false)
    window.speechSynthesis.speak(u)
  }, [])

  useEffect(() => {
    if (q) {
      setAnimIn(false)
      setTimeout(() => { setAnimIn(true); speak(q.text) }, 120)
    }
    return () => { window.speechSynthesis?.cancel() }
  }, [currentIdx, speak])

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [q.id]: value }
    setAnswers(newAnswers)
    speak('Got it.')
    setTimeout(() => {
      if (currentIdx < QUESTIONS.length - 1) {
        setCurrentIdx(i => i + 1)
      } else {
        finalize(newAnswers)
      }
    }, 600)
  }

  const finalize = (finalAnswers) => {
    setIsGenerating(true)
    speak('Perfect! Designing your saree now.')
    // Small delay so loading screen renders, then compute synchronously
    setTimeout(() => {
      const primaryDesign = buildDesignFromAnswers(finalAnswers)
      const recommendations = generateRecommendations(finalAnswers)
      const occ = finalAnswers.occasionAndWearer || ''
      const fab = finalAnswers.fabricAndStyle    || ''
      const col = finalAnswers.colorAndAccent    || ''
      const explanation =
        'A ' + (fab || 'silk') + ' saree in ' + (col || 'classic') + ' tones, ' +
        'designed for ' + (occ || 'your occasion') + '. ' +
        'The body pattern and pallu were selected to match your richness and border preferences.'
      onComplete({
        recommendations,
        design: { ...primaryDesign, explanation, sareeStyle: fab }
      }, finalAnswers)
    }, 400)
  }

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Voice not supported — please tap an option.'); return }
    window.speechSynthesis?.cancel()
    const rec = new SR()
    rec.continuous = false; rec.interimResults = true; rec.lang = 'en-IN'
    recognitionRef.current = rec
    rec.onstart  = () => { setIsListening(true); setTranscript('') }
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(t)
      if (e.results[e.results.length - 1].isFinal) {
        const match = q.options.find(o =>
          t.toLowerCase().includes(o.value.toLowerCase().split(' ')[0].toLowerCase())
        )
        if (match) { setIsListening(false); handleAnswer(match.value) }
      }
    }
    rec.onend   = () => setIsListening(false)
    rec.onerror = () => setIsListening(false)
    rec.start()
  }
  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false) }

  // ── Loading screen ──────────────────────────────────────────────────────────
  if (isGenerating) {
    return (
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        minHeight:400,padding:40,gap:24}}>
        <div style={{position:'relative',width:80,height:80}}>
          <div style={{position:'absolute',inset:0,borderRadius:'50%',
            border:'3px solid '+T.goldLight,borderTopColor:T.gold,animation:'spin 1s linear infinite'}} />
          <div style={{position:'absolute',inset:8,borderRadius:'50%',
            border:'2px solid rgba(106,27,154,0.15)',borderBottomColor:'#6A1B9A',
            animation:'spin 1.4s linear infinite reverse'}} />
          <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',
            justifyContent:'center',fontSize:28}}>🧵</div>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontFamily:'Cormorant Garamond',fontSize:24,color:T.text,
            fontStyle:'italic',marginBottom:6}}>Crafting your saree...</div>
          <div style={{fontSize:11,letterSpacing:1.5,textTransform:'uppercase',color:T.textLight}}>
            Mapping your preferences to design elements
          </div>
        </div>
        <div style={{background:T.surfaceAlt,border:'1px solid '+T.border,borderRadius:4,
          padding:16,width:'100%',maxWidth:320}}>
          <p style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:T.textLight,marginBottom:10}}>
            Your answers
          </p>
          {Object.entries(answers).map(([k,v]) => {
            const qObj = QUESTIONS.find(x => x.id === k)
            return (
              <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',
                padding:'5px 0',borderBottom:'1px solid '+T.borderLight,gap:8}}>
                <span style={{fontSize:10,color:T.textLight,whiteSpace:'nowrap'}}>
                  {qObj ? qObj.section : k}
                </span>
                <span style={{fontSize:10,fontWeight:500,color:T.text,textAlign:'right'}}>{v}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (!q) return null

  const SECTION_COLORS = {
    'Occasion':'#6A1B9A', 'Fabric & Heritage':'#1565C0',
    'Body & Richness':'#2E7D32', 'Border & Pallu':'#E65100', 'Colour':'#B8860B'
  }
  const sColor = SECTION_COLORS[q.section] || T.goldDark

  return (
    <div style={{maxWidth:520,margin:'0 auto',padding:'0 16px 40px'}}>

      {/* Header row */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:sColor}} />
          <span style={{fontSize:10,letterSpacing:2,textTransform:'uppercase',
            color:sColor,fontWeight:600}}>{q.section}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:10,letterSpacing:1.5,textTransform:'uppercase',
            color:T.textLight}}>{currentIdx + 1} / {totalQ}</span>
          <button onClick={onBack} className="btn-ghost"
            style={{padding:'4px 10px',fontSize:10}}>✕</button>
        </div>
      </div>

      {/* Step dots */}
      <div style={{display:'flex',gap:5,marginBottom:24}}>
        {QUESTIONS.map((_,i) => (
          <div key={i} style={{
            flex:1, height:4, borderRadius:2, transition:'background 0.3s',
            background: i < currentIdx ? T.gold : i === currentIdx ? '#6A1B9A' : T.border
          }} />
        ))}
      </div>

      {/* Avatar */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:20}}>
        <div style={{
          width:60,height:60,borderRadius:'50%',
          background:'linear-gradient(135deg,#6A1B9A,'+T.gold+')',
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:'0 0 0 '+(isSpeaking?'14px':'6px')+' rgba(106,27,154,0.1)',
          transition:'box-shadow 0.3s',
          animation:isSpeaking?'pulse 1.5s ease infinite':'none',fontSize:22
        }}>{q.icon}</div>
        {isSpeaking && (
          <div style={{display:'flex',gap:3,alignItems:'flex-end',height:14,marginTop:8}}>
            {[0,1,2,3,4].map(i=>(
              <div key={i} style={{width:3,borderRadius:2,background:T.gold,
                animation:'waveform 0.8s ease '+(i*0.14)+'s infinite'}} />
            ))}
          </div>
        )}
      </div>

      {/* Question text */}
      <div style={{textAlign:'center',marginBottom:18,
        animation:animIn?'fadeIn 0.3s ease':'none'}}>
        <h2 style={{fontFamily:'Cormorant Garamond',fontSize:22,fontWeight:400,
          color:T.text,lineHeight:1.35,marginBottom:5}}>{q.text}</h2>
        {q.subtext && (
          <p style={{fontSize:11,color:T.textLight,fontStyle:'italic',lineHeight:1.6}}>
            {q.subtext}
          </p>
        )}
      </div>

      {/* Options */}
      <div style={{display:'flex',flexDirection:'column',gap:7,marginBottom:24}}>
        {q.options.map(opt => (
          <button key={opt.value} onClick={() => handleAnswer(opt.value)}
            style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',
              borderRadius:4,border:'1.5px solid '+T.border,background:T.surface,
              cursor:'pointer',textAlign:'left',width:'100%',fontFamily:'Jost',
              transition:'all 0.18s ease'}}
            onMouseEnter={e=>{
              e.currentTarget.style.borderColor='#6A1B9A'
              e.currentTarget.style.background='rgba(106,27,154,0.04)'
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.borderColor=T.border
              e.currentTarget.style.background=T.surface
            }}>
            <div style={{
              width:30,height:30,borderRadius:'50%',flexShrink:0,
              background:'linear-gradient(135deg,rgba(106,27,154,0.08),rgba(212,175,55,0.08))',
              border:'1px solid '+T.border,display:'flex',alignItems:'center',
              justifyContent:'center',fontSize:11,color:'#6A1B9A',fontWeight:700
            }}>{opt.value.charAt(0)}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:500,color:T.text,marginBottom:1}}>
                {opt.value}
              </div>
              {opt.desc && (
                <div style={{fontSize:10,color:T.textLight,lineHeight:1.4}}>
                  {opt.desc}
                </div>
              )}
            </div>
            <span style={{color:T.border,fontSize:14,flexShrink:0}}>›</span>
          </button>
        ))}
      </div>

      {/* Voice button */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
        <button
          onMouseDown={startListening} onTouchStart={startListening}
          onMouseUp={stopListening}   onTouchEnd={stopListening}
          style={{
            width:56,height:56,borderRadius:'50%',border:'none',
            background: isListening
              ? 'linear-gradient(135deg,#C53030,#E53E3E)'
              : 'linear-gradient(135deg,#6A1B9A,'+T.gold+')',
            color:'white',fontSize:20,cursor:'pointer',
            boxShadow: isListening
              ? '0 0 0 10px rgba(197,48,48,0.18)'
              : '0 4px 18px rgba(106,27,154,0.28)',
            transition:'all 0.3s',
            animation:isListening?'pulse 1s ease infinite':'none',
            display:'flex',alignItems:'center',justifyContent:'center'
          }}>🎤</button>
        <span style={{fontSize:10,letterSpacing:1.5,textTransform:'uppercase',
          color:isListening?'#C53030':T.textLight}}>
          {isListening ? 'Listening...' : 'Hold to speak'}
        </span>
        {transcript && (
          <div style={{background:T.surfaceAlt,border:'1px solid '+T.border,
            borderRadius:3,padding:'6px 14px',fontSize:11,color:T.textMid,
            maxWidth:280,textAlign:'center',fontStyle:'italic'}}>
            "{transcript}"
          </div>
        )}
      </div>
    </div>
  )
}


function ImageUploadPage({ onBack, onDesignReady, notify }) {
  const [preview, setPreview] = useState(null)
  const [base64Data, setBase64Data] = useState(null)
  const [mediaType, setMediaType] = useState('image/jpeg')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const fileRef = useRef()
  const cameraRef = useRef()
  const isMobile = window.innerWidth < 768

  const handleFile = (file) => {
    if (!file) return
    setMediaType(file.type || 'image/jpeg')
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      setBase64Data(e.target.result.split(',')[1])
    }
    reader.readAsDataURL(file)
  }

  const analyzeImage = async () => {
    if (!base64Data) return
    setIsAnalyzing(true)
    setResult(null)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: 1000,
          system: `You are a saree design expert and image analyst. Analyze the uploaded image. If it contains a saree or fabric, extract design details and return ONLY valid JSON: {"isSaree":true,"detectedStyle":"Kanchipuram Silk","colors":{"primary":"#8B0000","secondary":"#C9A843","accent":"#FFD700"},"patterns":{"body":"temple motifs","border":"heavy zari","pallu":"peacock design"},"fabric":"silk","occasion":"wedding","designConfig":{"primaryColor":"#8B0000","secondaryColor":"#C9A843","accentColor":"#FFD700","bodyPattern":"b6","borderPattern":"br3","palluPattern":"p3"},"similarStyles":["Kanchipuram Silk","Banarasi Bridal"],"description":"A rich red Kanchipuram silk saree..."}. Pattern IDs: body(b1-b17), border(br1-br12), pallu(p1-p12). If no saree detected, return {"isSaree":false,"message":"No saree detected"}.`,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
              { type: 'text', text: 'Analyze this image for saree design details. Extract colors, patterns, fabric, and recreate it as a digital design.' }
            ]
          }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || '{}'
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setResult(parsed)
    } catch (e) {
      notify('Could not analyze image. Please try again.', 'error')
    }
    setIsAnalyzing(false)
  }

  return (
    <div style={{maxWidth:520,margin:'0 auto',padding:'0 16px'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:32}}>
        <button onClick={onBack} className="btn-ghost" style={{padding:'6px 14px',fontSize:11}}>← Back</button>
        <h2 style={{fontFamily:'Cormorant Garamond',fontSize:24,fontWeight:400,color:T.text}}>Image Upload Mode</h2>
      </div>

      {!preview ? (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{
            border:`2px dashed ${T.border}`,borderRadius:8,
            padding:48,textAlign:'center',
            background:T.surfaceAlt,
            cursor:'pointer'
          }} onClick={() => fileRef.current.click()}>
            <div style={{fontSize:48,marginBottom:12}}>🖼️</div>
            <p style={{fontFamily:'Cormorant Garamond',fontSize:20,color:T.textMid,marginBottom:6}}>Upload a saree image</p>
            <p style={{fontSize:12,color:T.textLight}}>JPG, PNG, WEBP supported</p>
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e => handleFile(e.target.files[0])} />
          </div>

          {isMobile && (
            <div style={{display:'flex',gap:12}}>
              <button className="btn-outline" style={{flex:1}} onClick={() => fileRef.current.click()}>
                📁 Choose File
              </button>
              <button className="btn-primary" style={{flex:1}} onClick={() => cameraRef.current.click()}>
                📷 Camera
              </button>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{display:'none'}} onChange={e => handleFile(e.target.files[0])} />
            </div>
          )}

          <div style={{padding:16,background:T.surfaceAlt,borderRadius:4,border:`1px solid ${T.border}`}}>
            <p className="label-xs" style={{marginBottom:8}}>What AI will do with your image</p>
            {['🎨 Recreate the saree design on canvas', '🔍 Find similar patterns from our library', '🌈 Extract and apply the color palette'].map(t => (
              <div key={t} style={{fontSize:12,color:T.textMid,padding:'4px 0',display:'flex',alignItems:'center',gap:8}}>{t}</div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{position:'relative',borderRadius:8,overflow:'hidden',border:`1px solid ${T.border}`}}>
            <img src={preview} alt="Uploaded saree" style={{width:'100%',maxHeight:300,objectFit:'cover',display:'block'}} />
            <button
              onClick={() => { setPreview(null); setBase64Data(null); setResult(null) }}
              style={{position:'absolute',top:8,right:8,background:'rgba(0,0,0,0.6)',color:'white',border:'none',borderRadius:'50%',width:28,height:28,cursor:'pointer',fontSize:14}}>
              ✕
            </button>
          </div>

          {!result && (
            <button className="btn-primary" onClick={analyzeImage} disabled={isAnalyzing} style={{width:'100%',padding:16}}>
              {isAnalyzing ? '🔍 Analysing...' : '✨ Analyse Saree'}
            </button>
          )}

          {isAnalyzing && (
            <div style={{textAlign:'center',padding:32}}>
              <div style={{width:48,height:48,borderRadius:'50%',border:`3px solid ${T.goldLight}`,borderTopColor:T.gold,animation:'spin 1s linear infinite',margin:'0 auto 16px'}} />
              <p style={{fontFamily:'Cormorant Garamond',fontSize:18,color:T.textMid,fontStyle:'italic'}}>Analysing your saree...</p>
              <p style={{fontSize:11,color:T.textLight,marginTop:4}}>Detecting patterns, colors &amp; style</p>
            </div>
          )}

          {result && result.isSaree && (
            <div className="card fade-in" style={{padding:20}}>
              <p className="label-xs" style={{marginBottom:16}}>Analysis Complete</p>
              <h3 style={{fontFamily:'Cormorant Garamond',fontSize:22,color:T.text,marginBottom:8}}>{result.detectedStyle}</h3>
              <p style={{fontSize:13,color:T.textMid,marginBottom:16,lineHeight:1.6}}>{result.description}</p>

              {/* Color palette */}
              <div style={{marginBottom:16}}>
                <p className="label-xs" style={{marginBottom:8}}>Extracted Colors</p>
                <div style={{display:'flex',gap:8}}>
                  {result.colors && Object.entries(result.colors).map(([k,v]) => (
                    <div key={k} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:v,border:`1px solid ${T.border}`,boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}} />
                      <span style={{fontSize:9,color:T.textLight,textTransform:'capitalize'}}>{k}</span>
                    </div>
                  ))}
                </div>
              </div>

              {result.similarStyles?.length > 0 && (
                <div style={{marginBottom:16}}>
                  <p className="label-xs" style={{marginBottom:8}}>Similar Styles</p>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {result.similarStyles.map(s => <span key={s} className="chip" style={{fontSize:11}}>{s}</span>)}
                  </div>
                </div>
              )}

              <button className="btn-primary" style={{width:'100%'}} onClick={() => onDesignReady(result.designConfig)}>
                Open in Designer →
              </button>
            </div>
          )}

          {result && !result.isSaree && (
            <div style={{textAlign:'center',padding:24,background:T.surfaceAlt,borderRadius:4,border:`1px solid ${T.border}`}}>
              <p style={{fontSize:16,color:T.textMid,marginBottom:8}}>No saree detected in this image.</p>
              <p style={{fontSize:12,color:T.textLight,marginBottom:16}}>Try uploading a clearer saree photo.</p>
              <button className="btn-ghost" onClick={() => { setPreview(null); setResult(null) }}>Try Again</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onAuth, notify }) {
  const [tab, setTab] = useState('signin')
  const [role, setRole] = useState('customer')
  const [form, setForm] = useState({ email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const isMobile = window.innerWidth < 768

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Please fill all fields'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setBusy(true); setError('')
    try {
      if (tab === 'signup') {
        const r = await sb.signUp(form.email, form.password, role)
        if (r.error) {
          setError(r.error.message || 'Signup failed. Please try again.')
          setBusy(false); return
        }
        // Email confirmation is OFF - auto sign-in immediately after signup
        const r2 = await sb.signIn(form.email, form.password)
        if (r2.access_token && r2.user) {
          sessionStorage.setItem('sb_token', r2.access_token)
          sessionStorage.setItem('sb_user', JSON.stringify(r2.user))
          const assignedRole = r2.user?.user_metadata?.role || role
          onAuth(r2.user, r2.access_token, assignedRole)
          return
        }
        setTab('signin')
      } else {
        const r = await sb.signIn(form.email, form.password)
        if (r.error) {
          setError(r.error.message || 'Invalid email or password.')
          setBusy(false); return
        }
        if (!r.access_token) {
          setError('Login failed. Please check your credentials.')
          setBusy(false); return
        }
        sessionStorage.setItem('sb_token', r.access_token)
        sessionStorage.setItem('sb_user', JSON.stringify(r.user))
        const userRole = r.user?.user_metadata?.role || 'customer'
        onAuth(r.user, r.access_token, userRole)
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError('Connection error. Please check your internet and try again.')
    }
    setBusy(false)
  }

  return (
    <div style={{
      minHeight:'100vh',display:'flex',
      background:`linear-gradient(135deg,${T.bg} 0%,${T.surfaceAlt} 50%,${T.bg} 100%)`
    }}>
      {/* Left panel - desktop only */}
      {!isMobile && <div style={{
        flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        padding:40,background:`linear-gradient(135deg,#2C2416,#4A3B24)`
      }}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <div style={{fontSize:16,letterSpacing:8,color:T.goldLight,marginBottom:8,textTransform:'uppercase',fontWeight:300}}>✦ Welcome to ✦</div>
          <h1 style={{fontFamily:'Cormorant Garamond',fontSize:52,fontWeight:300,color:'#FAF8F3',lineHeight:1.1,marginBottom:8}}>
            AI Saree<br/>Designer
          </h1>
          <div style={{fontSize:11,letterSpacing:4,color:T.goldLight,textTransform:'uppercase',marginTop:12}}>Studio</div>
        </div>

        {/* Preview canvas */}
        <div style={{transform:'scale(0.85)',transformOrigin:'center'}}>
          <SareeCanvas design={{ primaryColor:'#8B0000', secondaryColor:'#F5F5DC', accentColor:'#C9A843', bodyPattern:'b6', borderPattern:'br3', palluPattern:'p6' }} />
        </div>

        <div style={{marginTop:40,textAlign:'center'}}>
          <p style={{color:'rgba(250,248,243,0.5)',fontSize:13,lineHeight:1.8,maxWidth:280}}>
            Design your dream saree with AI assistance.<br/>
            <span style={{color:T.goldLight}}>Voice-guided • Pattern library • Instant preview</span>
          </p>
        </div>
      </div>}

      {/* Right panel - auth form */}
      <div style={{
        width: isMobile ? '100%' : 440,
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        padding:40,background:T.surface,
        boxShadow: '-4px 0 40px rgba(44,36,22,0.08)'
      }}>
        {/* Mobile logo */}
        {isMobile && (
          <div style={{textAlign:'center',marginBottom:40}}>
            <div style={{fontSize:10,letterSpacing:6,color:T.gold,marginBottom:6,textTransform:'uppercase'}}>✦ Welcome to ✦</div>
            <h1 style={{fontFamily:'Cormorant Garamond',fontSize:38,fontWeight:300,color:T.text,lineHeight:1.1}}>
              AI Saree<br/>Designer
            </h1>
            <div style={{fontSize:9,letterSpacing:4,color:T.textLight,textTransform:'uppercase',marginTop:8}}>Studio</div>
          </div>
        )}

        <div style={{width:'100%',maxWidth:340}}>
          <h2 style={{fontFamily:'Cormorant Garamond',fontSize:30,fontWeight:400,color:T.text,marginBottom:6}}>
            {tab === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{fontSize:12,color:T.textLight,marginBottom:32,letterSpacing:0.3}}>
            {tab === 'signin' ? 'Sign in to continue designing' : 'Join the studio today'}
          </p>

          {/* Tabs */}
          <div style={{display:'flex',gap:0,marginBottom:28,border:`1px solid ${T.border}`,borderRadius:2,overflow:'hidden'}}>
            {['signin','signup'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex:1,padding:'10px 0',border:'none',cursor:'pointer',
                fontSize:11,letterSpacing:1.5,fontWeight:500,textTransform:'uppercase',
                background: tab===t ? `linear-gradient(135deg,${T.goldDark},${T.gold})` : T.surfaceAlt,
                color: tab===t ? 'white' : T.textMid,
                transition:'all 0.2s'
              }}>{t === 'signin' ? 'Sign In' : 'Sign Up'}</button>
            ))}
          </div>

          {/* Role selector - signup only */}
          {tab === 'signup' && (
            <div style={{marginBottom:20}}>
              <p className="label-xs" style={{marginBottom:10}}>I am a</p>
              <div style={{display:'flex',gap:10}}>
                {[{v:'customer',label:'Customer',icon:'👗',desc:'Design my saree'},{v:'designer',label:'Designer',icon:'✏️',desc:'Manage & create'}].map(r => (
                  <div key={r.v} onClick={() => setRole(r.v)} style={{
                    flex:1,padding:'12px 10px',borderRadius:4,
                    border:`1.5px solid ${role===r.v ? T.gold : T.border}`,
                    background: role===r.v ? '#FEF9EC' : T.surfaceAlt,
                    cursor:'pointer',textAlign:'center',transition:'all 0.2s'
                  }}>
                    <div style={{fontSize:22,marginBottom:4}}>{r.icon}</div>
                    <div style={{fontSize:12,fontWeight:500,color:role===r.v?T.goldDark:T.text,marginBottom:2}}>{r.label}</div>
                    <div style={{fontSize:10,color:T.textLight}}>{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <div style={{display:'flex',flexDirection:'column',gap:14,marginBottom:20}}>
            <input className="input-field" type="email" placeholder="Email address" value={form.email} onChange={e => setForm({...form,email:e.target.value})} onKeyDown={e => e.key==='Enter' && handleSubmit()} />
            <input className="input-field" type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} onKeyDown={e => e.key==='Enter' && handleSubmit()} />
          </div>

          {error && <p style={{color:T.error,fontSize:12,marginBottom:12,padding:'8px 12px',background:'#FFF5F5',borderRadius:2,border:'1px solid #FEB2B2'}}>{error}</p>}

          <button className="btn-primary" style={{width:'100%',padding:'14px 0'}} onClick={handleSubmit} disabled={busy}>
            {busy ? 'Please wait...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

          <div className="divider" style={{margin:'20px 0'}} />
          <p style={{textAlign:'center',fontSize:11,color:T.textLight,letterSpacing:0.5}}>
            Powered by <span style={{color:T.gold,fontWeight:500}}>Claude AI</span> × <span style={{color:T.gold,fontWeight:500}}>Supabase</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── CUSTOMER HOME ────────────────────────────────────────────────────────────
function CustomerHome({ user, onNavigate, templates: propTemplates, palettes: propPalettes }) {
  const name = user?.email?.split('@')[0] || 'there'
  const templates = (propTemplates && propTemplates.length > 0) ? propTemplates : SEED_TEMPLATES
  const palettes  = (propPalettes  && propPalettes.length  > 0) ? propPalettes  : SEED_PALETTES

  const BADGE_COLORS = {
    'Most Popular': { bg:'rgba(212,175,55,0.18)', color: T.goldDark },
    'Trending':     { bg:'rgba(106,27,154,0.14)', color: '#6A1B9A'  },
    'New':          { bg:'rgba(27,94,32,0.14)',   color: '#2E7D32'  },
    'Folk Art':     { bg:'rgba(230,81,0,0.14)',   color: '#E65100'  },
    'Luxury':       { bg:'rgba(21,27,84,0.14)',   color: '#1a237e'  },
    'Heritage':     { bg:'rgba(139,0,0,0.14)',    color: '#8B0000'  },
  }

  // Build design object from template + palette
  const templateDesign = (t) => {
    const pal = palettes.find(p => p.id === t.palette_id) || palettes[0]
    return {
      primaryColor:   pal?.primary_color   || '#8B0000',
      secondaryColor: pal?.secondary_color || '#F5F5DC',
      accentColor:    pal?.accent_color    || '#D4AF37',
      bodyPattern:    t.body_pattern_id,
      borderPattern:  t.border_pattern_id,
      palluPattern:   t.pallu_pattern_id,
    }
  }

  return (
    <div style={{padding:'40px 24px',maxWidth:900,margin:'0 auto'}}>

      {/* Greeting */}
      <div style={{marginBottom:40}}>
        <p className="label-xs" style={{marginBottom:6}}>Welcome back</p>
        <h1 style={{fontFamily:'Cormorant Garamond',fontSize:38,fontWeight:300,color:T.text,lineHeight:1.1}}>
          Hello, {name} <span style={{fontSize:28}}>✦</span>
        </h1>
        <p style={{fontSize:13,color:T.textMid,marginTop:8,fontStyle:'italic',fontFamily:'Cormorant Garamond'}}>
          What would you like to create today?
        </p>
      </div>

      {/* Action cards row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:44}}>
        {[
          { id:'canvas',      icon:'✏️', title:'New Design',  desc:'Live canvas',          primary:true  },
          { id:'mydesigns',   icon:'👗', title:'My Designs',  desc:'Saved drafts'                        },
          { id:'aimode',      icon:'🤖', title:'AI Mode',     desc:'Voice & prompt'                      },
          { id:'imageupload', icon:'📷', title:'Image',       desc:'Upload & recreate'                   },
        ].map((card,i) => (
          <div key={card.id} onClick={() => onNavigate(card.id)} style={{
            padding:'18px 14px',borderRadius:4,cursor:'pointer',textAlign:'center',
            background: card.primary ? `linear-gradient(135deg,${T.goldDark},${T.gold})` : T.surface,
            border: card.primary ? 'none' : `1px solid ${T.border}`,
            transition:'all 0.22s ease',
            animation:`fadeIn 0.4s ease ${i*0.07}s both`
          }}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 8px 28px rgba(44,36,22,0.14)'}}
          onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}>
            <div style={{fontSize:24,marginBottom:8}}>{card.icon}</div>
            <div style={{fontFamily:'Cormorant Garamond',fontSize:15,fontWeight:500,
              color:card.primary?'white':T.text,marginBottom:3}}>{card.title}</div>
            <div style={{fontSize:10,color:card.primary?'rgba(255,255,255,0.75)':T.textLight,
              letterSpacing:0.3}}>{card.desc}</div>
          </div>
        ))}
      </div>

      {/* Popular Templates */}
      <div style={{marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <p className="label-xs">Popular Templates</p>
        <button className="btn-ghost" onClick={() => onNavigate('canvas')}
          style={{fontSize:10,padding:'4px 10px'}}>See all →</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:40}}>
        {templates.slice(0,6).map((t,i) => {
          const design = templateDesign(t)
          const badge  = t.badge || ''
          const bc     = BADGE_COLORS[badge] || { bg:'rgba(212,175,55,0.12)', color:T.goldDark }
          return (
            <div key={t.id} onClick={() => onNavigate('canvas', design)}
              style={{
                background:T.surface,border:`1px solid ${T.border}`,
                borderRadius:4,cursor:'pointer',overflow:'hidden',
                transition:'all 0.22s ease',
                animation:`fadeIn 0.4s ease ${i*0.07}s both`
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 6px 24px rgba(44,36,22,0.12)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}>

              {/* Pattern thumbnail */}
              <div style={{height:80,overflow:'hidden',background:`radial-gradient(ellipse,${design.secondaryColor}44,${design.primaryColor}22)`}}>
                <PatternRenderer
                  patternId={t.body_pattern_id}
                  color={design.primaryColor}
                  accentColor={design.accentColor}
                  width={240} height={80}
                />
              </div>

              {/* Card body */}
              <div style={{padding:'12px 14px'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:6,marginBottom:4}}>
                  <span style={{fontFamily:'Cormorant Garamond',fontSize:15,color:T.text,
                    lineHeight:1.2,fontWeight:500}}>{t.name}</span>
                  {badge && (
                    <span style={{
                      fontSize:8,letterSpacing:0.8,textTransform:'uppercase',
                      padding:'2px 6px',borderRadius:2,whiteSpace:'nowrap',flexShrink:0,
                      background:bc.bg,color:bc.color,fontWeight:600,border:`1px solid ${bc.color}33`
                    }}>{badge}</span>
                  )}
                </div>
                <p style={{fontSize:10,color:T.textLight,lineHeight:1.45,margin:0}}>
                  {t.subtitle || t.description || ''}
                </p>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

// ─── DESIGNER CANVAS ──────────────────────────────────────────────────────────
function DesignerCanvas({ user, token, initialDesign, notify, onBack, patterns: propPatterns, palettes: propPalettes }) {
  const isMobile = window.innerWidth < 768
  const [design, setDesign] = useState(initialDesign || {
    primaryColor: '#8B0000', secondaryColor: '#F5F5DC',
    accentColor: '#C9A843', bodyPattern: 'b4',
    borderPattern: 'br1', palluPattern: 'p2'
  })
  const [designName, setDesignName] = useState('My Saree Design')
  const [activeSection, setActiveSection] = useState('body')
  const [mobileTab, setMobileTab] = useState('controls')
  const [saving, setSaving] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiResult, setAiResult] = useState(null)

  const patterns = propPatterns && propPatterns.length > 0 ? propPatterns : SEED_PATTERNS
  const palettes = propPalettes && propPalettes.length > 0 ? propPalettes : SEED_PALETTES

  const sectionPatterns = {
    body: patterns.filter(p => p.saree_part === 'body'),
    border: patterns.filter(p => p.saree_part === 'border'),
    pallu: patterns.filter(p => p.saree_part === 'pallu'),
  }

  const currentPatternKey = { body: 'bodyPattern', border: 'borderPattern', pallu: 'palluPattern' }

  const applyPalette = (pal) => setDesign(d => ({...d, primaryColor:pal.primary_color, secondaryColor:pal.secondary_color, accentColor:pal.accent_color}))

  const generateAI = async () => {
    if (!aiPrompt.trim()) return
    setIsGenerating(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type':'application/json','x-api-key':'','anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true' },
        body: JSON.stringify({
          model: CLAUDE_MODEL, max_tokens: 600,
          system: `You are a saree design AI. Return ONLY valid JSON: {"primaryColor":"#hex","secondaryColor":"#hex","accentColor":"#hex","bodyPattern":"b1","borderPattern":"br1","palluPattern":"p1","explanation":"..."} Pattern IDs body:b1-b17, border:br1-br12, pallu:p1-p12.`,
          messages: [{ role:'user', content: `Design a saree: ${aiPrompt}` }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || '{}'
      const parsed = JSON.parse(text.replace(/```json|```/g,'').trim())
      setDesign(d => ({...d,...parsed}))
      setAiResult(parsed.explanation)
    } catch { notify('AI generation failed. Try again.','error') }
    setIsGenerating(false)
  }

  const saveDesign = async () => {
    if (!user) return
    setSaving(true)
    try {
      await sb.insert('saved_designs', {
        user_id: user.id, name: designName,
        design_data: design,
        thumbnail_colors: [design.primaryColor, design.secondaryColor, design.accentColor],
        status: 'draft'
      }, token)
      notify('Design saved!', 'success')
    } catch { notify('Could not save. Try again.', 'error') }
    setSaving(false)
  }

  const exportPNG = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 400; canvas.height = 660
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = design.primaryColor; ctx.fillRect(0, 0, 400, 170)
    ctx.fillStyle = design.secondaryColor; ctx.fillRect(0, 170, 400, 22)
    ctx.fillStyle = design.primaryColor; ctx.fillRect(0, 192, 400, 420)
    ctx.fillStyle = design.secondaryColor; ctx.fillRect(0, 612, 400, 22)
    ctx.fillStyle = design.secondaryColor; ctx.fillRect(0, 634, 400, 26)
    ctx.fillStyle = design.accentColor; ctx.fillRect(0, 648, 400, 12)
    ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = 'bold 16px serif'
    ctx.fillText(designName, 20, 30)
    const link = document.createElement('a')
    link.download = `${designName.replace(/\s/g,'-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    notify('Design exported!','success')
  }

  const Controls = () => (
    <div style={{display:'flex',flexDirection:'column',gap:20,padding: isMobile?'16px 0':'0'}}>
      {/* AI Generator */}
      <div>
        <p className="label-xs" style={{marginBottom:10}}>AI Generator</p>
        <div style={{display:'flex',gap:8}}>
          <input className="input-field" style={{flex:1,fontSize:12}} placeholder="e.g. red wedding silk saree..."
            value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&generateAI()} />
          <button className="btn-primary" onClick={generateAI} disabled={isGenerating} style={{whiteSpace:'nowrap',padding:'0 14px',fontSize:11}}>
            {isGenerating?'...':'✨'}
          </button>
        </div>
        {aiResult && <p style={{fontSize:11,color:T.textMid,marginTop:8,fontStyle:'italic',lineHeight:1.5}}>{aiResult}</p>}
      </div>

      {/* Section selector */}
      <div>
        <p className="label-xs" style={{marginBottom:10}}>Edit Section</p>
        <div style={{display:'flex',gap:6}}>
          {['body','border','pallu'].map(s => (
            <button key={s} onClick={()=>setActiveSection(s)} style={{
              flex:1,padding:'8px 4px',border:`1px solid ${activeSection===s?T.gold:T.border}`,
              background:activeSection===s?'#FEF9EC':T.surfaceAlt,
              color:activeSection===s?T.goldDark:T.textMid,
              borderRadius:2,cursor:'pointer',fontSize:11,
              fontWeight:activeSection===s?500:300,
              textTransform:'capitalize',letterSpacing:0.5,
              transition:'all 0.2s'
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Pattern grid */}
      <div>
        <p className="label-xs" style={{marginBottom:10}}>Patterns - {activeSection}</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
          {sectionPatterns[activeSection].map(p => (
            <div key={p.id} onClick={()=>setDesign(d=>({...d,[currentPatternKey[activeSection]]:p.id}))}
              style={{
                borderRadius:3,overflow:'hidden',cursor:'pointer',
                border:`2px solid ${design[currentPatternKey[activeSection]]===p.id?T.gold:T.border}`,
                transition:'all 0.2s',
                boxShadow: design[currentPatternKey[activeSection]]===p.id?`0 0 0 1px ${T.goldLight}`:'none'
              }}>
              <PatternRenderer patternId={p.id} color={design.primaryColor} accentColor={design.accentColor} width={80} height={60} />
              <div style={{padding:'4px',background:T.surface,fontSize:8,textAlign:'center',color:T.textLight,letterSpacing:0.5,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{p.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Color palettes */}
      <div>
        <p className="label-xs" style={{marginBottom:10}}>Colour Palettes</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {palettes.map(pal => (
            <div key={pal.id} onClick={()=>applyPalette(pal)} style={{
              padding:'10px 12px',borderRadius:3,cursor:'pointer',
              border:`1px solid ${T.border}`,background:T.surface,
              transition:'all 0.2s'
            }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=T.gold}
            onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
              <div style={{display:'flex',gap:4,marginBottom:6}}>
                {[pal.primary_color,pal.secondary_color,pal.accent_color].map((c,i)=>(<div key={i} style={{width:16,height:16,borderRadius:'50%',background:c,border:`1px solid ${T.border}`}} />))}
              </div>
              <div style={{fontSize:10,color:T.textMid,fontWeight:400}}>{pal.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom colors */}
      <div>
        <p className="label-xs" style={{marginBottom:10}}>Custom Colors</p>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {[['primaryColor','Primary'],['secondaryColor','Secondary'],['accentColor','Accent']].map(([k,label]) => (
            <div key={k} style={{display:'flex',alignItems:'center',gap:10}}>
              <input type="color" value={design[k]} onChange={e=>setDesign(d=>({...d,[k]:e.target.value}))}
                style={{width:32,height:32,borderRadius:2,border:`1px solid ${T.border}`,cursor:'pointer',padding:2,background:'white'}} />
              <span style={{fontSize:11,color:T.textMid}}>{label}</span>
              <code style={{marginLeft:'auto',fontSize:9,color:T.textLight}}>{design[k]}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const SavePanel = () => {
    const tmplList = (palettes && palettes.length > 0)
      ? SEED_TEMPLATES
      : SEED_TEMPLATES

    const applyTemplate = (t) => {
      const pal = palettes.find(p => p.id === t.palette_id) || SEED_PALETTES[0]
      setDesign({
        primaryColor:   pal?.primary_color   || '#8B0000',
        secondaryColor: pal?.secondary_color || '#F5F5DC',
        accentColor:    pal?.accent_color    || '#D4AF37',
        bodyPattern:    t.body_pattern_id,
        borderPattern:  t.border_pattern_id,
        palluPattern:   t.pallu_pattern_id,
      })
      notify('Applied "' + t.name + '"', 'success')
    }

    // Pattern name lookup
    const PATTERN_NAMES = {
      b1:'Plain', b2:'Stripes', b3:'Checks', b4:'Floral Butta', b5:'Ikat Diamond',
      b6:'Temple Motifs', b7:'Peacock Grid', b8:'Zari Dots', b9:'Bandhani',
      b10:'Leheriya', b11:'Mughal Arch', b12:'Geometric', b13:'Lotus',
      b14:'Warli', b15:'Kashmiri', b16:'Pinstripe', b17:'Meenakari',
      br1:'Single Kasavu', br2:'Double Kasavu', br3:'Temple', br4:'Mango',
      br5:'Peacock', br6:'Broad Zari', br7:'Thin Gold', br8:'Floral Chain',
      br9:'Geo Steps', br10:'Wave', br11:'Diamond', br12:'Lotus Row',
      p1:'Rich Zari', p2:'Contrast', p3:'Peacock', p4:'Floral', p5:'Minimal',
      p6:'Temple Arch', p7:'Mughal Garden', p8:'Butta Scatter', p9:'Stripe',
      p10:'Vines', p11:'Kashmiri', p12:'Geometric',
    }

    return (
      <div style={{display:'flex',flexDirection:'column',gap:14,padding:isMobile?'16px 0':'0'}}>

        {/* Design name */}
        <div>
          <p className="label-xs" style={{marginBottom:7}}>Design Name</p>
          <input className="input-field" value={designName}
            onChange={e=>setDesignName(e.target.value)} placeholder="My Saree Design" />
        </div>

        {/* Save / Export */}
        <button className="btn-primary" style={{width:'100%'}} onClick={saveDesign} disabled={saving}>
          {saving ? 'Saving...' : '✦ Save to Supabase'}
        </button>
        <button className="btn-outline" style={{width:'100%'}} onClick={exportPNG}>↓ Export PNG</button>

        {/* Sync status */}
        <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 10px',
          borderRadius:3,background:'rgba(27,94,32,0.08)',border:'1px solid rgba(27,94,32,0.2)'}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:'#4CAF50',flexShrink:0}} />
          <span style={{fontSize:9,letterSpacing:1.5,textTransform:'uppercase',
            color:'#2E7D32',fontWeight:500}}>Saves sync to Supabase</span>
        </div>

        <div className="divider" />

        {/* Current design summary */}
        <div>
          <p className="label-xs" style={{marginBottom:10}}>Current Design</p>
          <div style={{display:'flex',flexDirection:'column',gap:5,
            background:T.surfaceAlt,borderRadius:3,padding:'10px 12px',
            border:`1px solid ${T.border}`}}>
            {[
              { label:'BODY',   value: PATTERN_NAMES[design.bodyPattern]   || design.bodyPattern   },
              { label:'BORDER', value: PATTERN_NAMES[design.borderPattern] || design.borderPattern },
              { label:'PALLU',  value: PATTERN_NAMES[design.palluPattern]  || design.palluPattern  },
            ].map(row => (
              <div key={row.label}>
                <div style={{fontSize:8,letterSpacing:1.5,textTransform:'uppercase',
                  color:T.textLight,marginBottom:1}}>{row.label}</div>
                <div style={{fontSize:12,fontWeight:500,color:T.text}}>{row.value}</div>
              </div>
            ))}
            <div style={{display:'flex',gap:5,marginTop:6}}>
              {[design.primaryColor,design.secondaryColor,design.accentColor].map((c,i)=>(
                <div key={i} style={{flex:1,height:18,borderRadius:2,background:c,
                  border:`1px solid ${T.border}`}} />
              ))}
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Quick Templates */}
        <div>
          <p className="label-xs" style={{marginBottom:10}}>Quick Templates</p>
          <div style={{display:'flex',flexDirection:'column',gap:5}}>
            {tmplList.map(t => (
              <button key={t.id} onClick={() => applyTemplate(t)}
                style={{
                  width:'100%',padding:'9px 12px',borderRadius:3,
                  border:`1px solid ${T.border}`,background:T.surfaceAlt,
                  cursor:'pointer',textAlign:'left',fontFamily:'Jost',
                  fontSize:11,color:T.text,fontWeight:400,
                  transition:'all 0.18s ease'
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.background='rgba(212,175,55,0.06)';e.currentTarget.style.color=T.goldDark}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.surfaceAlt;e.currentTarget.style.color=T.text}}>
                {t.name}
              </button>
            ))}
          </div>
        </div>

      </div>
    )
  }

  if (isMobile) {
    return (
      <div style={{display:'flex',flexDirection:'column',height:'100vh',background:T.bg}}>
        {/* Top bar */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',background:T.surface,borderBottom:`1px solid ${T.border}`}}>
          <button onClick={onBack} className="btn-ghost" style={{padding:'5px 10px',fontSize:10}}>← Home</button>
          <span style={{fontFamily:'Cormorant Garamond',fontSize:16,color:T.text}}>Designer</span>
          <button className="btn-ghost" style={{padding:'5px 10px',fontSize:10}} onClick={saveDesign}>{saving?'...':'Save'}</button>
        </div>

        {/* Canvas - top 42% */}
        <div style={{height:'42%',display:'flex',alignItems:'center',justifyContent:'center',background:`radial-gradient(ellipse at center,${T.surfaceAlt},${T.bg})`,padding:12,position:'relative'}}>
          {isGenerating && (
            <div style={{position:'absolute',inset:0,background:'rgba(250,248,243,0.85)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:10}}>
              <div style={{width:32,height:32,borderRadius:'50%',border:`2px solid ${T.goldLight}`,borderTopColor:T.gold,animation:'spin 1s linear infinite',marginBottom:8}} />
              <span style={{fontSize:11,color:T.textMid}}>Generating...</span>
            </div>
          )}
          <SareeCanvas design={design} scale={0.62} />
          <div style={{position:'absolute',bottom:8,left:'50%',transform:'translateX(-50%)',display:'flex',gap:5}}>
            {[design.primaryColor,design.secondaryColor,design.accentColor].map((c,i)=>(
              <div key={i} style={{width:10,height:10,borderRadius:'50%',background:c,border:`1px solid ${T.border}`}} />
            ))}
          </div>
        </div>

        {/* Bottom tabs */}
        <div style={{display:'flex',background:T.surface,borderTop:`1px solid ${T.border}`}}>
          {[['controls','✦ Design'],['save','↓ Save']].map(([t,l]) => (
            <button key={t} onClick={()=>setMobileTab(t)} style={{
              flex:1,padding:'10px 0',border:'none',cursor:'pointer',
              background:'transparent',fontSize:10,letterSpacing:1.5,
              fontWeight:mobileTab===t?500:300,textTransform:'uppercase',
              color:mobileTab===t?T.gold:T.textMid,
              borderTop:`2px solid ${mobileTab===t?T.gold:'transparent'}`,
              transition:'all 0.2s'
            }}>{l}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:'auto',padding:'0 16px 100px'}}>
          {mobileTab==='controls' ? Controls() : SavePanel()}
        </div>
      </div>
    )
  }

  // Desktop 3-panel
  return (
    <div style={{display:'flex',height:'100vh',background:T.bg}}>
      {/* Left */}
      <div style={{width:280,overflowY:'auto',padding:24,background:T.surface,borderRight:`1px solid ${T.border}`}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:24}}>
          <button onClick={onBack} className="btn-ghost" style={{padding:'5px 12px',fontSize:10}}>← Back</button>
          <span style={{fontFamily:'Cormorant Garamond',fontSize:16,color:T.text}}>Canvas</span>
        </div>
        {Controls()}
      </div>

      {/* Center */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',background:`radial-gradient(ellipse at center,${T.surfaceAlt} 0%,${T.bg} 70%)`,position:'relative'}}>
        {isGenerating && (
          <div style={{position:'absolute',inset:0,background:'rgba(250,248,243,0.8)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:10}}>
            <div style={{width:48,height:48,borderRadius:'50%',border:`3px solid ${T.goldLight}`,borderTopColor:T.gold,animation:'spin 1s linear infinite',marginBottom:12}} />
            <span style={{fontFamily:'Cormorant Garamond',fontSize:20,color:T.textMid,fontStyle:'italic'}}>AI is creating...</span>
          </div>
        )}
        <SareeCanvas design={design} scale={1.1} />
      </div>

      {/* Right */}
      <div style={{width:220,overflowY:'auto',padding:24,background:T.surface,borderLeft:`1px solid ${T.border}`}}>
        {SavePanel()}
      </div>
    </div>
  )
}


// ─── EXPORTS ──────────────────────────────────────────────────────────────────
export {
  PatternRenderer,
  SareeCanvas,
  Notification,
  VoiceQuestionnaire,
  ImageUploadPage,
  AuthPage,
  CustomerHome,
  DesignerCanvas,
}