"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = __importDefault(require("../../controllers/register"));
const db_1 = __importDefault(require("../../dbConfig/db"));
jest.mock('../../dbConfig/db');
jest.mock('../../utils/hashPassword', () => ({
    hashPassword: jest.fn((password) => password), // Mock hashPassword to return the password as is
}));
describe('register function', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password',
                password2: 'password',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return an error if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body.name = '';
        req.body.email = '';
        req.body.password = '';
        req.body.password2 = '';
        yield (0, register_1.default)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: 'Please enter all fields' }],
        });
    }));
    it('should return an error if password is less than 6 characters', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body.password = '123';
        yield (0, register_1.default)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: 'Password should be at least 6 characters' }],
        });
    }));
    it('should return an error if passwords do not match', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body.password2 = 'differentpassword';
        yield (0, register_1.default)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: 'Passwords do not match' }],
        });
    }));
    it('should return an error if email is already registered', () => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        db_1.default.query.mockImplementationOnce((_query, _params, callback) => {
            callback(null, { rows: [{ user_email: 'johndoe@example.com' }] });
        });
        yield (0, register_1.default)(req, res);
        expect(db_1.default.query).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: 'Email already registered' }],
        });
    }));
    it('should register a new user if form validation passes', () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.default.query
            // @ts-ignore
            .mockImplementationOnce((_query, _params, callback) => {
            callback(null, { rows: [] });
        })
            // @ts-ignore
            .mockImplementationOnce((_query, _params, callback) => {
            callback(null, { rows: [{ user_name: 'John Doe', user_email: 'johndoe@example.com', user_id: 1 }] });
        });
        yield (0, register_1.default)(req, res);
        expect(db_1.default.query).toHaveBeenCalledTimes(2);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user_name: 'John Doe',
            user_email: 'johndoe@example.com',
            user_id: 1,
        });
    }));
});
