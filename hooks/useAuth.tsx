'use client'

import { useSession } from "next-auth/react"
import { createContext, useContext, ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any
  session: any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthWrapper({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  
  const value = {
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    user: session?.user,
    session
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthWrapper')
  }
  return context
}

// Componente para mostrar conteúdo apenas para usuários autenticados
export function AuthenticatedOnly({ children, fallback }: { children: ReactNode, fallback?: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return fallback || null
  }
  
  return isAuthenticated ? <>{children}</> : (fallback || null)
}

// Componente para mostrar conteúdo apenas para usuários não autenticados
export function UnauthenticatedOnly({ children, fallback }: { children: ReactNode, fallback?: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return fallback || null
  }
  
  return !isAuthenticated ? <>{children}</> : (fallback || null)
}