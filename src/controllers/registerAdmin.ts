import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db'
import { hashPassword } from '../utils/hashPassword'
const app: Application = express()

/**
 * @openapi
 * components:
 *   schemas:
 *     AdminRegistrationResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Admin ID
 *         name:
 *           type: string
 *           description: Name of the admin
 *         email:
 *           type: string
 *           description: Email address of the admin
 */

const registerAdmin = async (req: Request, res: Response) => {
    let { name, email } = req.query
    console.log({
        name,
        email
    })
    let password: string = 'admin123';
    let confirmPassword: string = 'admin123';
    let isAdmin: boolean = true
    let errors: any = []

    if (!name || !email) {
        errors.push({ msg: 'Please enter all fields'})
        //res.status(400)
        /*res.json({
            errors: [{ msg: 'Please enter all fields' }],
          });*/
    }

    if (password !== confirmPassword) {
        errors.push({msg: 'Passwords do not match'})
        /*res.status(400).json({
            errors: [{ msg: 'Passwords do not match' }],
          });*/

    
    }
    if (errors.length > 0) {
        res.render('register', {errors})
        // res.status(400)
        /*res.json({
            errors: errors
          });*/
    } else {
        // Form validation has passed

        const hashedPassword = await hashPassword(password)
        pool.query(
            `SELECT * FROM users WHERE user_email = $1`, [email], (err, result) => {
                if (err) {
                    throw err
                }
                console.log(result.rows)

                if (result.rows.length > 0) {
                    errors.push({ msg: 'Email already registered'})
                    res.render('register', { errors })
                    // res.status(409)
                    /*res.json({
                        errors: [{msg: 'Email already registered'}],
                    })*/
                } else {
                    pool.query(
                        `INSERT INTO users (user_name, user_email, user_password, is_admin)
                        VALUES ($1, $2, $3, $4)
                        RETURNING user_name, user_email, user_id`, [name, email, hashedPassword, isAdmin],
                        (err, result) => {
                            if (err) {
                                throw err
                            }
                            console.log(result.rows[0])
                            const adminUser = result.rows[0]
                            req.flash('success_msg', 'You are now registered, Please log in')
                            res.redirect('/login')
                            // res.status(200)
                            /*res.json({
                                user_name: adminUser.user_name,
                                user_email: adminUser.user_email,
                                user_id: adminUser.user_id
                            })*/
                        }
                    )
                }
            }
        )
    }
}


export default registerAdmin