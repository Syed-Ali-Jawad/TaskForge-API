import dotenv from "dotenv";
dotenv.config();

type ENV = {
  port: string;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  seedPassword: string;
};

const env: ENV = {
  port: process.env.PORT!,
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN!,
  seedPassword: process.env.SEED_PASSWORD!,
};

export default env;
