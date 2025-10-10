import { PrismaClient } from "@prisma/client";

// *────────────────────────────────
// * LEARN: Prisma ist das ORM (Object Relational Mapper)
// * „Programmierschnittstelle“ zur Datenbank PostgreSQL
// *────────────────────────────────

//Speichern im globalen Node-Scope
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["warn", "error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
