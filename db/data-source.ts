import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  // url: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false, // This is necessary if you're using self-signed certificates
  // },
  ssl: false,
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/db/migrations/*.js"],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
