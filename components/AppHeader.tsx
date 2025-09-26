'use client'

import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function AppHeader() {
  const { data: session } = useSession()
  const user = session?.user
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <header className="w-full bg-white">
      <div className="w-full px-10">
        <div className="flex items-center justify-between py-3">
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Image
              src="/epamig_logo.svg"
              alt="EPAMIG"
              width={130}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </div>

          {/* Center: Titles */}
          <div className="flex-1 text-center px-4 hidden sm:block">
            <p className="text-base sm:text-lg font-semibold text-slate-900 leading-tight">
              Empresa de Pesquisa Agropecuária de Minas Gerais
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Secretaria de Estado de Agricultura, Pecuária e Abastecimento de Minas Gerais
            </p>
          </div>

          {/* Right: User info */}
          <div className="flex-shrink-0 flex items-center gap-3">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || 'Usuário'}
                width={36}
                height={36}
                className="rounded-full h-9 w-9 object-cover"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-slate-200" />
            )}
            <div className="leading-tight hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 truncate max-w-[220px]">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-[#025C3E] truncate max-w-[220px]">
                {user?.email || ''}
              </p>
            </div>
            {user && (
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="ml-1"
                aria-label="Sair"
              >
                Sair
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
