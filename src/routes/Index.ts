import express, { Application, Request, Response, NextFunction} from 'express'
const router = express.Router()

router.get('/', (req: Request, res: Response) => {
    res.render('welcome')
})

export default router