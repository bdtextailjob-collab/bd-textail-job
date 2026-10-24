import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function UserDashboard({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser)
  const [activeTab, setActiveTab] = useState('home')

  // রিয়েল-টাইম সাবস্ক্রিপশন
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
      {/* ১. টপ বার (লোগো এবং অ্যাকশন আইকন) */}
      {/* ========================================== */}
      <header style={styles.topBar}>
        <h1 style={styles.appLogo}>BD Textail Job</h1>
        <div style={styles.topIcons}>
          <button style={styles.iconBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a1f44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <button style={styles.iconBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a1f44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <button style={styles.iconBtn}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a1f44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </header>

      {/* ========================================== */}
      {/* ২. নেভিগেশন বার (প্রিমিয়াম ব্র্যান্ড স্টাইল) */}
      {/* ========================================== */}
      <nav style={styles.topNav}>
        {/* হোম */}
        <button style={{ ...styles.navBtn, ...(activeTab === 'home' ? styles.navBtnActive : {}) }} onClick={() => setActiveTab('home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'home' ? "#0a1f44" : "none"} stroke={activeTab === 'home' ? "#0a1f44" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            {activeTab !== 'home' && <polyline points="9 22 9 12 15 12 15 22"></polyline>}
            {activeTab === 'home' && <polyline points="9 22 9 12 15 12 15 22" stroke="#ffffff"></polyline>}
          </svg>
        </button>

        {/* কমিউনিটি */}
        <button style={{ ...styles.navBtn, ...(activeTab === 'community' ? styles.navBtnActive : {}) }} onClick={() => setActiveTab('community')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'community' ? "#0a1f44" : "none"} stroke={activeTab === 'community' ? "#0a1f44" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </button>

        {/* মেসেজ */}
        <button style={{ ...styles.navBtn, ...(activeTab === 'message' ? styles.navBtnActive : {}) }} onClick={() => setActiveTab('message')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'message' ? "#0a1f44" : "none"} stroke={activeTab === 'message' ? "#0a1f44" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span style={styles.badge}>1</span>
        </button>

        {/* নোটিফিকেশন */}
        <button style={{ ...styles.navBtn, ...(activeTab === 'notification' ? styles.navBtnActive : {}) }} onClick={() => setActiveTab('notification')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'notification' ? "#0a1f44" : "none"} stroke={activeTab === 'notification' ? "#0a1f44" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span style={styles.badge}>8</span>
        </button>

        {/* প্রোফাইল */}
        <button style={{ ...styles.navBtn, ...(activeTab === 'profile' ? styles.navBtnActive : {}) }} onClick={() => setActiveTab('profile')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'profile' ? "#0a1f44" : "none"} stroke={activeTab === 'profile' ? "#0a1f44" : "#5a6472"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <div style={styles.emptyContent}>
             {/* এখানে পরবর্তী ডিজাইন বসবে */}
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
// স্টাইল (প্রিমিয়াম ব্র্যান্ড কালার)
// =====================================================
const styles = {
  appWrapper: {
    minHeight: '100vh',
    width: '100%',
    background: '#f5f7fa',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  },
  topBar: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'linear-gradient(135deg, #0a1f44 0%, #16346b 100%)',
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(10, 31, 68, 0.20)',
  },
  appLogo: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: '0.5px'
  },
  topIcons: {
    display: 'flex',
    gap: '8px'
  },
  iconBtn: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer'
  },
  
  // নেভিগেশন বার (উপরে)
  topNav: {
    background: '#ffffff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '10px 0',
    boxShadow: '0 4px 10px -5px rgba(0, 0, 0, 0.08)',
    zIndex: 40,
    borderBottom: '1px solid #e2e6ee'
  },
  navBtn: {
    position: 'relative',
    background: 'transparent',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  navBtnActive: {
    background: 'rgba(212, 165, 55, 0.20)', // হালকা সোনালি গ্লো
    padding: '8px 24px'
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
  },

  // মেইন কন্টেন্ট
  mainContent: {
    flex: 1,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    background: '#f5f7fa',
  },
  emptyContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 14px rgba(10, 31, 68, 0.06)',
    minHeight: '300px'
  },
  placeholderText: {
    fontSize: '18px',
    color: '#d4a537',
    fontWeight: 700,
    fontFamily: "'Hind Siliguri', sans-serif",
  }
}

export default UserDashboard
