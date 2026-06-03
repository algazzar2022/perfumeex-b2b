import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ar'],

  // Used when no locale matches
  defaultLocale: 'ar',
  
  // Disable locale detection based on user preferences so they always get Arabic first
  localeDetection: false
});

export default function middleware(req: NextRequest) {
  // Check if the path is inside admin-dashboard
  const path = req.nextUrl.pathname;
  const isAdminRoute = path.includes('/admin-dashboard');

  if (isAdminRoute) {
    const basicAuth = req.headers.get('authorization');
    const url = req.nextUrl;

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      // algazzar:mooha2711 encoded in base64 is YWxnYXp6YXI6bW9vaGEyNzEx
      const [user, pwd] = atob(authValue).split(':');

      if (user === 'algazzar' && pwd === 'mooha2711') {
        return intlMiddleware(req);
      }
    }
    url.pathname = '/api/auth';

    return new NextResponse('Auth required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
      },
    });
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
