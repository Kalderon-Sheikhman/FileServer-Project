"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.checkNotAuthenticated = exports.checkAuthenticated = void 0;
const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    next();
};
exports.checkAuthenticated = checkAuthenticated;
const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Sign in to access page!');
    res.redirect('/login');
    // res.status(401).json({error_msg: 'Sign in to access page!'})
};
exports.checkNotAuthenticated = checkNotAuthenticated;
const verifyAdmin = (req, res, next) => {
    const user = req.user;
    if (user.is_admin === true) {
        return next();
    }
    else {
        return res.redirect('/dashboard');
        // res.status(401).json({error_msg: 'Only Admin can access to this page'});
    }
};
exports.verifyAdmin = verifyAdmin;
module.exports = {
    checkAuthenticated: exports.checkAuthenticated,
    checkNotAuthenticated: exports.checkNotAuthenticated,
    verifyAdmin: exports.verifyAdmin
};
