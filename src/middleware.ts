import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ar'],

  // Used when no locale matches
  defaultLocale: 'ar',
  
  // Disable locale detection based on user preferences so they always get Arabic first
  localeDetection: false
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
