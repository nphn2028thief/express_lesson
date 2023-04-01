import { Request, Response } from 'express';
import mongoose from 'mongoose';
import favoriteSchema from '../models/favorite_model';

class FavoriteController {
  getMyFavorites = async (req: Request, res: Response) => {
    const accountId = req.accountId;

    try {
      if (accountId) {
        const _id = mongoose.Types.ObjectId.createFromHexString(accountId);
        const favorites = await favoriteSchema.find({ accountId: _id }).sort('-createdAt');

        res.json(favorites);
      }
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };

  addFavorite = async (req: Request, res: Response) => {
    const accountId = req.accountId;
    const { mediaId } = req.body;

    try {
      if (accountId) {
        const _id = mongoose.Types.ObjectId.createFromHexString(accountId);

        const isFavorite = await favoriteSchema.findOne({
          accountId: _id,
          mediaId,
        });

        if (isFavorite) {
          res.json(isFavorite);
        }
      }
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };

  deleteFavorite = async (req: Request, res: Response) => {
    const { favoriteId } = req.params;
    const accountId = req.accountId;

    try {
      if (accountId) {
        const _id = mongoose.Types.ObjectId.createFromHexString(accountId);

        const review = await favoriteSchema.findOne({
          _id: mongoose.Types.ObjectId.createFromHexString(favoriteId),
          accountId: _id,
        });

        if (!review) {
          return res.status(404).send({
            message: 'Not Found!',
          });
        }

        await review.deleteOne();

        res.send({
          message: 'Remove Review Successfully!',
        });
      }
    } catch (error) {
      return res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };
}

export default new FavoriteController();
