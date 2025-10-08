import { PrismaClient } from "@prisma/client";

declare global {
  
  var prisma: PrismaClient | undefined;
}

// Ensure we don't create multiple instances during development
const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };

export const db: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
