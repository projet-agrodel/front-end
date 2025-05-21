import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isAdmin = token?.role === 'admin';

    // Se tentar acessar rota admin sem ser admin
   // if (isAdminRoute && !isAdmin) {
   //   return NextResponse.redirect(new URL('/auth/login', req.url));
   // }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
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