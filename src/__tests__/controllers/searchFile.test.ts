import { Request, Response } from 'express';
import pool from '../../dbConfig/db';
import searchFile from '../../controllers/searchFile';

jest.mock('../../dbConfig/db');

describe('searchFile function', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  it('should return an error if title is missing', async () => {
    req.body = {};

    await searchFile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error_msg: 'Enter file title the next time' });
  });

  it('should return an error if no files match the title', async () => {
    req.body = { title: 'Non-existent file' };

    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    await searchFile(req, res);

    expect(pool.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error_msg: 'file does not exist' });
  });

  it('should return the search results if files match the title', async () => {
    req.body = { title: 'Wodin Fabrics' };
    const mockRows = [
      { file_id: 1, title: 'Wodin Fabrics', description: 'Description 1', image: 'image1.jpg' },
      { file_id: 2, title: 'Wodin Fabrics', description: 'Description 2', image: 'image2.jpg' },
    ];
    const mockResults = { rows: mockRows };

    (pool.query as jest.Mock).mockResolvedValue(mockResults);

    await searchFile(req, res);

    expect(pool.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ searchfiles: mockRows });
  });

  it('should handle database errors', async () => {
    req.body = { title: 'Wodin Fabrics' };
    const mockError = new Error('Database error');

    (pool.query as jest.Mock).mockRejectedValue(mockError);
    console.error = jest.fn();

    await searchFile(req, res);

    expect(pool.query).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(mockError.message);
  });
});
