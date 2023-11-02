import { Request, Response } from 'express';
import pool from '../../dbConfig/db';
import userInfo from '../../types/userInfo';
import allFiles from '../../controllers/AllFiles';

jest.mock('../../dbConfig/db');

describe('allFiles function', () => {
  let req: Request;
  let res: Response;

  // Set up mock request and response objects before each test
  beforeEach(() => {
    // @ts-ignore
    req = {
      user: { is_admin: true, user_name: 'Admin' },
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(), // Mock the status function of the response
      json: jest.fn(), // Mock the json function of the response
    } as unknown as Response;
  });

  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test to check if all files are returned for an admin user
  it('should return all files for admin user', async () => {
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
    (pool.query as jest.Mock).mockResolvedValue(mockFileInfo);

    // Call the allFiles function with the mock request and response
    await allFiles(req, res);

    // Expect the pool query to have been called
    expect(pool.query).toHaveBeenCalled();
    // Expect the status function to have been called with 200
    expect(res.status).toHaveBeenCalledWith(200);
    // Expect the json function to have been called with the mock file infos
    expect(res.json).toHaveBeenCalledWith({
      'You are logged in  as: ': 'Admin',
      fileInfos: mockFileInfos,
    });
  });
  

  // Test to check if all files are returned for a non-admin user
  it('should return all files for non-admin user', async () => {
    // @ts-ignore
    req.user.is_admin = false;

    const mockFiles = [
      { file_id: 1, title: 'File 1', description: 'Description 1', uploaded_at: '2023-11-02' },
      { file_id: 2, title: 'File 2', description: 'Description 2', uploaded_at: '2023-11-01' },
    ];
    const mockUserFiles = { rows: mockFiles };

    (pool.query as jest.Mock).mockResolvedValue(mockUserFiles);

    await allFiles(req, res);

    expect(pool.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      'You are logged in as: ': 'Admin',
      files: mockFiles,
    });
  });

  // Test to handle database errors
  it('should handle database errors', async () => {
    const mockError = new Error('Database error');
  
    (pool.query as jest.Mock).mockImplementation(() => {
      throw mockError;
    });
  
    // Expect the allFiles function to return undefined (resolves) when called
    await expect(allFiles(req, res)).resolves.toBeUndefined();
  
    // Expect the pool query to have been called
    expect(pool.query).toHaveBeenCalled();
    // Expect the status function to have been called with 500
    expect(res.status).toHaveBeenCalledWith(500);
    // Expect the json function to have been called with an error message
    expect(res.json).toHaveBeenCalledWith({ error_msg: 'Something went wrong' });
  });  
});
