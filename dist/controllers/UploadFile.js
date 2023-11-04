"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const db_1 = __importDefault(require("../dbConfig/db"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
/**
 * @openapi
 * components:
 *   schemas:
 *     FileUploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *       example:
 *         success: true
 *         message: File upload a success!
 */
// storage engine
const storage = multer_1.default.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    }
});
// check file type
const checkFileType = (file, cb) => {
    const filetypes = /png|jpg|jpeg|gif/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb('only image files are allowed');
    }
};
// Initialize upload
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('myfile');
// upload files to this endpoint
const uploadFile = (req, res) => {
    const { filename, description } = req.body;
    const host = 'https://astonishing-bridge-production.up.railway.app/uploads/';
    const errors = [];
    if (!filename || !description) {
        errors.push({ msg: 'Provide file title & description' });
        return res.render('uploadFile', { errors });
        // return res.status(400).json({error_msg: 'Provide file title & description'})
    }
    if (!req.file) {
        errors.push({ msg: 'No file has been selected' });
        return res.render('uploadFile', { errors });
        // return res.status(404).json({error_msg: 'No file has been selected'})
    }
    if (req.file.mimetype.startsWith('image/')) {
        db_1.default.query(`INSERT INTO files (title, description, image)
            VALUES ($1, $2, $3)
            RETURNING *`, [filename, description, `${host}${req.file.filename}`], (err, result) => {
            if (err) {
                throw err;
            }
            req.flash('success_msg', 'File upload a success!');
            res.redirect('/dashboard');
            // return res.status(200).json({success_msg: 'File upload a success!'});
        });
    }
    else {
        errors.push({ msg: 'Image files only' });
        return res.render('uploadFile', { errors });
        // return res.status(400).json({error_msg: 'Only image files are allowed!'});
    }
};
exports.default = uploadFile;
