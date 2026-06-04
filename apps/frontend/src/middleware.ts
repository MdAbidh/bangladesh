import { NextResponse, type NextRequest } from 'next/server';

const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/courses',
  '/api',
  '/_next',
  '/favicon.ico',
];

const publicRoutePatterns = [/^\/courses\/[^/]+$/, /^\/courses\/[^/]+\/lessons\/[^/]+$/];

function isPublicRoute(pathname: string): boolean {
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return true;
  }
  if (publicRoutePatterns.some((pattern) => pattern.test(pathname))) {
    return true;
  }
  return false;
}

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return request.cookies.get('accessToken')?.value ?? null;
}

function base64Decode(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  for (let bc = 0, bs = 0, bu = 0, i = 0; i < str.length; i++) {
    const ch = str.charAt(i);
    bu = chars.indexOf(ch);
    if (bu === -1) continue;
    ~bu && (bs = bc % 4 ? bs * 64 + bu : bu, bc++ % 4)
      ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
      : 0;
  }
  return output;
}

function parseToken(token: string): { role?: string; exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(base64Decode(parts[1]!));
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = getToken(request);

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = parseToken(token);

  if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('accessToken');
    return response;
  }

  const role = payload.role;

  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/teacher') && role !== 'TEACHER' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?|css|js)).*)',
  ],
};
