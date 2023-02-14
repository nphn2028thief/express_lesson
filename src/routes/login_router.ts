import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { config } from '../config';
import db from '../db';
import { verifyToken } from '../middleware/auth';
import { IAuth, IUserProfile } from '../types';

const generateTokens = (payload: IAuth) => {
  const { id } = payload;

  const accessToken = jwt.sign({ id }, config.accessTokenSecret, {
    expiresIn: '1h',
  });

  const refreshToken = jwt.sign({ id }, config.refreshTokenSecret, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

export const loginRouter = (router: Router) => {
  router.post('/auth/login', (req, res) => {
    const { username, password } = req.body;

    db.query<IAuth[]>('SELECT * FROM account WHERE account.username = ?', [username], async (err, users) => {
      if (err) {
        throw err;
      }

      if (!users.length) {
        return res.status(403).send({
          statusCode: 403,
          message: 'Tài khoản hoặc mật khẩu không đúng!',
        });
      }

      const isValid = await bcrypt.compare(password, users[0].password);

      if (!isValid) {
        return res.status(403).send({
          statusCode: 403,
          message: 'Tài khoản hoặc mật khẩu không đúng!',
        });
      }

      const tokens = generateTokens(users[0]);

      res.send(tokens);
    });
  });

  router.post('/auth/refreshToken', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).send({
        statusCode: 401,
        message: 'Thông tin đăng nhập không hợp lệ!',
      });
    }

    try {
      const decode = jwt.verify(refreshToken, config.refreshTokenSecret);
      const { id } = decode as any;

      db.query<IAuth[]>('SELECT * FROM account WHERE id = ?', [id], (err, users) => {
        if (err) {
          throw err;
        }

        if (!users.length) {
          return res.status(403).send({
            statusCode: 403,
            message: 'Lỗi xác thực tài khoản!',
          });
        }

        const tokens = generateTokens(users[0]);

        res.send(tokens);
      });
    } catch (error) {
      res.status(403).send({
        statusCode: 403,
        message: error,
      });
    }
  });

  router.get('/auth/me', verifyToken, (req, res) => {
    db.query<IUserProfile[]>('SELECT * FROM account WHERE id = ?', [req.accountId], (err, users) => {
      if (err) {
        throw err;
      }

      res.send(users[0]);
    });
  });
};
