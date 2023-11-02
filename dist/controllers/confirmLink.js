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
const db_1 = __importDefault(require("../dbConfig/db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * @openapi
 * components:
 *   schemas:
 *     ValidateLink:
 *       type: object
 *       required:
 *         - link
 *       properties:
 *         link:
 *           type: string
 *         email:
 *           type: string
 */
const confirmLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, token } = req.params;
    try {
        const results = yield db_1.default.query(`SELECT * FROM users WHERE user_id = $1`, [id]);
        const user = results.rows[0];
        const secret = process.env.JWT_SECRET + user.user_password;
        if (id !== user.user_id) {
            console.log('Invalid id...');
            // return res.status(400).json({error_msg: "Invalid id..."})
        }
        const payload = jsonwebtoken_1.default.verify(token, secret);
        res.render('resetPassword');
        // res.status(200).json({"Link": "This link is valid", email: user.user_email})
    }
    catch (error) {
        // res.status(409).json({error_msg: 'Invalid token or id'})
    }
});
exports.default = confirmLink;
