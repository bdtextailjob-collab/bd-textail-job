import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// কালার থিমের লিস্ট (আপনার সাইটের ব্র্যান্ড কালারসহ)
const colorThemes = [
  { id: 'white', bg: '#ffffff', text: '#1a1a1a', isLight: true },
  { id: 'brandblue', bg: '#0a1f44', text: '#ffffff', isLight: false },
  { id: 'gold', bg: '#d4a537', text: '#0a1f44', isLight: true },
  { id: 'blue', bg: '#1877F2', text: '#ffffff', isLight: false },
  { id: 'red', bg: '#d93636', text: '#ffffff', isLight: false },
  { id: 'green', bg: '#1e9d5a', text: '#ffffff', isLight: false },
  { id: 'purple', bg: '#8b5cf6', text: '#ffffff', isLight: false },
  { id: 'orange', bg: '#f97316', text: '#ffffff', isLight: false },
  { id: 'black', bg: '#111827', text: '#ffffff', isLight: false },
]

function UserDashboard({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser)
  const [activeTab, setActiveTab] = useState('home')
  
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [postText, setPostText] = useState('')
  const [selectedTheme, setSelectedTheme] = useState(colorThemes[0])

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'সাধারণ ইউজার',
      authorImage: 'https://ui-avatars.com/api/?name=User&background=0a1f44&color=fff',
      time: '২ ঘণ্টা আগে',
      content: 'আমাদের গার্মেন্টসে ৫ জন অপারেটর প্রয়োজন। আগ্রহীরা ইনবক্স করুন।',
      theme: colorThemes[0]
    },
    {
      id: 2,
      author: 'মোঃ রফিকুল ইসলাম',
      authorImage: 'https://ui-avatars.com/api/?name=Rofiq&background=d4a537&color=fff',
      time: '৫ ঘণ্টা আগে',
      content: 'আমি একজন সুপারভাইজার হিসেবে কাজ খুঁজছি। ৫ বছরের অভিজ্ঞতা আছে।',
      theme: colorThemes[0]
    }
  ])

  useEffect(() => {
    const channel = supabase
      .channel(`user-status-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${user.id}` },
        (payload) => {
          const newStatus = payload.new.status
          if (newStatus === 'suspended' || newStatus === 'blocked' || newStatus === 'disabled') {
            alert('আপনার অ্যাকাউন্টে পরিবর্তন এসেছে। দয়া করে আবার লগইন করুন।')
            onLogout()
          } else {
            setUser(payload.new)
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id])

  const handleCreatePost = () => {
    if (!postText.trim()) return;
    const newPost = {
      id: Date.now(),
      author: user.name,
      authorImage: user.profile_image_url || `https://ui-avatars.com/api/?name=${user.name}&background=0a1f44&color=fff`,
      time: 'এখনই',
      content: postText,
      theme: selectedTheme
    }
    setPosts([newPost, ...posts])
    setPostText('')
    setSelectedTheme(colorThemes[0])
    setIsCreatePostOpen(false)
  }

  return (
    <div style={styles.appWrapper}>
      
      {/* ১. টপ বার (ব্র্যান্ড নীল) */}
      <header style={styles.topBar}>
        <h1 style={styles.appLogo}>BD Textail Job</h1>
        <div style={styles.topIcons}>
          <button style={styles.iconBtn} onClick={() => setIsCreatePostOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <button style={styles.iconBtn}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <button style={styles.iconBtn} onClick={onLogout}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </header>

      {/* ২. নেভিগেশন বার (গাঢ় নীল) */}
      <nav style={styles.topNav}>
        <button style={styles.navBtn} onClick={() => setActiveTab('home')}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === 'home' ? "#d4a537" : "none"} stroke={activeTab === 'home' ? "#d4a537" : "#ffffff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            {activeTab !== 'home' && <polyline points="9 22 9 12 15 12 15 22"></polyline>}
            {activeTab === 'home' && <polyline points="9 22 9 12 15 12 15 22" stroke="#0a1f44"></polyline>}
          </svg>
          {activeTab === 'home' && <div style={styles.activeLine}></div>}
        </button>
        <button style={styles.navBtn} onClick={() => setActiveTab('community')}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === 'community' ? "#d4a537" : "none"} stroke={activeTab === 'community' ? "#d4a537" : "#ffffff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          {activeTab === 'community' && <div style={styles.activeLine}></div>}
        </button>
        <button style={styles.navBtn} onClick={() => setActiveTab('message')}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === 'message' ? "#d4a537" : "none"} stroke={activeTab === 'message' ? "#d4a537" : "#ffffff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span style={styles.badge}>1</span>
          {activeTab === 'message' && <div style={styles.activeLine}></div>}
        </button>
        <button style={styles.navBtn} onClick={() => setActiveTab('notification')}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === 'notification' ? "#d4a537" : "none"} stroke={activeTab === 'notification' ? "#d4a537" : "#ffffff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span style={styles.badge}>8</span>
          {activeTab === 'notification' && <div style={styles.activeLine}></div>}
        </button>
        <button style={styles.navBtn} onClick={() => setActiveTab('profile')}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === 'profile' ? "#d4a537" : "none"} stroke={activeTab === 'profile' ? "#d4a537" : "#ffffff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          {activeTab === 'profile' && <div style={styles.activeLine}></div>}
        </button>
      </nav>

      {/* ৩. মূল কন্টেন্ট এরিয়া */}
      <main style={styles.mainContent}>
        
        {activeTab === 'home' && (
          <div style={styles.feedContainer}>
            
            {/* ক্লিকেবল পোস্ট বক্স */}
            <div style={styles.createPostBox} onClick={() => setIsCreatePostOpen(true)}>
              <div style={styles.postHeader}>
                <img src={user.profile_image_url || `https://ui-avatars.com/api/?name=${user.name}&background=0a1f44&color=fff`} alt="Profile" style={styles.avatar} />
                <div style={styles.fakeInput}>
                  দক্ষ লোক খুঁজতে পোস্ট করুন...
                </div>
              </div>
            </div>

            {/* পোস্ট লিস্ট */}
            {posts.map((post) => (
              <div key={post.id} style={{ ...styles.feedCard, backgroundColor: post.theme.bg }}>
                
                <div style={styles.feedHeader}>
                  <img src={post.authorImage} alt="User" style={styles.feedAvatar} />
                  <div>
                    <p style={{ ...styles.feedAuthor, color: post.theme.text }}>{post.author}</p>
                    <p style={{ ...styles.feedTime, color: post.theme.isLight ? '#6b7280' : 'rgba(255,255,255,0.8)' }}>{post.time}</p>
                  </div>
                </div>
                
                <p style={{ ...styles.feedContent, color: post.theme.text }}>{post.content}</p>
                
                <div style={{ ...styles.postActionBar, borderTopColor: post.theme.isLight ? '#e5e7eb' : 'rgba(255,255,255,0.2)' }}>
                  <button style={{ ...styles.actionBtn, color: post.theme.text }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                    Like
                  </button>
                  <button style={{ ...styles.actionBtn, color: post.theme.text }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    Comment
                  </button>
                  <button style={{ ...styles.actionBtn, color: post.theme.text }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                    Share
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}

        {activeTab !== 'home' && (
          <div style={styles.emptyContent}>
            <p style={styles.placeholderText}>
              {activeTab === 'community' && 'Community Page'}
              {activeTab === 'message' && 'Messages Page'}
              {activeTab === 'notification' && 'Notifications Page'}
              {activeTab === 'profile' && 'Profile Page'}
            </p>
          </div>
        )}

      </main>

      {/* ৪. Create Post Modal */}
      {isCreatePostOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            
            <div style={styles.modalHeader}>
              <button style={styles.closeBtn} onClick={() => setIsCreatePostOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a1f44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
              <h2 style={styles.modalTitle}>Create post</h2>
              <button style={styles.modalPostBtn} onClick={handleCreatePost}>POST</button>
            </div>

            <div style={styles.modalUserInfo}>
              <img src={user.profile_image_url || `https://ui-avatars.com/api/?name=${user.name}&background=0a1f44&color=fff`} alt="Profile" style={styles.modalAvatar} />
              <div>
                <p style={styles.modalUserName}>{user.name}</p>
                <div style={styles.privacyBadge}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a1f44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  <span>Public</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#0a1f44"><polygon points="7 10 12 15 17 10 7 10"></polygon></svg>
                </div>
              </div>
            </div>

            <div style={styles.colorPalette}>
              {colorThemes.map((theme) => (
                <button
                  key={theme.id}
                  style={{
                    ...styles.colorCircle,
                    backgroundColor: theme.bg,
                    border: selectedTheme.id === theme.id ? '3px solid #d4a537' : '2px solid #e2e6ee',
                    boxShadow: selectedTheme.id === theme.id ? '0 0 0 2px #ffffff inset' : 'none'
                  }}
                  onClick={() => setSelectedTheme(theme)}
                />
              ))}
            </div>

            <textarea
              style={{ ...styles.modalTextArea, backgroundColor: selectedTheme.bg, color: selectedTheme.text }}
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              autoFocus
            />

          </div>
        </div>
      )}

    </div>
  )
}

// =====================================================
// স্টাইল (ব্র্যান্ড কালার)
// =====================================================
const styles = {
  appWrapper: { minHeight: '100vh', width: '100%', background: '#f5f7fa', display: 'flex', flexDirection: 'column', overflowX: 'hidden' },
  
  // টপ বার
  topBar: { position: 'sticky', top: 0, zIndex: 50, background: 'linear-gradient(135deg, #0a1f44 0%, #16346b 100%)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' },
  appLogo: { fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: '0.5px' },
  topIcons: { display: 'flex', gap: '10px' },
  iconBtn: { width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)' },
  
  // নেভিগেশন বার
  topNav: { background: '#0a1f44', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '6px 0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', zIndex: 40, position: 'sticky', top: '68px' },
  navBtn: { position: 'relative', background: 'transparent', border: 'none', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  activeLine: { position: 'absolute', bottom: '0px', left: '10%', width: '80%', height: '3px', background: '#d4a537', borderRadius: '3px 3px 0 0', boxShadow: '0 -1px 8px rgba(212, 165, 55, 0.6)' },
  badge: { position: 'absolute', top: '4px', right: '10px', background: 'linear-gradient(135deg, #d4a537, #e6c267)', color: '#0a1f44', fontSize: '10px', fontWeight: 800, minWidth: '20px', height: '20px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0a1f44', boxShadow: '0 2px 6px rgba(212, 165, 55, 0.4)' },
  
  // মেইন কন্টেন্ট
  mainContent: { flex: 1, padding: '16px' },
  feedContainer: { maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' },
  
  // পোস্ট বক্স
  createPostBox: { background: '#ffffff', borderRadius: '20px', padding: '18px', boxShadow: '0 8px 25px rgba(10, 31, 68, 0.08)', cursor: 'pointer', border: '1px solid #e2e6ee' },
  postHeader: { display: 'flex', gap: '12px', alignItems: 'center' },
  avatar: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d4a537' },
  fakeInput: { flex: 1, padding: '14px', borderRadius: '25px', border: '1.5px solid #e2e6ee', background: '#f5f7fa', fontSize: '15px', fontFamily: "'Hind Siliguri', sans-serif", color: '#5a6472' },

  // ফিড কার্ড
  feedCard: { borderRadius: '24px', padding: '22px', boxShadow: '0 8px 24px rgba(10, 31, 68, 0.1)', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'background-color 0.3s ease', border: '1px solid rgba(0,0,0,0.05)' },
  feedHeader: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' },
  feedAvatar: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' },
  feedAuthor: { fontSize: '16px', fontWeight: 800, margin: '0 0 4px', fontFamily: "'Hind Siliguri', sans-serif" },
  feedTime: { fontSize: '12px', margin: 0, fontFamily: "'Hind Siliguri', sans-serif" },
  feedContent: { fontSize: '18px', margin: '0 0 20px', lineHeight: 1.6, fontFamily: "'Hind Siliguri', sans-serif", flexGrow: 1 },
  
  // পোস্ট অ্যাকশন বার
  postActionBar: { display: 'flex', justifyContent: 'space-between', borderTopWidth: '1px', borderTopStyle: 'solid', paddingTop: '14px' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', fontSize: '14px', fontWeight: 600, fontFamily: "'Hind Siliguri', sans-serif", cursor: 'pointer' },

  emptyContent: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', borderRadius: '20px', border: '2px dashed #d4a537', minHeight: '300px' },
  placeholderText: { fontSize: '20px', color: '#d4a537', fontWeight: 800, fontFamily: "'Hind Siliguri', sans-serif" },

  // ==========================================
  // Create Post Modal (পপআপ স্টাইল)
  // ==========================================
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10, 31, 68, 0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: '#ffffff', width: '100%', maxWidth: '500px', height: '100vh', display: 'flex', flexDirection: 'column', padding: '16px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1.5px solid #e2e6ee' },
  closeBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' },
  modalTitle: { fontSize: '18px', fontWeight: 700, color: '#0a1f44', margin: 0, fontFamily: "'Hind Siliguri', sans-serif" },
  modalPostBtn: { background: 'transparent', border: 'none', color: '#d4a537', fontSize: '16px', fontWeight: 800, cursor: 'pointer', fontFamily: "'Hind Siliguri', sans-serif" },
  
  modalUserInfo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  modalAvatar: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d4a537' },
  modalUserName: { fontSize: '15px', fontWeight: 700, color: '#0a1f44', margin: '0 0 4px', fontFamily: "'Hind Siliguri', sans-serif" },
  privacyBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f5f7fa', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#0a1f44', fontFamily: "'Hind Siliguri', sans-serif", border: '1px solid #e2e6ee' },
  
  // কালার প্যালেট
  colorPalette: { display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1.5px solid #e2e6ee' },
  colorCircle: { width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', flexShrink: 0, transition: 'transform 0.2s ease', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
  
  // টেক্সট এরিয়া
  modalTextArea: { flex: 1, border: 'none', outline: 'none', fontSize: '20px', fontFamily: "'Hind Siliguri', sans-serif", resize: 'none', padding: '20px', borderRadius: '16px', transition: 'all 0.3s ease', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)' },
}

export default UserDashboard
