import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const colorThemes = [
  { id: 'white', bg: '#ffffff', text: '#1a1a1a', isLight: true },
  { id: 'brandblue', bg: '#0a1f44', text: '#ffffff', isLight: false },
  { id: 'gold', bg: '#d4a537', text: '#0a1f44', isLight: true },
  { id: 'blue', bg: '#1877F2', text: '#ffffff', isLight: false },
  { id: 'red', bg: '#d93636', text: '#ffffff', isLight: false },
  { id: 'green', bg: '#1e9d5a', text: '#ffffff', isLight: false },
  { id: 'purple', bg: '#8b5cf6', text: '#ffffff', isLight: false },
  { id: 'orange', bg: '#f97316', text: '#ffffff', isLight: false },
  { id: 'black', bg: '#111827', text: '#ffffff', isLight: false },
]

function UserDashboard({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser)
  const [activeTab, setActiveTab] = useState('home')
  
  // Post State
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [postText, setPostText] = useState('')
  const [selectedTheme, setSelectedTheme] = useState(colorThemes[0])
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  // Community State
  const [communityUsers, setCommunityUsers] = useState([])
  const [loadingCommunity, setLoadingCommunity] = useState(true)

  // Chat State
  const [activeChatUser, setActiveChatUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [isOtherTyping, setIsOtherTyping] = useState(false)
  const [isChatBlocked, setIsChatBlocked] = useState(false)
  const [chatBlockPopup, setChatBlockPopup] = useState(false)
  const chatEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Messages List (Inbox) State
  const [chatPartners, setChatPartners] = useState([])
  const [unreadCount, setUnreadCount] = useState(0) // নেভিগেশন বারে মোট আনরিড

  // ---------- Functions ----------
  const fetchPosts = async () => {
    setLoadingPosts(true)
    try {
      const { data, error } = await supabase.from('posts').select('*').or(`status.eq.approved,and(user_id.eq.${user.id},status.eq.disabled)`).order('created_at', { ascending: false })
      if (error) throw error
      setPosts(data || [])
    } catch (err) { console.error(err) } finally { setLoadingPosts(false) }
  }

  const fetchCommunityUsers = async () => {
    setLoadingCommunity(true)
    try {
      const { data, error } = await supabase.from('users').select('*').eq('status', 'approved').neq('id', user.id).order('created_at', { ascending: false })
      if (error) throw error
      setCommunityUsers(data || [])
    } catch (err) { console.error(err) } finally { setLoadingCommunity(false) }
  }

  const fetchMessages = async (partnerId) => {
    setLoadingMessages(true)
    try {
      const { data, error } = await supabase.from('messages').select('*').or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`).order('created_at', { ascending: true })
      if (error) throw error
      setMessages(data || [])
      
      if (data && data.length > 0 && data[0].is_chat_blocked) setIsChatBlocked(true)
      else setIsChatBlocked(false)

      // অপরজনের পাঠানো আনরিড মেসেজগুলো 'Seen' করা
      const unreadIds = data?.filter(m => m.sender_id === partnerId && !m.is_seen).map(m => m.id)
      if (unreadIds && unreadIds.length > 0) {
        await supabase.from('messages').update({ is_seen: true }).in('id', unreadIds)
      }
    } catch (err) { console.error(err) } finally { setLoadingMessages(false) }
  }

  const fetchChatPartnersAndUnread = async () => {
    try {
      // সব মেসেজ আনা (আনরিড কাউন্ট ও লাস্ট মেসেজের জন্য)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false }) // লেটেস্ট আগে

      if (error) throw error

      const partnerMap = {}
      let totalUnread = 0

      data.forEach(msg => {
        const isMe = msg.sender_id === user.id
        const partnerId = isMe ? msg.receiver_id : msg.sender_id
        
        // আনরিড কাউন্ট (শুধু অপরজনের পাঠানো, যা এখনো দেখা হয়নি)
        if (!isMe && !msg.is_seen) totalUnread++

        // প্রথমবার এই পার্টনারের মেসেজ পেলে (যেহেতু descending order, এটি লাস্ট মেসেজ)
        if (!partnerMap[partnerId]) {
          partnerMap[partnerId] = {
            lastMessage: msg.content,
            hasUnread: !isMe && !msg.is_seen,
            created_at: msg.created_at
          }
        }
      })

      setUnreadCount(totalUnread)

      const partnerIds = Object.keys(partnerMap)
      if (partnerIds.length === 0) { setChatPartners([]); return }

      const { data: usersData } = await supabase.from('users').select('*').in('id', partnerIds)
      
      const formattedPartners = usersData?.map(u => ({
        ...u,
        lastMessage: partnerMap[u.id].lastMessage,
        hasUnread: partnerMap[u.id].hasUnread
      })) || []

      // লাস্ট মেসেজের সময় অনুযায়ী সাজানো
      formattedPartners.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

      setChatPartners(formattedPartners)
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    fetchPosts(); fetchCommunityUsers(); fetchChatPartnersAndUnread()

    const userChannel = supabase.channel(`user-status-${user.id}`).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${user.id}` }, (payload) => {
      const newStatus = payload.new.status
      if (newStatus === 'suspended' || newStatus === 'blocked' || newStatus === 'disabled') { alert('আপনার অ্যাকাউন্টে পরিবর্তন এসেছে। আবার লগইন করুন।'); onLogout() } 
      else setUser(payload.new)
    }).subscribe()

    // গ্লোবাল মেসেজ লিসেনার (যেকোনো নতুন মেসেজ এলে চ্যাট লিস্ট ও আনরিড আপডেট হবে)
    const globalMsgChannel = supabase.channel(`global-messages-${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchChatPartnersAndUnread()
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, () => {
        fetchChatPartnersAndUnread()
      })
      .subscribe()

    return () => { 
      supabase.removeChannel(userChannel)
      supabase.removeChannel(globalMsgChannel)
    }
  }, [user.id])

  // চ্যাট ওপেন থাকলে রিয়েল-টাইম আপডেট
  useEffect(() => {
    if (!activeChatUser) return

    const msgChannel = supabase.channel(`chat-${user.id}-${activeChatUser.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new
        if ((msg.sender_id === user.id && msg.receiver_id === activeChatUser.id) || (msg.sender_id === activeChatUser.id && msg.receiver_id === user.id)) {
          setMessages(prev => [...prev, msg])
          if (msg.is_chat_blocked) setIsChatBlocked(true)
          
          if (msg.sender_id === activeChatUser.id) {
             supabase.from('messages').update({ is_seen: true }).eq('id', msg.id).then()
          }
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new : m))
      })
      .subscribe()

    const typingChannel = supabase.channel(`typing-${user.id}-${activeChatUser.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'typing_status' }, (payload) => {
        if (payload.new.sender_id === activeChatUser.id && payload.new.receiver_id === user.id) {
          setIsOtherTyping(payload.new.is_typing)
        }
      })
      .subscribe()

    return () => { 
      supabase.removeChannel(msgChannel)
      supabase.removeChannel(typingChannel)
    }
  }, [activeChatUser, user.id])

  useEffect(() => { 
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' }) 
  }, [messages, isOtherTyping])

  const handleCreatePost = async () => {
    if (!postText.trim() || isPosting) return;
    setIsPosting(true)
    try {
      const { error } = await supabase.from('posts').insert([{ user_id: user.id, author_name: user.name, author_image: user.profile_image_url || `https://ui-avatars.com/api/?name=${user.name}&background=0a1f44&color=fff`, content: postText, theme_bg: selectedTheme.bg, theme_text: selectedTheme.text, status: 'pending' }])
      if (error) throw error
      setPostText(''); setSelectedTheme(colorThemes[0]); setIsCreatePostOpen(false); setShowSuccessPopup(true)
    } catch (err) { alert('সমস্যা: ' + err.message) } finally { setIsPosting(false) }
  }

  const openChat = async (partner) => {
    const { data: partnerData } = await supabase.from('users').select('is_msg_blocked').eq('id', partner.id).single()
    if (partnerData?.is_msg_blocked) { setChatBlockPopup(true); return }

    setActiveChatUser(partner)
    fetchMessages(partner.id)
    setActiveTab('chat')
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChatUser || isChatBlocked) return
    
    const msgContent = newMessage.trim()
    setNewMessage('') 
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    await supabase.from('typing_status').upsert({ sender_id: user.id, receiver_id: activeChatUser.id, is_typing: false }, { onConflict: 'sender_id,receiver_id' })

    try {
      const { data, error } = await supabase.from('messages').insert([{ sender_id: user.id, receiver_id: activeChatUser.id, content: msgContent, is_chat_blocked: false, is_seen: false }]).select()
      if (error) throw error
      if (data) setMessages(prev => [...prev, data[0]])
    } catch (err) { alert('মেসেজ পাঠাতে সমস্যা: ' + err.message) }
  }

  const handleTyping = async (e) => {
    setNewMessage(e.target.value)
    if (!activeChatUser) return

    await supabase.from('typing_status').upsert({ sender_id: user.id, receiver_id: activeChatUser.id, is_typing: true, updated_at: new Date() }, { onConflict: 'sender_id,receiver_id' })

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(async () => {
      await supabase.from('typing_status').upsert({ sender_id: user.id, receiver_id: activeChatUser.id, is_typing: false }, { onConflict: 'sender_id,receiver_id' })
    }, 2000)
  }

  // =====================================================
  // চ্যাট UI
  // =====================================================
  if (activeTab === 'chat' && activeChatUser) {
    return (
      <div style={styles.chatPage}>
        <header style={styles.chatHeader}>
          <button style={styles.backBtn} onClick={() => setActiveTab('message')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a1f44" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <img src={activeChatUser.profile_image_url} alt={activeChatUser.name} style={styles.chatAvatar} />
          <div>
            <p style={styles.chatName}>{activeChatUser.name}</p>
            <p style={styles.chatStatus}>{isOtherTyping ? 'টাইপ করছে...' : 'সক্রিয়'}</p>
          </div>
        </header>

        <div style={styles.chatBody}>
          {loadingMessages ? <p style={{ textAlign: 'center', color: '#5a6472' }}>লোড হচ্ছে...</p> : messages.length === 0 ? <p style={{ textAlign: 'center', color: '#5a6472', marginTop: '40px' }}>কোনো মেসেজ নেই।</p> : (
            messages.map((msg, idx) => {
              const isMe = msg.sender_id === user.id
              const showAvatar = !isMe && (idx === 0 || messages[idx - 1].sender_id !== msg.sender_id)

              return (
                <div key={msg.id} style={{ ...styles.msgRow, justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: (idx < messages.length - 1 && messages[idx+1].sender_id !== msg.sender_id) ? '16px' : '2px' }}>
                  {!isMe && (
                     <div style={{ width: '32px', marginRight: '8px' }}>
                       {showAvatar && <img src={activeChatUser.profile_image_url} alt="Avatar" style={styles.msgAvatar} />}
                     </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{ 
                      ...styles.msgBubble, 
                      background: isMe ? '#0084ff' : '#e4e6eb',
                      color: isMe ? '#ffffff' : '#111827',
                      borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
                    }}>
                      <p style={styles.msgText}>{msg.content}</p>
                    </div>
                    <span style={{ ...styles.msgTime, color: '#8a92a2' }}>
                      {isMe ? (msg.is_seen ? 'Seen' : 'Sent') : new Date(msg.created_at).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              )
            })
          )}
          {isOtherTyping && (
            <div style={{ display: 'flex', marginLeft: '40px', marginTop: '4px' }}>
               <div style={{ ...styles.msgBubble, background: '#e4e6eb', borderRadius: '18px', padding: '10px 16px', display: 'flex', gap: '4px' }}>
                 <span style={styles.dot}></span><span style={{...styles.dot, animationDelay: '0.2s'}}></span><span style={{...styles.dot, animationDelay: '0.4s'}}></span>
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div style={styles.chatInputRow}>
          {isChatBlocked ? (
            <div style={styles.chatBlockedBox}><p style={styles.chatBlockedText}>চ্যাট ব্লক করা হয়েছে। সাপোর্টে যোগাযোগ করুন।</p></div>
          ) : (
            <>
              <input 
                type="text" 
                style={styles.chatInput} 
                placeholder="মেসেজ লিখুন..." 
                value={newMessage} 
                onChange={handleTyping}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button style={styles.sendBtn} onClick={handleSendMessage}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </>
          )}
        </div>

        {chatBlockPopup && (
          <div style={styles.popupOverlay}>
            <div style={styles.popupBox}>
              <div style={styles.popupIcon}>🚫</div>
              <h3 style={styles.popupTitle}>মেসেজ ব্লকড</h3>
              <p style={styles.popupMessage}>আপনি এই ইউজারের সাথে মেসেজ করতে পারবেন না। সাপোর্টে যোগাযোগ করুন।</p>
              <button style={styles.popupBtn} onClick={() => { setChatBlockPopup(false); setActiveTab('home'); }}>ঠিক আছে</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={styles.appWrapper}>
      <header style={styles.topBar}>
        <h1 style={styles.appLogo}>BD Textail Job</h1>
        <div style={styles.topIcons}>
          <button style={styles.iconBtn} onClick={() => setIsCreatePostOpen(true)}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
          <button style={styles.iconBtn} onClick={onLogout}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></button>
        </div>
      </header>

      <nav style={styles.topNav}>
        <button style={styles.navBtn} onClick={() => setActiveTab('home')}><svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === 'home' ? "#d4a537" : "none"} stroke={activeTab === 'home' ? "#d4a537" : "#ffffff"} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>{activeTab === 'home' && <div style={styles.activeLine}></div>}</button>
        <button style={styles.navBtn} onClick={() => setActiveTab('community')}><svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === 'community' ? "#d4a537" : "none"} stroke={activeTab === 'community' ? "#d4a537" : "#ffffff"} strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>{activeTab === 'community' && <div style={styles.activeLine}></div>}</button>
        
        {/* মেসেজ আইকন (লাইভ আনরিড ব্যাজ সহ) */}
        <button style={styles.navBtn} onClick={() => setActiveTab('message')}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === 'message' ? "#d4a537" : "none"} stroke={activeTab === 'message' ? "#d4a537" : "#ffffff"} strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
          {activeTab === 'message' && <div style={styles.activeLine}></div>}
        </button>

        <button style={styles.navBtn} onClick={() => setActiveTab('notification')}><svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === 'notification' ? "#d4a537" : "none"} stroke={activeTab === 'notification' ? "#d4a537" : "#ffffff"} strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg><span style={styles.badge}>8</span>{activeTab === 'notification' && <div style={styles.activeLine}></div>}</button>
        <button style={styles.navBtn} onClick={() => setActiveTab('profile')}><svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === 'profile' ? "#d4a537" : "none"} stroke={activeTab === 'profile' ? "#d4a537" : "#ffffff"} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>{activeTab === 'profile' && <div style={styles.activeLine}></div>}</button>
      </nav>

      <main style={styles.mainContent}>
        {activeTab === 'home' && (
          <div style={styles.feedContainer}>
            <div style={styles.createPostBox} onClick={() => setIsCreatePostOpen(true)}><div style={styles.postHeader}><img src={user.profile_image_url || `https://ui-avatars.com/api/?name=${user.name}&background=0a1f44&color=fff`} style={styles.avatar} /><div style={styles.fakeInput}>দক্ষ লোক খুঁজতে পোস্ট করুন...</div></div></div>
            {loadingPosts ? <p style={styles.loadingText}>লোড হচ্ছে...</p> : posts.map((post) => (
              <div key={post.id} style={{ ...styles.feedCard, backgroundColor: post.theme_bg }}>
                <div style={styles.feedHeader}><img src={post.author_image} style={styles.feedAvatar} /><div><p style={{ ...styles.feedAuthor, color: post.theme_text }}>{post.author_name}</p></div></div>
                <p style={{ ...styles.feedContent, color: post.theme_text }}>{post.content}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'community' && (
          <div style={styles.communityContainer}>
            <h2 style={styles.communityTitle}>কমিউনিটি</h2>
            <div style={styles.userGrid}>
              {communityUsers.map((u) => (
                <div key={u.id} style={styles.userCard}>
                  <div style={styles.cardHeader}><img src={u.profile_image_url} style={styles.cardAvatar} /><div><h3 style={styles.cardName}>{u.name}</h3><span style={{ ...styles.cardTypeBadge, ...(u.user_type === 'job_seeker' ? styles.cardTypeJob : styles.cardTypeGeneral) }}>{u.user_type === 'job_seeker' ? 'চাকরিজীবী' : 'সাধারণ'}</span></div></div>
                  {u.user_type === 'job_seeker' && (
                    <div style={styles.cardCareerInfo}>
                      {u.industry_type && <div style={styles.cardInfoRow}><span style={styles.cardInfoLabel}>ইন্ডাস্ট্রি:</span><span style={styles.cardInfoValue}>{u.industry_type}</span></div>}
                      {u.designation && <div style={styles.cardInfoRow}><span style={styles.cardInfoLabel}>পদবী:</span><span style={styles.cardInfoValue}>{u.designation}</span></div>}
                    </div>
                  )}
                  <button style={styles.messageBtn} onClick={() => openChat(u)}>💬 মেসেজ</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'message' && (
          <div style={styles.communityContainer}>
            <h2 style={styles.communityTitle}>মেসেজ</h2>
            {chatPartners.length === 0 ? <p style={styles.loadingText}>এখনো কোনো মেসেজ নেই।</p> : (
              <div style={styles.chatList}>
                {chatPartners.map((u) => (
                  <div key={u.id} style={{ ...styles.chatListCard, background: u.hasUnread ? '#f0f8ff' : '#ffffff' }} onClick={() => openChat(u)}>
                    <img src={u.profile_image_url} style={styles.chatListAvatar} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={styles.chatListName}>{u.name}</p>
                        {u.hasUnread && <span style={styles.unreadDot}></span>}
                      </div>
                      <p style={{ ...styles.chatListText, fontWeight: u.hasUnread ? 700 : 400, color: u.hasUnread ? '#0a1f44' : '#5a6472' }}>
                        {u.lastMessage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Post Modal */}
      {isCreatePostOpen && (
        <div style={styles.modalOverlay}><div style={styles.modalContent}><div style={styles.modalHeader}><button style={styles.closeBtn} onClick={() => setIsCreatePostOpen(false)}>✕</button><h2 style={styles.modalTitle}>Create post</h2><button style={styles.modalPostBtn} onClick={handleCreatePost} disabled={isPosting}>{isPosting ? '...' : 'POST'}</button></div><div style={styles.modalUserInfo}><img src={user.profile_image_url} style={styles.modalAvatar} /><div><p style={styles.modalUserName}>{user.name}</p></div></div><div style={styles.colorPalette}>{colorThemes.map((theme) => (<button key={theme.id} style={{ ...styles.colorCircle, backgroundColor: theme.bg, border: selectedTheme.id === theme.id ? '3px solid #d4a537' : '2px solid #e2e6ee' }} onClick={() => setSelectedTheme(theme)} />))}</div><textarea style={{ ...styles.modalTextArea, backgroundColor: selectedTheme.bg, color: selectedTheme.text }} placeholder="What's on your mind?" value={postText} onChange={(e) => setPostText(e.target.value)} autoFocus /></div></div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (<div style={styles.popupOverlay}><div style={styles.popupBox}><div style={styles.popupIcon}>⏳</div><h2 style={styles.popupTitle}>পোস্ট সফলভাবে জমা হয়েছে!</h2><p style={styles.popupMessage}>পোস্টটি সাপোর্ট টিম পর্যবেক্ষণ করছে।</p><button style={styles.popupBtn} onClick={() => setShowSuccessPopup(false)}>ঠিক আছে</button></div></div>)}
    </div>
  )
}

// স্টাইল
const styles = {
  // ... আগের স্টাইল (এখানে সম্পূর্ণ কোড দিলাম, আগের স্টাইলগুলো ঠিক আছে)
  appWrapper: { minHeight: '100vh', width: '100%', background: '#f5f7fa', display: 'flex', flexDirection: 'column', overflowX: 'hidden' },
  topBar: { position: 'sticky', top: 0, zIndex: 50, background: 'linear-gradient(135deg, #0a1f44 0%, #16346b 100%)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  appLogo: { fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: 0, fontFamily: "'Poppins', sans-serif" },
  topIcons: { display: 'flex', gap: '10px' },
  iconBtn: { width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' },
  topNav: { background: '#0a1f44', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '6px 0', zIndex: 40, position: 'sticky', top: '68px' },
  navBtn: { position: 'relative', background: 'transparent', border: 'none', padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  activeLine: { position: 'absolute', bottom: '0px', left: '10%', width: '80%', height: '3px', background: '#d4a537', borderRadius: '3px 3px 0 0' },
  badge: { position: 'absolute', top: '4px', right: '10px', background: '#d93636', color: '#ffffff', fontSize: '10px', fontWeight: 800, minWidth: '20px', height: '20px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0a1f44' },
  mainContent: { flex: 1, padding: '16px' },
  feedContainer: { maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' },
  createPostBox: { background: '#ffffff', borderRadius: '20px', padding: '18px', boxShadow: '0 8px 25px rgba(10, 31, 68, 0.08)', cursor: 'pointer' },
  postHeader: { display: 'flex', gap: '12px', alignItems: 'center' },
  avatar: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d4a537' },
  fakeInput: { flex: 1, padding: '14px', borderRadius: '25px', border: '1.5px solid #e2e6ee', background: '#f5f7fa', fontSize: '15px', color: '#5a6472' },
  feedCard: { borderRadius: '24px', padding: '22px', boxShadow: '0 8px 24px rgba(10, 31, 68, 0.1)' },
  feedHeader: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' },
  feedAvatar: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' },
  feedAuthor: { fontSize: '16px', fontWeight: 800, margin: '0 0 4px' },
  feedContent: { fontSize: '18px', lineHeight: 1.6, margin: '0 0 20px' },
  loadingText: { textAlign: 'center', color: '#5a6472', padding: '20px' },
  communityContainer: { maxWidth: '600px', margin: '0 auto' },
  communityTitle: { fontSize: '22px', fontWeight: 800, color: '#0a1f44', margin: '0 0 20px' },
  userGrid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  userCard: { background: '#ffffff', borderRadius: '20px', padding: '20px', boxShadow: '0 8px 25px rgba(10, 31, 68, 0.08)', borderLeft: '4px solid #d4a537' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' },
  cardAvatar: { width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #d4a537' },
  cardName: { fontSize: '17px', fontWeight: 800, color: '#0a1f44', margin: '0 0 4px' },
  cardTypeBadge: { fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px' },
  cardTypeGeneral: { background: 'rgba(10, 31, 68, 0.10)', color: '#0a1f44' },
  cardTypeJob: { background: 'rgba(212, 165, 55, 0.20)', color: '#8a6a1f' },
  cardCareerInfo: { background: '#f5f7fa', borderRadius: '12px', padding: '12px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' },
  cardInfoRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px' },
  cardInfoLabel: { color: '#8a92a2', fontWeight: 600 },
  cardInfoValue: { color: '#0a1f44', fontWeight: 700 },
  messageBtn: { width: '100%', padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #0a1f44, #16346b)', color: '#ffffff', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(10, 31, 68, 0.2)' },
  chatList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  chatListCard: { display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '16px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(10,31,68,0.06)', transition: 'background 0.2s ease' },
  chatListAvatar: { width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' },
  chatListName: { fontSize: '16px', fontWeight: 700, color: '#0a1f44', margin: '0 0 2px' },
  chatListText: { fontSize: '13px', color: '#5a6472', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  unreadDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#0084ff' },
  
  // Chat Page (Messenger Style)
  chatPage: { display: 'flex', flexDirection: 'column', height: '100vh', background: '#ffffff' },
  chatHeader: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', zIndex: 10, borderBottom: '1px solid #e2e6ee' },
  backBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' },
  chatAvatar: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' },
  chatName: { fontSize: '16px', fontWeight: 700, color: '#0a1f44', margin: 0 },
  chatStatus: { fontSize: '11px', color: '#1e9d5a', margin: 0 },
  chatBody: { flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', background: '#f0f2f5' },
  msgRow: { display: 'flex', alignItems: 'flex-end', marginTop: '2px' },
  msgAvatar: { width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px' },
  msgBubble: { maxWidth: '75%', padding: '10px 14px' },
  msgText: { fontSize: '14.5px', margin: 0, lineHeight: 1.5, fontFamily: "'Hind Siliguri', sans-serif" },
  msgTime: { fontSize: '10px', marginTop: '2px', marginLeft: '4px', marginRight: '4px' },
  chatInputRow: { display: 'flex', gap: '10px', padding: '12px', background: '#ffffff', borderTop: '1px solid #e2e6ee' },
  chatInput: { flex: 1, padding: '12px 16px', borderRadius: '25px', border: 'none', background: '#f0f2f5', fontSize: '15px', outline: 'none' },
  sendBtn: { width: '46px', height: '46px', borderRadius: '50%', background: '#1877F2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  chatBlockedBox: { flex: 1, padding: '12px', background: '#ffebee', borderRadius: '12px', border: '1px solid #d93636' },
  chatBlockedText: { color: '#d93636', margin: 0, fontWeight: 600, textAlign: 'center', fontSize: '14px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', background: '#8a92a2', display: 'inline-block', animation: 'typing 1.4s infinite ease-in-out both' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10, 31, 68, 0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: '#ffffff', width: '100%', maxWidth: '600px', height: '90vh', display: 'flex', flexDirection: 'column', padding: '20px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1.5px solid #e2e6ee' },
  closeBtn: { background: '#f5f7fa', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' },
  modalTitle: { fontSize: '18px', fontWeight: 700, color: '#0a1f44', margin: 0 },
  modalPostBtn: { background: 'transparent', border: 'none', color: '#d4a537', fontSize: '16px', fontWeight: 800, cursor: 'pointer' },
  modalUserInfo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  modalAvatar: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' },
  modalUserName: { fontSize: '15px', fontWeight: 700, color: '#0a1f44', margin: 0 },
  colorPalette: { display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1.5px solid #e2e6ee' },
  colorCircle: { width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', flexShrink: 0 },
  modalTextArea: { flex: 1, border: 'none', outline: 'none', fontSize: '20px', resize: 'none', padding: '20px', borderRadius: '16px' },
  popupOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10, 31, 68, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' },
  popupBox: { background: '#ffffff', width: '100%', maxWidth: '360px', borderRadius: '24px', padding: '30px 24px', textAlign: 'center' },
  popupIcon: { fontSize: '50px', marginBottom: '16px' },
  popupTitle: { fontSize: '20px', fontWeight: 800, color: '#0a1f44', margin: '0 0 12px' },
  popupMessage: { fontSize: '14px', color: '#3a4152', margin: '0 0 24px', lineHeight: 1.7 },
  popupBtn: { width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #d4a537, #e6c267)', color: '#0a1f44', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer' },
}

// Add animation keyframes
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes typing {
    0% { transform: translateY(0); opacity: 0.5; }
    50% { transform: translateY(-5px); opacity: 1; }
    100% { transform: translateY(0); opacity: 0.5; }
  }
`;
document.head.appendChild(styleSheet);

export default UserDashboard
