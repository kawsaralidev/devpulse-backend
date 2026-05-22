import dotenv from "dotenv";
import path from "path";
import { env } from "process";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL as string,
  jwt_secret: process.env.JWT_SECRET,
  node_env: env.NODE_ENV as string,
};

export default config;
