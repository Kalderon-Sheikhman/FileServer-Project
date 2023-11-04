"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../dbConfig/db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Mailer_1 = __importDefault(require("../utils/Mailer"));
;
const server_1 = require("../server");
;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * @openapi
 * components:
 *   schemas:
 *     ForgotPasswordInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           default: foo@gmail.com
 *     ForgotPasswordResponse:
 *       type: object
 *       properties:
 *         mail message:
 *           type: string
 *         link:
 *           type: string
 */
const forgotPassword = (req, res, next) => {
    const { email } = req.body;
    let errors = [];
    // Make sure user exist in database with this email
    db_1.default.query(`SELECT * FROM users WHERE user_email = $1`, [email], (err, result) => {
        if (err) {
            throw err;
        }
        else if (result.rows.length === 0) {
            errors.push({ msg: 'this email does not have an account' });
            res.render('forgotPassword', { errors });
            // res.status(400).json({errors})
        }
        else {
            // User exist and now create a one time link valid for 15minutes
            console.log(result.rows);
            let user = result.rows[0];
            const secret = process.env.JWT_SECRET + user.user_password;
            const payload = {
                email: user.user_email,
                id: user.user_id
            };
            const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '15m' });
            const environment = process.env.NODE_ENV || 'development';
            const link = environment === 'production'
                ? `https://${process.env.HOST}/reset_password/${user.user_id}/${token}`
                : `${process.env.BASE_URL}:${server_1.port}/reset_password/${user.user_id}/${token}`;
            console.log(link);
            const mailOptions = {
                from: process.env.ADMIN_MAIL,
                to: email,
                subject: 'Password reset',
                html: `
                        <h4>click on this link to reset your password</h4>
                        <br>
                        <p>${link}</p>
                        `
            };
            Mailer_1.default.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Email sent: ' + info.response);
                    // do something useful
                }
            });
            //res.send('Password reset link has been sent to your email ...')
            req.flash('success_msg', 'Generated password reset link has been sent to your mail ...');
            res.redirect('/login');
            // res.status(200).json({"mail message": "Password reset link has been sent to your email ...", link, token, id: user.user_id})
        }
    });
};
exports.default = forgotPassword;
