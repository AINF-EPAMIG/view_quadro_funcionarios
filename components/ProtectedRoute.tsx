'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, ReactNode } from "react"
import { PageLoader } from "@/components/ui/loading-spinner"

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Ainda carregando

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
  }, [status, router])

  // Mostra fallback durante o carregamento
  if (status === "loading") {
    return fallback || <PageLoader message="Verificando autenticação..." />
  }

  // Se não estiver autenticado, não mostra nada (será redirecionado)
  if (status === "unauthenticated") {
    return null
  }

  // Se estiver autenticado, mostra o conteúdo
  return <>{children}</>
}

// Hook para verificar autenticação
export function useAuthCheck() {
  const { data: session, status } = useSession()
  
  return {
    session,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    user: session?.user
  }
}