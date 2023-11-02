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
const AllFiles_1 = __importDefault(require("../../controllers/AllFiles"));
jest.mock('../../dbConfig/db');
describe('allFiles function', () => {
    let req;
    let res;
    // Set up mock request and response objects before each test
    beforeEach(() => {
        // @ts-ignore
        req = {
            user: { is_admin: true, user_name: 'Admin' },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(), // Mock the json function of the response
        };
    });
    // Clear all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });
    // Test to check if all files are returned for an admin user
    it('should return all files for admin user', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockFileInfos = [
            {
                title: 'File 1',
                description: 'Description 1',
                image: 'image1.jpg',
                number_of_sent_files: '5',
                number_of_downloaded_files: '3',
            },
            {
                title: 'File 2',
                description: 'Description 2',
                image: 'image2.jpg',
                number_of_sent_files: '10',
                number_of_downloaded_files: '7',
            },
        ];
        const mockFileInfo = { rows: mockFileInfos };
        // Mock the resolved value of the pool query to be the mock file info
        db_1.default.query.mockResolvedValue(mockFileInfo);
        // Call the allFiles function with the mock request and response
        yield (0, AllFiles_1.default)(req, res);
        // Expect the pool query to have been called
        expect(db_1.default.query).toHaveBeenCalled();
        // Expect the status function to have been called with 200
        expect(res.status).toHaveBeenCalledWith(200);
        // Expect the json function to have been called with the mock file infos
        expect(res.json).toHaveBeenCalledWith({
            'You are logged in  as: ': 'Admin',
            fileInfos: mockFileInfos,
        });
    }));
    // Test to check if all files are returned for a non-admin user
    it('should return all files for non-admin user', () => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        req.user.is_admin = false;
        const mockFiles = [
            { file_id: 1, title: 'File 1', description: 'Description 1', uploaded_at: '2023-11-02' },
            { file_id: 2, title: 'File 2', description: 'Description 2', uploaded_at: '2023-11-01' },
        ];
        const mockUserFiles = { rows: mockFiles };
        db_1.default.query.mockResolvedValue(mockUserFiles);
        yield (0, AllFiles_1.default)(req, res);
        expect(db_1.default.query).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            'You are logged in as: ': 'Admin',
            files: mockFiles,
        });
    }));
    // Test to handle database errors
    it('should handle database errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error('Database error');
        db_1.default.query.mockImplementation(() => {
            throw mockError;
        });
        // Expect the allFiles function to return undefined (resolves) when called
        yield expect((0, AllFiles_1.default)(req, res)).resolves.toBeUndefined();
        // Expect the pool query to have been called
        expect(db_1.default.query).toHaveBeenCalled();
        // Expect the status function to have been called with 500
        expect(res.status).toHaveBeenCalledWith(500);
        // Expect the json function to have been called with an error message
        expect(res.json).toHaveBeenCalledWith({ error_msg: 'Something went wrong' });
    }));
});
