// src/lib/db.ts

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

// Type declaration for global prisma instance
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// Use existing instance or create new one
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// In development, store on global to prevent multiple instances during hot reload
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export { prisma };