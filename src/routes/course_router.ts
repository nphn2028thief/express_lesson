import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { verifyAdminToken, verifyToken } from '../middleware/auth';
import db from '../db';
import { ICourse } from '../types';

export const courseRouter = (router: Router) => {};
