import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

interface Config {
  development: {
    db: DatabaseConfig;
  };
  production: {
    db: DatabaseConfig;
  };
  [key: string]: {
    db: DatabaseConfig;
  };
}

const config: Config = {
  test: {
    db: {
      host: process.env.DB_HOST_TEST!,
      port: parseInt(process.env.DB_PORT_TEST!),
      database: process.env.DB_NAME_TEST!,
      username: process.env.DB_USER_TEST!,
      password: process.env.DB_PASS_TEST!,
    },
  },
  development: {
    db: {
      host: process.env.DB_HOST_DEV!,
      port: parseInt(process.env.DB_PORT_DEV!),
      database: process.env.DB_NAME_DEV!,
      username: process.env.DB_USER_DEV!,
      password: process.env.DB_PASS_DEV!,
    },
  },
  production: {
    db: {
      host: process.env.PGHOST!,
      port: parseInt(process.env.PGPORT!),
      database: process.env.PGDATABASE!,
      username: process.env.PGUSER!,
      password: process.env.PGPASSWORD!,
    },
  },
};

export default config;
