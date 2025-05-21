import { AuthUser } from '@/services/interfaces/auth';
import NextAuth from 'next-auth';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
          const response = await fetch(`http://127.0.0.1:5000/auth/login`, {
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

          if (!response.ok || !data) {
            throw new Error(data.message || 'Credenciais inválidas');
          }

        return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.type,
        } as AuthUser;
          
        } catch (error) {
          console.error('Erro na autenticação:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      let user_2 = user as AuthUser

      if (user_2) {
        token.role = user_2.role;
     }

     if (user?.id) {
        token.sub = user.id;
     }

     return token;
    },
    async session({ session, token }) {
        if (session.user) {
            session.user.role = token.role as string;
            session.user.id = token.sub as string;
         }

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