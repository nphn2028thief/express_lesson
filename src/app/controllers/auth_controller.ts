import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../config';
import accountSchema from '../models/auth_model';

class AuthController {
  generateTokens(_id: mongoose.Types.ObjectId) {
    const accessToken = jwt.sign({ _id }, config.accessTokenSecret, {
      expiresIn: '7d',
    });

    // const refreshToken = jwt.sign({ _id }, config.refreshTokenSecret, {
    //   expiresIn: '7d',
    // });
    return { accessToken };
  }

  register = async (req: Request, res: Response) => {
    const { username, password, firstName, lastName } = req.body;

    if (!username || !password || !firstName || !lastName) {
      return res.status(400).send({
        message: 'Invalid data!',
      });
    }

    try {
      const existUsername = await accountSchema.findOne({ username });

      if (existUsername) {
        return res.status(400).send({
          message: 'Username has been used!',
        });
      }

      const hash = await bcrypt.hash(password, 12);
      const accountData = {
        username,
        password: hash,
        firstName,
        lastName,
      };

      await accountSchema.create(accountData);

      res.send({
        message: 'Register successfully!',
      });
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({
        message: 'Invalid data!',
      });
    }

    try {
      const account = await accountSchema.findOne({ username });

      if (!account) {
        return res.status(403).send({
          message: 'Username or password is not correct!',
        });
      }

      const match = await bcrypt.compare(password, account.password);

      if (!match) {
        return res.status(403).send({
          message: 'Username or password is not correct!',
        });
      }

      const tokens = this.generateTokens(account._id);
      res.json(tokens);
    } catch (error) {
      throw error;
    }
  };

  getMe = async (req: Request, res: Response) => {
    const id = req.accountId;

    // if (id) {
    const account = await accountSchema.findById({
      _id: mongoose.Types.ObjectId.createFromHexString(id),
    });

    if (!account) {
      return res.status(400).send({
        message: 'User authenticate error!',
      });
    }

    res.json({
      _id: account._id,
      password: account.password,
      firstName: account.firstName,
      lastName: account.lastName,
      image: account.image,
    });
    // }
  };

  updateMe = async (req: Request, res: Response) => {
    const id = req.accountId;
    const { firstName, lastName, image } = req.body;
    try {
      if (id) {
        // const account = await accountSchema.findById({
        //   _id: mongoose.Types.ObjectId.createFromHexString(id),
        // });
        // if (!account) {
        //   return res.status(400).send({
        //     message: 'User authenticate error!',
        //   });
        // }
        const _id = mongoose.Types.ObjectId.createFromHexString(id);
        const updateAccount = await accountSchema.findByIdAndUpdate(
          _id,
          {
            firstName,
            lastName,
            image,
          },
          {
            new: true,
          },
        );
        res.json(updateAccount);
      }
    } catch (error) {
      throw error;
    }
  };

  updatePassword = async (req: Request, res: Response) => {
    const id = req.accountId;
    const { password, newPassword, confirmNewPassword } = req.body;

    if (!password || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
      return res.send({
        message: 'Invalid Data!',
      });
    }

    try {
      if (id) {
        const _id = mongoose.Types.ObjectId.createFromHexString(id);

        const hash = bcrypt.hash(confirmNewPassword, 12);

        await accountSchema.findByIdAndUpdate(
          _id,
          {
            password: hash,
          },
          { new: true },
        );

        res.send({
          message: 'Change password successfully!',
        });
      }
    } catch (error) {
      throw error;
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    const id = req.accountId;

    if (id) {
      try {
        const _id = mongoose.Types.ObjectId.createFromHexString(id);
        const account = await accountSchema.findById(_id);

        if (!account) {
          return res.status(400).send({
            message: 'User authenticate error!',
          });
        }

        const tokens = this.generateTokens(account._id);
        res.json(tokens);
      } catch (error) {
        throw error;
      }
    }
  };
}

export default new AuthController();
