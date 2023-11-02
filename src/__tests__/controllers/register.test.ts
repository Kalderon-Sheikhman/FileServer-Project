import { Request, Response } from 'express';
import register from '../../controllers/Register';
import pool from '../../dbConfig/db';
import { hashPassword } from '../../utils/HashPassword';

// Mocking the necessary modules
jest.mock('../../dbConfig/db');
jest.mock('../../utils/hashPassword', () => ({
  hashPassword: jest.fn((password) => password), // Mock hashPassword to return the password as it is
}));

describe('register function', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    // Setting up the mock request and response objects
    req = {
      body: {
        name: 'Foo Bar', // Replacing name with 'Foo Bar'
        email: 'foobar@gmail.com', // Replacing email with 'foobar@gmail.com'
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

  // Test to check for missing required fields
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

  // Test to check for password length less than 7 characters
  it('should return an error if password is less than 7 characters', async () => {
    req.body.password = '123';

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Password should be at least 7 characters' }],
    });
  });

  // Test to check if passwords match
  it('should return an error if passwords do not match', async () => {
    req.body.password2 = 'differentpassword';

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Passwords do not match' }],
    });
  });

  // Test to check if the email is already registered
  it('should return an error if email is already registered', async () => {
    // Mocking the pool.query to return an existing email
    // @ts-ignore
    pool.query.mockImplementationOnce((_query, _params, callback) => {
      callback(null, { rows: [{ user_email: 'foobar@gmail.com' }] });
    });

    await register(req, res);

    expect(pool.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Email already registered' }],
    });
  });

  // Test to check successful registration
  it('should register a new user if form validation passes', async () => {
    pool.query
      // Mocking the initial pool.query to return an empty result for email check
      // @ts-ignore
      .mockImplementationOnce((_query, _params, callback) => {
        callback(null, { rows: [] });
      })
      // Mocking the subsequent pool.query to return a successful user registration
      // @ts-ignore
      .mockImplementationOnce((_query, _params, callback) => {
        callback(null, { rows: [{ user_name: 'Foo Bar', user_email: 'foobar@gmail.com', user_id: 1 }] });
      });

    await register(req, res);

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user_name: 'Foo Bar',
      user_email: 'foobar@gmail.com',
      user_id: 1,
    });
  });
});
