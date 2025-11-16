import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      onboarded: boolean;
    };
  }

  interface USER {
    id?: string;
    image?: string;
    email?: string;
    name?: string;
    onboarded: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    image?: string;
    email?: string;
    name?: string;
    onboarded: boolean;
  }
}
