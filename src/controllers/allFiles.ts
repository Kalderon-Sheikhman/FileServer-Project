import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db'
import userInfo from '../types/userInfo'


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
 *           default: john@gmail.com
 *         password:
 *           type: string
 *           default: john123
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


const allFiles = async (req: Request, res: Response) => {
    const user = req.user as userInfo
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
            res.render('adminDashboard', { fileInfos: fileInfos, name: user.user_name })
            // res.status(200)
            // res.json({"You are login as: ": user.user_name, fileInfos})
    
        } catch (err: any) {
            res.status(500)
            res.json({error_msg: 'Something went wrong'})
        }
        
    } else {
        console.log(req.user)
        try {
            let userfiles = await pool.query(
                `SELECT * FROM files ORDER BY uploaded_at DESC`
            )
            let files = userfiles.rows
            res.render('userDashboard', { files: files, name: user.user_name })
            // res.status(200)
            // res.json({"You are login as: ": user.user_name, files})
    
        } catch (err: any) {
            res.status(500)
            res.json({error_msg: 'Something went wrong'})
        }
         
    } 
}

export default allFiles