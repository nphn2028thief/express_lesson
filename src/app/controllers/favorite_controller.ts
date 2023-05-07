import { Request, Response } from 'express';
import mongoose from 'mongoose';
import favoriteSchema from '../models/favorite_model';

class FavoriteController {
  checkFavorite = async (req: Request, res: Response) => {
    const { mediaId } = req.body;
    const accountId = req.accountId;

    if (!mediaId) {
      return res.status(400).send({
        message: 'Invalid data!',
      });
    }

    try {
      const _id = mongoose.Types.ObjectId.createFromHexString(accountId);
      const hasFavorite = await favoriteSchema.find({ accountId: _id, mediaId });

      if (!hasFavorite.length) {
        return res.status(404).send({
          message: false,
        });
      }

      res.send({
        message: true,
      });
    } catch (error: any) {
      res.status(500).send({
        message: 'Oops! Something went wrong!',
      });
    }
  };

  getMyFavorites = async (req: Request, res: Response) => {
    const accountId = req.accountId;

    try {
      const _id = mongoose.Types.ObjectId.createFromHexString(accountId);
      const favorites = await favoriteSchema.find({ accountId: _id }).sort('-createdAt');

      res.json(favorites);
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something went wrong!',
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
      const _id = mongoose.Types.ObjectId.createFromHexString(accountId);

      const newFavorite = await favoriteSchema.create({
        accountId: _id,
        mediaType,
        mediaId,
        mediaTitle,
        mediaPoster,
        mediaRate,
      });

      res.json({
        message: 'Add media to favorite list successfully!',
        data: newFavorite,
      });
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something went wrong!',
      });
    }
  };

  deleteFavorite = async (req: Request, res: Response) => {
    const { favoriteId } = req.params;

    if (!favoriteId) {
      return res.status(400).send({
        message: 'Invalid data!',
      });
    }

    try {
      const _favoriteId = mongoose.Types.ObjectId.createFromHexString(favoriteId);

      const foundAndDeletedFavorite = await favoriteSchema.findByIdAndDelete({ _id: _favoriteId });

      if (foundAndDeletedFavorite) {
        return res.json({
          message: 'Delete favorite successfully!',
          favoriteId,
        });
      }

      return res.status(404).json({
        message: 'No favorite found!',
        favoriteId,
      });

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
    } catch (error) {
      return res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };
}

export default new FavoriteController();
