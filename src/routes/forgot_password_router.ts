import { Router } from 'express';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { validateEmail } from '../validate';
import db from '../db';
import { IAuth } from '../types';

export const forgotPasswordRouter = (router: Router) => {
  // router.post('/auth/email/verification', (req, res) => {
  //   const { emailSendTo } = req.body;
  //   const user: string = 'nphn2082thief@gmail.com';
  //   const pass: string = 'xzbqmguhnhsthlhm';
  //   // otp = Math.floor(1000 + Math.random() * 9999);

  //   if (validateEmail(emailSendTo) === false) {
  //     return res.status(400).send({
  //       statusCode: 400,
  //       message: 'Email không hợp lệ!',
  //     });
  //   }

  //   const transporter = nodemailer.createTransport({
  //     service: 'gmail',
  //     auth: {
  //       user,
  //       pass,
  //     },
  //   });

  //   const mail_configs = {
  //     from: user,
  //     to: emailSendTo,
  //     subject: 'Verify your Email',
  //     // text: `Mã xác thực của bạn là: ${otp}`,
  //   };

  //   transporter.sendMail(mail_configs, (err, info) => {
  //     if (err) {
  //       return res.status(404).send({
  //         statusCode: 404,
  //         message: err,
  //       });
  //     }

  //     return res.send('OK');
  //   });
  // });

  // router.post('/auth/otp/verification', (req, res) => {
  //   const { otpCode } = req.body;

  //   if (!otpCode) {
  //     return res.status(400).send({
  //       statusCode: 400,
  //       message: 'Mã OTP không hợp lệ!',
  //     });
  //   }

  //   if (otpCode == otp) {
  //     res.send('OK');
  //   }
  // });

  router.post('/auth/email/verification', (req, res) => {
    const { username, email } = req.body;
    const user: string = 'nphn2082thief@gmail.com';
    const pass: string = 'xzbqmguhnhsthlhm';
    const html = `
      <html>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100&family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,100&display=swap"
            rel="stylesheet"
          />
          <style>
            div, h1, p, a {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
          </style>
        </head>

        <body>
        <div
          style="
            width: 580px;
            padding: 12px;
            margin: auto;
            color: #000 !important;
            text-align: center;
            border-radius: 12px;
            border: 4px solid #ccc;
            font-family: 'Poppins', sans-serif;
          "
        >
          <h2 style="font-size: 28px; font-weight: 600; letter-spacing: 1px; margin-top: 0; margin-bottom: 12px">Thư xác nhận việc reset mật khẩu</h2>
          <p style="font-size: 16px; letter-spacing: 1px; line-height: 1.5; margin-bottom: 12px">
            Nếu bạn là người gửi email này, vui lòng click vào đường Link bên dưới
            để đi đến trang reset mật khẩu, nếu không phải bạn thì hãy bỏ qua thư
            này!
          </p>
          <a style="font-size: 16px" href="https://www.youtube.com">Link</a>
        </body>
      </html>
    `;

    if (!username) {
      return res.status(400).send({
        statusCode: 400,
        message: 'Dữ liệu không hợp lệ!',
      });
    }

    if (validateEmail(email) === false) {
      return res.status(400).send({
        statusCode: 400,
        message: 'Email không hợp lệ!',
      });
    }

    db.query<IAuth[]>('SELECT * FROM account WHERE username = ? AND email = ?', [username, email], (err, users) => {
      if (err) {
        throw err;
      }

      if (!users.length) {
        return res.status(404).send({
          statusCode: 404,
          message: 'Không tìm thấy người dùng!',
        });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass,
        },
      });

      const mail_configs = {
        from: user,
        to: email,
        subject: 'Verify your Email',
        html,
      };

      transporter.sendMail(mail_configs, (err, info) => {
        if (err) {
          return res.status(404).send({
            statusCode: 404,
            message: err,
          });
        }

        return res.send('OK');
      });
    });
  });
};
