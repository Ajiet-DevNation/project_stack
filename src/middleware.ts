// This line imports and exports the default NextAuth.js middleware.
// It automatically handles the session check and redirection.
import { withAuth } from "next-auth/middleware";

export default withAuth({
   callbacks: {
    authorized: ({ token }) => {
      // `token` exists only if the user is signed in
      return !!token;
    },
  },
  // 👇 Redirect path if unauthorized
  pages: {
    signIn: "/", 
  },
});

// The 'config' object specifies which routes the middleware should run on.
export const config = {
  //    This matcher array defines the paths that this middleware will protect.
  matcher: [
    "/dashboard/:path*", // frontend pages
    "/api/protected/:path*", // backend API routes you want to protect
    "/onbaording/:path*" 
  ],
};
