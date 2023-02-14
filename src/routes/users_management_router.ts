import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import db from '../db';
import { verifyToken, verifyAdminToken } from '../middleware/auth';
import { IUserProfile, IUser, IAuth } from '../types';

interface IAccountId extends RowDataPacket {
  accountId: string;
}

export const usersManagementRouter = (router: Router) => {
  router.get('/users', verifyToken, verifyAdminToken, (req, res) => {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const keyword = req.query.q ? `%${req.query.q}%` : '%';

    if (page && limit) {
      if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit <= 0 || limit > 10) {
        return res.status(400).send({
          statusCode: 400,
          message: 'Dữ liệu không hợp lệ',
        });
      }

      db.query<IUser[]>(
        'SELECT * FROM account WHERE firstName LIKE ? OR lastName LIKE ? LIMIT ? OFFSET ?',
        [keyword, keyword, limit, (page - 1) * limit],
        (err, users) => {
          if (err) {
            throw err;
          }

          if (!users.length) {
            return res.status(404).send({
              statusCode: 404,
              message: 'Không tìm thấy người dùng nào!',
            });
          }

          res.send(users);
        },
      );
    } else {
      db.query<IUser[]>(
        'SELECT * FROM account WHERE firstName LIKE ? OR lastName LIKE ?',
        [keyword, keyword],
        (err, users) => {
          if (err) {
            throw err;
          }

          if (!users.length) {
            return res.status(404).send({
              statusCode: 404,
              message: 'Không tìm thấy người dùng nào!',
            });
          }

          res.send(users);
        },
      );
    }
  });

  router.get('/users/:id', verifyToken, verifyAdminToken, (req, res) => {
    const accountId = req.params.id;

    db.query<IUser[]>('SELECT * FROM account WHERE id = ?', [accountId], (err, users) => {
      if (err) {
        throw err;
      }

      if (!users.length) {
        return res.status(404).send({
          statusCode: 404,
          message: 'Không tìm thấy người dùng nào!',
        });
      }

      res.send(users[0]);
    });
  });

  // router.patch('/users/:id', verifyToken, verifyAdminToken, (req, res) => {
  //   const userId = req.params.id;
  //   const { role } = req.body;

  //   if (!userId) {
  //     return res.status(404).send({
  //       statusCode: 404,
  //       message: 'Không tìm thấy người dùng!',
  //     });
  //   }

  //   db.query(
  //     'UPDATE account SET role = ? WHERE (SELECT accountId FROM user_profiles WHERE user_profiles.id = ?) = account.id',
  //     [role, userId],
  //     (err) => {
  //       if (err) {
  //         throw err;
  //       }

  //       res.send({
  //         statusCode: 200,
  //         message: 'Cập nhật role người dùng thành công!',
  //       });
  //     },
  //   );
  // });

  // router.delete('/users/:id', verifyToken, verifyAdminToken, (req, res) => {
  //   const userId = req.params.id;

  //   if (!userId) {
  //     return res.status(404).send({
  //       statusCode: 404,
  //       message: 'Không tìm thấy người dùng!',
  //     });
  //   }

  //   db.query<IAccountId[]>('SELECT accountId FROM user_profiles WHERE id = ?', [userId], (err, accountId) => {
  //     if (err) {
  //       throw err;
  //     }

  //     const id = accountId[0].accountId;

  //     db.query('DELETE FROM account WHERE id = ?', [id], (err) => {
  //       if (err) {
  //         throw err;
  //       }

  //       res.send({
  //         statusCode: 200,
  //         message: 'Xóa người dùng thành công!',
  //       });
  //     });
  //   });
  // });
};
