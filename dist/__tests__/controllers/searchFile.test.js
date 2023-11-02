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
const db_1 = __importDefault(require("../../dbConfig/db"));
const searchFile_1 = __importDefault(require("../../controllers/searchFile"));
jest.mock('../../dbConfig/db');
describe('searchFile function', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    it('should return an error if title is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {};
        yield (0, searchFile_1.default)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error_msg: 'Enter file title the next time' });
    }));
    it('should return an error if no files match the title', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { title: 'Non-existent file' };
        db_1.default.query.mockResolvedValue({ rows: [] });
        yield (0, searchFile_1.default)(req, res);
        expect(db_1.default.query).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error_msg: 'file does not exist' });
    }));
    it('should return the search results if files match the title', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { title: 'Wodin Fabrics' };
        const mockRows = [
            { file_id: 1, title: 'Wodin Fabrics', description: 'Description 1', image: 'image1.jpg' },
            { file_id: 2, title: 'Wodin Fabrics', description: 'Description 2', image: 'image2.jpg' },
        ];
        const mockResults = { rows: mockRows };
        db_1.default.query.mockResolvedValue(mockResults);
        yield (0, searchFile_1.default)(req, res);
        expect(db_1.default.query).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ searchfiles: mockRows });
    }));
    it('should handle database errors', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { title: 'Wodin Fabrics' };
        const mockError = new Error('Database error');
        db_1.default.query.mockRejectedValue(mockError);
        console.error = jest.fn();
        yield (0, searchFile_1.default)(req, res);
        expect(db_1.default.query).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith(mockError.message);
    }));
});
