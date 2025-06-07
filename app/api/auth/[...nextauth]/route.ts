import { AuthUser } from '@/services/interfaces/auth';
import NextAuth from 'next-auth';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials): Promise<AuthUser | null> {
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Credenciais inválidas.');
          }

          if (!data?.user || !data?.access_token) {
            throw new Error('Dados de autenticação inválidos recebidos da API.');
          }

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.type,
            accessToken: data.access_token,
          } as AuthUser;
          
        } catch (error) {
          const e = error as Error;
          console.error('Erro na autenticação:', e.message);
          throw new Error(e.message || 'Ocorreu um erro durante a autenticação.');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      const typedUser = user as AuthUser;

      if (typedUser) {
        token.sub = typedUser.id;
        token.role = typedUser.role;
        token.email = typedUser.email;
        token.name = typedUser.name;
        token.accessToken = typedUser.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.sub as string;
      }

      session.accessToken = token.accessToken as string;
      
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 