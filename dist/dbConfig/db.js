"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = __importDefault(require("../config/config"));
// `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
const environment = process.env.NODE_ENV || 'production';
const dbConfig = environment === 'test' ? config_1.default.test.db : config_1.default[environment].db;
const pool = new pg_1.Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});
exports.default = pool;
