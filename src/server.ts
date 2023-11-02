import express, { Request, Response, NextFunction} from 'express'
import hRoutes from './routes/Index';
import uRoutes from './routes/Users';
import expressLayout from 'express-ejs-layouts'
import flash from 'connect-flash';
import session, { Session, SessionData } from 'express-session';
import passport from 'passport';
import swaggerDocs from './utils/Swagger';




export const app = express()

// Authorize Login
import initialize from './middleware/AuthLogins';
initialize(passport)

// Public Folder
app.use(express.static('./public'))

// EJS
app.use(expressLayout)
app.set('view engine', 'ejs')

// Bodyparser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Express Session
app.use(
  session({
      secret: "secret",
      resave: false,
      saveUninitialized: false

  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())

// Global Variables for flash messages
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

// Add a middleware to set the 'cache-control' header for authenticated routes
app.use((req, res, next) => {
  // For authenticated routes, set cache-control to 'no-store' to prevent caching
  if (req.isAuthenticated()) {
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
});

// Routes
app.use('/', hRoutes)
app.use('/', uRoutes)


  



export const port = process.env.PORT ? Number(process.env.PORT) : 5000;

//  app listen
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    swaggerDocs(app, port)
});