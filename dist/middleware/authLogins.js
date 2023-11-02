"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LocalStrategy = require("passport-local").Strategy;
const db_1 = __importDefault(require("../dbConfig/db"));
const hashPassword_1 = require("../utils/hashPassword");
function initialize(passport) {
    const authenticateUser = (email, password, done) => __awaiter(this, void 0, void 0, function* () {
        db_1.default.query(`SELECT * FROM users WHERE user_email = $1`, [email], (err, results) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                throw err;
            }
            console.log(results.rows);
            if (results.rows.length > 0) {
                const user = results.rows[0];
                console.log(user);
                try {
                    const isMatch = yield (0, hashPassword_1.comparePassword)(password, user.user_password);
                    if (isMatch) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false, { message: "Password is not correct" });
                    }
                }
                catch (error) {
                    console.error(error);
                    return done(null, false, { message: "An error occurred while checking the password" });
                }
            }
            else {
                return done(null, false, { message: "Email is not registered" });
            }
        }));
    });
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.user_id));
    passport.deserializeUser((id, done) => {
        db_1.default.query(`SELECT * FROM users WHERE user_id = $1`, [id], (err, results) => {
            if (err) {
                throw err;
            }
            return done(null, results.rows[0]);
        });
    });
}
exports.default = initialize;
