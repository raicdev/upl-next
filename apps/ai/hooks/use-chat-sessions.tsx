"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ChatMessage {
  author: "ai" | "user";
  image?: string;
  message: string;
  model?: string;
  thinkingEffort?: ThinkingEffort;
  thinkingTime?: number;
}

export type ThinkingEffort = "low" | "medium" | "high";


export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

interface ChatSessionsContextValue {
  sessions: ChatSession[];
  createSession: () => ChatSession;
  addSession: (session: ChatSession) => void;
  updateSession: (id: string, updatedSession: ChatSession) => void;
  updateSessionMessage: (sessionId: string, messageIndex: number, newMessage: string) => void;
  deleteSession: (id: string) => void;
  selectSession: (id: string) => void;
  getSession: (id: string) => ChatSession | undefined;
}

const ChatSessionsContext = createContext<ChatSessionsContextValue | undefined>(undefined);

export function ChatSessionsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const savedSessions = localStorage.getItem("chatSessions");
    return savedSessions ? JSON.parse(savedSessions) : [];
  });
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(() => {
    const savedCurrentSession = localStorage.getItem("currentChatSession");
    return savedCurrentSession ? JSON.parse(savedCurrentSession) : null;
  });

  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("currentChatSession", JSON.stringify(currentSession));
  }, [currentSession]);

  const createSession = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setSessions((prev) => [...prev, newSession]);
    setCurrentSession(newSession);
    return newSession;
  };

  const addSession = (session: ChatSession) => {
    const newSession: ChatSession = {
      id: session.id,
      title: session.title,
      messages: session.messages,
      createdAt: session.createdAt,
    };
    setSessions((prev) => [...prev, newSession]);
    setCurrentSession(newSession);
    return newSession;
  };

  const getSession = (id: string) => sessions.find((session) => session.id === id);

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
    if (currentSession?.id === id) {
      setCurrentSession(null);
    }
  };

  const selectSession = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      router.push(`/chat/${id}`);
    }
  };

  const updateSessionMessage = (sessionId: string, messageIndex: number, newMessage: string) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;
        const newMessages = [...session.messages];
        if (newMessages[messageIndex]) {
          newMessages[messageIndex] = { ...newMessages[messageIndex], message: newMessage };
        }
        return { ...session, messages: newMessages };
      })
    );
  };

  const updateSession = (id: string, updatedSession: ChatSession) => {
    setSessions((prev) => prev.map((session) => (session.id === id ? updatedSession : session)));
  };

  const value: ChatSessionsContextValue = {
    sessions,
    createSession,
    addSession,
    getSession,
    deleteSession,
    selectSession,
    updateSessionMessage,
    updateSession,
  };

  return <ChatSessionsContext.Provider value={value}>{children}</ChatSessionsContext.Provider>;
}

export function useChatSessions() {
  const context = useContext(ChatSessionsContext);
  if (context === undefined) {
    throw new Error("useChatSessions must be used within a ChatSessionsProvider");
  }
  return context;
}