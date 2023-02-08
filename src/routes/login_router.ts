import { Request, Router } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import db from '../db';
import { verifyAdminToken, verifyToken } from '../middleware/auth';
import { IUser, IUserProfile } from '../types/hello';

const generateTokens = (payload: IUser) => {
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
  router.post('/users/login', (req, res) => {
    const { username, password } = req.body;

    db.query<IUser[]>(
      'SELECT * FROM account WHERE account.username = ? AND account.password = ?',
      [username, password],
      (err, accounts) => {
        if (err) {
          throw err;
        }

        const user = accounts.find((account) => account.username == username && account.password == password);

        if (!user) {
          return res.status(403).send({
            statusCode: 403,
            message: 'Tài khoản hoặc mật khẩu không đúng!',
          });
        }

        const tokens = generateTokens(user);

        res.send(tokens);
      },
    );
  });

  router.post('/refreshToken', (req, res) => {
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

      db.query<IUser[]>('SELECT * FROM account WHERE id = ?', [id], (err, users) => {
        if (err) {
          throw err;
        }

        const user = users.find((user) => user.id == id);

        if (!user) {
          return res.status(403).send({
            statusCode: 403,
            message: 'Lỗi xác thực tài khoản!',
          });
        }

        const tokens = generateTokens(user);

        res.send(tokens);
      });
    } catch (error) {
      res.status(403).send({
        statusCode: 403,
        message: error,
      });
    }
  });

  router.get('/users/me', verifyToken, (req, res) => {
    db.query<IUserProfile[]>(
      'SELECT CONCAT(firstName, " ", lastName) as fullName, address FROM user_profiles WHERE accountId = ?',
      [req.accountId],
      (err, users) => {
        if (err) {
          throw err;
        }

        res.send(users[0]);
      },
    );
  });
};
