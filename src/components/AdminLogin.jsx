import { useState } from 'react'

// অ্যাডমিন পাসওয়ার্ড (পরের ধাপে আমরা এটি Environment Variable-এ নিয়ে যাব)
const ADMIN_PASSWORD = 'BdTextail@2026#Admin'

function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setError('')
      onLoginSuccess()
    } else {
      setError('ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।')
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.loginBox}>
        <div style={styles.logoArea}>
          <div style={styles.logoCircle}>BT</div>
          <h1 style={styles.title}>BD Textail Job</h1>
          <p style={styles.subtitle}>Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>অ্যাডমিন পাসওয়ার্ড দিন</label>
          
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
              placeholder="পাসওয়ার্ড লিখুন..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
            />
            <button
              type="button"
              style={styles.showBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" style={styles.loginBtn}>
            লগইন করুন →
          </button>
        </form>

        <p style={styles.footerNote}>শুধুমাত্র অনুমোদিত ব্যক্তির জন্য</p>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #0a1f44 0%, #16346b 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  loginBox: {
    width: '100%',
    maxWidth: '400px',
    background: '#ffffff',
    borderRadius: '20px',
    padding: '32px 24px 24px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.30)',
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: '26px',
  },
  logoCircle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #d4a537, #e6c267)',
    color: '#0a1f44',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: 700,
    fontFamily: "'Poppins', sans-serif",
    margin: '0 auto 12px',
    boxShadow: '0 6px 18px rgba(212,165,55,0.35)',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#0a1f44',
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
  },
  subtitle: {
    fontSize: '13px',
    color: '#d4a537',
    margin: '4px 0 0',
    fontWeight: 600,
    fontFamily: "'Hind Siliguri', sans-serif",
    letterSpacing: '1px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontSize: '13.5px',
    fontWeight: 600,
    color: '#0a1f44',
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  passwordWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '14px 44px 14px 14px',
    borderRadius: '12px',
    border: '1.5px solid #e2e6ee',
    background: '#f5f7fa',
    fontSize: '15px',
    color: '#1a1a1a',
    fontFamily: "'Hind Siliguri', sans-serif",
    outline: 'none',
  },
  inputError: {
    borderColor: '#d93636',
    background: '#fff5f5',
  },
  showBtn: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '6px',
  },
  errorText: {
    fontSize: '12.5px',
    color: '#d93636',
    margin: 0,
    fontFamily: "'Hind Siliguri', sans-serif",
    fontWeight: 500,
  },
  loginBtn: {
    width: '100%',
    padding: '15px 20px',
    marginTop: '8px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #0a1f44, #16346b)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: "'Hind Siliguri', sans-serif",
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(10,31,68,0.25)',
  },
  footerNote: {
    fontSize: '11px',
    color: '#8a92a2',
    textAlign: 'center',
    margin: '20px 0 0',
    fontFamily: "'Hind Siliguri', sans-serif",
  },
}

export default AdminLogin
