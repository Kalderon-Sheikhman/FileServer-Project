"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    test: {
        db: {
            host: process.env.DB_HOST_TEST,
            port: parseInt(process.env.DB_PORT_TEST),
            database: process.env.DB_NAME_TEST,
            username: process.env.DB_USER_TEST,
            password: process.env.DB_PASS_TEST,
        },
    },
    development: {
        db: {
            host: process.env.DB_HOST_DEV,
            port: parseInt(process.env.DB_PORT_DEV),
            database: process.env.DB_NAME_DEV,
            username: process.env.DB_USER_DEV,
            password: process.env.DB_PASS_DEV,
        },
    },
    production: {
        db: {
            host: process.env.PGHOST,
            port: parseInt(process.env.PGPORT),
            database: process.env.PGDATABASE,
            username: process.env.PGUSER,
            password: process.env.PGPASSWORD,
        },
    },
};
exports.default = config;
