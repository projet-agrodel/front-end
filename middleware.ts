import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { PROTECTED_ROUTES } from './services/constants';

 export default withAuth(
  function middleware(req) {
     const token = req.nextauth.token;

     const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        req.nextUrl.pathname.startsWith(route)
     );

     if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
     }

     // ToDo mudar role
     if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
     }

     return NextResponse.next();
  },
  {
     callbacks: {
        authorized: ({ token }) => !!token,
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