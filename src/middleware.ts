import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    // Define public routes (accessible without auth)
    const isPublicRoute = pathname === "/" || pathname === "/home";
    
    // Define onboarding route
    const isOnboardingRoute = pathname.startsWith("/onboarding");
    
    // Check if user is authenticated
    const isAuthenticated = !!token;
    
    // Check if user is onboarded
    const isOnboarded = token?.onboarded === true;

    // Case 1: Not authenticated
    if (!isAuthenticated) {
      // Allow access to landing page
      if (isPublicRoute) {
        return NextResponse.next();
      }
      // Redirect to landing page for any other route
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Case 2: Authenticated but not onboarded
    if (isAuthenticated && !isOnboarded) {
      // Allow access to onboarding page
      if (isOnboardingRoute) {
        return NextResponse.next();
      }
      // Allow access to landing page (in case they want to sign out)
      if (isPublicRoute) {
        return NextResponse.next();
      }
      // Redirect all other routes to onboarding
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Case 3: Authenticated and onboarded
    if (isAuthenticated && isOnboarded) {
      // Prevent access to onboarding page if already onboarded
      if (isOnboardingRoute) {
        return NextResponse.redirect(new URL("/home", req.url));
      }
      // Redirect from landing page to home if already authenticated and onboarded
      if (isPublicRoute) {
        return NextResponse.redirect(new URL("/home", req.url));
      }
      // Allow access to all other routes
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // This authorized callback is required, but we handle logic in the middleware function above
      authorized: ({ }) => {
        // Return true to let the middleware function handle the logic
        return true;
      },
    },
    pages: {
      signIn: "/",
    },
  }
);

// Protect all routes except static files and API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    // Exclude API, Next internals and common static asset extensions so requests
    // for files in /public (images, icons) are not intercepted by auth middleware.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico)).*)",
  ],
};