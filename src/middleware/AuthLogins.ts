const LocalStrategy = require("passport-local").Strategy
import pool from "../dbConfig/db"
import { comparePassword } from "../utils/HashPassword"

function initialize(passport: any) {
    const authenticateUser = async(email: string, password: string, done: any) => {
        pool.query(
            `SELECT * FROM users WHERE user_email = $1`,
            [email],
            async (err, results) => {
                if (err) {
                    throw err
                }
                console.log(results.rows)
                if (results.rows.length > 0) {
                    const user = results.rows[0]
                    console.log(user)

                    try {
                        const isMatch = await comparePassword(password, user.user_password);
                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: "Password is not correct"})
                        }
                    } catch (error) {
                        console.error(error);
                        return done(null, false, { message: "An error occurred while checking the password" })
                    }
                } else {
                    return done(null, false, { message: "Email is not registered"})
                }
            }
        )
    }

    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            authenticateUser
        )
    )

    passport.serializeUser((user: any, done: any) => done(null, user.user_id))

    passport.deserializeUser((id: number, done: any) => {
        pool.query(`SELECT * FROM users WHERE user_id = $1`, [id], (err, results) => {
            if (err) {
                throw err
            }
            return done(null, results.rows[0])
        })
    })
}

export default initialize
