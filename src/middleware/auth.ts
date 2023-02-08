import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import db from '../db';
import { IUser } from '../types/hello';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({
      statusCode: 401,
      message: 'Không thể xác thực người dùng!',
    });
  }

  try {
    const decode = jwt.verify(token, config.accessTokenSecret);
    const { id } = decode as any;
    req.accountId = id;

    next();
  } catch (error) {
    return res.status(403).send({
      statusCode: 403,
      message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!',
    });
  }
};

export const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = req.accountId;

    if (accountId) {
      db.query<IUser[]>('SELECT role FROM account WHERE id = ?', [accountId], (err, roles) => {
        if (err) {
          throw err;
        }

        if (roles[0].role !== 'admin') {
          return res.status(401).send({
            statusCode: 401,
            message: 'Bạn không có quyền truy cập!',
          });
        }

        next();
      });
    }
  } catch (error) {
    return res.status(403).send({
      statusCode: 403,
      message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!',
    });
  }
};
