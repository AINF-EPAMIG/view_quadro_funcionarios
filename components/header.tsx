"use client"

import Image from "next/image"
import Link from "next/link"
import { Globe, User } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Separator } from "@/components/ui/separator"

export default function Header() {
  const { data: session } = useSession()

  return (
    <>
      <header className="w-full">
        {/* Topo do header com logo, título centralizado e links */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5">
          {/* Layout em coluna para mobile, linha para tablet+ */}
          <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-between">
            {/* Logo - centralizada em mobile/tablet, à esquerda em desktop */}
            <div className="relative h-16 w-40 sm:h-18 sm:w-44 lg:h-20 lg:w-48 mx-auto lg:mx-0 lg:self-center">
              <Image
                src="/epamig_logo.svg"
                alt="EPAMIG Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            {/* Texto - centralizado e com margens adequadas em todas as telas */}
            <div className="flex-1 text-center mx-auto my-3 sm:my-4 lg:my-0 px-2 lg:max-w-3xl lg:self-center">
              <h1 className="text-green-700 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold leading-tight">
                Empresa de Pesquisa Agropecuária de Minas Gerais
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-800 font-bold mt-1">
                Secretaria de Estado de Agricultura, Pecuária e Abastecimento de Minas Gerais
              </p>
            </div>

            {/* Links - centralizado em mobile/tablet, à direita em desktop */}
            <div className="flex justify-center gap-6 mt-3 sm:mt-4 lg:mt-0 lg:min-w-max lg:self-center">
              <Link 
                href="https://epamig.br" 
                className="flex items-center gap-1 text-sm md:text-base text-green-700 hover:underline hover:text-green-800 transition-colors" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Globe size={18} className="flex-shrink-0" />
                <span>Site</span>
              </Link>
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1 text-sm md:text-base text-green-700 hover:underline hover:text-green-800 transition-colors"
                >
                  <User size={18} className="flex-shrink-0" />
                  <span>Sair</span>
                </button>
              ) : (
                <button
                  onClick={() => signIn('google')}
                  className="flex items-center gap-1 text-sm md:text-base text-green-700 hover:underline hover:text-green-800 transition-colors"
                >
                  <User size={18} className="flex-shrink-0" />
                  <span>Login Google</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <Separator className="bg-green-700 h-1" />
    </>
  )
}
