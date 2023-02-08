import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import { IUser } from '../types/hello';

export const registerRouter = (router: Router) => {
  router.post('/register', (req, res) => {
    const accountId = uuidv4();
    const { username, password, firstName, lastName, address } = req.body;

    if (!password || !firstName || !lastName) {
      return res.status(400).send({
        statusCode: 400,
        message: 'Dữ liệu không hợp lệ!',
      });
    }

    db.query<IUser[]>('SELECT * FROM account WHERE username = ?', [username], (err, users) => {
      if (err) {
        throw err;
      }

      const user = users.find((user) => user.username == username);

      if (user) {
        return res.status(400).send({
          statusCode: 400,
          message: 'Tên đã nhập đã được sử dụng!',
        });
      }

      db.query(
        'INSERT INTO account (id, username, password, roleId) VALUES (?, ?, ?, 2)',
        [accountId, username, password],
        (err) => {
          if (err) {
            throw err;
          }

          const userProfileId = uuidv4();
          db.query(
            'INSERT INTO user_profiles (id, firstName, lastName, address, accountId) VALUES (?, ?, ?, ?, ?)',
            [userProfileId, firstName, lastName, address, accountId],
            (err) => {
              if (err) {
                throw err;
              }

              res.status(201).send({
                statusCode: 201,
                message: 'Đăng ký tài khoản thành công!',
              });
            },
          );
        },
      );
    });
  });
};
