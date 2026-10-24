import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function UserDashboard({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser)
  
  // অ্যাক্টিভ ট্যাব (হোম, মেসেজ, নোটিফিকেশন ইত্যাদি)
  const [activeTab, setActiveTab] = useState('home')

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

  return (
    <div style={styles.appWrapper}>
      {/* ========================================== */}
      {/* ১. উপরের হেডার (Top Bar) */}
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
          <button style={styles.iconBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a1f44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </header>

      {/* ========================================== */}
      {/* ২. মূল কন্টেন্ট এরিয়া (Main Content) */}
      {/* ========================================== */}
      <main style={styles.mainContent}>
        
        {/* হোম ট্যাব (এখানে পরে আমরা জব লিস্ট বা অন্যান্য ফিচার বসাবো) */}
        {activeTab === 'home' && (
          <div style={styles.emptyStateContainer}>
             {/* আপাতত ফাঁকা, পরে আপনার নির্দেশমতো ডিজাইন করা হবে */}
            <p style={styles.emptyStateText}>Input Your Message</p>
          </div>
        )}

        {/* অন্যান্য ট্যাবের জন্য প্লেসহোল্ডার */}
        {activeTab !== 'home' && (
          <div style={styles.emptyStateContainer}>
            <p style={styles.emptyStateText}>
              {activeTab === 'community' && 'Community Page'}
              {activeTab === 'message' && 'Messages Page'}
              {activeTab === 'notification' && 'Notifications Page'}
              {activeTab === 'profile' && 'Profile Page'}
            </p>
          </div>
        )}

      </main>

      {/* ========================================== */}
      {/* ৩. নিচের নেভিগেশন বার (Bottom Navigation) */}
      {/* ========================================== */}
      <nav style={styles.bottomNav}>
        {/* হোম */}
        <button style={styles.navBtn} onClick={() => setActiveTab('home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'home' ? "#1877F2" : "none"} stroke={activeTab === 'home' ? "#1877F2" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            {activeTab !== 'home' && <polyline points="9 22 9 12 15 12 15 22"></polyline>}
            {activeTab === 'home' && <polyline points="9 22 9 12 15 12 15 22" stroke="#ffffff"></polyline>}
          </svg>
        </button>

        {/* কমিউনিটি */}
        <button style={styles.navBtn} onClick={() => setActiveTab('community')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'community' ? "#1877F2" : "none"} stroke={activeTab === 'community' ? "#1877F2" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </button>

        {/* মেসেজ (নোটিফিকেশন ব্যাজ সহ) */}
        <button style={styles.navBtn} onClick={() => setActiveTab('message')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'message' ? "#1877F2" : "none"} stroke={activeTab === 'message' ? "#1877F2" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span style={styles.badge}>1</span>
        </button>

        {/* নোটিফিকেশন */}
        <button style={styles.navBtn} onClick={() => setActiveTab('notification')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'notification' ? "#1877F2" : "none"} stroke={activeTab === 'notification' ? "#1877F2" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span style={styles.badge}>8</span>
        </button>

        {/* প্রোফাইল */}
        <button style={styles.navBtn} onClick={() => setActiveTab('profile')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'profile' ? "#1877F2" : "none"} stroke={activeTab === 'profile' ? "#1877F2" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </nav>
    </div>
  )
}

// =====================================================
// স্টাইল (প্রিমিয়াম অ্যাপ লুক)
// =====================================================
const styles = {
  appWrapper: {
    minHeight: '100vh',
    width: '100%',
    background: '#f5f7fa',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    position: 'relative'
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
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
  },
  appLogo: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1877F2', // স্কাই ব্লু (Facebook-এর মতো রঙ)
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: '-0.5px'
  },
  topIcons: {
    display: 'flex',
    gap: '8px'
  },
  iconBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: '#f0f2f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer'
  },
  mainContent: {
    flex: 1,
    padding: '16px',
    paddingBottom: '80px', // নিচের নেভিগেশনের জন্য জায়গা
    display: 'flex',
    flexDirection: 'column'
  },
  emptyStateContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
    borderRadius: '16px',
    border: '1.5px dashed #e2e6ee',
    marginTop: '10px'
  },
  emptyStateText: {
    fontSize: '22px',
    color: '#e2e6ee',
    fontWeight: 700,
    fontFamily: "'Hind Siliguri', sans-serif",
    textAlign: 'center'
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#ffffff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '8px 0',
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
    zIndex: 50
  },
  navBtn: {
    position: 'relative',
    background: 'transparent',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badge: {
    position: 'absolute',
    top: '2px',
    right: '10px',
    background: '#d93636',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: 700,
    minWidth: '18px',
    height: '18px',
    borderRadius: '9px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #ffffff'
  }
}

export default UserDashboard
