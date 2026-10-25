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
      {/* ২. নেভিগেশন বার (3D হাইলাইট) */}
      {/* ========================================== */}
      <nav style={styles.topNav}>
        <button style={{ ...styles.navBtn, ...(activeTab === 'home' ? styles.navBtnActive : {}) }} onClick={() => setActiveTab('home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'home' ? "#ffffff" : "none"} stroke={activeTab === 'home' ? "#ffffff" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            {activeTab !== 'home' && <polyline points="9 22 9 12 15 12 15 22"></polyline>}
            {activeTab === 'home' && <polyline points="9 22 9 12 15 12 15 22" stroke="#ffffff"></polyline>}
          </svg>
        </button>

        <button style={{ ...styles.navBtn, ...(activeTab === 'community' ? styles.navBtnActive : {}) }} onClick={() => setActiveTab('community')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'community' ? "#ffffff" : "none"} stroke={activeTab === 'community' ? "#ffffff" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </button>

        <button style={{ ...styles.navBtn, ...(activeTab === 'message' ? styles.navBtnActive : {}) }} onClick={() => setActiveTab('message')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'message' ? "#ffffff" : "none"} stroke={activeTab === 'message' ? "#ffffff" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span style={styles.badge}>1</span>
        </button>

        <button style={{ ...styles.navBtn, ...(activeTab === 'notification' ? styles.navBtnActive : {}) }} onClick={() => setActiveTab('notification')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'notification' ? "#ffffff" : "none"} stroke={activeTab === 'notification' ? "#ffffff" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span style={styles.badge}>8</span>
        </button>

        <button style={{ ...styles.navBtn, ...(activeTab === 'profile' ? styles.navBtnActive : {}) }} onClick={() => setActiveTab('profile')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'profile' ? "#ffffff" : "none"} stroke={activeTab === 'profile' ? "#ffffff" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            
            {/* পোস্ট তৈরি করার বক্স (3D শ্যাডো সহ) */}
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
// স্টাইল (3D ও লাইভ ইফেক্ট)
// =====================================================
const styles = {
  appWrapper: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e2e6ee 100%)', // হালকা গ্রেডিয়েন্ট ব্যাকগ্রাউন্ড
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  },
  topBar: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: '#ffffff',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', // 3D শ্যাডো
  },
  appLogo: {
    fontSize: '24px',
    fontWeight: 800,
    background: 'linear-gradient(45deg, #1877F2, #00C6FF)', // গ্রেডিয়েন্ট টেক্সট
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: '-0.5px',
    filter: 'drop-shadow(0px 2px 4px rgba(24, 119, 242, 0.2))', // টেক্সটে হালকা গ্লো
  },
  topIcons: {
    display: 'flex',
    gap: '12px',
  },
  iconBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08), inset 0 -2px 5px rgba(0,0,0,0.02)', // 3D বাটন
    transition: 'transform 0.1s ease',
  },
  
  // নেভিগেশন বার (3D হাইলাইট)
  topNav: {
    background: '#ffffff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '12px 0',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.05)', // নিচে শ্যাডো
    zIndex: 40,
    position: 'sticky',
    top: '65px',
  },
  navBtn: {
    position: 'relative',
    background: 'transparent',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  navBtnActive: {
    background: 'linear-gradient(135deg, #1877F2 0%, #00C6FF 100%)', // স্কাই ব্লু গ্রেডিয়েন্ট
    boxShadow: '0 8px 16px rgba(24, 119, 242, 0.4)', // 3D গ্লো
    transform: 'translateY(-2px)', // উপরে উঠে আসা
  },
  badge: {
    position: 'absolute',
    top: '0px',
    right: '8px',
    background: 'linear-gradient(135deg, #ff416c, #ff4b2b)', // লাল গ্রেডিয়েন্ট
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: 800,
    minWidth: '20px',
    height: '20px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #ffffff',
    boxShadow: '0 2px 5px rgba(255, 65, 108, 0.4)',
  },

  // মেইন কন্টেন্ট
  mainContent: {
    flex: 1,
    padding: '16px',
  },
  feedContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  
  // পোস্ট তৈরির বক্স (3D কার্ড)
  createPostBox: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '18px',
    boxShadow: '0 10px 25px rgba(10, 31, 68, 0.08), 0 2px 5px rgba(10, 31, 68, 0.04)', // ডাবল শ্যাডো
    transform: 'translateY(0)',
    transition: 'transform 0.2s ease',
  },
  postHeader: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  avatar: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #1877F2',
    padding: '2px',
  },
  postTextArea: {
    flex: 1,
    padding: '14px',
    borderRadius: '14px',
    border: '1px solid #e2e6ee',
    background: '#f8fafc',
    fontSize: '14.5px',
    fontFamily: "'Hind Siliguri', sans-serif",
    resize: 'none',
    outline: 'none',
    boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.02)', // ভেতরে হালকা শ্যাডো (ইনপুট ফিল)
  },
  postActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '14px',
  },
  postSubmitBtn: {
    padding: '10px 24px',
    borderRadius: '25px',
    background: 'linear-gradient(135deg, #d4a537 0%, #f3d47a 100%)', // সোনালি গ্রেডিয়েন্ট (প্রিমিয়াম)
    color: '#0a1f44',
    fontSize: '14px',
    fontWeight: 800,
    fontFamily: "'Hind Siliguri', sans-serif",
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 6px 15px rgba(212, 165, 55, 0.4)', // সোনালি 3D গ্লো
    transition: 'all 0.2s ease',
  },

  // ফিডের স্টাইল (জীবন্ত লুক)
  feedCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '18px',
    boxShadow: '0 8px 20px rgba(10, 31, 68, 0.06)', // সফট 3D শ্যাডো
    borderLeft: '4px solid #1877F2', // বাম দিকে হাইলাইট বর্ডার
  },
  feedHeader: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '12px',
  },
  feedAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  feedAuthor: {
    fontSize: '15px',
    fontWeight: 800,
    color: '#0a1f44',
    margin: '0 0 2px',
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  feedTime: {
    fontSize: '11px',
    color: '#8a92a2',
    margin: 0,
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  feedContent: {
    fontSize: '15px',
    color: '#3a4152',
    margin: 0,
    lineHeight: 1.7,
    fontFamily: "'Hind Siliguri', sans-serif",
  },

  // অন্যান্য ট্যাবের প্লেসহোল্ডার
  emptyContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
    borderRadius: '20px',
    border: '2px dashed #e2e6ee',
    minHeight: '300px',
    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)',
  },
  placeholderText: {
    fontSize: '20px',
    color: '#d4a537',
    fontWeight: 800,
    fontFamily: "'Hind Siliguri', sans-serif",
  }
}

export default UserDashboard
