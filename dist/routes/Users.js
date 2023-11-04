"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const passport_1 = __importDefault(require("passport"));
const AuthAccess_1 = require("../middleware/AuthAccess");
const Register_1 = __importDefault(require("../controllers/Register"));
const ForgotPassword_1 = __importDefault(require("../controllers/ForgotPassword"));
const ConfirmLink_1 = __importDefault(require("../controllers/ConfirmLink"));
const ResetPassword_1 = __importDefault(require("../controllers/ResetPassword"));
const UploadFile_1 = __importStar(require("../controllers/UploadFile"));
const AllFiles_1 = __importDefault(require("../controllers/AllFiles"));
const SearchFile_1 = __importDefault(require("../controllers/SearchFile"));
const SendingMail_1 = __importDefault(require("../controllers/SendingMail"));
const DownloadFile_1 = __importDefault(require("../controllers/DownloadFile"));
const RegisterAdmin_1 = __importDefault(require("../controllers/RegisterAdmin"));
const app = (0, express_1.default)();
const routes = (0, express_2.Router)();
// Register Page
routes.get('/register', AuthAccess_1.checkAuthenticated, (req, res) => {
    res.render('register');
});
/**
 * @openapi
 * /register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */
routes.post('/register', Register_1.default);
/**
 * @openapi
 * /register_admin:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Register an admin
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Name of the admin
 *         required: true
 *         schema:
 *           type: string
 *       - name: email
 *         in: query
 *         description: Email address of the admin
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminRegistrationResponse'
 *       400:
 *         description: Bad request
 */
routes.get('/register_admin', RegisterAdmin_1.default);
// Login Page
routes.get('/login', AuthAccess_1.checkAuthenticated, (req, res) => {
    res.render('login');
});
/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - Login
 *     summary: Log user into dashboard
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginUserResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */
// Login Handle
routes.post('/login', (req, res, next) => {
    console.log('session >>>>', req.session);
    passport_1.default.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});
routes.get('/dashboard', AuthAccess_1.checkNotAuthenticated, AllFiles_1.default);
// Logout Handle
routes.get('/logout', (req, res) => {
    req.logOut(function () { console.log('Done logging out.'); });
    req.flash('success_msg', 'Logged out');
    res.redirect('/login');
});
routes.get('/forgot_password', (req, res, next) => {
    res.render('forgotPassword');
});
/**
 * @openapi
 * /forgot_password:
 *   post:
 *     tags:
 *       - Forgot Password
 *     summary: Can't remember your password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForgotPasswordResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */
routes.post('/forgot_password', ForgotPassword_1.default);
/**
 * @openapi
 * /reset_password/{id}/{token}:
 *   get:
 *     tags:
 *       - Validate link
 *     summary: validating reset password link
 *     parameters:
 *       - name: id
 *         in: path
 *         description: provide id from reset password link
 *         required: true
 *       - name: token
 *         in: path
 *         description: provide token from reset password link
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidateLink'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */
routes.get('/reset_password/:id/:token', ConfirmLink_1.default);
/**
 * @openapi
 * /reset_password/{id}/{token}:
 *   post:
 *     tags:
 *       - Reset Password
 *     summary: Reset your password
 *     parameters:
 *       - name: id
 *         in: path
 *         description: provide id from reset password link
 *         required: true
 *       - name: token
 *         in: path
 *         description: provide token from reset password link
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordForm'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPasswordResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */
routes.post('/reset_password/:id/:token', ResetPassword_1.default);
routes.post('/send_mail', AuthAccess_1.checkNotAuthenticated, (req, res) => {
    const { file_id, filename, description, myfile } = req.body;
    console.log(req.body);
    res.render('sendingMail', { file_id, filename, description, myfile });
});
routes.post('/sending_mail', SendingMail_1.default);
routes.post('/download_file', DownloadFile_1.default);
routes.get('/upload_file', AuthAccess_1.checkNotAuthenticated, AuthAccess_1.verifyAdmin, (req, res) => {
    res.render('uploadFile');
});
/**
 * @openapi
 * /upload_file:
 *   post:
 *     tags:
 *       - File Upload
 *     summary: Upload a file with title and description
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *               description:
 *                 type: string
 *               myfile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileUploadResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */
routes.post('/upload_file', AuthAccess_1.checkNotAuthenticated, AuthAccess_1.verifyAdmin, UploadFile_1.upload, UploadFile_1.default);
// search by file title
routes.get('/search_file', AuthAccess_1.checkNotAuthenticated, (req, res) => {
    res.render('searchFile');
});
/**
 * @openapi
 * /search_file:
 *   post:
 *     tags:
 *       - Search Files
 *     summary: Search for files by file title
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SearchFilesInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchFilesResponse'
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad request
 */
routes.post('/search_file', AuthAccess_1.checkNotAuthenticated, SearchFile_1.default);
exports.default = routes;
