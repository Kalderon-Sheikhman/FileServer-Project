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

  if (!title) {
    res.redirect('/dashboard');
    // res.status(400)
    // res.json({error_msg: "Enter file title the next time"})
  }

  try {
    const results = await pool.query(`SELECT file_id, title, description, image FROM files WHERE title ILIKE $1`, [`%${title}%`]);
    let searchfiles = results.rows;
    console.log(searchfiles);

    if (searchfiles.length === 0) {
      req.flash('success_msg', 'No file with such title!');
      res.redirect('/dashboard');
      // res.status(404).json({error_msg: "file does not exist"})
    }

    res.render('searchFile', { searchfiles: searchfiles, name: user.user_name });
    // res.json({searchfiles})
    
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default searchFile;
