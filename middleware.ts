// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['ar', 'en']
const defaultLocale = 'ar'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    )
  }
}

export const config = {
  // تم تحديث هذا الجزء
  // matcher الآن يستثني مسارات api, _next, والملفات التي لها امتداد (مثل .png, .woff2)
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\..*).*)'
  ],
}