import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// কালার থিম
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
  
  // পোস্ট স্টেট
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [postText, setPostText] = useState('')
  const [selectedTheme, setSelectedTheme] = useState(colorThemes[0])
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  // কমিউনিটি স্টেট
  const [communityUsers, setCommunityUsers] = useState([])
  const [loadingCommunity, setLoadingCommunity] = useState(true)

  // ---------- ডেটাবেস থেকে পোস্ট লোড ----------
  const fetchPosts = async () => {
    setLoadingPosts(true)
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .or(`status.eq.approved,and(user_id.eq.${user.id},status.eq.disabled)`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      console.error('Error fetching posts:', err)
    } finally {
      setLoadingPosts(false)
    }
  }

  // ---------- ডেটাবেস থেকে কমিউনিটি ইউজার লোড ----------
  const fetchCommunityUsers = async () => {
    setLoadingCommunity(true)
    try {
      // নিজের আইডি বাদে, শুধু 'approved' ইউজারদের আনব
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('status', 'approved')
        .neq('id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setCommunityUsers(data || [])
    } catch (err) {
      console.error('Error fetching community:', err)
    } finally {
      setLoadingCommunity(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    fetchCommunityUsers()

    // রিয়েল-টাইম আপডেট (পোস্টের জন্য)
    const postChannel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        if (payload.new.status === 'approved' || payload.new.user_id === user.id) {
          setPosts(prev => [payload.new, ...prev])
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' }, () => fetchPosts())
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, (payload) => {
        setPosts(prev => prev.filter(p => p.id !== payload.old.id))
      })
      .subscribe()

    // রিয়েল-টাইম আপডেট (ইউজার স্ট্যাটাসের জন্য)
    const userChannel = supabase
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

    return () => { 
      supabase.removeChannel(postChannel)
      supabase.removeChannel(userChannel)
    }
  }, [user.id])

  // ---------- নতুন পোস্ট ----------
  const handleCreatePost = async () => {
    if (!postText.trim() || isPosting) return;
    setIsPosting(true)

    try {
      const { error } = await supabase.from('posts').insert([{
        user_id: user.id,
        author_name: user.name,
        author_image: user.profile_image_url || `https://ui-avatars.com/api/?name=${user.name}&background=0a1f44&color=fff`,
        content: postText,
        theme_bg: selectedTheme.bg,
        theme_text: selectedTheme.text,
        status: 'pending'
      }])

      if (error) throw error

      setPostText('')
      setSelectedTheme(colorThemes[0])
      setIsCreatePostOpen(false)
      setShowSuccessPopup(true)
      
    } catch (err) {
      console.error('Post Error:', err)
      alert('পোস্ট করতে সমস্যা হয়েছে: ' + err.message)
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div style={styles.appWrapper}>
      
      {/* ১. টপ বার */}
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

      {/* ২. নেভিগেশন বার */}
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
        
        {/* ================= হোম পেজ ================= */}
        {activeTab === 'home' && (
          <div style={styles.feedContainer}>
            <div style={styles.createPostBox} onClick={() => setIsCreatePostOpen(true)}>
              <div style={styles.postHeader}>
                <img src={user.profile_image_url || `https://ui-avatars.com/api/?name=${user.name}&background=0a1f44&color=fff`} alt="Profile" style={styles.avatar} />
                <div style={styles.fakeInput}>দক্ষ লোক খুঁজতে পোস্ট করুন...</div>
              </div>
            </div>

            {loadingPosts ? (
              <p style={styles.loadingText}>পোস্ট লোড হচ্ছে...</p>
            ) : posts.length === 0 ? (
              <p style={styles.loadingText}>এখনো কোনো পোস্ট নেই। আপনিই প্রথম পোস্ট করুন!</p>
            ) : (
              posts.map((post) => {
                const isOwner = post.user_id === user.id;
                const isDisabled = post.status === 'disabled';
                return (
                  <div key={post.id} style={{ ...styles.feedCard, backgroundColor: post.theme_bg, opacity: (isOwner && isDisabled) ? 0.5 : 1 }}>
                    <div style={styles.feedHeader}>
                      <img src={post.author_image} alt="User" style={styles.feedAvatar} />
                      <div>
                        <p style={{ ...styles.feedAuthor, color: post.theme_text }}>{post.author_name}</p>
                        <p style={{ ...styles.feedTime, color: post.theme_bg === '#ffffff' ? '#6b7280' : 'rgba(255,255,255,0.8)' }}>
                          {new Date(post.created_at).toLocaleString('bn-BD', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    <p style={{ ...styles.feedContent, color: post.theme_text }}>{post.content}</p>
                    <div style={{ ...styles.postActionBar, borderTopColor: post.theme_bg === '#ffffff' ? '#e5e7eb' : 'rgba(255,255,255,0.2)' }}>
                      <button style={{ ...styles.actionBtn, color: post.theme_text }}>Like</button>
                      <button style={{ ...styles.actionBtn, color: post.theme_text }}>Comment</button>
                      <button style={{ ...styles.actionBtn, color: post.theme_text }}>Share</button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ================= কমিউনিটি পেজ ================= */}
        {activeTab === 'community' && (
          <div style={styles.communityContainer}>
            <h2 style={styles.communityTitle}>কমিউনিটি</h2>
            <p style={styles.communitySubtitle}>আমাদের প্ল্যাটফর্মের অনুমোদিত সদস্যদের দেখুন</p>

            {loadingCommunity ? (
              <p style={styles.loadingText}>ইউজার লোড হচ্ছে...</p>
            ) : communityUsers.length === 0 ? (
              <p style={styles.loadingText}>এখনো কোনো অনুমোদিত ইউজার নেই।</p>
            ) : (
              <div style={styles.userGrid}>
                {communityUsers.map((u) => (
                  <div key={u.id} style={styles.userCard}>
                    <div style={styles.cardHeader}>
                      <img src={u.profile_image_url} alt={u.name} style={styles.cardAvatar} />
                      <div style={styles.cardNameArea}>
                        <h3 style={styles.cardName}>{u.name}</h3>
                        <span style={{ ...styles.cardTypeBadge, ...(u.user_type === 'job_seeker' ? styles.cardTypeJob : styles.cardTypeGeneral) }}>
                          {u.user_type === 'job_seeker' ? 'চাকরিজীবী' : 'সাধারণ'}
                        </span>
                      </div>
                    </div>

                    {/* চাকরিজীবী হলে পেশাগত তথ্য দেখাবে */}
                    {u.user_type === 'job_seeker' && (
                      <div style={styles.cardCareerInfo}>
                        {u.industry_type && (
                          <div style={styles.cardInfoRow}>
                            <span style={styles.cardInfoLabel}>ইন্ডাস্ট্রি:</span>
                            <span style={styles.cardInfoValue}>{u.industry_type}</span>
                          </div>
                        )}
                        {u.designation && (
                          <div style={styles.cardInfoRow}>
                            <span style={styles.cardInfoLabel}>পদবী:</span>
                            <span style={styles.cardInfoValue}>{u.designation}</span>
                          </div>
                        )}
                        {(u.experience_years || u.experience_months) && (
                          <div style={styles.cardInfoRow}>
                            <span style={styles.cardInfoLabel}>অভিজ্ঞতা:</span>
                            <span style={styles.cardInfoValue}>
                              {u.experience_years ? `${u.experience_years} বছর ` : ''}
                              {u.experience_months ? `${u.experience_months} মাস` : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <button style={styles.messageBtn}>💬 মেসেজ</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* অন্যান্য ট্যাবের প্লেসহোল্ডার */}
        {activeTab !== 'home' && activeTab !== 'community' && (
          <div style={styles.emptyContent}>
            <p style={styles.placeholderText}>
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
              <button style={styles.modalPostBtn} onClick={handleCreatePost} disabled={isPosting}>
                {isPosting ? 'POSTING...' : 'POST'}
              </button>
            </div>

            <div style={styles.modalUserInfo}>
              <img src={user.profile_image_url || `https://ui-avatars.com/api/?name=${user.name}&background=0a1f44&color=fff`} alt="Profile" style={styles.modalAvatar} />
              <div>
                <p style={styles.modalUserName}>{user.name}</p>
                <div style={styles.privacyBadge}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a1f44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  <span>Public</span>
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

      {/* ৫. সাকসেস পপআপ */}
      {showSuccessPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupBox}>
            <div style={styles.popupIcon}>⏳</div>
            <h2 style={styles.popupTitle}>পোস্ট সফলভাবে জমা হয়েছে!</h2>
            <p style={styles.popupMessage}>
              আপনার পোস্টটি <strong>BD Textail Job</strong>-এর সাপোর্ট টিম পর্যবেক্ষণ করছে। শীঘ্রই আপনার পোস্টটি পাবলিশ করা হবে।
            </p>
            <button style={styles.popupBtn} onClick={() => setShowSuccessPopup(false)}>ঠিক আছে</button>
          </div>
        </div>
      )}

    </div>
  )
}

// =====================================================
// স্টাইল
// =====================================================
const styles = {
  appWrapper: { minHeight: '100vh', width: '100%', background: '#f5f7fa', display: 'flex', flexDirection: 'column', overflowX: 'hidden' },
  topBar: { position: 'sticky', top: 0, zIndex: 50, background: 'linear-gradient(135deg, #0a1f44 0%, #16346b 100%)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' },
  appLogo: { fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: 0, fontFamily: "'Poppins', sans-serif" },
  topIcons: { display: 'flex', gap: '10px' },
  iconBtn: { width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' },
  topNav: { background: '#0a1f44', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '6px 0', zIndex: 40, position: 'sticky', top: '68px' },
  navBtn: { position: 'relative', background: 'transparent', border: 'none', padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  activeLine: { position: 'absolute', bottom: '0px', left: '10%', width: '80%', height: '3px', background: '#d4a537', borderRadius: '3px 3px 0 0' },
  badge: { position: 'absolute', top: '4px', right: '10px', background: '#d4a537', color: '#0a1f44', fontSize: '10px', fontWeight: 800, minWidth: '20px', height: '20px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0a1f44' },
  
  mainContent: { flex: 1, padding: '16px' },
  feedContainer: { maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' },
  createPostBox: { background: '#ffffff', borderRadius: '20px', padding: '18px', boxShadow: '0 8px 25px rgba(10, 31, 68, 0.08)', cursor: 'pointer' },
  postHeader: { display: 'flex', gap: '12px', alignItems: 'center' },
  avatar: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d4a537' },
  fakeInput: { flex: 1, padding: '14px', borderRadius: '25px', border: '1.5px solid #e2e6ee', background: '#f5f7fa', fontSize: '15px', color: '#5a6472', fontFamily: "'Hind Siliguri', sans-serif" },
  feedCard: { borderRadius: '24px', padding: '22px', boxShadow: '0 8px 24px rgba(10, 31, 68, 0.1)', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'opacity 0.3s ease' },
  feedHeader: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' },
  feedAvatar: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' },
  feedAuthor: { fontSize: '16px', fontWeight: 800, margin: '0 0 4px' },
  feedTime: { fontSize: '12px', margin: 0 },
  feedContent: { fontSize: '18px', margin: '0 0 20px', lineHeight: 1.6, flexGrow: 1 },
  postActionBar: { display: 'flex', justifyContent: 'space-between', borderTopWidth: '1px', borderTopStyle: 'solid', paddingTop: '14px' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  loadingText: { textAlign: 'center', color: '#5a6472', padding: '20px' },

  // কমিউনিটি স্টাইল
  communityContainer: { maxWidth: '600px', margin: '0 auto' },
  communityTitle: { fontSize: '22px', fontWeight: 800, color: '#0a1f44', margin: '0 0 6px', fontFamily: "'Hind Siliguri', sans-serif" },
  communitySubtitle: { fontSize: '13px', color: '#5a6472', margin: '0 0 20px', fontFamily: "'Hind Siliguri', sans-serif" },
  userGrid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  userCard: { background: '#ffffff', borderRadius: '20px', padding: '20px', boxShadow: '0 8px 25px rgba(10, 31, 68, 0.08)', borderLeft: '4px solid #d4a537' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' },
  cardAvatar: { width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #d4a537' },
  cardNameArea: { flex: 1 },
  cardName: { fontSize: '17px', fontWeight: 800, color: '#0a1f44', margin: '0 0 4px', fontFamily: "'Hind Siliguri', sans-serif" },
  cardTypeBadge: { fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px' },
  cardTypeGeneral: { background: 'rgba(10, 31, 68, 0.10)', color: '#0a1f44' },
  cardTypeJob: { background: 'rgba(212, 165, 55, 0.20)', color: '#8a6a1f' },
  cardCareerInfo: { background: '#f5f7fa', borderRadius: '12px', padding: '12px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' },
  cardInfoRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px' },
  cardInfoLabel: { color: '#8a92a2', fontWeight: 600 },
  cardInfoValue: { color: '#0a1f44', fontWeight: 700 },
  messageBtn: { width: '100%', padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #0a1f44, #16346b)', color: '#ffffff', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'Hind Siliguri', sans-serif", boxShadow: '0 4px 12px rgba(10, 31, 68, 0.2)' },

  emptyContent: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', borderRadius: '20px', border: '2px dashed #d4a537', minHeight: '300px' },
  placeholderText: { fontSize: '20px', color: '#d4a537', fontWeight: 800 },

  // Modal স্টাইল
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10, 31, 68, 0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: '#ffffff', width: '100%', maxWidth: '600px', height: '90vh', display: 'flex', flexDirection: 'column', padding: '20px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1.5px solid #e2e6ee' },
  closeBtn: { background: '#f5f7fa', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' },
  modalTitle: { fontSize: '18px', fontWeight: 700, color: '#0a1f44', margin: 0 },
  modalPostBtn: { background: 'transparent', border: 'none', color: '#d4a537', fontSize: '16px', fontWeight: 800, cursor: 'pointer' },
  modalUserInfo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  modalAvatar: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' },
  modalUserName: { fontSize: '15px', fontWeight: 700, color: '#0a1f44', margin: '0 0 4px' },
  privacyBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f5f7fa', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 },
  colorPalette: { display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1.5px solid #e2e6ee' },
  colorCircle: { width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', flexShrink: 0 },
  modalTextArea: { flex: 1, border: 'none', outline: 'none', fontSize: '20px', resize: 'none', padding: '20px', borderRadius: '16px' },

  // Popup
  popupOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10, 31, 68, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' },
  popupBox: { background: '#ffffff', width: '100%', maxWidth: '360px', borderRadius: '24px', padding: '30px 24px', textAlign: 'center' },
  popupIcon: { fontSize: '50px', marginBottom: '16px' },
  popupTitle: { fontSize: '20px', fontWeight: 800, color: '#0a1f44', margin: '0 0 12px' },
  popupMessage: { fontSize: '14px', color: '#3a4152', margin: '0 0 24px', lineHeight: 1.7 },
  popupBtn: { width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #d4a537, #e6c267)', color: '#0a1f44', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer' },
}

export default UserDashboard
