import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({
      message: 'Unable to authenticate user!',
    });
  }

  try {
    const decode = jwt.verify(token, config.accessTokenSecret);
    const { _id } = decode as any;

    if (!_id) {
      return res.status(404).send({
        message: 'Not found!',
      });
    }

    req.accountId = _id;

    next();
  } catch (error) {
    return res.status(403).send({
      message: 'Login session has expired, please login again!',
    });
  }
};

export const verifyRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).send({
      message: 'Invalid login information!',
    });
  }

  try {
    const decode = jwt.verify(refreshToken, config.refreshTokenSecret);
    const { _id } = decode as any;

    if (!_id) {
      return res.status(404).send({
        message: 'Not found!',
      });
    }

    req.accountId = _id;
    next();
  } catch (error) {
    return res.status(403).send({
      message: 'Login session has expired, please login again!',
    });
  }
};
