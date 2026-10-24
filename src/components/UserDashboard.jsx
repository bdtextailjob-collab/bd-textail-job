import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function UserDashboard({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser)

  // রিয়েল-টাইম সাবস্ক্রিপশন (যদি অ্যাডমিন মাঝপথে স্ট্যাটাস পরিবর্তন করে, তবে ইউজার লগআউট হয়ে যাবে)
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
            onLogout() // সাথে সাথে লগআউট করে দেবে
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
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoRow}>
            <div style={styles.logoCircle}>BT</div>
            <div>
              <p style={styles.headerTitle}>BD Textail Job</p>
              <p style={styles.headerSubtitle}>আমার ড্যাশবোর্ড</p>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={onLogout}>লগআউট</button>
        </div>
      </header>

      <main style={styles.main}>
        {/* প্রোফাইল কার্ড (স্ট্যাটাস ব্যাজ ছাড়া) */}
        <section style={styles.profileCard}>
          <img src={user.profile_image_url} alt={user.name} style={styles.profileImage} />
          <h2 style={styles.userName}>{user.name}</h2>
          <p style={styles.userEmail}>{user.email}</p>
          <p style={styles.userMobile}>📱 {user.mobile}</p>
          
          {user.status === 'pending' && (
            <p style={{ ...styles.statusMessage, color: '#d4a537' }}>
              আপনার অ্যাকাউন্টটি সাপোর্ট টিম যাচাই করছেন। অপেক্ষা করুন।
            </p>
          )}
          {user.status === 'approved' && (
            <p style={{ ...styles.statusMessage, color: '#1e9d5a' }}>
              🎉 অভিনন্দন! আপনার অ্যাকাউন্ট অনুমোদিত হয়েছে।
            </p>
          )}
          {user.status === 'rejected' && (
            <p style={{ ...styles.statusMessage, color: '#d93636' }}>
              আপনার অ্যাকাউন্টটি বাতিল করা হয়েছে। সাপোর্টে যোগাযোগ করুন।
            </p>
          )}
        </section>

        <section style={styles.infoCard}>
          <p style={styles.infoTitle}>আপনার তথ্য</p>
          <div style={styles.infoRow}><span style={styles.infoLabel}>বাবার নাম</span><span style={styles.infoValue}>{user.father_name}</span></div>
          <div style={styles.infoRow}><span style={styles.infoLabel}>মায়ের নাম</span><span style={styles.infoValue}>{user.mother_name}</span></div>
          <div style={styles.infoRow}><span style={styles.infoLabel}>ঠিকানা</span><span style={styles.infoValue}>{user.village}, {user.thana}, {user.district}</span></div>
          <div style={styles.infoRow}><span style={styles.infoLabel}>শিক্ষা</span><span style={styles.infoValue}>{user.education_level}</span></div>
          {user.user_type === 'job_seeker' && user.industry_type && (
            <div style={styles.infoRow}><span style={styles.infoLabel}>ইন্ডাস্ট্রি</span><span style={styles.infoValue}>{user.industry_type}</span></div>
          )}
          {user.user_type === 'job_seeker' && user.designation && (
            <div style={styles.infoRow}><span style={styles.infoLabel}>পদবী</span><span style={styles.infoValue}>{user.designation}</span></div>
          )}
        </section>

        <section style={styles.comingSoonCard}>
          <p style={styles.comingSoonTitle}>🔔 শীঘ্রই আসছে</p>
          <p style={styles.comingSoonText}>চাকরির আবেদন, নোটিফিকেশন, চ্যাট — সব সুবিধা শীঘ্রই যুক্ত হবে।</p>
        </section>
      </main>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', width: '100%', background: '#f5f7fa', display: 'flex', flexDirection: 'column' },
  header: { position: 'sticky', top: 0, zIndex: 50, background: 'linear-gradient(135deg, #0a1f44 0%, #16346b 100%)', padding: '14px 16px', boxShadow: '0 2px 10px rgba(10, 31, 68, 0.15)' },
  headerInner: { maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoCircle: { width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4a537, #e6c267)', color: '#0a1f44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', fontFamily: "'Poppins', sans-serif" },
  headerTitle: { fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: "'Poppins', sans-serif" },
  headerSubtitle: { fontSize: '11px', color: '#e6c267', margin: '2px 0 0', fontFamily: "'Hind Siliguri', sans-serif" },
  logoutBtn: { padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: "'Hind Siliguri', sans-serif" },
  main: { flex: 1, maxWidth: '480px', width: '100%', margin: '0 auto', padding: '18px 16px 32px', display: 'flex', flexDirection: 'column', gap: '14px' },
  profileCard: { background: '#ffffff', borderRadius: '20px', padding: '24px 20px', textAlign: 'center', boxShadow: '0 6px 20px rgba(10, 31, 68, 0.08)', borderTop: '4px solid #d4a537' },
  profileImage: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #d4a537', margin: '0 auto 12px', display: 'block', boxShadow: '0 6px 18px rgba(212, 165, 55, 0.30)' },
  userName: { fontSize: '19px', fontWeight: 700, color: '#0a1f44', margin: '0 0 4px', fontFamily: "'Hind Siliguri', sans-serif" },
  userEmail: { fontSize: '13px', color: '#5a6472', margin: '0 0 4px', fontFamily: "'Poppins', sans-serif", wordBreak: 'break-all' },
  userMobile: { fontSize: '13px', color: '#5a6472', margin: '0 0 16px', fontFamily: "'Hind Siliguri', sans-serif" },
  statusMessage: { fontSize: '13.5px', margin: '8px 0 0', lineHeight: 1.65, fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 600 },
  infoCard: { background: '#ffffff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 14px rgba(10, 31, 68, 0.06)' },
  infoTitle: { fontSize: '14px', fontWeight: 700, color: '#0a1f44', margin: '0 0 14px', paddingBottom: '10px', borderBottom: '1.5px solid #e2e6ee', fontFamily: "'Hind Siliguri', sans-serif" },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '13px', fontFamily: "'Hind Siliguri', sans-serif", gap: '10px' },
  infoLabel: { color: '#8a92a2', fontWeight: 500, flexShrink: 0 },
  infoValue: { color: '#0a1f44', fontWeight: 600, textAlign: 'right' },
  comingSoonCard: { background: 'rgba(212, 165, 55, 0.10)', border: '1.5px dashed #d4a537', borderRadius: '16px', padding: '16px', textAlign: 'center' },
  comingSoonTitle: { fontSize: '13px', fontWeight: 700, color: '#8a6a1f', margin: '0 0 6px', fontFamily: "'Hind Siliguri', sans-serif" },
  comingSoonText: { fontSize: '12px', color: '#5a6472', margin: 0, lineHeight: 1.6, fontFamily: "'Hind Siliguri', sans-serif" },
}

export default UserDashboard
