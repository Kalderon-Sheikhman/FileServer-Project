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
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../dbConfig/db"));
const HashPassword_1 = require("../utils/HashPassword");
const app = (0, express_1.default)();
/**
 * @openapi
 * components:
 *   schemas:
 *     AdminRegistrationResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Admin ID
 *         name:
 *           type: string
 *           description: Name of the admin
 *         email:
 *           type: string
 *           description: Email address of the admin
 */
// Function to register an admin
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, email } = req.query;
    console.log({
        name,
        email
    });
    let password = 'admin123';
    let confirmPassword = 'admin123';
    let isAdmin = true;
    let errors = [];
    // Check if required fields are missing
    if (!name || !email) {
        errors.push({ msg: 'Please enter all fields' });
    }
    // Check if passwords match
    if (password !== confirmPassword) {
        errors.push({ msg: 'Passwords do not match' });
    }
    if (errors.length > 0) {
        res.render('register', { errors });
    }
    else {
        // Form validation has passed
        const hashedPassword = yield (0, HashPassword_1.hashPassword)(password);
        db_1.default.query(`SELECT * FROM users WHERE user_email = $1`, [email], (err, result) => {
            if (err) {
                throw err;
            }
            console.log(result.rows);
            if (result.rows.length > 0) {
                errors.push({ msg: 'Email already registered' });
                res.render('register', { errors });
            }
            else {
                db_1.default.query(`INSERT INTO users (user_name, user_email, user_password, is_admin)
                        VALUES ($1, $2, $3, $4)
                        RETURNING user_name, user_email, user_id`, [name, email, hashedPassword, isAdmin], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    console.log(result.rows[0]);
                    const adminUser = result.rows[0];
                    req.flash('success_msg', 'You are now registered, Please log in');
                    res.redirect('/login');
                });
            }
        });
    }
});
exports.default = registerAdmin;
