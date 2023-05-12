import { Request, Response } from 'express';
import mongoose from 'mongoose';
import favoriteSchema from '../models/favorite_model';

class FavoriteController {
  checkFavorite = async (req: Request, res: Response) => {
    const { mediaId } = req.body;
    const account = req.accountId;

    if (!mediaId) {
      return res.status(400).send({
        message: 'Invalid data!',
      });
    }

    try {
      const hasFavorite = await favoriteSchema.find({ account, mediaId });

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
    const account = req.accountId;

    try {
      const favorites = await favoriteSchema.find({ account }).sort('-createdAt');

      res.json(favorites);
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something went wrong!',
      });
    }
  };

  addFavorite = async (req: Request, res: Response) => {
    const account = req.accountId;
    const { mediaType, mediaId, mediaTitle, mediaPoster, mediaRate } = req.body;

    if (!mediaType || !mediaId || !mediaTitle || !mediaPoster || !mediaRate) {
      return res.status(400).send({
        message: 'Invalid data!',
      });
    }

    try {
      const favorite = await favoriteSchema.create({
        account,
        mediaType,
        mediaId,
        mediaTitle,
        mediaPoster,
        mediaRate,
      });

      res.json({
        message: 'Add media to favorite list successfully!',
        data: favorite,
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
      const _id = mongoose.Types.ObjectId.createFromHexString(favoriteId);

      const foundAndDeletedFavorite = await favoriteSchema.findByIdAndDelete({ _id });

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
    } catch (error) {
      return res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };
}

export default new FavoriteController();
