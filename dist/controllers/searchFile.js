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
 *     SearchFilesInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           default: Wodin Fabrics
 *     SearchFilesResponse:
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
/**
 * Searches files based on the provided title.
 * @param req Request object
 * @param res Response object
 * @returns Rendered searchFile template or appropriate error response
 */
const searchFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { title } = req.body;
    if (!title) {
        res.redirect('/dashboard');
        // res.status(400)
        // res.json({error_msg: "Enter file title the next time"})
    }
    try {
        const results = yield db_1.default.query(`SELECT file_id, title, description, image FROM files WHERE title ILIKE $1`, [`%${title}%`]);
        let searchfiles = results.rows;
        console.log(searchfiles);
        if (searchfiles.length === 0) {
            req.flash('success_msg', 'No file with such title!');
            res.redirect('/dashboard');
            // res.status(404).json({error_msg: "file does not exist"})
        }
        res.render('searchFile', { searchfiles: searchfiles, name: user.user_name });
        // res.json({searchfiles})
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = searchFile;
