import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db';
import { hashPassword } from '../utils/HashPassword';
import jwt from 'jsonwebtoken';
const app: Application = express();

/**
 * @openapi
 * components:
 *   schemas:
 *     ResetPasswordForm:
 *       type: object
 *       required:
 *         - password
 *         - password2
 *       properties:
 *         password:
 *           type: string
 *           default: foobar123
 *         password2:
 *           type: string
 *           default: foobar123
 *     ResetPasswordResponse:
 *       type: object
 *       properties:
 *         success_msg:
 *           type: string
 */

// Function to reset password
const resetPassword = async (req: Request, res: Response) => {
    const { id, token } = req.params

    const { password, password2 } = req.body
    console.log({
        password,
        password2
    })

    let errors: any = []

    // Check if required fields are missing
    if (!password || !password2) {
        errors.push({ msg: 'Please enter all fields'})
    }

    // Check if password length is valid
    if (password.length < 7) {
        errors.push({ msg: 'Password should be at least 7 characters'})
    }

    // Check if passwords match
    if (password != password2) {
        errors.push({msg: 'Passwords do not match'})
    }

    if (errors.length > 0) {
        res.render('resetPassword', { errors })
    } else {
        // Form validation has passed

        const hashedPassword = await hashPassword(password)
        console.log(hashedPassword)

        pool.query(
            `SELECT * FROM users WHERE user_id = $1`, [id], (err, result) => {
                if (err) {
                    throw err
                
                }
                const user = result.rows[0]
                const secret = process.env.JWT_SECRET + user.user_password
                const payload = jwt.verify(token, secret)
                user.user_password = hashedPassword
                pool.query(`UPDATE users SET user_password = $1 WHERE user_id = $2`, [user.user_password, id], (err, result) => {
                    if (err) {
                        throw err
                    }
                    console.log(result.rows)
                    req.flash('success_msg', 'Password reset done successfully')
                    res.redirect('/login')
                })
            }
        )
    }
}

export default resetPassword
