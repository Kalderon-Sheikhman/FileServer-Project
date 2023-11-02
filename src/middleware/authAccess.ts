import express, { Application, Request, Response, NextFunction} from 'express'
import userInfo from '../types/userInfo'
export const checkAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard')
    }
    next()
    
}

export const checkNotAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('error_msg', 'Please log in to view resource')
    res.redirect('/login')
    // res.status(401).json({error_msg: 'Please log in to view resources!'})
}

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as userInfo
    if(user.is_admin === true){
        return next();
    }
    else{
        return res.redirect('/dashboard')
        // res.status(401).json({error_msg: 'Only Admin can access to this web page or resources!'});
    }
};

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    verifyAdmin
}