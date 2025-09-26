'use client'

import { Card, CardContent } from "@/components/ui/card"

interface LoadingSpinnerProps {
  message?: string
  fullScreen?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ 
  message = "Carregando...", 
  fullScreen = false, 
  size = 'md' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  }

  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-slate-50" 
    : "flex items-center justify-center p-8"

  return (
    <div className={containerClasses}>
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className={`animate-spin rounded-full border-4 border-slate-200 border-t-green-700 ${sizeClasses[size]}`}></div>
          <p className="text-slate-600 font-medium">{message}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function PageLoader({ message = "Verificando autenticação..." }: { message?: string }) {
  return <LoadingSpinner message={message} fullScreen={true} size="lg" />
}