// ─── App.jsx ─────────────────────────────────────────────────────────────────
// Root component — Vite entry point (src/App.jsx)
import { useState, useEffect } from 'react'
import { T, GlobalStyles } from './theme.jsx'
import { sb, SEED_PATTERNS, SEED_PALETTES, SEED_TEMPLATES } from './data.jsx'
import { Notification, AuthPage, CustomerHome, DesignerCanvas, ImageUploadPage, CustomerDesignUploadPage } from './components.jsx'
import { AIModePage, MyDesignsPage, DesignerDashboard, TopNav } from './pages.jsx'

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [userRole, setUserRole] = useState('customer')
  const [authLoading, setAuthLoading] = useState(true)
  const [page, setPage] = useState('home')
  const [initialDesign, setInitialDesign] = useState(null)
  const [notification, setNotification] = useState(null)
  // Supabase-loaded data
  const [dbPatterns, setDbPatterns] = useState([])
  const [dbUserUploadPatterns, setDbUserUploadPatterns] = useState([])
  const [dbPalettes, setDbPalettes] = useState([])
  const [dbTemplates, setDbTemplates] = useState([])
  const [dbLoaded, setDbLoaded] = useState(false)

  const refreshLibraryData = async () => {
    try {
      const [pats, pals, tmps] = await Promise.all([
        sb.select('design_patterns', 'order=id.asc'),
        sb.select('color_palettes', 'order=id.asc'),
        sb.select('ai_design_templates', 'order=id.asc'),
      ])
      if (Array.isArray(pats)) setDbPatterns(pats)
      if (Array.isArray(pals)) setDbPalettes(pals)
      if (Array.isArray(tmps)) setDbTemplates(tmps)
      if (user && userRole === 'customer') {
        const mine = await sb.select('saved_designs', `user_id=eq.${user.id}&order=created_at.desc`, token)
        const uploadPats = (Array.isArray(mine) ? mine : []).flatMap((d) => {
          const u = d?.design_data?.uploadMeta
          if (!u?.file_data_url || !u?.custom_id || !u?.part) return []
          return [{
            id: u.custom_id,
            name: d.name || 'My Upload',
            saree_part: u.part,
            style_type: 'uploaded',
            richness_level: 3,
            tags: ['uploaded', (u.occasion || '').toLowerCase()].filter(Boolean),
            image_data_url: u.file_data_url,
            editor: (u.editor && typeof u.editor === 'object') ? u.editor : {
              opacity: 0.86, density: 1, zoom: 1, spacing: 1.18, rotation: 0, x: 0, y: 0, repeatStyle: 'grid',
            },
          }]
        })
        const uniq = []
        const seen = new Set()
        for (const p of uploadPats) {
          if (seen.has(p.id)) continue
          seen.add(p.id)
          uniq.push(p)
        }
        setDbUserUploadPatterns(uniq)
      } else {
        setDbUserUploadPatterns([])
      }
    } catch {}
  }

  // Restore session
  useEffect(() => {
    const t = sessionStorage.getItem('sb_token')
    const u = sessionStorage.getItem('sb_user')
    if (t && u) {
      const parsedUser = JSON.parse(u)
      setToken(t); setUser(parsedUser)
      setUserRole(parsedUser?.user_metadata?.role || 'customer')
    }
    setAuthLoading(false)
  }, [])

  // Load all data from Supabase on mount
  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        const [pats, pals, tmps] = await Promise.all([
          sb.select('design_patterns', 'order=id.asc'),
          sb.select('color_palettes', 'order=id.asc'),
          sb.select('ai_design_templates', 'order=id.asc'),
        ])
        const validPats = Array.isArray(pats) && pats.length > 0
        const validPals = Array.isArray(pals) && pals.length > 0
        const validTmps = Array.isArray(tmps) && tmps.length > 0
        if (validPats) setDbPatterns(pats)
        if (validPals) setDbPalettes(pals)
        if (validTmps) setDbTemplates(tmps)
        setDbLoaded(true)
        console.log(`✅ Supabase loaded: ${validPats?pats.length:0} patterns, ${validPals?pals.length:0} palettes, ${validTmps?tmps.length:0} templates`)
      } catch(e) {
        console.warn('⚠️ Supabase load failed, using seed data:', e)
        setDbLoaded(true)
      }
    }
    loadFromSupabase()
  }, [])

  useEffect(() => {
    if (user) refreshLibraryData()
  }, [user?.id, userRole])

  // Merge: use Supabase data if available, else fall back to seed
  const basePatterns = dbPatterns.length > 0 ? dbPatterns : SEED_PATTERNS
  const patterns = userRole === 'customer'
    ? [...basePatterns, ...dbUserUploadPatterns.filter(p => !basePatterns.some(b => b.id === p.id))]
    : basePatterns
  const palettes = dbPalettes.length > 0 ? dbPalettes : SEED_PALETTES
  const templates = dbTemplates.length > 0 ? dbTemplates : SEED_TEMPLATES

  const notify = (msg, type = 'info') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3500)
  }

  const handleAuth = (u, t, role) => {
    setUser(u); setToken(t); setUserRole(role)
    setPage('home')
  }

  const handleSignOut = async () => {
    if (token) await sb.signOut(token)
    sessionStorage.removeItem('sb_token')
    sessionStorage.removeItem('sb_user')
    setUser(null); setToken(null)
    setPage('home')
  }

  const handleNavigate = (target, design = null) => {
    if (target === 'canvas') { setInitialDesign(design); setPage('canvas') }
    else setPage(target)
  }

  const handleDesignReady = (design) => {
    setInitialDesign(design)
    setPage('canvas')
  }

  if (authLoading) {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:T.bg}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:48,height:48,borderRadius:'50%',border:`3px solid ${T.goldLight}`,borderTopColor:T.gold,animation:'spin 1s linear infinite',margin:'0 auto 16px'}} />
          <p style={{fontFamily:'Cormorant Garamond',fontSize:18,color:T.textMid,fontStyle:'italic'}}>Loading studio...</p>
        </div>
      </div>
    )
  }

  if (!user) return (
    <>
      <GlobalStyles />
      <AuthPage onAuth={handleAuth} notify={notify} />
      <Notification notification={notification} />
    </>
  )

  // Full-screen pages (no nav)
  if (page === 'canvas') return (
    <>
      <GlobalStyles />
      <DesignerCanvas
        user={user}
        token={token}
        initialDesign={initialDesign}
        notify={notify}
        onBack={()=>setPage('home')}
        patterns={patterns}
        palettes={palettes}
      />
      <Notification notification={notification} />
    </>
  )
  if (page === 'aimode') return (
    <>
      <GlobalStyles />
      <div style={{minHeight:'100dvh',background:T.bg}}>
        <TopNav user={user} userRole={userRole} onSignOut={handleSignOut} onHome={()=>setPage('home')} />
        <AIModePage onBack={()=>setPage('home')} onDesignReady={handleDesignReady} notify={notify} />
      </div>
      <Notification notification={notification} />
    </>
  )
  if (page === 'imageupload') return (
    <>
      <GlobalStyles />
      <div style={{minHeight:'100dvh',background:T.bg}}>
        <TopNav user={user} userRole={userRole} onSignOut={handleSignOut} onHome={()=>setPage('home')} />
        <div style={{padding:'32px 20px'}}>
          <ImageUploadPage onBack={()=>setPage('home')} onDesignReady={handleDesignReady} notify={notify} />
        </div>
      </div>
      <Notification notification={notification} />
    </>
  )
  if (page === 'uploaddesign') return (
    <>
      <GlobalStyles />
      <div style={{minHeight:'100dvh',background:T.bg}}>
        <TopNav user={user} userRole={userRole} onSignOut={handleSignOut} onHome={()=>setPage('home')} />
        <CustomerDesignUploadPage
          user={user}
          token={token}
          notify={notify}
          onLibraryChanged={refreshLibraryData}
          onBack={()=>setPage('home')}
          onSaved={()=>setPage('mydesigns')}
        />
      </div>
      <Notification notification={notification} />
    </>
  )
  if (page === 'mydesigns') return (
    <>
      <GlobalStyles />
      <div style={{minHeight:'100dvh',background:T.bg}}>
        <TopNav user={user} userRole={userRole} onSignOut={handleSignOut} onHome={()=>setPage('home')} />
        <MyDesignsPage user={user} userRole={userRole} token={token} onBack={()=>setPage('home')} onOpenDesign={handleDesignReady} notify={notify} />
      </div>
      <Notification notification={notification} />
    </>
  )
  if (page === 'designer' || (page === 'home' && userRole === 'designer')) return (
    <>
      <GlobalStyles />
      <DesignerDashboard user={user} token={token} notify={notify} onLibraryChanged={refreshLibraryData} onBack={()=>setPage('home')} onSignOut={handleSignOut} onOpenDesign={handleDesignReady} patterns={patterns} palettes={palettes} templates={templates} />
      <Notification notification={notification} />
    </>
  )

  // Home page
  return (
    <>
      <GlobalStyles />
      <div style={{minHeight:'100dvh',background:T.bg}}>
        <TopNav user={user} userRole={userRole} onSignOut={handleSignOut} onHome={()=>setPage('home')} />
        {userRole === 'designer'
          ? <DesignerDashboard user={user} token={token} notify={notify} onLibraryChanged={refreshLibraryData} onBack={()=>setPage('home')} onSignOut={handleSignOut} onOpenDesign={handleDesignReady} patterns={patterns} palettes={palettes} templates={templates} />
          : <CustomerHome user={user} onNavigate={handleNavigate} templates={templates} palettes={palettes} />
        }
      </div>
      <Notification notification={notification} />
    </>
  )
}
