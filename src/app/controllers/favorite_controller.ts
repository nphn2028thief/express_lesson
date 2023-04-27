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
    const { mediaType, mediaId, mediaTitle, mediaPoster, mediaRate } = req.body;

    if (!mediaType || !mediaId || !mediaTitle || !mediaPoster || !mediaRate) {
      return res.status(400).send({
        message: 'Invalid data!',
      });
    }

    try {
      if (accountId) {
        const _id = mongoose.Types.ObjectId.createFromHexString(accountId);

        await favoriteSchema.create({
          accountId: _id,
          mediaType,
          mediaId,
          mediaTitle,
          mediaPoster,
          mediaRate,
        });

        res.send({
          message: 'Add Media to Favorite List Successfully!',
        });
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

    if (!favoriteId) {
      return res.status(400).send({
        message: 'Invalid data!',
      });
    }

    try {
      if (accountId) {
        const _favoriteId = mongoose.Types.ObjectId.createFromHexString(favoriteId);
        // const _accountId = mongoose.Types.ObjectId.createFromHexString(accountId);

        const foundAndDeletedFavorite = await favoriteSchema.findByIdAndDelete({ _id: _favoriteId });

        if (foundAndDeletedFavorite) {
          return res.send({
            message: 'Remove Review Successfully!',
          });
        } else {
          return res.status(404).send({
            message: 'No Favorite Found!',
          });
        }

        // const review = await favoriteSchema.findOne({
        //   _id: _favoriteId,
        //   accountId: _accountId,
        // });

        // if (!review) {
        // return res.status(404).send({
        //   message: 'Not Found!',
        // });
        // }

        // await review.deleteOne();
      }
    } catch (error) {
      return res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };
}

export default new FavoriteController();
