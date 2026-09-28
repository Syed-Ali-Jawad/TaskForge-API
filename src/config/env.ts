import dotenv from "dotenv";
dotenv.config();

type ENV = {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  seedPassword: string;
  vercel: boolean;
};

const env: ENV = {
  port: Number(process.env.PORT!),
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN!,
  seedPassword: process.env.SEED_PASSWORD!,
  vercel: !!process.env.VERCEL || false,
};

export default env;
