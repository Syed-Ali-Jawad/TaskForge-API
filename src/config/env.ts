import dotenv from "dotenv";
dotenv.config();

type ENV = {
  port: string;
  databaseUrl: string;
};

const env: ENV = {
  port: process.env.PORT!,
  databaseUrl: process.env.DATABASE_URL!,
};

export default env;
