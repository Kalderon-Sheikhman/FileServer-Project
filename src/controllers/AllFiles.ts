import express, { Application, Request, Response, NextFunction} from 'express';
import pool from '../dbConfig/db';
import userInfo from '../types/userInfo';

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
const allFiles = async (req: Request, res: Response) => {
    const user = req.user as userInfo;

    // If the user is an admin, retrieve all files with additional information
    if (user.is_admin === true) {
        try {
            let fileInfo = await pool.query(
                `SELECT f.title, f.description, f.image, COALESCE(s.number_of_sent_files, '0') AS number_of_sent_files, COALESCE(d.number_of_downloaded_files, '0') AS number_of_downloaded_files
                FROM files f
                LEFT JOIN mails_sent s ON f.file_id = s.file_id
                LEFT JOIN downloads d ON f.file_id = d.file_id
                ORDER BY f.uploaded_at DESC;
                `,
            )
            let fileInfos = fileInfo.rows
            res.render('adminDashboard', { fileInfos: fileInfos, name: user.user_name }) // Render the admin dashboard
        } catch (err: any) {
            res.status(500)
            res.json({error_msg: 'Something went wrong'}) // Return error message for internal server error
        }
        
    } else {
        console.log(req.user)
        try {
            let userfiles = await pool.query(
                `SELECT * FROM files ORDER BY uploaded_at DESC`
            )
            let files = userfiles.rows
            res.render('userDashboard', { files: files, name: user.user_name }) // Render the user dashboard
        } catch (err: any) {
            res.status(500)
            res.json({error_msg: 'Something went wrong'}) // Return error message for internal server error
        }
         
    } 
}

export default allFiles;
