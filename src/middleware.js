import { clerkMiddleware,createRouteMatcher } from '@clerk/nextjs/server'


const IsProtectedRoute = createRouteMatcher(['/api/trpc','/', '/chat', '/chat/:id', '/settings'])

export default clerkMiddleware(async (auth,req) => {
  // Check if the request is for a protected route
  if (IsProtectedRoute(req))  await auth.protect()

  })

  

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}