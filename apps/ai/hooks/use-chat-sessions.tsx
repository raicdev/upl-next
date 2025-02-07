// apps/ai/hooks/use-chat-sessions.tsx
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export interface ChatSession {
  id: string
  title: string
  messages: any[] // メッセージの型は実際の実装に合わせて定義してください
  createdAt: Date
}

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const savedSessions = localStorage.getItem('chatSessions')
    return savedSessions ? JSON.parse(savedSessions) : []
  })
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(() => {
    const savedCurrentSession = localStorage.getItem('currentChatSession')
    return savedCurrentSession ? JSON.parse(savedCurrentSession) : null
  })
  const router = useRouter()

  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    localStorage.setItem('currentChatSession', JSON.stringify(currentSession))
  }, [currentSession])

  const createSession = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date()
    }
    setSessions([...sessions, newSession])
    setCurrentSession(newSession)

    return newSession
  }

  const getSession = (id: string) => {
    return sessions.find(session => session.id === id)
  }

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id))
    if (currentSession?.id === id) {
      setCurrentSession(null)
    }
  }

  const selectSession = (id: string) => {
    const session = sessions.find(s => s.id === id)
    if (session) {
      router.push(`/chat/${id}`)
    }
  }

  const updateSessionMessage = (sessionId: string, messageIndex: number, newMessage: string) => {
    setSessions(sessions.map(session => {
      if (session.id !== sessionId) return session;
      const newMessages = [...session.messages];
      newMessages[messageIndex] = newMessage;
      return { ...session, messages: newMessages };
    }));
  };
  
  const updateSession = (id: string, updatedSession: ChatSession) => {
    setSessions(sessions.map(session => session.id === id ? updatedSession : session))
  }

  return {
    sessions,
    updateSession,
    updateSessionMessage,
    getSession,
    createSession,
    deleteSession,
    selectSession
  }
}