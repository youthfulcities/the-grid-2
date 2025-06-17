import acceptLanguage from 'accept-language';
import { NextResponse } from 'next/server';
import { cookieName, fallbackLng, languages } from './app/i18n/settings';

acceptLanguage.languages(languages);

export const config = {
  // matcher: '/:lng*'
  matcher: [
    '/((?!api|redirect|_next/static|_next/image|assets|favicon.ico|sw.js|manifest.webmanifest).*)',
  ],
};

export function middleware(req) {
  const env =
    process.env.AMPLIFY_ENV ||
    process.env.NEXT_PUBLIC_ENV ||
    process.env.NODE_ENV;

  // Restrict access to RAI in prod before release
  if (env === 'prod') {
    // Check if the request is for the restricted route.
    if (
      req.nextUrl.pathname.includes('/insights/real-affordability') &&
      !req.nextUrl.pathname.includes('/grocery') &&
      !req.nextUrl.pathname.includes('/coming-soon')
    ) {
      // Option 1: Redirect to a custom 403 page:
      return NextResponse.redirect(
        new URL('/insights/real-affordability/coming-soon', req.url)
      );

      // Option 2: Return a 403 status response:
      // return new NextResponse('Forbidden', { status: 403 });
    }
  }

  let lng;
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName).value);
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;

  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
    );
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer'));
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next();
}
