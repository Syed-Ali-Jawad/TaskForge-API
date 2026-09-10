import { PrismaClient } from "../generated/prisma/client";
import { PrismaClientOptions } from "../generated/prisma/internal/prismaNamespace.ts";

const prisma = new PrismaClient({} as PrismaClientOptions);

export default prisma;
