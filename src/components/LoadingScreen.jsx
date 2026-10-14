import { useEffect, useState } from 'react'

function LoadingScreen() {
  const [activeDot, setActiveDot] = useState(0)

  // প্রতি ৪০০ms পর পর ডট বদলাবে (0 → 1 → 2 → 3 → 0 ...)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 4)
    }, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={styles.wrapper}>
      {/* হালকা গ্লো ইফেক্ট */}
      <div style={styles.glowTop}></div>
      <div style={styles.glowBottom}></div>

      <div style={styles.content}>
        {/* মূল ব্র্যান্ড নাম */}
        <h1 style={styles.brandName}>BD Textail Job</h1>

        {/* বাংলা নাম */}
        <p style={styles.brandNameBn}>বিডি টেক্সটাইল জব</p>

        {/* সোনালি আন্ডারলাইন */}
        <div style={styles.divider}></div>

        {/* ৪টি ডট */}
        <div style={styles.dotsContainer}>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                ...styles.dot,
                ...(activeDot === i ? styles.dotActive : {}),
              }}
            />
          ))}
        </div>

        {/* ছোট ট্যাগলাইন */}
        <p style={styles.tagline}>আপনার ভবিষ্যৎ এখান থেকেই শুরু</p>
      </div>

      {/* নিচে ভার্সন */}
      <p style={styles.version}>v0.1.0</p>

      {/* অ্যানিমেশন কীফ্রেম */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.15);
          }
        }

        @keyframes dotPop {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.4);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>
    </div>
  )
}

// ---------- সব স্টাইল এখানে (একই ফাইলে) ----------
const styles = {
  wrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100vh',
    background: 'linear-gradient(160deg, #0a1f44 0%, #16346b 55%, #0a1f44 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 9999,
    fontFamily: "'Poppins', 'Hind Siliguri', sans-serif",
  },

  glowTop: {
    position: 'absolute',
    top: '-15%',
    right: '-15%',
    width: '320px',
    height: '320px',
    background: 'radial-gradient(circle, rgba(212,165,55,0.35) 0%, rgba(212,165,55,0) 70%)',
    borderRadius: '50%',
    animation: 'glowPulse 3s ease-in-out infinite',
    pointerEvents: 'none',
  },

  glowBottom: {
    position: 'absolute',
    bottom: '-15%',
    left: '-15%',
    width: '320px',
    height: '320px',
    background: 'radial-gradient(circle, rgba(212,165,55,0.25) 0%, rgba(212,165,55,0) 70%)',
    borderRadius: '50%',
    animation: 'glowPulse 3s ease-in-out infinite 1.5s',
    pointerEvents: 'none',
  },

  content: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '0 24px',
    animation: 'fadeInUp 0.8s ease-out',
  },

  brandName: {
    fontSize: '32px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    background: 'linear-gradient(90deg, #ffffff 0%, #e6c267 50%, #ffffff 100%)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
    margin: 0,
    lineHeight: 1.2,
    animation: 'shimmer 3s linear infinite',
    fontFamily: "'Poppins', sans-serif",
  },

  brandNameBn: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#e6c267',
    letterSpacing: '1.5px',
    marginTop: '8px',
    marginBottom: '0',
    fontFamily: "'Hind Siliguri', sans-serif",
    opacity: 0.9,
  },

  divider: {
    width: '56px',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #d4a537, transparent)',
    marginTop: '22px',
    marginBottom: '26px',
    borderRadius: '2px',
  },

  dotsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '26px',
    height: '16px',
  },

  dot: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'rgba(230, 194, 103, 0.35)',
    transition: 'all 0.35s ease',
    transform: 'scale(1)',
  },

  dotActive: {
    background: '#e6c267',
    boxShadow: '0 0 12px 2px rgba(230, 194, 103, 0.7)',
    animation: 'dotPop 0.4s ease',
  },

  tagline: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: '0.5px',
    margin: 0,
    fontFamily: "'Hind Siliguri', sans-serif",
    fontWeight: 400,
  },

  version: {
    position: 'absolute',
    bottom: '22px',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: '1px',
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
  },
}

export default LoadingScreen
