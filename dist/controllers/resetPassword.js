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
const hashPassword_1 = require("../utils/hashPassword");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
/**
 * @openapi
 * components:
 *   schemas:
 *     ResetPasswordForm:
 *       type: object
 *       required:
 *         - password
 *         - password2
 *       properties:
 *         password:
 *           type: string
 *           default: john123
 *         password2:
 *           type: string
 *           default: john123
 *     ResetPasswordResponse:
 *       type: object
 *       properties:
 *         success_msg:
 *           type: string
 */
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, token } = req.params;
    const { password, password2 } = req.body;
    console.log({
        password,
        password2
    });
    let errors = [];
    if (!password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }
    if (errors.length > 0) {
        res.render('resetPassword', { errors });
        /*res.status(400).json({
            errors: errors
        })*/
    }
    else {
        // Form validation has passed
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        console.log(hashedPassword);
        db_1.default.query(`SELECT * FROM users WHERE user_id = $1`, [id], (err, result) => {
            if (err) {
                throw err;
            }
            const user = result.rows[0];
            const secret = process.env.JWT_SECRET + user.user_password;
            const payload = jsonwebtoken_1.default.verify(token, secret);
            user.user_password = hashedPassword;
            db_1.default.query(`UPDATE users SET user_password = $1 WHERE user_id = $2`, [user.user_password, id], (err, result) => {
                if (err) {
                    throw err;
                }
                console.log(result.rows);
                req.flash('success_msg', 'Password reset done successfully');
                res.redirect('/login');
                // res.status(200).json({'success_msg': 'Password reset done successfully, you can now login to view your resource'})
            });
        });
    }
});
exports.default = resetPassword;
