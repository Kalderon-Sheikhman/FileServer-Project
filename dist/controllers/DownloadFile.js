"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../dbConfig/db"));
// Function to extract filename from path
const extractFilenameFromPath = (path) => {
    const filename = path.substring(path.lastIndexOf('/') + 1);
    return filename;
};
// Check if the file is already in the user's session
const isFileInSession = (downloaded_files, id) => {
    for (let i = 0; i < downloaded_files.length; i++) {
        if (downloaded_files[i].file_id == id) {
            downloaded_files[i].numberOfDownloadedFiles += 1;
            return true;
        }
    }
    return false;
};
// Function to download a file
const downloadFile = (req, res) => {
    const user = req.user;
    const { user_id, user_email } = user;
    let { file_id, filename, description, myfile } = req.body;
    const numberOfDownloadedFiles = 1;
    // Extract filename from the file path
    const exfilename = extractFilenameFromPath(myfile);
    const imagePath = `/app/public/uploads/${exfilename}`;
    console.log(myfile, file_id, filename, description, exfilename, imagePath);
    const fileData = {
        user_id,
        user_email,
        file_id,
        myfile,
        numberOfDownloadedFiles
    };
    // Check if the file is in the session
    if (req.session.downloaded_files !== undefined) {
        const downloads_cart = req.session.downloaded_files;
        if (!isFileInSession(downloads_cart, file_id)) {
            downloads_cart.push(fileData);
        }
    }
    else {
        req.session.downloaded_files = [fileData];
        const downloads_cart = req.session.downloaded_files;
    }
    console.log('Negative!', req.session.downloaded_files);
    let results = req.session.downloaded_files;
    console.log('Mailing Done...', results, exfilename);
    for (let i = 0; i < results.length; i++) {
        db_1.default.query(`INSERT INTO downloads (downloaded_files_id, user_id, user_email, file_id, image, number_of_downloaded_files)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (file_id)
        DO UPDATE SET
          user_id = EXCLUDED.user_id,
          downloaded_files_id = EXCLUDED.downloaded_files_id,
          user_email = EXCLUDED.user_email,
          image = EXCLUDED.image,
          number_of_downloaded_files = EXCLUDED.number_of_downloaded_files
        WHERE downloads.file_id = EXCLUDED.file_id        
        RETURNING *`, [results[i].user_id, results[i].user_id, results[i].user_email, results[i].file_id, results[i].myfile, results[i].numberOfDownloadedFiles], (err, result) => {
            if (err) {
                throw err;
            }
            console.log(result.rows);
        });
    }
    // Download the file
    res.download(imagePath, (err) => {
        if (err) {
            console.error('file not found', err);
        }
        else {
            console.log('file has been successfully downloaded');
        }
    });
};
exports.default = downloadFile;
