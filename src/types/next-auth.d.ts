import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {

  // Extends the built-in session.user type
  interface Session {
    user: {
      id: string;
      onboarded: boolean;
    } & DefaultSession["user"]; 
  }

  
  // Extends the built-in User model (the one from your database)
  interface User {
    onboarded: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    onboarded: boolean;
    image?: string | null; 
    name?: string;
    email?: string;
  }
}