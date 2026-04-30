import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = {
  '/profile': ['worker'],
  // '/employer': ['employer'],
};

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const protectedPath = Object.keys(protectedRoutes).find((route) =>
    pathname.startsWith(route)
  );

  if (protectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token');

      const payload = JSON.parse(atob(parts[1]));
      const userRole = payload.role?.toLowerCase() || '';

      const allowedRoles =
        protectedRoutes[protectedPath as keyof typeof protectedRoutes];

      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/employer/:path*'],
};
