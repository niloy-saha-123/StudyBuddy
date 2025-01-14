// src/middleware.ts
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/signup', '/dashboard'],
  afterAuth(auth, req) {
    // If the user is logged in and trying to access a public route
    if (auth.userId && auth.isPublicRoute) {
      const dashboardUrl = new URL('/dashboard', req.url);
      return Response.redirect(dashboardUrl);
    }
  },
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};