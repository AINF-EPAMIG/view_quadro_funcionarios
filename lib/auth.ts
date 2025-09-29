import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = (user?.email || "").toLowerCase();
      if (!email) return false;

      // If any allowlist is configured, enforce it. If none provided, allow all (no restriction).
      const hasAllowlist = ALLOWED_EMAILS.length > 0 || ALLOWED_EMAIL_DOMAINS.length > 0;
      if (!hasAllowlist) return true;

      const domain = email.split("@")[1] || "";
      const emailAllowed = ALLOWED_EMAILS.includes(email);
      const domainAllowed = domain ? ALLOWED_EMAIL_DOMAINS.includes(domain) : false;
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
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "16cb14b902a9f90b45728dedfb2cc31cfac127b3b2a730cbb4ec103db94934aa",
};