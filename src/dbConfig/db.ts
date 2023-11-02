import { Pool } from 'pg';
import config from '../config/config';

// `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`

const environment = process.env.NODE_ENV || 'production';
const dbConfig = environment === 'test' ? config.test.db : config[environment].db;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

export default pool;

