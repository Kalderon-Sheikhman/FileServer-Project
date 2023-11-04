"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mailer_1 = __importDefault(require("../utils/Mailer"));
const db_1 = __importDefault(require("../dbConfig/db"));
const isFileInSession = (sent_files, id) => {
    for (let i = 0; i < sent_files.length; i++) {
        if (sent_files[i].file_id == id) {
            sent_files[i].nunmerOfSentFiles += 1;
            return true;
        }
    }
    return false;
};
/**
 * Sends an email with an attached file.
 * @param req Request object
 * @param res Response object
 * @returns Redirects to the dashboard or appropriate error response
 */
const sendingMail = (req, res) => {
    const { to, subject, body, file_id, filename, description, myfile } = req.body;
    // Check if email and subject are provided
    if (!to || !subject) {
        req.flash('success_msg', 'File could not be delivered, no mail address provided!');
        res.redirect('/dashboard');
    }
    const nunmerOfSentFiles = 1;
    const user = req.user;
    const { user_id, user_email } = user;
    const fileData = {
        user_id,
        user_email,
        file_id,
        myfile,
        nunmerOfSentFiles
    };
    // Store sent file in session if not already present
    if (req.session.sent_files !== undefined) {
        const sent_files = req.session.sent_files;
        if (!isFileInSession(sent_files, file_id)) {
            sent_files.push(fileData);
        }
    }
    else {
        req.session.sent_files = [fileData];
        const sent_files = req.session.sent_files;
    }
    // Store information in the database
    let results = req.session.sent_files;
    for (let i = 0; i < results.length; i++) {
        db_1.default.query(`INSERT INTO mails_sent (mails_sent_id, user_id, user_email, file_id, image, number_of_sent_files)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (file_id)
        DO UPDATE SET
          user_id = EXCLUDED.user_id,
          mails_sent_id = EXCLUDED.mails_sent_id,
          user_email = EXCLUDED.user_email,
          image = EXCLUDED.image,
          number_of_sent_files = EXCLUDED.number_of_sent_files
        WHERE mails_sent.file_id = EXCLUDED.file_id        
        RETURNING *`, [results[i].user_id, results[i].user_id, results[i].user_email, results[i].file_id, results[i].myfile, results[i].nunmerOfSentFiles], (err, result) => {
            if (err) {
                throw err;
            }
        });
    }
    // Send email with attachment
    const mailOptions = {
        from: process.env.ADMIN_MAIL,
        to: to,
        subject: subject,
        text: body,
        attachments: [
            {
                path: myfile
            }
        ]
    };
    Mailer_1.default.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
    // Redirect to the dashboard with success message
    req.flash('success_msg', 'message with attachment sent to mail address....');
    res.redirect('/dashboard');
};
exports.default = sendingMail;
