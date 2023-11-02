import { Request, Response } from 'express';
import pool from '../../dbConfig/db';
import userInfo from '../../types/userInfo';
import allFiles from '../../controllers/allFiles';

jest.mock('../../dbConfig/db');

describe('allFiles function', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    // @ts-ignore
    req = {
      user: { is_admin: true, user_name: 'Admin' },
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

    (pool.query as jest.Mock).mockResolvedValue(mockFileInfo);

    await allFiles(req, res);

    expect(pool.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      'You are login as: ': 'Admin',
      fileInfos: mockFileInfos,
    });
  });

  it('should return all files for non-admin user', async () => {
    // @ts-ignore
    req.user.is_admin = false;

    const mockFiles = [
      { file_id: 1, title: 'File 1', description: 'Description 1', uploaded_at: '2023-05-12' },
      { file_id: 2, title: 'File 2', description: 'Description 2', uploaded_at: '2023-05-11' },
    ];
    const mockUserFiles = { rows: mockFiles };

    (pool.query as jest.Mock).mockResolvedValue(mockUserFiles);

    await allFiles(req, res);

    expect(pool.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      'You are login as: ': 'Admin',
      files: mockFiles,
    });
  });

  it('should handle database errors', async () => {
    const mockError = new Error('Database error');
  
    (pool.query as jest.Mock).mockImplementation(() => {
      throw mockError;
    });
  
    await expect(allFiles(req, res)).resolves.toBeUndefined();
  
    expect(pool.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error_msg: 'Something went wrong' });
  });  
});
