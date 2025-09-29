import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Middleware adicional pode ser executado aqui
    // Se chegou aqui, o token é válido
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Se não há token, redirecionar para login
        if (!token) {
          return false;
        }
        
        // Token existe e é válido
        return true;
      },
    },
    pages: {
      signIn: '/login',
      error: '/login',
    },
  }
)

export const config = {
  // Protege todas as rotas exceto /login, /api/auth/*, e arquivos estáticos
  matcher: ['/((?!login|api/auth|_next/static|_next/image|favicon.ico|.*\\.svg$).*)']
}