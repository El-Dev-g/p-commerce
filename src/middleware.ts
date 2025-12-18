
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/storefront')) {
    const basicAuth = req.headers.get('authorization');
    const url = req.nextUrl;

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      const validUser = process.env.BASIC_AUTH_USER;
      const validPass = process.env.BASIC_AUTH_PASS;

      if (user === validUser && pwd === validPass) {
        return NextResponse.next();
      }
    }

    url.pathname = '/api/auth-required';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/storefront/:path*',
};
