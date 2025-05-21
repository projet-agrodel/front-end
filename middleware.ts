import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isAdmin = token?.role === 'admin';

    // Se tentar acessar rota admin sem ser admin
    if (isAdminRoute && !isAdmin) {
      // Redireciona para a página inicial ou uma página de "Não Autorizado"
      return NextResponse.redirect(new URL('/', req.url)); 
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token; // Garante que o usuário está logado para todas as rotas no matcher.
      }
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/checkout/:path*',
  ]
}; 