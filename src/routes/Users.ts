import express, { Application, Request, Response, NextFunction} from 'express'
import { Router } from 'express'
import passport from 'passport';
import { checkAuthenticated, checkNotAuthenticated, verifyAdmin } from '../middleware/AuthAccess'
import register from '../controllers/Register';
import forgotPassword from '../controllers/ForgotPassword';
import confirmLink from '../controllers/ConfirmLink';
import resetPassword from '../controllers/ResetPassword';
import uploadForm from '../controllers/UploadFile';
import uploadFile, { upload } from '../controllers/UploadFile';
import allFiles from '../controllers/AllFiles';
import searchFile from '../controllers/SearchFile';
import sendingMail from '../controllers/SendingMail';
import downloadFile from '../controllers/DownloadFile';
import registerAdmin from '../controllers/RegisterAdmin';


const app: Application = express()

const routes = Router()


// Register Page
routes.get('/register', checkAuthenticated, (req: Request, res: Response) => {
    res.render('register')
})

/**
 * @openapi
 * /register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */


routes.post('/register', register)
/**
 * @openapi
 * /register_admin:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Register an admin
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Name of the admin
 *         required: true
 *         schema:
 *           type: string
 *       - name: email
 *         in: query
 *         description: Email address of the admin
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminRegistrationResponse'
 *       400:
 *         description: Bad request
 */

routes.get('/register_admin', registerAdmin)

// Login Page
routes.get('/login', checkAuthenticated, (req: Request, res: Response) => {
    res.render('login')
})
/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - Login
 *     summary: Log user into dashboard
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginUserResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */


// Login Handle
routes.post('/login', (req: Request, res: Response, next: NextFunction) => {
    console.log('session >>>>', req.session)
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})


routes.get('/dashboard', checkNotAuthenticated, allFiles)


// Logout Handle
routes.get('/logout', (req, res) => {
    req.logOut(function () { console.log('Done logging out.'); })
    req.flash('success_msg', 'Logged out')
    res.redirect('/login')
})

routes.get('/forgot_password', (req, res, next) => {
    res.render('forgotPassword')
})
/**
 * @openapi
 * /forgot_password:
 *   post:
 *     tags:
 *       - Forgot Password
 *     summary: Can't remember your password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForgotPasswordResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */  

routes.post('/forgot_password', forgotPassword)
/**
 * @openapi
 * /reset_password/{id}/{token}:
 *   get:
 *     tags:
 *       - Validate link
 *     summary: validating reset password link
 *     parameters:
 *       - name: id
 *         in: path
 *         description: provide id from reset password link
 *         required: true
 *       - name: token
 *         in: path
 *         description: provide token from reset password link
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidateLink'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */




routes.get('/reset_password/:id/:token', confirmLink)


/**
 * @openapi
 * /reset_password/{id}/{token}:
 *   post:
 *     tags:
 *       - Reset Password
 *     summary: Reset your password
 *     parameters:
 *       - name: id
 *         in: path
 *         description: provide id from reset password link
 *         required: true
 *       - name: token
 *         in: path
 *         description: provide token from reset password link
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordForm'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPasswordResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */


routes.post('/reset_password/:id/:token', resetPassword)

routes.post('/send_mail', checkNotAuthenticated, (req, res) => {
    const { file_id, filename, description, myfile } = req.body
    console.log(req.body)
    res.render('sendingMail', { file_id, filename, description, myfile })
})

routes.post('/sending_mail', sendingMail)

routes.post('/download_file', downloadFile)

routes.get('/upload_file', checkNotAuthenticated, verifyAdmin, (req, res) => {
    res.render('uploadFile')
})
/**
 * @openapi
 * /upload_file:
 *   post:
 *     tags:
 *       - File Upload
 *     summary: Upload a file with title and description
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *               description:
 *                 type: string
 *               myfile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileUploadResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */



routes.post('/upload_file', checkNotAuthenticated, verifyAdmin, upload, uploadFile)

// search by file title
routes.get('/search_file', checkNotAuthenticated, (req, res) => {
    res.render('searchFile')
})
/**
 * @openapi
 * /search_file:
 *   post:
 *     tags:
 *       - Search Files
 *     summary: Search for files by file title
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SearchFilesInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchFilesResponse'
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad request
 */
routes.post('/search_file', checkNotAuthenticated, searchFile)



export default routes