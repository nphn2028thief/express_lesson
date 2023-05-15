import { Request, Response } from 'express';
import accountSchema from '../models/auth_model';
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
      const user = await accountSchema.findById({ _id: account });
      const favorite = await favoriteSchema.findOne({ account, mediaId });

      if (user) {
        const check = user.favorites.find((item) => Number(item) === Number(mediaId));

        if (check) {
          return res.send({
            message: true,
            favoriteId: favorite?._id,
          });
        }

        return res.send({
          message: false,
          favoriteId: favorite?._id,
        });
      }

      return res.send({
        message: 'Not found!',
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

      await accountSchema.findByIdAndUpdate(
        { _id: account },
        {
          $push: {
            favorites: Number(mediaId),
          },
        },
        { new: true, validateModifiedOnly: true },
      );

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
    const account = req.accountId;

    if (!favoriteId) {
      return res.status(400).send({
        message: 'Invalid data!',
      });
    }

    try {
      const foundAndDeletedFavorite = await favoriteSchema.findOneAndDelete({ _id: favoriteId, account });
      await accountSchema.findByIdAndUpdate(
        { _id: account },
        {
          $pull: {
            favorites: Number(foundAndDeletedFavorite?.mediaId),
          },
        },
        { new: true, validateModifiedOnly: true },
      );

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
