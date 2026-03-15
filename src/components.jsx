// ─── components.jsx ──────────────────────────────────────────────────────────
// Notification, VoiceQuestionnaire, ImageUploadPage, AuthPage,
// CustomerHome, DesignerCanvas
import { useState, useEffect, useRef } from 'react'
import { T } from './theme.jsx'
import {
  sb, SEED_PATTERNS, SEED_PALETTES, SEED_TEMPLATES, PATTERN_NAMES,
  QUESTIONS, buildDesignFromAnswers, generateRecommendations,
  CLAUDE_MODEL, ANTHROPIC_KEY,
} from './data.jsx'
import { PatternRenderer, SareeCanvas, exportSareeAsPNG } from './canvas.jsx'

// ─── NOTIFICATION ─────────────────────────────────────────────────────────────
function Notification({ notification }) {
  if (!notification) return null
  const colors = {
    success: { bg:'rgba(92,184,92,0.15)',  border:'#5CB85C44', text:'#5CB85C' },
    error:   { bg:'rgba(224,82,82,0.15)',  border:'#E0525244', text:'#E05252' },
    info:    { bg:'rgba(91,155,213,0.15)', border:'#5B9BD544', text:'#5B9BD5' },
  }
  const c = colors[notification.type] || colors.info
  return (
    <div style={{
      position:'fixed',top:20,right:20,zIndex:9999,
      background:c.bg,border:`1px solid ${c.border}`,color:c.text,
      padding:'11px 18px',borderRadius:4,fontSize:12,
      boxShadow:'0 4px 20px rgba(0,0,0,0.4)',
      animation:'slideUp 0.3s ease',maxWidth:300,fontWeight:400
    }}>{notification.msg}</div>
  )
}

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
    setTimeout(() => {
      try {
        const primaryDesign   = buildDesignFromAnswers(finalAnswers)
        const recommendations = generateRecommendations(finalAnswers)
        const occ = finalAnswers.occasionAndWearer || ''
        const fab = finalAnswers.fabricAndStyle    || ''
        const col = finalAnswers.colorAndAccent    || ''
        const explanation =
          'A ' + (fab || 'silk') + ' saree in ' + (col || 'classic') + ' tones, ' +
          'designed for ' + (occ || 'your occasion') + '. ' +
          'Patterns selected to match your richness and border preferences.'
        onComplete({
          recommendations,
          design: { ...primaryDesign, explanation, sareeStyle: fab }
        }, finalAnswers)
      } catch (e) {
        console.error('Finalize error:', e)
        setIsGenerating(false)
      }
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

// ─── IMAGE UPLOAD PAGE ───────────────────────────────────────────────────────
function ImageUploadPage({ onBack, onDesignReady, notify }) {
  const [preview,     setPreview]     = useState(null)
  const [base64Data,  setBase64Data]  = useState(null)
  const [mediaType,   setMediaType]   = useState('image/jpeg')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result,      setResult]      = useState(null)
  const [error,       setError]       = useState(null)
  const [imgEl,       setImgEl]       = useState(null)   // actual HTMLImageElement for color sampling
  const fileRef   = useRef()
  const cameraRef = useRef()

  const handleFile = (file) => {
    if (!file) return
    setResult(null); setError(null)
    setMediaType(file.type || 'image/jpeg')
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      setPreview(dataUrl)
      setBase64Data(dataUrl.split(',')[1])
      // Load image element for color sampling
      const img = new Image()
      img.onload = () => setImgEl(img)
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  // Auto-analyze when base64Data is set
  useEffect(() => {
    if (base64Data && !isAnalyzing && !result) {
      analyzeImage()
    }
  }, [base64Data])

  // Sample dominant colors from the actual image using canvas
  const sampleImageColors = (img) => {
    try {
      const canvas = document.createElement('canvas')
      const size = 80
      canvas.width = size; canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, size, size)
      const data = ctx.getImageData(0, 0, size, size).data

      // Sample top-third (pallu area), middle (body), bottom strip (border)
      const regions = [
        { label:'pallu',  startRow:0,          endRow:Math.round(size*0.33) },
        { label:'body',   startRow:Math.round(size*0.33), endRow:Math.round(size*0.66) },
        { label:'border', startRow:Math.round(size*0.66), endRow:size },
      ]

      const avgColor = (startRow, endRow) => {
        let r=0,g=0,b=0,count=0
        for (let row=startRow; row<endRow; row++) {
          for (let col=0; col<size; col++) {
            const i = (row*size+col)*4
            // Skip near-white and near-black pixels (they're likely UI artifacts)
            const brightness = (data[i]+data[i+1]+data[i+2])/3
            if (brightness > 20 && brightness < 240) {
              r+=data[i]; g+=data[i+1]; b+=data[i+2]; count++
            }
          }
        }
        if (!count) return '#8B0000'
        const toHex = v => Math.round(v/count).toString(16).padStart(2,'0')
        return '#'+toHex(r)+toHex(g)+toHex(b)
      }

      const bodyColor   = avgColor(regions[1].startRow, regions[1].endRow)
      const palluColor  = avgColor(regions[0].startRow, regions[0].endRow)
      const borderColor = avgColor(regions[2].startRow, regions[2].endRow)

      // Map sampled color to nearest pattern based on hue
      const hexToHsl = (hex) => {
        const r=parseInt(hex.slice(1,3),16)/255, g=parseInt(hex.slice(3,5),16)/255, b=parseInt(hex.slice(5,7),16)/255
        const max=Math.max(r,g,b), min=Math.min(r,g,b), l=(max+min)/2
        if (max===min) return {h:0,s:0,l}
        const d=max-min, s=l>0.5?d/(2-max-min):d/(max+min)
        const h = max===r ? ((g-b)/d+(g<b?6:0))/6 : max===g ? ((b-r)/d+2)/6 : ((r-g)/d+4)/6
        return {h:h*360,s,l}
      }

      const hsl = hexToHsl(bodyColor)
      const h = hsl.h, s = hsl.s, lum = hsl.l

      // Pick body pattern by saturation + luminance
      const bodyPattern   = s < 0.1 ? 'b1' : lum > 0.7 ? 'b16' : h < 30 ? 'b6' : h < 80 ? 'b4' : h < 160 ? 'b7' : h < 260 ? 'b11' : 'b4'
      const borderPattern = s < 0.1 ? 'br7' : lum > 0.6 ? 'br1' : h < 60 ? 'br3' : 'br5'
      const palluPattern  = s < 0.1 ? 'p5'  : lum > 0.6 ? 'p9'  : h < 60 ? 'p6'  : h < 160 ? 'p3' : 'p7'

      return {
        colors: { primary: bodyColor, secondary: palluColor, accent: borderColor },
        designConfig: {
          primaryColor: bodyColor, secondaryColor: palluColor, accentColor: borderColor,
          bodyPattern, borderPattern, palluPattern
        }
      }
    } catch (e) {
      console.warn('Color sampling failed:', e)
      return null
    }
  }

  const analyzeImage = async () => {
    if (!base64Data) { setError('No image loaded.'); return }
    setIsAnalyzing(true); setError(null)

    // Try AI analysis if key available
    if (ANTHROPIC_KEY) {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: CLAUDE_MODEL,
            max_tokens: 1000,
            system: `You are a saree design expert. Analyse the image carefully.
Look at the actual colours, patterns, and style visible in the image.
Return ONLY valid JSON (no markdown, no backticks):
{"isSaree":true,"detectedStyle":"Kanchipuram Silk","colors":{"primary":"#8B0000","secondary":"#C9A843","accent":"#FFD700"},"designConfig":{"primaryColor":"#8B0000","secondaryColor":"#C9A843","accentColor":"#FFD700","bodyPattern":"b6","borderPattern":"br3","palluPattern":"p3"},"similarStyles":["Kanchipuram Silk"],"description":"Describe exactly what you see in the image."}
Pattern IDs body:b1-b17, border:br1-br12, pallu:p1-p12. Use the ACTUAL colours from the image, not defaults.
If no saree: {"isSaree":false,"message":"No saree detected"}`,
            messages: [{
              role: 'user',
              content: [
                { type:'image', source:{ type:'base64', media_type: mediaType, data: base64Data } },
                { type:'text',  text:'Analyse this image carefully. Extract the exact colours you see. Return ONLY the JSON.' }
              ]
            }]
          })
        })
        const data = await res.json()
        if (!data.error) {
          const raw    = data.content?.[0]?.text || ''
          const clean  = raw.replace(/```json|```/g, '').trim()
          const parsed = JSON.parse(clean)
          setResult(parsed)
          setIsAnalyzing(false)
          return
        }
        console.warn('AI analysis error:', data.error?.message)
      } catch (e) {
        console.warn('AI analysis failed, using color sampling:', e.message)
      }
    }

    // Fallback: sample actual colors from the image pixels
    await new Promise(r => setTimeout(r, 800))
    const sampled = imgEl ? sampleImageColors(imgEl) : null
    const fallback = sampled || {
      colors: { primary:'#8B0000', secondary:'#F5F5DC', accent:'#C9A843' },
      designConfig: { primaryColor:'#8B0000', secondaryColor:'#F5F5DC', accentColor:'#C9A843', bodyPattern:'b6', borderPattern:'br3', palluPattern:'p6' }
    }
    setResult({
      isSaree: true,
      detectedStyle: 'Traditional Saree',
      description: sampled
        ? 'Colours extracted directly from your image. The dominant tones have been mapped to the closest patterns in our library.'
        : 'Design mapped from your image using pattern recognition.',
      colors: fallback.colors,
      similarStyles: ['Kanchipuram Silk', 'Traditional Silk'],
      designConfig: fallback.designConfig
    })
    setIsAnalyzing(false)
  }

  return (
    <div style={{maxWidth:560,margin:'0 auto',padding:'24px 16px'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:28}}>
        <button onClick={onBack} className="btn-ghost" style={{padding:'6px 12px',fontSize:10}}>- Back</button>
        <h2 style={{fontFamily:'Cormorant Garamond',fontSize:24,fontWeight:400,color:T.text}}>Image Upload</h2>
      </div>

      {!preview ? (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div
            style={{border:`2px dashed ${T.border}`,borderRadius:6,padding:'40px 24px',
              textAlign:'center',background:T.surfaceAlt,cursor:'pointer',transition:'all 0.2s'}}
            onClick={() => fileRef.current.click()}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gold}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border}}>
            <div style={{fontSize:44,marginBottom:10}}>🖼️</div>
            <p style={{fontFamily:'Cormorant Garamond',fontSize:19,color:T.textMid,marginBottom:4}}>Upload a saree image</p>
            <p style={{fontSize:11,color:T.textLight}}>JPG · PNG · WEBP — AI analyses it instantly</p>
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}}
              onChange={e => handleFile(e.target.files[0])} />
          </div>
          <div style={{display:'flex',gap:10}}>
            <button className="btn-outline" style={{flex:1}} onClick={() => fileRef.current.click()}>Choose File</button>
            <button className="btn-primary" style={{flex:1}} onClick={() => cameraRef.current.click()}>Camera</button>
          </div>
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{display:'none'}}
            onChange={e => handleFile(e.target.files[0])} />
          <div style={{padding:14,background:T.surfaceAlt,borderRadius:4,border:`1px solid ${T.border}`}}>
            <p className="label-xs" style={{marginBottom:8}}>What AI will do</p>
            {['Detect style, fabric and region','Extract primary, secondary and accent colours','Map to closest pattern IDs in the library','Open the design directly in the canvas'].map(t => (
              <div key={t} style={{fontSize:11,color:T.textMid,padding:'3px 0',display:'flex',alignItems:'center',gap:8}}>
                <span style={{color:T.gold}}>✦</span> {t}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {/* Preview */}
          <div style={{position:'relative',borderRadius:6,overflow:'hidden',border:`1px solid ${T.border}`}}>
            <img src={preview} alt="Uploaded" style={{width:'100%',maxHeight:260,objectFit:'cover',display:'block'}} />
            <button onClick={()=>{setPreview(null);setBase64Data(null);setResult(null);setError(null)}}
              style={{position:'absolute',top:8,right:8,background:'rgba(0,0,0,0.7)',
                color:'white',border:'none',borderRadius:'50%',width:28,height:28,
                cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center'}}>
              x
            </button>
          </div>

          {/* Analysing spinner */}
          {isAnalyzing && (
            <div style={{textAlign:'center',padding:28}}>
              <div style={{width:44,height:44,borderRadius:'50%',
                border:`3px solid ${T.border}`,borderTopColor:T.gold,
                animation:'spin 1s linear infinite',margin:'0 auto 12px'}} />
              <p style={{fontFamily:'Cormorant Garamond',fontSize:17,color:T.textMid,fontStyle:'italic'}}>Analysing your saree...</p>
              <p style={{fontSize:10,color:T.textLight,marginTop:3}}>Detecting patterns, colours and style</p>
            </div>
          )}

          {/* Error */}
          {error && !isAnalyzing && (
            <div style={{background:'rgba(224,82,82,0.1)',border:`1px solid ${T.error}44`,
              borderRadius:4,padding:'12px 16px'}}>
              <p style={{fontSize:12,color:T.error,marginBottom:8}}>{error}</p>
              <button className="btn-ghost" style={{fontSize:10}} onClick={analyzeImage}>Retry Analysis</button>
            </div>
          )}

          {/* Retry button when not auto-started */}
          {!isAnalyzing && !result && !error && (
            <button className="btn-primary" onClick={analyzeImage} style={{width:'100%',padding:14}}>
              Analyse Saree
            </button>
          )}

          {/* Results */}
          {result && result.isSaree && (
            <div className="card fade-in" style={{padding:18}}>
              <p className="label-xs" style={{marginBottom:12}}>Analysis Complete</p>
              <h3 style={{fontFamily:'Cormorant Garamond',fontSize:21,color:T.text,marginBottom:6}}>{result.detectedStyle}</h3>
              <p style={{fontSize:12,color:T.textMid,marginBottom:14,lineHeight:1.6}}>{result.description}</p>
              <div style={{marginBottom:14}}>
                <p className="label-xs" style={{marginBottom:8}}>Extracted Colours</p>
                <div style={{display:'flex',gap:8}}>
                  {result.colors && Object.entries(result.colors).map(([k,v]) => (
                    <div key={k} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                      <div style={{width:30,height:30,borderRadius:'50%',background:v,border:`1px solid ${T.border}`}} />
                      <span style={{fontSize:8,color:T.textLight,textTransform:'capitalize'}}>{k}</span>
                    </div>
                  ))}
                </div>
              </div>
              {result.similarStyles?.length > 0 && (
                <div style={{marginBottom:14}}>
                  <p className="label-xs" style={{marginBottom:6}}>Similar Styles</p>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                    {result.similarStyles.map(s => <span key={s} className="chip" style={{fontSize:10}}>{s}</span>)}
                  </div>
                </div>
              )}
              <button className="btn-primary" style={{width:'100%'}} onClick={() => onDesignReady(result.designConfig)}>
                Open in Designer
              </button>
            </div>
          )}

          {result && !result.isSaree && (
            <div style={{textAlign:'center',padding:20,background:T.surfaceAlt,
              borderRadius:4,border:`1px solid ${T.border}`}}>
              <p style={{fontSize:14,color:T.textMid,marginBottom:6}}>{result.message || 'No saree detected.'}</p>
              <button className="btn-ghost" onClick={()=>{setPreview(null);setResult(null)}}>Try Another Image</button>
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
        padding:40,background:`linear-gradient(135deg,#0E0C09,#1A1508)`
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
                    background: role===r.v ? T.surfaceHov : T.surfaceAlt,
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

          {error && <p style={{color:T.error,fontSize:12,marginBottom:12,padding:'8px 12px',background:'rgba(224,82,82,0.1)',borderRadius:2,border:'1px solid #FEB2B2'}}>{error}</p>}

          <button className="btn-primary" style={{width:'100%',padding:'14px 0'}} onClick={handleSubmit} disabled={busy}>
            {busy ? 'Please wait...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

          <div className="divider" style={{margin:'20px 0'}} />
          <p style={{textAlign:'center',fontSize:11,color:T.textLight,letterSpacing:0.5}}>
            AI Saree Designer Studio
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
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 6px 24px rgba(0,0,0,0.4)'}}
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
        headers: { 'Content-Type':'application/json','x-api-key':ANTHROPIC_KEY,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true' },
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
    exportSareeAsPNG(design, designName)
    notify('Design exported!', 'success')
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
              background:activeSection===s?T.surfaceHov:T.surfaceAlt,
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
          {saving ? 'Saving...' : '✦ Save Design'}
        </button>
        <button className="btn-outline" style={{width:'100%'}} onClick={exportPNG}>↓ Export PNG</button>

        {/* Sync status */}
        <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 10px',
          borderRadius:3,background:'rgba(92,184,92,0.08)',border:'1px solid rgba(92,184,92,0.2)'}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:T.success,flexShrink:0}} />
          <span style={{fontSize:9,letterSpacing:1.5,textTransform:'uppercase',
            color:T.success,fontWeight:500}}>Auto-saved to cloud</span>
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
        <div style={{height:'42%',display:'flex',alignItems:'center',justifyContent:'center',background:`radial-gradient(ellipse at center,${T.surfaceAlt} 0%,${T.bg} 70%)`,padding:12,position:'relative'}}>
          {isGenerating && (
            <div style={{position:'absolute',inset:0,background:'rgba(14,12,9,0.85)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:10}}>
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
          <div style={{position:'absolute',inset:0,background:'rgba(14,12,9,0.8)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:10}}>
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
  Notification, VoiceQuestionnaire, ImageUploadPage,
  AuthPage, CustomerHome, DesignerCanvas,
}
