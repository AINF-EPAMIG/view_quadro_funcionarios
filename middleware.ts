import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Middleware adicional pode ser executado aqui
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
)

export const config = {
  // Protege todas as rotas exceto /login, /api/auth/*, e arquivos estáticos
  matcher: ['/((?!login|api/auth|_next/static|_next/image|favicon.ico|.*\\.svg$).*)']
}