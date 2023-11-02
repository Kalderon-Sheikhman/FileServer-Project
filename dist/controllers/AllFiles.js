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
/**
 * @openapi
 * components:
 *   schemas:
 *     LoginUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           default: foo@gmail.com
 *         password:
 *           type: string
 *           default: foo123
 *     LoginUserResponse:
 *       type: object
 *       properties:
 *         login_user:
 *           type: string
 *         file_id:
 *           type: number
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 */
// Handles the retrieval of all files based on user type (admin or non-admin)
const allFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // If the user is an admin, retrieve all files with additional information
    if (user.is_admin === true) {
        try {
            let fileInfo = yield db_1.default.query(`SELECT f.title, f.description, f.image, COALESCE(s.number_of_sent_files, '0') AS number_of_sent_files, COALESCE(d.number_of_downloaded_files, '0') AS number_of_downloaded_files
                FROM files f
                LEFT JOIN mails_sent s ON f.file_id = s.file_id
                LEFT JOIN downloads d ON f.file_id = d.file_id
                ORDER BY f.uploaded_at DESC;
                `);
            let fileInfos = fileInfo.rows;
            res.render('adminDashboard', { fileInfos: fileInfos, name: user.user_name }); // Render the admin dashboard
        }
        catch (err) {
            res.status(500);
            res.json({ error_msg: 'Something went wrong' }); // Return error message for internal server error
        }
    }
    else {
        console.log(req.user);
        try {
            let userfiles = yield db_1.default.query(`SELECT * FROM files ORDER BY uploaded_at DESC`);
            let files = userfiles.rows;
            res.render('userDashboard', { files: files, name: user.user_name }); // Render the user dashboard
        }
        catch (err) {
            res.status(500);
            res.json({ error_msg: 'Something went wrong' }); // Return error message for internal server error
        }
    }
});
exports.default = allFiles;
