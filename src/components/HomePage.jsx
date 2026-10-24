import { useState } from 'react'
import UserRegisterForm from './UserRegisterForm.jsx'
import JobSeekerRegisterForm from './JobSeekerRegisterForm.jsx'
import LoginPage from './LoginPage.jsx'
import UserDashboard from './UserDashboard.jsx'

function HomePage() {
  const [showAccountPopup, setShowAccountPopup] = useState(false)
  const [activeView, setActiveView] = useState('home') // 'home', 'register-general', 'register-jobseeker', 'login', 'dashboard'
  const [loggedInUser, setLoggedInUser] = useState(null)

  const handleOpenAccount = () => setShowAccountPopup(true)
  const handleCloseAccount = () => setShowAccountPopup(false)

  const handleSelectGeneralUser = () => { setShowAccountPopup(false); setActiveView('register-general') }
  const handleSelectJobSeeker = () => { setShowAccountPopup(false); setActiveView('register-jobseeker') }

  const handleCloseForm = () => setActiveView('home')

  // লগইন বাটন
  const handleLoginClick = () => { setActiveView('login') }
  const handleCloseLogin = () => setActiveView('home')

  // লগইন সফল হলে
  const handleLoginSuccess = (userData) => {
    setLoggedInUser(userData)
    setActiveView('dashboard')
  }

  // লগআউট
  const handleLogout = () => {
    setLoggedInUser(null)
    setActiveView('home')
  }

  // রেন্ডার
  if (activeView === 'register-general') return <UserRegisterForm onClose={handleCloseForm} />
  if (activeView === 'register-jobseeker') return <JobSeekerRegisterForm onClose={handleCloseForm} />
  if (activeView === 'login') return <LoginPage onLoginSuccess={handleLoginSuccess} onClose={handleCloseLogin} />
  if (activeView === 'dashboard' && loggedInUser) return <UserDashboard user={loggedInUser} onLogout={handleLogout} />

  return (
    <div style={styles.page}>
      {/* হেডার */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoArea}>
            <div style={styles.logoCircle}>BT</div>
            <div>
              <h1 style={styles.logoTitle}>BD Textail Job</h1>
              <p style={styles.logoSubtitle}>বিডি টেক্সটাইল জব</p>
            </div>
          </div>
          <button style={styles.menuBtn} onClick={() => alert('মেনু শীঘ্রই যুক্ত হবে।')} aria-label="মেনু">
            <span style={styles.menuLine}></span>
            <span style={styles.menuLine}></span>
            <span style={styles.menuLine}></span>
          </button>
        </div>
      </header>

      {/* মূল কনটেন্ট */}
      <main style={styles.main}>
        <section style={styles.welcomeCard}>
          <div style={styles.welcomeBadge}>স্বাগতম</div>
          <h2 style={styles.welcomeTitle}>BD Textail Job-এ আপনাকে স্বাগতম!</h2>
          <p style={styles.welcomeText}>আপনার সুন্দর ভবিষ্যৎ গড়ার যাত্রা শুরু হোক এখান থেকেই। একটি অ্যাকাউন্ট তৈরি করে বাংলাদেশের টেক্সটাইল ও গার্মেন্টস শিল্পের বিভিন্ন চাকরির সুযোগ খুঁজুন।</p>
          <p style={styles.welcomeText}>আর আপনি যদি কোনো কোম্পানি বা কারখানার নিয়োগদাতা হন, তাহলে আপনার প্রতিষ্ঠানের বিভিন্ন সেকশন ও পদের জন্য উপযুক্ত কর্মী খুঁজে নিতে পারবেন।</p>
          <p style={styles.welcomeTextBold}>চাকরির সুযোগ ও দক্ষ কর্মীর মধ্যে তৈরি হোক সহজ সংযোগ। বেকারত্ব কমানোর প্রচেষ্টায় আপনিও হোন আমাদের অংশ।</p>
          <p style={styles.welcomeTextLast}>আজই BD Textail Job-এ অ্যাকাউন্ট তৈরি করুন, নিজের সুন্দর ভবিষ্যৎ গড়ার পথে এগিয়ে যান।</p>
        </section>

        <section style={styles.actionSection}>
          <button style={styles.btnPrimary} onClick={handleOpenAccount}>অ্যাকাউন্ট করুন</button>
          <button style={styles.btnOutline} onClick={handleLoginClick}>লগইন করুন</button>
        </section>

        <section style={styles.statsCard}>
          <p style={styles.statsLabel}>মোট নিবন্ধিত ব্যবহারকারী</p>
          <p style={styles.statsNumber}>০</p>
          <p style={styles.statsNote}>ডেটাবেস সংযোগের পর প্রকৃত সংখ্যা দেখাবে</p>
        </section>
      </main>

      <footer style={styles.footer}>
        <h3 style={styles.footerBrand}>BD Textail Job</h3>
        <p style={styles.footerDesc}>বাংলাদেশের টেক্সটাইল ও গার্মেন্টস শিল্পের জন্য একটি আধুনিক অনলাইন জব প্ল্যাটফর্ম।</p>
        <div style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>আমাদের সম্পর্কে</a>
          <a href="#" style={styles.footerLink}>যোগাযোগ</a>
          <a href="#" style={styles.footerLink}>গোপনীয়তা নীতি</a>
          <a href="#" style={styles.footerLink}>শর্তাবলি</a>
        </div>
        <div style={styles.footerDivider}></div>
        <p style={styles.footerCopy}>© ২০২৬ BD Textail Job — সর্বস্বত্ব সংরক্ষিত</p>
      </footer>

      {showAccountPopup && (
        <div style={styles.popupOverlay} onClick={handleCloseAccount}>
          <div style={styles.popupBox} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.popupTitle}>অ্যাকাউন্টের ধরন নির্বাচন করুন</h3>
            <p style={styles.popupSubtitle}>আপনার প্রয়োজন অনুযায়ী একটি অপশন বেছে নিন</p>

            <button style={styles.popupOption} onClick={handleSelectGeneralUser}>
              <div style={styles.popupOptionIcon}>👤</div>
              <div style={styles.popupOptionContent}>
                <p style={styles.popupOptionTitle}>সাধারণ ইউজার</p>
                <p style={styles.popupOptionDesc}>চাকরির সুযোগ দেখতে ও আবেদন করতে</p>
              </div>
            </button>

            <button style={styles.popupOption} onClick={handleSelectJobSeeker}>
              <div style={styles.popupOptionIcon}>💼</div>
              <div style={styles.popupOptionContent}>
                <p style={styles.popupOptionTitle}>চাকরিজীবী</p>
                <p style={styles.popupOptionDesc}>প্রতিষ্ঠানের জন্য কর্মী খুঁজতে</p>
              </div>
            </button>

            <button style={styles.popupClose} onClick={handleCloseAccount}>বাতিল করুন</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popupFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popupSlide { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', width: '100%', background: '#f5f7fa', display: 'flex', flexDirection: 'column', overflowX: 'hidden' },
  header: { position: 'sticky', top: 0, zIndex: 50, background: '#0a1f44', boxShadow: '0 2px 10px rgba(10, 31, 68, 0.15)' },
  headerInner: { maxWidth: '480px', margin: '0 auto', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logoArea: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoCircle: { width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4a537, #e6c267)', color: '#0a1f44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '15px', fontFamily: "'Poppins', sans-serif", boxShadow: '0 2px 8px rgba(212,165,55,0.35)' },
  logoTitle: { fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.2, fontFamily: "'Poppins', sans-serif" },
  logoSubtitle: { fontSize: '11px', color: '#e6c267', margin: 0, marginTop: '2px', fontFamily: "'Hind Siliguri', sans-serif" },
  menuBtn: { width: '36px', height: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px' },
  menuLine: { display: 'block', width: '18px', height: '2px', background: '#ffffff', borderRadius: '2px' },
  main: { flex: 1, width: '100%', maxWidth: '480px', margin: '0 auto', padding: '18px 16px 32px', display: 'flex', flexDirection: 'column', gap: '18px' },
  welcomeCard: { background: '#ffffff', borderRadius: '18px', padding: '24px 20px', boxShadow: '0 6px 18px rgba(10, 31, 68, 0.08)', animation: 'fadeIn 0.6s ease-out', borderTop: '4px solid #d4a537' },
  welcomeBadge: { display: 'inline-block', background: 'linear-gradient(135deg, #d4a537, #e6c267)', color: '#0a1f44', fontSize: '11px', fontWeight: 700, padding: '5px 12px', borderRadius: '20px', letterSpacing: '0.5px', marginBottom: '14px', fontFamily: "'Hind Siliguri', sans-serif" },
  welcomeTitle: { fontSize: '20px', fontWeight: 700, color: '#0a1f44', margin: 0, marginBottom: '16px', lineHeight: 1.4, fontFamily: "'Hind Siliguri', sans-serif" },
  welcomeText: { fontSize: '14.5px', lineHeight: 1.75, color: '#3a4152', margin: 0, marginBottom: '14px', fontFamily: "'Hind Siliguri', sans-serif" },
  welcomeTextBold: { fontSize: '14.5px', lineHeight: 1.75, color: '#0a1f44', fontWeight: 600, margin: 0, marginBottom: '14px', padding: '12px 14px', background: 'rgba(212, 165, 55, 0.10)', borderLeft: '3px solid #d4a537', borderRadius: '6px', fontFamily: "'Hind Siliguri', sans-serif" },
  welcomeTextLast: { fontSize: '14.5px', lineHeight: 1.75, color: '#3a4152', margin: 0, fontWeight: 500, fontFamily: "'Hind Siliguri', sans-serif" },
  actionSection: { display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 0.6s ease-out 0.15s both' },
  btnPrimary: { width: '100%', padding: '15px 20px', borderRadius: '12px', background: 'linear-gradient(135deg, #0a1f44, #16346b)', color: '#ffffff', fontSize: '16px', fontWeight: 700, fontFamily: "'Hind Siliguri', sans-serif", border: 'none', cursor: 'pointer', boxShadow: '0 6px 16px rgba(10, 31, 68, 0.25)', letterSpacing: '0.3px' },
  btnOutline: { width: '100%', padding: '15px 20px', borderRadius: '12px', background: '#ffffff', color: '#0a1f44', fontSize: '16px', fontWeight: 700, fontFamily: "'Hind Siliguri', sans-serif", border: '2px solid #0a1f44', cursor: 'pointer', letterSpacing: '0.3px' },
  statsCard: { background: 'linear-gradient(135deg, #0a1f44 0%, #16346b 100%)', borderRadius: '18px', padding: '24px 20px', textAlign: 'center', boxShadow: '0 8px 22px rgba(10, 31, 68, 0.20)', animation: 'fadeIn 0.6s ease-out 0.3s both', position: 'relative', overflow: 'hidden' },
  statsLabel: { fontSize: '13px', color: '#e6c267', margin: 0, marginBottom: '8px', letterSpacing: '0.5px', fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 500 },
  statsNumber: { fontSize: '42px', fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1, fontFamily: "'Poppins', sans-serif", textShadow: '0 2px 12px rgba(212,165,55,0.3)' },
  statsNote: { fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0, marginTop: '10px', fontFamily: "'Hind Siliguri', sans-serif", lineHeight: 1.5 },
  footer: { background: '#0a1f44', padding: '28px 20px 22px', textAlign: 'center', marginTop: 'auto' },
  footerBrand: { fontSize: '17px', fontWeight: 700, color: '#ffffff', margin: 0, marginBottom: '10px', fontFamily: "'Poppins', sans-serif" },
  footerDesc: { fontSize: '12.5px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0, marginBottom: '18px', maxWidth: '360px', marginLeft: 'auto', marginRight: 'auto', fontFamily: "'Hind Siliguri', sans-serif" },
  footerLinks: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px 20px', marginBottom: '18px' },
  footerLink: { fontSize: '12.5px', color: '#e6c267', textDecoration: 'none', fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 500 },
  footerDivider: { width: '60px', height: '1px', background: 'rgba(230,194,103,0.35)', margin: '0 auto 14px' },
  footerCopy: { fontSize: '11.5px', color: 'rgba(255,255,255,0.5)', margin: 0, fontFamily: "'Hind Siliguri', sans-serif", letterSpacing: '0.3px' },
  popupOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10, 31, 68, 0.65)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 100, animation: 'popupFade 0.25s ease-out' },
  popupBox: { width: '100%', maxWidth: '400px', background: '#ffffff', borderRadius: '20px', padding: '24px 20px 20px', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)', animation: 'popupSlide 0.3s ease-out' },
  popupTitle: { fontSize: '18px', fontWeight: 700, color: '#0a1f44', margin: 0, marginBottom: '6px', textAlign: 'center', fontFamily: "'Hind Siliguri', sans-serif" },
  popupSubtitle: { fontSize: '13px', color: '#5a6472', margin: 0, marginBottom: '20px', textAlign: 'center', fontFamily: "'Hind Siliguri', sans-serif" },
  popupOption: { width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: '#f5f7fa', border: '2px solid transparent', borderRadius: '14px', marginBottom: '12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' },
  popupOptionIcon: { width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #0a1f44, #16346b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 },
  popupOptionContent: { flex: 1 },
  popupOptionTitle: { fontSize: '15px', fontWeight: 700, color: '#0a1f44', margin: 0, marginBottom: '3px', fontFamily: "'Hind Siliguri', sans-serif" },
  popupOptionDesc: { fontSize: '12px', color: '#5a6472', margin: 0, fontFamily: "'Hind Siliguri', sans-serif", lineHeight: 1.4 },
  popupClose: { width: '100%', padding: '12px', marginTop: '6px', background: 'transparent', color: '#5a6472', fontSize: '14px', fontWeight: 600, fontFamily: "'Hind Siliguri', sans-serif", border: 'none', cursor: 'pointer', borderRadius: '10px' },
}

export default HomePage
