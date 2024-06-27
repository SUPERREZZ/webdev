import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Debug log untuk memastikan middleware dieksekusi
  console.log("Middleware executed");

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Debug log untuk melihat apakah token berhasil diambil
  console.log("Token:", token);

  // Redirect ke halaman login jika token tidak ada dan halaman yang diminta bukan login
  if (!token && req.nextUrl.pathname !== '/auth/login') {
    console.log("Redirecting to login");
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Lanjutkan jika token ada atau halaman yang diminta adalah login
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|favicon.ico|auth/login).*)',
  ],
};
