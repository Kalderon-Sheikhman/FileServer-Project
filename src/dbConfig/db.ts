import { Pool } from 'pg';
import dotenv from 'dotenv';
import config from '../config/config';

dotenv.config();

const environment = process.env.NODE_ENV || 'production';
const dbConfig = environment === 'test' ? config.test.db : config[environment].db;

const conString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

const pool = new Pool({
  connectionString: conString,
});

export default pool;
