import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function UserDashboard({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser)
  const [activeTab, setActiveTab] = useState('home')
  
  // পোস্ট টেক্সট এরিয়ার স্টেট
  const [postText, setPostText] = useState('')

  // ডেমো পোস্ট (পরে ডেটাবেস থেকে আসবে)
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'সাধারণ ইউজার',
      authorImage: 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff',
      time: '২ ঘণ্টা আগে',
      content: 'আমাদের গার্মেন্টসে ৫ জন অপারেটর প্রয়োজন। আগ্রহীরা ইনবক্স করুন।',
    },
    {
      id: 2,
      author: 'মোঃ রফিকুল ইসলাম',
      authorImage: 'https://ui-avatars.com/api/?name=Rofiq&background=D4A537&color=fff',
      time: '৫ ঘণ্টা আগে',
      content: 'আমি একজন সুপারভাইজার হিসেবে কাজ খুঁজছি। ৫ বছরের অভিজ্ঞতা আছে।',
    }
  ])

  // রিয়েল-টাইম সাবস্ক্রিপশন (স্ট্যাটাস পরিবর্তন হলে লগআউট করার জন্য)
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

  // নতুন পোস্ট সাবমিট করার ফাংশন
  const handlePostSubmit = () => {
    if (!postText.trim()) return;
    
    // নতুন পোস্ট লোকাল স্টেটে যোগ করা (পরে ডেটাবেসে যাবে)
    const newPost = {
      id: Date.now(),
      author: user.name,
      authorImage: user.profile_image_url || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`,
      time: 'এখনই',
      content: postText
    }

    setPosts([newPost, ...posts])
    setPostText('')
  }

  return (
    <div style={styles.appWrapper}>
      
      {/* ========================================== */}
      {/* ১. টপ বার */}
      {/* ========================================== */}
      <header style={styles.topBar}>
        <h1 style={styles.appLogo}>BD Textail Job</h1>
        <div style={styles.topIcons}>
          <button style={styles.iconBtn}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a1f44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <button style={styles.iconBtn}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a1f44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <button style={styles.iconBtn} onClick={onLogout}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a1f44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </header>

      {/* ========================================== */}
      {/* ২. নেভিগেশন বার */}
      {/* ========================================== */}
      <nav style={styles.topNav}>
        <button style={styles.navBtn} onClick={() => setActiveTab('home')}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === 'home' ? "#1877F2" : "none"} stroke={activeTab === 'home' ? "#1877F2" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            {activeTab !== 'home' && <polyline points="9 22 9 12 15 12 15 22"></polyline>}
            {activeTab === 'home' && <polyline points="9 22 9 12 15 12 15 22" stroke="#ffffff"></polyline>}
          </svg>
        </button>
        <button style={styles.navBtn} onClick={() => setActiveTab('community')}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === 'community' ? "#1877F2" : "none"} stroke={activeTab === 'community' ? "#1877F2" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </button>
        <button style={styles.navBtn} onClick={() => setActiveTab('message')}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === 'message' ? "#1877F2" : "none"} stroke={activeTab === 'message' ? "#1877F2" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span style={styles.badge}>1</span>
        </button>
        <button style={styles.navBtn} onClick={() => setActiveTab('notification')}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === 'notification' ? "#1877F2" : "none"} stroke={activeTab === 'notification' ? "#1877F2" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span style={styles.badge}>8</span>
        </button>
        <button style={styles.navBtn} onClick={() => setActiveTab('profile')}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === 'profile' ? "#1877F2" : "none"} stroke={activeTab === 'profile' ? "#1877F2" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </nav>

      {/* ========================================== */}
      {/* ৩. মূল কন্টেন্ট এরিয়া */}
      {/* ========================================== */}
      <main style={styles.mainContent}>
        
        {activeTab === 'home' && (
          <div style={styles.feedContainer}>
            
            {/* পোস্ট তৈরি করার বক্স */}
            <div style={styles.createPostBox}>
              <div style={styles.postHeader}>
                <img 
                  src={user.profile_image_url || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`} 
                  alt="Profile" 
                  style={styles.avatar} 
                />
                <textarea 
                  style={styles.postTextArea}
                  placeholder="দক্ষ লোক খুঁজতে পোস্ট করুন..."
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  rows={2}
                />
              </div>
              <div style={styles.postActions}>
                <button style={styles.postSubmitBtn} onClick={handlePostSubmit}>পোস্ট করুন</button>
              </div>
            </div>

            {/* ফিড (ডেমো পোস্টসমূহ) */}
            {posts.map((post) => (
              <div key={post.id} style={styles.feedCard}>
                <div style={styles.feedHeader}>
                  <img src={post.authorImage} alt="User" style={styles.feedAvatar} />
                  <div>
                    <p style={styles.feedAuthor}>{post.author}</p>
                    <p style={styles.feedTime}>{post.time}</p>
                  </div>
                </div>
                <p style={styles.feedContent}>{post.content}</p>
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
    </div>
  )
}

// =====================================================
// স্টাইল (প্রিমিয়াম অ্যাপ লুক)
// =====================================================
const styles = {
  appWrapper: { minHeight: '100vh', width: '100%', background: '#f5f7fa', display: 'flex', flexDirection: 'column', overflowX: 'hidden' },
  topBar: { position: 'sticky', top: 0, zIndex: 50, background: '#ffffff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f2f6' },
  appLogo: { fontSize: '24px', fontWeight: 700, color: '#1877F2', margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.5px' },
  topIcons: { display: 'flex', gap: '8px' },
  iconBtn: { width: '38px', height: '38px', borderRadius: '50%', background: '#f0f2f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' },
  
  topNav: { background: '#ffffff', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0', boxShadow: '0 4px 10px -5px rgba(0, 0, 0, 0.05)', zIndex: 40, position: 'sticky', top: '65px' },
  navBtn: { position: 'relative', background: 'transparent', border: 'none', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: '2px', right: '10px', background: '#d93636', color: '#ffffff', fontSize: '10px', fontWeight: 700, minWidth: '18px', height: '18px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #ffffff' },

  mainContent: { flex: 1, padding: '16px', background: '#f5f7fa' },
  feedContainer: { maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' },
  
  // পোস্ট তৈরির স্টাইল
  createPostBox: { background: '#ffffff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(10, 31, 68, 0.06)' },
  postHeader: { display: 'flex', gap: '12px', alignItems: 'flex-start' },
  avatar: { width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 },
  postTextArea: { flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e6ee', background: '#f5f7fa', fontSize: '14px', fontFamily: "'Hind Siliguri', sans-serif", resize: 'none', outline: 'none' },
  postActions: { display: 'flex', justifyContent: 'flex-end', marginTop: '12px' },
  postSubmitBtn: { padding: '8px 20px', borderRadius: '20px', background: '#1877F2', color: '#ffffff', fontSize: '14px', fontWeight: 600, fontFamily: "'Hind Siliguri', sans-serif", border: 'none', cursor: 'pointer' },

  // ফিডের স্টাইল
  feedCard: { background: '#ffffff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(10, 31, 68, 0.06)' },
  feedHeader: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' },
  feedAvatar: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' },
  feedAuthor: { fontSize: '15px', fontWeight: 700, color: '#0a1f44', margin: '0 0 2px', fontFamily: "'Hind Siliguri', sans-serif" },
  feedTime: { fontSize: '11px', color: '#8a92a2', margin: 0, fontFamily: "'Hind Siliguri', sans-serif" },
  feedContent: { fontSize: '14.5px', color: '#3a4152', margin: 0, lineHeight: 1.6, fontFamily: "'Hind Siliguri', sans-serif" },

  // অন্যান্য ট্যাবের প্লেসহোল্ডার
  emptyContent: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', borderRadius: '16px', border: '1.5px dashed #e2e6ee', minHeight: '300px' },
  placeholderText: { fontSize: '20px', color: '#e2e6ee', fontWeight: 700, fontFamily: "'Hind Siliguri', sans-serif" }
}

export default UserDashboard
