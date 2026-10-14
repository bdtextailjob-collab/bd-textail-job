import { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen.jsx'
import HomePage from './components/HomePage.jsx'

function App() {
  // isLoading = true মানে লোডিং স্ক্রিন দেখাবে
  // isLoading = false মানে হোমপেজ দেখাবে
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ২ সেকেন্ড পর লোডিং স্ক্রিন সরিয়ে হোমপেজ দেখাবে
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // পরিষ্কার করা (memory leak এড়ানোর জন্য)
    return () => clearTimeout(timer)
  }, [])

  // ---------- লোডিং স্ক্রিন ----------
  if (isLoading) {
    return <LoadingScreen />
  }

  // ---------- মূল সাইট ----------
  return (
    <div className="app-wrapper">
      <HomePage />
    </div>
  )
}

export default App
