import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Verificar se as variáveis de ambiente estão definidas
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing required Google OAuth environment variables');
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Missing NEXTAUTH_SECRET environment variable');
}

// Helper to parse comma/semicolon/space separated lists from env vars
const parseList = (v?: string) =>
  (v ?? "")
    .split(/[;,\s]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 1000); // safety cap

const ALLOWED_EMAILS = parseList(process.env.ALLOWED_EMAILS);
const ALLOWED_EMAIL_DOMAINS = parseList(process.env.ALLOWED_EMAIL_DOMAINS);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log('SignIn callback:', { user: user?.email, account: account?.provider });
      
      const email = (user?.email || "").toLowerCase();
      if (!email) {
        console.log('No email provided');
        return false;
      }

      // If any allowlist is configured, enforce it. If none provided, allow all (no restriction).
      const hasAllowlist = ALLOWED_EMAILS.length > 0 || ALLOWED_EMAIL_DOMAINS.length > 0;
      if (!hasAllowlist) {
        console.log('No allowlist configured, allowing all emails');
        return true;
      }

      const domain = email.split("@")[1] || "";
      const emailAllowed = ALLOWED_EMAILS.includes(email);
      const domainAllowed = domain ? ALLOWED_EMAIL_DOMAINS.includes(domain) : false;
      
      console.log('Auth check:', { email, domain, emailAllowed, domainAllowed, allowedDomains: ALLOWED_EMAIL_DOMAINS });
      
      return emailAllowed || domainAllowed;
    },

    async session({ session, token }) {
      if (session?.user) {
        // Adiciona o ID do token ao objeto de sessão como propriedade personalizada
        (session.user as { id?: string }).id = token.sub!;
        
        // Garantir que a imagem do perfil esteja disponível na sessão
        if (token.picture && session.user) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      
      // Garantir que token tenha todas as propriedades necessárias
      if (user) {
        token.picture = user.image;
      }
      
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata);
    },
    warn(code) {
      console.warn('NextAuth Warning:', code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth Debug:', code, metadata);
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};