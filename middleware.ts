import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token && req.nextUrl.pathname !== '/auth/login') {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    '/((?!_next/static|favicon.ico|auth/login).*)',
  ],
};
