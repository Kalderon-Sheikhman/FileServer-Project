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
const SearchFile_1 = __importDefault(require("../../controllers/SearchFile"));
// Mocking the necessary module
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
    // Test to check for missing title
    it('should return an error if title is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {};
        yield (0, SearchFile_1.default)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error_msg: 'Enter file title the next time' });
    }));
    // Test to check if no files match the title
    it('should return an error if no files match the title', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { title: 'Non-existent file' };
        db_1.default.query.mockResolvedValue({ rows: [] });
        yield (0, SearchFile_1.default)(req, res);
        expect(db_1.default.query).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error_msg: 'file does not exist' });
    }));
    // Test to check if files match the title
    it('should return the search results if files match the title', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { title: 'First File' };
        const mockRows = [
            { file_id: 1, title: 'First File', description: 'Description 1', image: 'image1.jpg' },
            { file_id: 2, title: 'Second File', description: 'Description 2', image: 'image2.jpg' },
        ];
        const mockResults = { rows: mockRows };
        db_1.default.query.mockResolvedValue(mockResults);
        yield (0, SearchFile_1.default)(req, res);
        expect(db_1.default.query).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ searchfiles: mockRows });
    }));
    // Test to check handling of database errors
    it('should handle database errors', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { title: 'First File' };
        const mockError = new Error('Database error');
        db_1.default.query.mockRejectedValue(mockError);
        console.error = jest.fn();
        yield (0, SearchFile_1.default)(req, res);
        expect(db_1.default.query).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith(mockError.message);
    }));
});
