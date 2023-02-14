import { Router } from 'express';
import db from '../db';
import { verifyToken } from '../middleware/auth';
import { IAuth } from '../types';
import { validateEmail } from '../validate';

export const userRouter = (router: Router) => {
  router.patch('/auth/me', verifyToken, (req, res) => {
    const accountId = req.accountId;
    const { firstName, lastName, email, address } = req.body;
    const emailRegex: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    db.query<IAuth[]>('SELECT * FROM account WHERE id = ?', [accountId], (err, users) => {
      if (err) {
        throw err;
      }

      if (!users.length) {
        return res.status(404).send({
          statusCode: 404,
          message: 'Không tìm thấy thông tin người dùng!',
        });
      }

      if (validateEmail(email) === false) {
        return res.status(400).send({
          statusCode: 400,
          message: 'Email không hợp lệ!',
        });
      }

      db.query(
        'UPDATE account SET firstName = ?, lastName = ?, email = ?, address = ? WHERE id = ?',
        [firstName, lastName, email, address, accountId],
        (err) => {
          if (err) {
            throw err;
          }

          res.send({
            statusCode: 200,
            message: 'Cập nhật thông tin người dùng thành công!',
          });
        },
      );
    });
  });
};
