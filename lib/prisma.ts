import { PrismaClient } from "@prisma/client";



 const prismaClientSingleton = () => {
    return new PrismaClient()
 }



 const globalForPrisma =  globalThis as unknown as { prisma: PrismaClient | undefined };



 const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

 