import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import db from '../db';
import { IAuth } from '../types';
import { verifyToken, verifyAdminToken } from '../middleware/auth';

export const registerRouter = (router: Router) => {
  router.post('/auth/register', (req, res) => {
    const accountId = uuidv4();
    const { username, password, firstName, lastName, email, address } = req.body;
    const saltRounds = 11;

    if (!username || !password || !firstName || !lastName) {
      return res.status(400).send({
        statusCode: 400,
        message: 'Dữ liệu không hợp lệ!',
      });
    }

    db.query<IAuth[]>('SELECT * FROM account WHERE username = ?', [username], (err, users) => {
      if (err) {
        throw err;
      }

      if (users.length) {
        return res.status(400).send({
          statusCode: 400,
          message: 'Tên đã nhập đã được sử dụng!',
        });
      }

      db.query<IAuth[]>('SELECT * FROM account WHERE email = ?', [email], (err, users) => {
        if (err) {
          throw err;
        }

        if (users.length) {
          return res.status(400).send({
            statusCode: 400,
            message: 'Email đã được sử dụng!',
          });
        }

        bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) {
            throw 'GenSalt: ' + err;
          }

          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              throw 'Hash: ' + err;
            }

            db.query(
              'INSERT INTO account (id, username, password, firstName, lastName, email, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [accountId, username, hash, firstName, lastName, email, address],
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
          });
        });
      });
    });
  });

  router.post('/admin/auth/register', verifyToken, verifyAdminToken, (req, res) => {
    const accountId = uuidv4();
    const { username, password, firstName, lastName, email, address } = req.body;
    const saltRounds = 11;

    if (!username || !password || !firstName || !email || !lastName) {
      return res.status(400).send({
        statusCode: 400,
        message: 'Dữ liệu không hợp lệ!',
      });
    }

    db.query<IAuth[]>('SELECT * FROM account WHERE username = ?', [username], (err, users) => {
      if (err) {
        throw err;
      }

      if (users.length) {
        return res.status(400).send({
          statusCode: 400,
          message: 'Tên đã nhập đã được sử dụng!',
        });
      }
    });

    db.query<IAuth[]>('SELECT * FROM account WHERE email = ?', [email], (err, users) => {
      if (err) {
        throw err;
      }

      if (users.length) {
        return res.status(400).send({
          statusCode: 400,
          message: 'Email đã được sử dụng!',
        });
      }
    });

    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        throw 'GenSalt: ' + err;
      }

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          throw 'Hash: ' + err;
        }

        db.query(
          'INSERT INTO account (id, username, password, firstName, lastName, email, address, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [accountId, username, hash, firstName, lastName, email, address, 'admin'],
          (err) => {
            if (err) {
              throw err;
            }

            res.status(201).send({
              statusCode: 201,
              message: 'Thêm tài khoản admin thành công!',
            });
          },
        );
      });
    });
  });
};
