// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

// export default clerkMiddleware(async (auth, req: NextRequest) => {
//   if (isProtectedRoute(req)) await auth.protect();
// });
// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)'
//   ]
// };

export function middleware(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // ✅ Nếu Zalo mở root, index, hoặc path lạ -> luôn rewrite về /landing
  if (
    path === '/' ||
    path === '/index' ||
    path.startsWith('/__index') ||
    url.searchParams.has('zplatform') ||
    url.searchParams.has('zclient') ||
    url.searchParams.has('zsource')
  ) {
    return NextResponse.rewrite(new URL('/landing', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: []
};
