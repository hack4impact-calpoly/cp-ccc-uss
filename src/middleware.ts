import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/api/volunteer(.*)',
  '/api/entry(.*)',
  '/api/role(.*)',
  '/api/form(.*)',
  '/volunteerProfile',
  '/admin(.*)'
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
})

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};