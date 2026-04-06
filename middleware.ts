import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './src/navigation';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' 
});

/**
 * Combined Middleware:
 * 1. next-intl for routing / language
 * 2. Zero-Retention Security for /api/analyze
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. SECURITY LAYER (FOR /api/analyze) ──────────────────────────
  if (pathname.includes('/api/analyze')) {
    const requestHeaders = new Headers(request.headers);
    
    // Strip telemetry and traceability headers
    const headersToStrip: string[] = [];
    for (const [key] of requestHeaders.entries()) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.startsWith('x-vercel-') ||
        lowerKey === 'x-forwarded-for' ||
        lowerKey === 'x-real-ip' ||
        lowerKey === 'x-request-id' ||
        lowerKey === 'x-correlation-id' ||
        lowerKey === 'x-trace-id'
      ) {
        headersToStrip.push(key);
      }
    }
    for (const key of headersToStrip) {
      requestHeaders.delete(key);
    }

    // Set opaque request ID
    requestHeaders.set('x-request-id', crypto.randomUUID());

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // Zero-retention response headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Athar-Retention', 'zero');

    return response;
  }

  // ── 2. ROUTING LAYER (FOR LANDING PAGE) ───────────────────────────
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|ar)/:path*', '/api/analyze']
};
