import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

type Server = {
  hostname: string | undefined;
  port: number;
  corsOriginUrl: string | undefined;
};

type MySql = {
  user: string | undefined;
  password: string | undefined;
  port: number;
  database: string | undefined;
  host: string | undefined;
};

type JwtSecret = {
  secret: string | undefined;
};

type Config = {
  server: Server;
  database: MySql;
  jwt: JwtSecret;
};

const SERVER_HOSTNAME: string | undefined = process.env.HOST_NAME;
const SERVER_PORT: number | undefined = parseInt(<string>process.env.SERVER_PORT, 10);
const CORS_ORIGIN_URL: string | undefined = process.env.CORS_ORIGIN_URL;

const SERVER: Server = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
  corsOriginUrl: CORS_ORIGIN_URL
};

const MYSQL_HOST: string | undefined = process.env.MYSQL_HOST;
const MYSQL_DATABASE: string | undefined = process.env.MYSQL_DATABASE;
const MYSQL_PORT: number | undefined = parseInt(<string>process.env.MYSQL_PORT, 10);
const MYSQL_USER: string | undefined = process.env.MYSQL_USER;
const MYSQL_PASS: string | undefined = process.env.MYSQL_PASSWORD;

const MYSQL: MySql = {
  user: MYSQL_USER,
  password: MYSQL_PASS,
  port: MYSQL_PORT,
  database: MYSQL_DATABASE,
  host: MYSQL_HOST
};

const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

const JWT: JwtSecret = {
  secret: JWT_SECRET
};

const config: Config = {
  server: SERVER,
  database: MYSQL,
  jwt: JWT
};

export default config;
