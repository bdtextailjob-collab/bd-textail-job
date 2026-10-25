import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function LoginPage({ onLoginSuccess, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // পপআপ স্টেট
  const [blockedPopup, setBlockedPopup] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) { setError('জিমেইল এড্রেস দিন'); return }
    if (!password) { setError('পাসওয়ার্ড দিন'); return }

    setLoading(true)

    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('password', password)
        .single()

      if (fetchError || !data) {
        setError('ভুল ইমেইল বা পাসওয়ার্ড!')
        setLoading(false)
        return
      }

      // স্ট্যাটাস চেক
      if (data.status !== 'approved') {
        setBlockedPopup(data.status)
        setLoading(false)
        return
      }

      // সফল লগইন
      setLoading(false)
      onLoginSuccess(data)
      
    } catch (err) {
      console.error(err)
      setError('লগইন করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।')
      setLoading(false)
    }
  }

  // পপআপ মেসেজ
  const getPopupMessage = (status) => {
    if (status === 'pending') return 'আপনার অ্যাকাউন্টটি পেন্ডিং অবস্থায় আছে। BD Textail Job-এর সাপোর্ট টিম আপনার অ্যাকাউন্টটি পর্যবেক্ষণ করছেন। অনুগ্রহ করে কনফার্মেশন SMS-এর জন্য অপেক্ষা করুন।'
    if (status === 'rejected') return 'দুঃখিত, আপনার অ্যাকাউন্টটি বাতিল করা হয়েছে। বিস্তারিত জানতে সাপোর্টে যোগাযোগ করুন।'
    if (status === 'suspended') return 'আপনার অ্যাকাউন্টটি সাময়িকভাবে সাসপেন্ড করা হয়েছে। সাপোর্ট টিমের সাথে যোগাযোগ করুন।'
    if (status === 'blocked') return 'দুঃখিত, আপনার অ্যাকাউন্টটি ব্লক করা হয়েছে। বিস্তারিত জানতে সাপোর্টে যোগাযোগ করুন।'
    if (status === 'disabled') return 'আপনার অ্যাকাউন্টটি নিষ্ক্রিয় (Disable) করা হয়েছে। সাপোর্টে যোগাযোগ করুন।'
    return 'আপনার অ্যাকাউন্টটি বর্তমানে লগইন করার অনুমতি নেই।'
  }

  // পপআপ টাইটেল
  const getPopupTitle = (status) => {
    if (status === 'pending') return '⏳ অ্যাকাউন্ট পেন্ডিং'
    return '🚫 অ্যাক্সেস ব্লকড'
  }

  return (
    <div style={styles.wrapper}>
      <button style={styles.closeBtn} onClick={onClose} aria-label="বন্ধ">✕</button>

      <div style={styles.loginBox}>
        <div style={styles.logoArea}>
          <div style={styles.logoCircle}>BT</div>
          <h1 style={styles.title}>BD Textail Job</h1>
          <p style={styles.subtitle}>আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>জিমেইল এড্রেস</label>
            <input
              type="email"
              inputMode="email"
              style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              disabled={loading}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>পাসওয়ার্ড</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                style={{ ...styles.input, paddingRight: '44px', ...(error ? styles.inputError : {}) }}
                placeholder="আপনার পাসওয়ার্ড"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                disabled={loading}
              />
              <button type="button" style={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" style={styles.loginBtn} disabled={loading}>
            {loading ? 'অপেক্ষা করুন...' : 'লগইন করুন →'}
          </button>
        </form>

        <p style={styles.footerNote}>
          অ্যাকাউন্ট নেই? হোমপেজে ফিরে "অ্যাকাউন্ট করুন" চাপুন।
        </p>
      </div>

      {/* অ্যাকশন পপআপ */}
      {blockedPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupBox}>
            <div style={styles.popupIcon}>{blockedPopup === 'pending' ? '⏳' : '🚫'}</div>
            <h3 style={styles.popupTitle}>{getPopupTitle(blockedPopup)}</h3>
            <p style={styles.popupMessage}>{getPopupMessage(blockedPopup)}</p>
            <button style={styles.popupBtn} onClick={() => setBlockedPopup(null)}>ঠিক আছে</button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', width: '100%', background: 'linear-gradient(135deg, #0a1f44 0%, #16346b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative' },
  closeBtn: { position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '16px', border: 'none', cursor: 'pointer' },
  loginBox: { width: '100%', maxWidth: '400px', background: '#ffffff', borderRadius: '22px', padding: '32px 24px 24px', boxShadow: '0 20px 50px rgba(0,0,0,0.30)' },
  logoArea: { textAlign: 'center', marginBottom: '26px' },
  logoCircle: { width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4a537, #e6c267)', color: '#0a1f44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, fontFamily: "'Poppins', sans-serif", margin: '0 auto 12px', boxShadow: '0 6px 18px rgba(212,165,55,0.35)' },
  title: { fontSize: '22px', fontWeight: 700, color: '#0a1f44', margin: 0, fontFamily: "'Poppins', sans-serif" },
  subtitle: { fontSize: '13px', color: '#5a6472', margin: '6px 0 0', fontFamily: "'Hind Siliguri', sans-serif" },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 600, color: '#0a1f44', fontFamily: "'Hind Siliguri', sans-serif" },
  input: { width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1.5px solid #e2e6ee', background: '#f5f7fa', fontSize: '15px', color: '#1a1a1a', fontFamily: "'Hind Siliguri', sans-serif", outline: 'none' },
  inputError: { borderColor: '#d93636', background: '#fff5f5' },
  passwordWrapper: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '6px' },
  errorText: { fontSize: '12.5px', color: '#d93636', margin: 0, fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 500 },
  loginBtn: { width: '100%', padding: '15px 20px', marginTop: '6px', borderRadius: '12px', background: 'linear-gradient(135deg, #0a1f44, #16346b)', color: '#ffffff', fontSize: '16px', fontWeight: 700, fontFamily: "'Hind Siliguri', sans-serif", border: 'none', cursor: 'pointer', boxShadow: '0 6px 16px rgba(10,31,68,0.25)' },
  footerNote: { fontSize: '12px', color: '#8a92a2', textAlign: 'center', margin: '18px 0 0', fontFamily: "'Hind Siliguri', sans-serif" },

  popupOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10, 31, 68, 0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 9999 },
  popupBox: { width: '100%', maxWidth: '360px', background: '#ffffff', borderRadius: '20px', padding: '30px 24px 24px', textAlign: 'center', boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)' },
  popupIcon: { fontSize: '50px', marginBottom: '12px' },
  popupTitle: { fontSize: '18px', fontWeight: 700, color: '#0a1f44', margin: 0, marginBottom: '10px', fontFamily: "'Hind Siliguri', sans-serif" },
  popupMessage: { fontSize: '13.5px', color: '#3a4152', margin: 0, marginBottom: '24px', lineHeight: 1.7, fontFamily: "'Hind Siliguri', sans-serif" },
  popupBtn: { width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #0a1f44, #16346b)', color: '#ffffff', fontSize: '15px', fontWeight: 700, fontFamily: "'Hind Siliguri', sans-serif", border: 'none', cursor: 'pointer' },
}

export default LoginPage
