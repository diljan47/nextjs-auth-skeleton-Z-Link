import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

const publicRoutes = [ "/signin", "/signup", "/forgot-password", "/reset-password","/verify-email"];

const protectedRoutes = ["/dashboard", "/account","/change-password","/logout",];

export async function middleware(request: NextRequest): Promise<NextResponse> {

  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value ?? null;

  if (request.nextUrl.searchParams.has("invalid_session")) {
    if (!pathname.startsWith('/signin')) {
      const response = NextResponse.redirect(new URL("/signin", request.url));
      const cookiesList = request.cookies.getAll();
      
      cookiesList.forEach((cookie) => {
        response.cookies.delete(cookie.name);
      });
      return response;
    }
    return NextResponse.next();
  }

  if (pathname === "/" || pathname.startsWith("/verify-email")) {
    return NextResponse.next();
  }

  if (publicRoutes.some(route => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
  }
  


  if (request.method === "GET") {
    const response = NextResponse.next();
    if (token !== null) {
      response.cookies.set("session", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }
    return response;
  }
  const originHeader = request.headers.get("Origin");
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader = request.headers.get("Host");
  if (originHeader === null || hostHeader === null) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  let origin: URL;
  try {
    origin = new URL(originHeader);
  } catch {
    return new NextResponse(null, {
      status: 403,
    });
  }
  if (origin.host !== hostHeader) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  return NextResponse.next(); 
}


export const config = {
  matcher: [
    // Protected routes
    '/dashboard/:path*',
    '/account/:path*',
    '/change-password/:path*',
    '/logout',
    '/settings/:path*',
    '/profile/:path*',
    '/security/:path*',

    // Auth routes
    '/signin',
    
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',

    // Exclude Next.js internals
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};
