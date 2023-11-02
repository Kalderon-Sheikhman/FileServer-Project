import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db'
import jwt from 'jsonwebtoken'
import transporter from '../utils/mailer';
import { port } from '../server';
import dotenv from 'dotenv'
dotenv.config()

/**
 * @openapi
 * components:
 *   schemas:
 *     ForgotPasswordInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           default: john@gmail.com
 *     ForgotPasswordResponse:
 *       type: object
 *       properties:
 *         mail message:
 *           type: string
 *         link:
 *           type: string
 */



const forgotPassword = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body
    let errors: any = []

    // Make sure user exist in database with this email
    pool.query(
        `SELECT * FROM users WHERE user_email = $1`, [email], (err, result) => {
            if (err) {
                throw err
            }

            else if (result.rows.length === 0) {
                errors.push({ msg: 'User with this email does not exist'})
                res.render('forgotPassword', { errors })
                // res.status(400).json({errors})
            } else {
                // User exist and now create a one time link valid for 15minutes

                console.log(result.rows)
                let user = result.rows[0]
                const secret = process.env.JWT_SECRET + user.user_password
                const payload = {
                    email: user.user_email,
                    id: user.user_id
                }
                const token = jwt.sign(payload, secret, { expiresIn: '15m'})

                const environment = process.env.NODE_ENV || 'development';
                const link = environment === 'production'
                ? `https://${process.env.HOST}/reset_password/${user.user_id}/${token}`
                : `${process.env.BASE_URL}:${port}/reset_password/${user.user_id}/${token}`;

                console.log(link)
                const mailOptions = {
                    from: process.env.ADMIN_MAIL,
                    to: email,
                    subject: 'Password reset',
                    html: `
                        <h3>click on the link below to reset your password</h3>
                        <br>
                        <p>${link}</p>
                        `
                }
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                   console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                      // do something useful
                    }
                  });
                //res.send('Password reset link has been sent to your email ...')
                req.flash('success_msg', 'Password reset link has been sent to your email ...')
                res.redirect('/login')
                // res.status(200).json({"mail message": "Password reset link has been sent to your email ...", link, token, id: user.user_id})
                
                

            }
    })

}

export default forgotPassword