import express, { Application, Request, Response, NextFunction } from 'express';
import pool from '../dbConfig/db';
import userInfo from '../types/userInfo';
import * as path from 'path';
import * as fs from 'fs';
import { config } from 'dotenv';


/**
 * @openapi
 * components:
 *   schemas:
 *     SearchFilesInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           default: Wodin Fabrics
 *     SearchFilesResponse:
 *       type: object
 *       properties:
 *         login_user:
 *           type: string
 *         file_id:
 *           type: number
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 */

/**
 * Searches files based on the provided title.
 * @param req Request object
 * @param res Response object
 * @returns Rendered searchFile template or appropriate error response
 */

const searchFile = async (req: Request, res: Response) => {
  const user = req.user as userInfo;
  const { title } = req.body;

  // Check if title is provided
  if (!title) {
    res.redirect('/dashboard');
  }

  try {
    // Search for files with a similar title
    const results = await pool.query(`SELECT file_id, title, description, image FROM files WHERE title ILIKE $1`, [`%${title}%`]);
    let searchfiles = results.rows;
    console.log(searchfiles);

    // If no files found, redirect with error message
    if (searchfiles.length === 0) {
      req.flash('success_msg', 'No file with such title!');
      res.redirect('/dashboard');
    }

    // Render searchFile template with search results
    res.render('searchFile', { searchfiles: searchfiles, name: user.user_name });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default searchFile
