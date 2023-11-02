import express, { Application, Request, Response, NextFunction} from 'express';
import pool from '../dbConfig/db';
import { hashPassword } from '../utils/HashPassword';
const app: Application = express();

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - password2
 *       properties:
 *         name:
 *           type: string
 *           default: foo
 *         email:
 *           type: string
 *           default: foo@gmail.com
 *         password:
 *           type: string
 *           default: foo123
 *         password2:
 *           type: string
 *           default: foo123
 *     CreateUserResponse:
 *       type: object
 *       properties:
 *         user_name:
 *           type: string
 *         user_email:
 *           type: string
 *         user_id:
 *           type: string
 */

const register = async (req: Request, res: Response) => {
    let { name, email, password, password2 } = req.body
    console.log({
        name,
        email,
        password,
        password2
    })

    let errors: any = []

    // Check if required fields are missing
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields'})
    }

    // Check if password is less than 7 characters
    if (password.length < 7) {
        errors.push({ msg: 'Password should be at least 7 characters'})
    }

    // Check if passwords match
    if (password !== password2) {
        errors.push({msg: 'Passwords do not match'})
    }
    if (errors.length > 0) {
        res.render('register', {errors})
    } else {
        // Form validation has passed

        const hashedPassword = await hashPassword(password)

        pool.query(
            `SELECT * FROM users WHERE user_email = $1`, [email], (err, result) => {
                if (err) {
                    throw err
                }

                if (result.rows.length > 0) {
                    errors.push({ msg: 'Email already registered'})
                    res.render('register', { errors })
                } else {
                    pool.query(
                        `INSERT INTO users (user_name, user_email, user_password)
                        VALUES ($1, $2, $3)
                        RETURNING user_name, user_email, user_id`, [name, email, hashedPassword],
                        (err, result) => {
                            if (err) {
                                throw err
                            }
                            const newUser = result.rows[0]
                            req.flash('success_msg', 'Welcome!,  now registered, Please log in')
                            res.redirect('/login')
                        }
                    )
                }
            }
        )
    }
}


export default register
