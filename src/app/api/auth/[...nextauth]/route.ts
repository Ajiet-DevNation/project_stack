import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // Use Prisma to store user, account, and session data
  adapter: PrismaAdapter(db),
  
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Force JWT strategy for session management
  session: {
    strategy: "jwt",
  },

  // Callbacks to control and customize the session flow
  callbacks: {
    // This callback runs whenever a JWT is created or updated.
    async jwt({ token, user }) {
      // 1. On initial sign-in, add user data to the token
      if (user) {
        token.id = user.id;
        // The 'user' object from the database might have a default 'onboarded' value
        const dbUser = await db.user.findUnique({ where: { id: user.id } });
        token.onboarded = dbUser?.onboarded ?? false;
      }
      // 2. On subsequent requests, refresh the token with the latest data
      else {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
        });
        if (dbUser) {
          token.onboarded = dbUser.onboarded;
        }
      }

      return token;
    },
    // This callback runs when a session is accessed by the client.
    async session({ session, token }) {
      // Add custom properties from the token to the client-side session object
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.onboarded = token.onboarded as boolean;
      }
      return session;
    },
  },

  // You can specify a custom sign-in page if you have one
  pages: {
    signIn: "/sign-in", // Example custom sign-in page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };