import { Request, Response } from 'express';
import register from '../../controllers/register';
import pool from '../../dbConfig/db';
import { hashPassword } from '../../utils/hashPassword';

jest.mock('../../dbConfig/db');
jest.mock('../../utils/hashPassword', () => ({
  hashPassword: jest.fn((password) => password), // Mock hashPassword to return the password as is
}));

describe('register function', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
        password2: 'password',
      },
    } as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if required fields are missing', async () => {
    req.body.name = '';
    req.body.email = '';
    req.body.password = '';
    req.body.password2 = '';

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Please enter all fields' }],
    });
  });

  it('should return an error if password is less than 6 characters', async () => {
    req.body.password = '123';

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Password should be at least 6 characters' }],
    });
  });

  it('should return an error if passwords do not match', async () => {
    req.body.password2 = 'differentpassword';

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Passwords do not match' }],
    });
  });

  it('should return an error if email is already registered', async () => {
    // @ts-ignore
    pool.query.mockImplementationOnce((_query, _params, callback) => {
      callback(null, { rows: [{ user_email: 'johndoe@example.com' }] });
    });

    await register(req, res);

    expect(pool.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Email already registered' }],
    });
  });

  it('should register a new user if form validation passes', async () => {
    pool.query
    // @ts-ignore
      .mockImplementationOnce((_query, _params, callback) => {
        callback(null, { rows: [] });
      })
      // @ts-ignore
      .mockImplementationOnce((_query, _params, callback) => {
        callback(null, { rows: [{ user_name: 'John Doe', user_email: 'johndoe@example.com', user_id: 1 }] });
      });

    await register(req, res);

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user_name: 'John Doe',
      user_email: 'johndoe@example.com',
      user_id: 1,
    });
  });
});
