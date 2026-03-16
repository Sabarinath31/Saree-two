// ─── pages.jsx ───────────────────────────────────────────────────────────────
// AIModePage, MyDesignsPage, DesignerDashboard, TopNav
import { useState, useEffect } from 'react'
import { T } from './theme.jsx'
import { sb, SEED_PATTERNS, SEED_PALETTES, SEED_TEMPLATES, CLAUDE_MODEL, ANTHROPIC_KEY } from './data.jsx'
import { PatternRenderer, SareeCanvas } from './canvas.jsx'
import { VoiceQuestionnaire } from './components.jsx'

// ─── AI MODE PAGE ─────────────────────────────────────────────────────────────
function AIModePage({ onBack, onDesignReady, notify }) {
  const [mode, setMode] = useState('choose') // choose | questionnaire | prompt | results
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState(null)
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState(null)
  const [activeRec, setActiveRec] = useState(0)

  // Fallback: derive a design from keywords in the prompt text
  const promptFallback = (text) => {
    const t = text.toLowerCase()
    const primaryColor   = t.includes('blue') ? '#191970' : t.includes('green') ? '#006400' : t.includes('white') || t.includes('cream') ? '#F5F5DC' : t.includes('pink') ? '#C2185B' : t.includes('black') ? '#1A1A1A' : t.includes('yellow') || t.includes('mustard') ? '#B8860B' : '#8B0000'
    const secondaryColor = primaryColor === '#F5F5DC' ? '#C9A843' : '#F5F5DC'
    const accentColor    = '#C9A843'
    const bodyPattern    = t.includes('peacock') ? 'b7' : t.includes('mughal') || t.includes('banarasi') ? 'b11' : t.includes('temple') || t.includes('kanchipuram') ? 'b6' : t.includes('floral') ? 'b4' : t.includes('checks') || t.includes('cotton') ? 'b3' : t.includes('plain') || t.includes('linen') ? 'b1' : 'b4'
    const borderPattern  = t.includes('bridal') || t.includes('wedding') ? 'br6' : t.includes('temple') ? 'br3' : t.includes('minimal') || t.includes('office') ? 'br7' : 'br3'
    const palluPattern   = t.includes('bridal') || t.includes('wedding') ? 'p1' : t.includes('peacock') ? 'p3' : t.includes('minimal') ? 'p5' : 'p4'
    return { primaryColor, secondaryColor, accentColor, bodyPattern, borderPattern, palluPattern, explanation: 'Design generated from your description.' }
  }

  const generateFromPrompt = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    try {
      // Try AI first
      if (ANTHROPIC_KEY) {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type':'application/json','x-api-key':ANTHROPIC_KEY,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true' },
          body: JSON.stringify({
            model: CLAUDE_MODEL, max_tokens: 800,
            system: `Saree design expert. Return ONLY valid JSON with no markdown: {"recommendations":[{"name":"...","description":"...","matchScore":90,"design":{"primaryColor":"#hex","secondaryColor":"#hex","accentColor":"#hex","bodyPattern":"b6","borderPattern":"br3","palluPattern":"p6"}}],"design":{"primaryColor":"#hex","secondaryColor":"#hex","accentColor":"#hex","bodyPattern":"b1","borderPattern":"br1","palluPattern":"p1","explanation":"..."}}. Pattern IDs: body b1-b17, border br1-br12, pallu p1-p12.`,
            messages: [{ role:'user', content: `Design a saree based on: ${prompt}` }]
          })
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error.message || 'API error')
        const text   = data.content?.[0]?.text || ''
        const clean  = text.replace(/```json|```/g,'').trim()
        const parsed = JSON.parse(clean)
        // Ensure each recommendation has a design object
        if (parsed.recommendations) {
          parsed.recommendations = parsed.recommendations.map(r => ({
            ...r,
            design: r.design || parsed.design || promptFallback(prompt)
          }))
        }
        setResults(parsed)
        setIsGenerating(false)
        setMode('results')
        return
      }
    } catch (e) {
      console.warn('AI generation failed, using fallback:', e.message)
    }
    // Fallback: keyword-based design (no API needed)
    const fallbackDesign = promptFallback(prompt)
    setResults({
      design: fallbackDesign,
      recommendations: [
        { name: 'Your Design',         score: 90, budget: '₹10K–₹40K', description: 'Generated from your description.',           design: fallbackDesign },
        { name: 'Classic Alternative', score: 80, budget: '₹15K–₹50K', description: 'A heritage variant of your chosen style.',  design: { ...fallbackDesign, bodyPattern:'b6', borderPattern:'br3', palluPattern:'p6' } },
        { name: 'Modern Variant',      score: 72, budget: '₹8K–₹25K',  description: 'A lighter, contemporary interpretation.',   design: { ...fallbackDesign, bodyPattern:'b2', borderPattern:'br7', palluPattern:'p5' } },
      ]
    })
    setIsGenerating(false)
    setMode('results')
  }

  const handleQuestionnaireComplete = (result, answers) => {
    setQuestionnaireAnswers(answers)
    setResults(result)
    setActiveRec(0)
    setMode('results')
  }

  if (mode === 'questionnaire') {
    return (
      <div style={{minHeight:'100dvh',background:T.bg,padding:'32px 20px'}}>
        <VoiceQuestionnaire onComplete={handleQuestionnaireComplete} onBack={()=>setMode('choose')} />
      </div>
    )
  }

  // Loading screen while prompt is generating
  if (isGenerating) {
    return (
      <div style={{minHeight:'100dvh',background:T.bg,display:'flex',flexDirection:'column',
        alignItems:'center',justifyContent:'center',gap:20,padding:40}}>
        <div style={{position:'relative',width:72,height:72}}>
          <div style={{position:'absolute',inset:0,borderRadius:'50%',
            border:'3px solid '+T.border,borderTopColor:T.gold,
            animation:'spin 1s linear infinite'}} />
          <div style={{position:'absolute',inset:10,display:'flex',alignItems:'center',
            justifyContent:'center',fontSize:26}}>🧵</div>
        </div>
        <div style={{textAlign:'center'}}>
          <p style={{fontFamily:'Cormorant Garamond',fontSize:24,color:T.text,
            fontStyle:'italic',marginBottom:6}}>Designing your saree...</p>
          <p style={{fontSize:11,color:T.textLight,letterSpacing:1.5,textTransform:'uppercase'}}>
            Analysing your prompt
          </p>
        </div>
      </div>
    )
  }

  if (mode === 'results' && results) {
    const recs = results.recommendations || []
    const shownDesign = recs[activeRec]?.design || results.design

    return (
      <div style={{maxWidth:600,margin:'0 auto',padding:'28px 16px 48px'}}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
          <button onClick={()=>setMode('choose')} className="btn-ghost"
            style={{padding:'6px 12px',fontSize:10}}>← Back</button>
          <div>
            <h2 style={{fontFamily:'Cormorant Garamond',fontSize:24,fontWeight:400,
              color:T.text,lineHeight:1}}>Your Design</h2>
            <p style={{fontSize:10,color:T.textLight,letterSpacing:1.5,
              textTransform:'uppercase',marginTop:2}}>
              {recs.length > 0 ? recs.length + ' styles generated for you' : 'AI Generated'}
            </p>
          </div>
        </div>

        {/* Live canvas preview — updates with selected rec */}
        <div style={{display:'flex',justifyContent:'center',marginBottom:20,
          background:'radial-gradient(ellipse at center,'+T.surfaceAlt+','+T.bg+')',
          borderRadius:6,padding:'24px 16px',border:'1px solid '+T.border}}>
          <SareeCanvas design={shownDesign || results.design} scale={0.88} />
        </div>

        {/* Explanation */}
        {(recs[activeRec]?.description || results.design?.explanation) && (
          <div style={{background:T.surfaceAlt,border:'1px solid '+T.border,
            borderRadius:4,padding:'12px 16px',marginBottom:20}}>
            <p style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',
              color:T.textLight,marginBottom:5}}>Design Notes</p>
            <p style={{fontSize:13,color:T.textMid,lineHeight:1.7,fontStyle:'italic',
              fontFamily:'Cormorant Garamond'}}>
              {recs[activeRec]?.description || results.design?.explanation}
            </p>
          </div>
        )}

        {/* Recommendations with clickable preview */}
        {recs.length > 0 && (
          <div style={{marginBottom:24}}>
            <p style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',
              color:T.textLight,marginBottom:12}}>Recommended Styles — tap to preview</p>

            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {recs.map((r,i) => {
                const isActive = i === activeRec
                const score = r.score || r.matchScore || 0
                // colour based on score
                const scoreColor = score >= 90 ? '#2E7D32' : score >= 80 ? '#E65100' : '#6A1B9A'
                return (
                  <button key={i} onClick={() => setActiveRec(i)}
                    style={{
                      display:'flex',alignItems:'center',gap:14,
                      padding:'14px 16px',borderRadius:5,width:'100%',textAlign:'left',
                      border: isActive ? '2px solid '+T.gold : '1.5px solid '+T.border,
                      background: isActive ? 'rgba(201,168,67,0.06)' : T.surface,
                      cursor:'pointer',fontFamily:'Jost',transition:'all 0.2s',
                      boxShadow: isActive ? '0 2px 12px rgba(201,168,67,0.18)' : 'none'
                    }}>

                    {/* Score circle */}
                    <div style={{
                      width:48,height:48,borderRadius:'50%',flexShrink:0,
                      background: isActive
                        ? 'linear-gradient(135deg,'+T.goldDark+','+T.gold+')'
                        : T.surfaceAlt,
                      display:'flex',flexDirection:'column',alignItems:'center',
                      justifyContent:'center',transition:'background 0.2s'
                    }}>
                      <span style={{fontSize:14,fontWeight:700,
                        color: isActive ? 'white' : scoreColor,lineHeight:1}}>
                        {score}
                      </span>
                      <span style={{fontSize:8,color: isActive ? 'rgba(255,255,255,0.8)' : T.textLight,
                        lineHeight:1,letterSpacing:0.5}}>%</span>
                    </div>

                    {/* Details */}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                        <span style={{fontFamily:'Cormorant Garamond',fontSize:16,
                          color:T.text,fontWeight: isActive ? 600 : 400}}>{r.name}</span>
                        {isActive && (
                          <span style={{fontSize:8,letterSpacing:1.5,textTransform:'uppercase',
                            color:T.gold,background:'rgba(201,168,67,0.08)',
                            padding:'2px 6px',borderRadius:2}}>Previewing</span>
                        )}
                      </div>
                      {/* Mini colour swatches from design */}
                      {r.design && (
                        <div style={{display:'flex',gap:4,marginBottom:4}}>
                          {[r.design.primaryColor,r.design.secondaryColor,r.design.accentColor].map((c,ci)=>(
                            <div key={ci} style={{width:12,height:12,borderRadius:'50%',
                              background:c,border:'1px solid '+T.border}} />
                          ))}
                          <span style={{fontSize:9,color:T.textLight,marginLeft:2,
                            alignSelf:'center'}}>
                            {r.design.bodyPattern} · {r.design.borderPattern} · {r.design.palluPattern}
                          </span>
                        </div>
                      )}
                      {/* Score bar */}
                      <div style={{height:3,background:T.border,borderRadius:2,overflow:'hidden'}}>
                        <div style={{
                          height:'100%',borderRadius:2,transition:'width 0.5s ease',
                          width: score+'%',
                          background:'linear-gradient(90deg,'+scoreColor+','+T.gold+')'
                        }} />
                      </div>
                    </div>

                    {/* Budget chip */}
                    <div style={{flexShrink:0,textAlign:'right'}}>
                      <div style={{fontSize:9,color:T.textLight,lineHeight:1.4}}>
                        {r.budget || r.estimatedBudget || ''}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <button className="btn-primary"
          style={{width:'100%',padding:'14px 0',fontSize:13}}
          onClick={() => onDesignReady(shownDesign || results.design)}>
          Open in Designer →
        </button>

      </div>
    )
  }


  // Choose mode
  return (
    <div style={{maxWidth:520,margin:'0 auto',padding:'32px 20px'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:32}}>
        <button onClick={onBack} className="btn-ghost" style={{padding:'6px 14px',fontSize:11}}>← Back</button>
        <h2 style={{fontFamily:'Cormorant Garamond',fontSize:26,fontWeight:400,color:T.text}}>AI Mode</h2>
      </div>

      {/* Voice questionnaire section */}
      <div className="card" style={{padding:24,marginBottom:16}}>
        <div style={{display:'flex',gap:16,alignItems:'flex-start',marginBottom:20}}>
          <div style={{
            width:48,height:48,borderRadius:'50%',flexShrink:0,
            background:`linear-gradient(135deg,${T.goldDark},${T.gold})`,
            display:'flex',alignItems:'center',justifyContent:'center',fontSize:22
          }}>🎤</div>
          <div>
            <h3 style={{fontFamily:'Cormorant Garamond',fontSize:20,color:T.text,marginBottom:4}}>Voice Questionnaire</h3>
            <p style={{fontSize:12,color:T.textLight,lineHeight:1.6}}>Answer 6 guided questions - by speaking or tapping. AI designs your perfect saree.</p>
          </div>
        </div>
        <button className="btn-primary" style={{width:'100%'}} onClick={()=>setMode('questionnaire')}>
          Start Conversation →
        </button>
      </div>

      {/* Divider */}
      <div style={{display:'flex',alignItems:'center',gap:12,margin:'20px 0'}}>
        <div style={{flex:1,height:1,background:T.border}} />
        <span style={{fontSize:10,letterSpacing:2,color:T.textLight,textTransform:'uppercase'}}>or</span>
        <div style={{flex:1,height:1,background:T.border}} />
      </div>

      {/* Prompt section */}
      <div className="card" style={{padding:24}}>
        <div style={{display:'flex',gap:16,alignItems:'flex-start',marginBottom:20}}>
          <div style={{
            width:48,height:48,borderRadius:'50%',flexShrink:0,
            background:T.surfaceAlt,border:`1px solid ${T.border}`,
            display:'flex',alignItems:'center',justifyContent:'center',fontSize:22
          }}>✨</div>
          <div>
            <h3 style={{fontFamily:'Cormorant Garamond',fontSize:20,color:T.text,marginBottom:4}}>Type a Prompt</h3>
            <p style={{fontSize:12,color:T.textLight,lineHeight:1.6}}>Describe your dream saree in your own words and let AI generate it.</p>
          </div>
        </div>
        <textarea className="input-field" rows={3} placeholder="e.g. Traditional red silk wedding saree with peacock pallu and heavy gold border..." value={prompt} onChange={e=>setPrompt(e.target.value)} style={{marginBottom:12,resize:'none',lineHeight:1.6}} />
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:14}}>
          {['Wedding silk saree','Kerala kasavu','Minimal linen office saree','Bridal Banarasi'].map(s=>(
            <button key={s} className="chip" style={{fontSize:10}} onClick={()=>setPrompt(s)}>{s}</button>
          ))}
        </div>
        <button className="btn-primary" style={{width:'100%'}} onClick={generateFromPrompt} disabled={isGenerating||!prompt.trim()}>
          {isGenerating ? '✨ Generating...' : '✨ Generate Design'}
        </button>
      </div>
    </div>
  )
}

// ─── MY DESIGNS — CATALOGUE VIEW ─────────────────────────────────────────────
function MyDesignsPage({ user, token, onBack, onOpenDesign, notify }) {
  const [designs,    setDesigns]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected,   setSelected]   = useState(null)   // detail modal

  useEffect(() => { loadDesigns() }, [])

  const loadDesigns = async () => {
    setLoading(true)
    try {
      const data = await sb.select('saved_designs', `user_id=eq.${user.id}&order=created_at.desc`, token)
      setDesigns(Array.isArray(data) ? data : [])
    } catch { setDesigns([]) }
    setLoading(false)
  }

  const deleteDesign = async (id) => {
    try {
      await sb.delete('saved_designs', `id=eq.${id}`, token)
      setDesigns(d => d.filter(x => x.id !== id))
      if (selected?.id === id) setSelected(null)
      notify('Design removed from catalogue', 'info')
    } catch { notify('Could not delete', 'error') }
  }

  const STATUS_MAP = {
    draft:      { label:'Draft',           cls:'status-draft'      },
    submitted:  { label:'Submitted',       cls:'status-submitted'  },
    review:     { label:'Under Review',    cls:'status-review'     },
    approved:   { label:'Approved',        cls:'status-approved'   },
    production: { label:'Production Ready',cls:'status-production' },
  }

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

  // Filter + search
  const filtered = designs.filter(d => {
    const matchSearch = !search || d.name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || (d.status || 'draft') === filterStatus
    return matchSearch && matchStatus
  })

  const statusCounts = designs.reduce((acc, d) => {
    const s = d.status || 'draft'
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})

  // ── Detail Modal ──────────────────────────────────────────────────────────────
  const DetailModal = ({ d }) => {
    const dd = d.design_data || {}
    const st = STATUS_MAP[d.status] || STATUS_MAP.draft
    return (
      <div style={{
        position:'fixed',inset:0,zIndex:200,
        background:'rgba(14,12,9,0.92)',
        display:'flex',alignItems:'center',justifyContent:'center',
        padding:20,backdropFilter:'blur(4px)',
      }} onClick={()=>setSelected(null)}>
        <div style={{
          background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,
          width:'100%',maxWidth:480,maxHeight:'92vh',overflowY:'auto',
          animation:'slideUp 0.25s ease',
        }} onClick={e=>e.stopPropagation()}>

          {/* Canvas preview */}
          <div style={{
            background:`radial-gradient(ellipse at center,${T.surfaceAlt},${T.bg})`,
            display:'flex',justifyContent:'center',padding:'28px 0 20px',
            borderBottom:`1px solid ${T.border}`,position:'relative',
          }}>
            <SareeCanvas design={dd} scale={0.95} />
            <button onClick={()=>setSelected(null)} style={{
              position:'absolute',top:12,right:12,background:'rgba(0,0,0,0.6)',
              border:'none',color:T.textMid,borderRadius:'50%',
              width:28,height:28,cursor:'pointer',fontSize:14,
              display:'flex',alignItems:'center',justifyContent:'center',
            }}>✕</button>
          </div>

          {/* Info */}
          <div style={{padding:'20px 22px'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:14,gap:10}}>
              <h3 style={{fontFamily:'Cormorant Garamond',fontSize:22,fontWeight:400,color:T.text,lineHeight:1.2}}>{d.name}</h3>
              <span className={st.cls} style={{flexShrink:0,marginTop:3}}>{st.label}</span>
            </div>

            {/* Colour swatches */}
            <div style={{display:'flex',gap:6,marginBottom:16}}>
              {[
                {label:'Body',   color:dd.primaryColor},
                {label:'Accent', color:dd.secondaryColor},
                {label:'Zari',   color:dd.accentColor},
              ].map(c=>(
                <div key={c.label} style={{flex:1,textAlign:'center'}}>
                  <div style={{height:28,borderRadius:3,background:c.color||'#ccc',border:`1px solid ${T.border}`,marginBottom:4}} />
                  <span style={{fontSize:9,color:T.textLight,letterSpacing:0.8,textTransform:'uppercase'}}>{c.label}</span>
                </div>
              ))}
            </div>

            {/* Pattern details */}
            <div style={{background:T.surfaceAlt,borderRadius:4,padding:'12px 14px',marginBottom:16,border:`1px solid ${T.border}`}}>
              <p style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:T.textLight,marginBottom:10}}>Pattern Details</p>
              {[
                {label:'Body',   val: PATTERN_NAMES[dd.bodyPattern]   || dd.bodyPattern},
                {label:'Border', val: PATTERN_NAMES[dd.borderPattern] || dd.borderPattern},
                {label:'Pallu',  val: PATTERN_NAMES[dd.palluPattern]  || dd.palluPattern},
              ].map(r=>(
                <div key={r.label} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:`1px solid ${T.borderLight}`}}>
                  <span style={{fontSize:11,color:T.textLight}}>{r.label}</span>
                  <span style={{fontSize:11,fontWeight:500,color:T.text}}>{r.val || '—'}</span>
                </div>
              ))}
            </div>

            <p style={{fontSize:10,color:T.textLight,marginBottom:18}}>
              Added {d.created_at ? new Date(d.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : '—'}
            </p>

            {/* Actions */}
            <div style={{display:'flex',gap:10}}>
              <button className="btn-primary" style={{flex:1}} onClick={()=>{setSelected(null);onOpenDesign(dd)}}>
                ✦ Edit Design
              </button>
              <button className="btn-ghost" style={{padding:'10px 14px',fontSize:11,color:T.error,borderColor:T.error+'55'}}
                onClick={()=>deleteDesign(d.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Catalogue card ────────────────────────────────────────────────────────────
  const CatalogueCard = ({ d }) => {
    const dd    = d.design_data || {}
    const st    = STATUS_MAP[d.status] || STATUS_MAP.draft
    const dateStr = d.created_at
      ? new Date(d.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})
      : ''
    return (
      <div onClick={()=>setSelected(d)} style={{
        background:T.surface,border:`1px solid ${T.border}`,borderRadius:5,
        overflow:'hidden',cursor:'pointer',transition:'all 0.22s ease',
        display:'flex',flexDirection:'column',
      }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gold+'88';e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow=`0 8px 28px rgba(0,0,0,0.45)`}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}
      >
        {/* Saree canvas preview */}
        <div style={{
          background:`radial-gradient(ellipse at center,${T.surfaceAlt} 0%,${T.bg} 100%)`,
          display:'flex',alignItems:'center',justifyContent:'center',
          padding:'18px 8px 14px',
          borderBottom:`1px solid ${T.border}`,
          position:'relative',minHeight:200,
        }}>
          <SareeCanvas design={dd} scale={0.58} />
          {/* Status badge overlay */}
          <div style={{position:'absolute',top:8,left:8}}>
            <span className={st.cls}>{st.label}</span>
          </div>
        </div>

        {/* Card info */}
        <div style={{padding:'12px 14px',flex:1,display:'flex',flexDirection:'column',gap:8}}>
          <h4 style={{
            fontFamily:'Cormorant Garamond',fontSize:16,fontWeight:400,
            color:T.text,lineHeight:1.2,
            whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
          }}>{d.name}</h4>

          {/* Pattern chips */}
          <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
            {[dd.bodyPattern, dd.borderPattern, dd.palluPattern].filter(Boolean).map((pid,i)=>(
              <span key={i} style={{
                fontSize:9,padding:'2px 7px',borderRadius:40,
                background:T.surfaceAlt,border:`1px solid ${T.border}`,
                color:T.textLight,letterSpacing:0.5,
              }}>{PATTERN_NAMES[pid] || pid}</span>
            ))}
          </div>

          {/* Colour swatches */}
          <div style={{display:'flex',gap:3,marginTop:'auto'}}>
            {[dd.primaryColor, dd.secondaryColor, dd.accentColor].filter(Boolean).map((c,i)=>(
              <div key={i} style={{
                flex:1,height:8,borderRadius:40,
                background:c,border:`1px solid ${T.border}`,
              }} />
            ))}
          </div>

          {/* Footer row */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:4,borderTop:`1px solid ${T.borderLight}`}}>
            <span style={{fontSize:9,color:T.textLight,letterSpacing:0.5}}>{dateStr}</span>
            <span style={{fontSize:10,color:T.goldDark,letterSpacing:0.5}}>View →</span>
          </div>
        </div>
      </div>
    )
  }

  // ── Page render ───────────────────────────────────────────────────────────────
  return (
    <div style={{padding:'28px 20px 60px',maxWidth:1100,margin:'0 auto'}}>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button onClick={onBack} className="btn-ghost" style={{padding:'6px 14px',fontSize:11}}>← Back</button>
          <div>
            <h2 style={{fontFamily:'Cormorant Garamond',fontSize:26,fontWeight:400,color:T.text,lineHeight:1}}>
              Saree Catalogue
            </h2>
            <p style={{fontSize:10,color:T.textLight,letterSpacing:1.5,textTransform:'uppercase',marginTop:3}}>
              {designs.length} design{designs.length !== 1 ? 's' : ''} saved
            </p>
          </div>
        </div>
      </div>

      {/* Search + filter bar */}
      {designs.length > 0 && (
        <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
          <input
            className="input-field"
            style={{flex:1,minWidth:180,maxWidth:320,padding:'9px 14px',fontSize:12}}
            placeholder="Search designs..."
            value={search}
            onChange={e=>setSearch(e.target.value)}
          />
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {['all','draft','submitted','review','approved','production'].map(s=>{
              const count = s === 'all' ? designs.length : (statusCounts[s]||0)
              if (s !== 'all' && count === 0) return null
              return (
                <button key={s} onClick={()=>setFilterStatus(s)}
                  className={filterStatus===s ? 'chip active' : 'chip'}
                  style={{fontSize:10,padding:'4px 12px'}}>
                  {s === 'all' ? 'All' : STATUS_MAP[s]?.label || s}
                  {count > 0 && <span style={{marginLeft:5,opacity:0.7}}>{count}</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{textAlign:'center',padding:80}}>
          <div style={{width:44,height:44,borderRadius:'50%',border:`3px solid ${T.goldLight}`,borderTopColor:T.gold,animation:'spin 1s linear infinite',margin:'0 auto 16px'}} />
          <p style={{fontFamily:'Cormorant Garamond',fontSize:17,color:T.textMid,fontStyle:'italic'}}>Loading catalogue...</p>
        </div>
      ) : designs.length === 0 ? (
        <div style={{textAlign:'center',padding:'80px 20px'}}>
          <div style={{fontSize:56,marginBottom:16}}>👗</div>
          <h3 style={{fontFamily:'Cormorant Garamond',fontSize:24,color:T.textMid,marginBottom:8,fontWeight:400}}>
            Your catalogue is empty
          </h3>
          <p style={{fontSize:13,color:T.textLight,lineHeight:1.7,maxWidth:320,margin:'0 auto'}}>
            Save designs from the canvas or AI mode — they'll appear here as a browsable catalogue.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:'center',padding:60}}>
          <p style={{fontSize:14,color:T.textMid}}>No designs match your filter.</p>
          <button className="btn-ghost" style={{marginTop:12,fontSize:11}} onClick={()=>{setSearch('');setFilterStatus('all')}}>
            Clear filters
          </button>
        </div>
      ) : (
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',
          gap:16,
        }}>
          {filtered.map(d => <CatalogueCard key={d.id} d={d} />)}
        </div>
      )}

      {/* Detail modal */}
      {selected && <DetailModal d={selected} />}
    </div>
  )
}

// ─── DESIGNER DASHBOARD ───────────────────────────────────────────────────────
function DesignerDashboard({ user, token, notify, onBack, patterns: propPatterns, palettes: propPalettes, templates: propTemplates }) {
  const [activeTab, setActiveTab] = useState('requests')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'requests') loadRequests()
  }, [activeTab])

  const loadRequests = async () => {
    setLoading(true)
    try {
      const data = await sb.select('saved_designs', `order=created_at.desc&limit=30`, token)
      setRequests(Array.isArray(data) ? data : [])
    } catch { setRequests([]) }
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    try {
      await sb.update('saved_designs', { status }, `id=eq.${id}`, token)
      setRequests(r => r.map(x => x.id===id ? {...x, status} : x))
      notify(`Status updated to: ${status}`,'success')
    } catch { notify('Could not update status','error') }
  }

  // patternLibrary | customerRequests tabs
  const tabs = [
    { id:'requests', label:'Customer Requests', icon:'📋' },
    { id:'patterns', label:'Pattern Library', icon:'🗂️' },
    { id:'templates', label:'Style Templates', icon:'📐' },
  ]

  const statusColors = {
    draft:'#B7791F', submitted:'#2B6CB0', review:'#C53030',
    approved:'#276749', production:'#6B46C1'
  }

  return (
    <div style={{minHeight:'100vh',background:T.bg}}>
      {/* Header */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <button onClick={onBack} className="btn-ghost" style={{padding:'5px 12px',fontSize:10}}>← Home</button>
          <h1 style={{fontFamily:'Cormorant Garamond',fontSize:24,fontWeight:400,color:T.text}}>Designer Dashboard</h1>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:T.success}} />
          <span style={{fontSize:11,color:T.textMid}}>{user?.email}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,padding:'20px 24px',maxWidth:900,margin:'0 auto'}}>
        {[
          {label:'Total Requests', value:requests.length, icon:'📋'},
          {label:'Pending Review', value:requests.filter(r=>r.status==='submitted'||r.status==='review').length, icon:'⏳'},
          {label:'Approved', value:requests.filter(r=>r.status==='approved').length, icon:'✅'},
          {label:'In Production', value:requests.filter(r=>r.status==='production').length, icon:'🏭'},
        ].map(s => (
          <div key={s.label} className="card" style={{padding:16,textAlign:'center'}}>
            <div style={{fontSize:24,marginBottom:6}}>{s.icon}</div>
            <div style={{fontFamily:'Cormorant Garamond',fontSize:28,color:T.gold,marginBottom:4}}>{s.value}</div>
            <div style={{fontSize:10,color:T.textLight,letterSpacing:0.5}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{maxWidth:900,margin:'0 auto',padding:'0 24px'}}>
        <div style={{display:'flex',gap:0,borderBottom:`1px solid ${T.border}`,marginBottom:24}}>
          {tabs.map(t => (
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
              padding:'12px 20px',border:'none',cursor:'pointer',
              background:'transparent',fontSize:12,letterSpacing:0.5,
              color:activeTab===t.id?T.gold:T.textMid,
              borderBottom:`2px solid ${activeTab===t.id?T.gold:'transparent'}`,
              transition:'all 0.2s',fontFamily:'Jost',fontWeight:activeTab===t.id?500:300
            }}>{t.icon} {t.label}</button>
          ))}
        </div>

        {/* Customer Requests */}
        {activeTab === 'requests' && (
          loading ? (
            <div style={{textAlign:'center',padding:48}}>
              <div style={{width:40,height:40,borderRadius:'50%',border:`2px solid ${T.goldLight}`,borderTopColor:T.gold,animation:'spin 1s linear infinite',margin:'0 auto'}} />
            </div>
          ) : requests.length === 0 ? (
            <div style={{textAlign:'center',padding:60}}>
              <div style={{fontSize:48,marginBottom:12}}>📭</div>
              <p style={{fontFamily:'Cormorant Garamond',fontSize:20,color:T.textMid}}>No requests yet</p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {requests.map(r => (
                <div key={r.id} className="card" style={{padding:16}}>
                  <div style={{display:'flex',gap:16,alignItems:'center'}}>
                    {/* Color preview */}
                    <div style={{display:'flex',gap:2,flexShrink:0}}>
                      {(r.thumbnail_colors||['#ccc']).map((c,i)=>(
                        <div key={i} style={{width:20,height:48,borderRadius:2,background:c}} />
                      ))}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:'Cormorant Garamond',fontSize:17,color:T.text,marginBottom:4}}>{r.name}</div>
                      <div style={{fontSize:11,color:T.textLight,marginBottom:8}}>{r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : ''}</div>
                      {/* Status actions */}
                      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        {['review','approved','production'].map(s => (
                          <button key={s} onClick={()=>updateStatus(r.id,s)} style={{
                            padding:'4px 10px',border:`1px solid ${r.status===s?statusColors[s]:T.border}`,
                            background:r.status===s?`${statusColors[s]}15`:'transparent',
                            color:r.status===s?statusColors[s]:T.textLight,
                            borderRadius:40,cursor:'pointer',fontSize:9,
                            letterSpacing:0.8,textTransform:'uppercase',
                            transition:'all 0.2s'
                          }}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{flexShrink:0}}>
                      <span className={`status-${r.status||'draft'}`}>{r.status||'Draft'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Pattern Library */}
        {activeTab === 'patterns' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:12}}>
              {(propPatterns&&propPatterns.length>0?propPatterns:SEED_PATTERNS).map(p => (
                <div key={p.id} className="card" style={{overflow:'hidden'}}>
                  <PatternRenderer patternId={p.id} color='#8B0000' accentColor='#C9A843' width={120} height={90} />
                  <div style={{padding:'8px 10px'}}>
                    <div style={{fontSize:11,color:T.text,fontWeight:400,marginBottom:2}}>{p.name}</div>
                    <div style={{fontSize:9,color:T.textLight,textTransform:'capitalize'}}>{p.saree_part} · {p.style_type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Style Templates */}
        {activeTab === 'templates' && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16}}>
            {(propTemplates&&propTemplates.length>0?propTemplates:SEED_TEMPLATES).map(t => {
              const pal = (propPalettes&&propPalettes.length>0?propPalettes:SEED_PALETTES).find(p=>p.id===t.palette_id) || SEED_PALETTES[0]
              return (
                <div key={t.id} className="card" style={{padding:0,overflow:'hidden'}}>
                  <div style={{height:120,display:'flex',alignItems:'center',justifyContent:'center',background:`linear-gradient(135deg,${pal.primary_color},${pal.secondary_color})`}}>
                    <SareeCanvas design={{primaryColor:pal.primary_color,secondaryColor:pal.secondary_color,accentColor:pal.accent_color,bodyPattern:t.body_pattern_id,borderPattern:t.border_pattern_id,palluPattern:t.pallu_pattern_id}} scale={0.4} />
                  </div>
                  <div style={{padding:14}}>
                    <div style={{fontFamily:'Cormorant Garamond',fontSize:17,color:T.text,marginBottom:4}}>{t.name}</div>
                    <div style={{fontSize:11,color:T.textLight}}>{t.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── MAIN NAV ─────────────────────────────────────────────────────────────────
function TopNav({ user, userRole, onSignOut, onHome }) {
  return (
    <div style={{
      position:'sticky',top:0,zIndex:100,
      background:`rgba(14,12,9,0.97)`,
      backdropFilter:'blur(12px)',
      borderBottom:`1px solid ${T.border}`,
      padding:'0 24px',height:56,
      display:'flex',alignItems:'center',justifyContent:'space-between'
    }}>
      <button onClick={onHome} style={{background:'transparent',border:'none',cursor:'pointer',padding:0}}>
        <span style={{fontFamily:'Cormorant Garamond',fontSize:20,fontWeight:400}} className="gold-gradient">
          ✦ AI Saree Designer
        </span>
      </button>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        {userRole === 'designer' && (
          <span style={{fontSize:9,padding:'3px 10px',background:T.surfaceAlt,border:`1px solid ${T.gold}44`,borderRadius:40,color:T.goldDark,letterSpacing:1,textTransform:'uppercase',fontWeight:500}}>Designer</span>
        )}
        <span style={{fontSize:11,color:T.textMid,maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.email}</span>
        <button className="btn-ghost" style={{padding:'5px 12px',fontSize:10}} onClick={onSignOut}>Sign Out</button>
      </div>
    </div>
  )
}

export { AIModePage, MyDesignsPage, DesignerDashboard, TopNav }
