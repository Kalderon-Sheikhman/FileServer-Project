"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const Index_1 = __importDefault(require("./routes/Index"));
const Users_1 = __importDefault(require("./routes/Users"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const Swagger_1 = __importDefault(require("./utils/Swagger"));
exports.app = (0, express_1.default)();
// Authorize Login
const AuthLogins_1 = __importDefault(require("./middleware/AuthLogins"));
(0, AuthLogins_1.default)(passport_1.default);
// Public Folder
exports.app.use(express_1.default.static('./public'));
// EJS
exports.app.use(express_ejs_layouts_1.default);
exports.app.set('view engine', 'ejs');
// Bodyparser
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
// Express Session
exports.app.use((0, express_session_1.default)({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));
// Passport middleware
exports.app.use(passport_1.default.initialize());
exports.app.use(passport_1.default.session());
// Connect flash
exports.app.use((0, connect_flash_1.default)());
// Global Variables for flash messages
exports.app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
// Add a middleware to set the 'cache-control' header for authenticated routes
exports.app.use((req, res, next) => {
    // For authenticated routes, set cache-control to 'no-store' to prevent caching
    if (req.isAuthenticated()) {
        res.setHeader('Cache-Control', 'no-store');
    }
    next();
});
// Routes
exports.app.use('/', Index_1.default);
exports.app.use('/', Users_1.default);
exports.port = process.env.PORT ? Number(process.env.PORT) : 5000;
//  app listen
exports.app.listen(exports.port, () => {
    console.log(`Server running on port ${exports.port}`);
    (0, Swagger_1.default)(exports.app, exports.port);
});
