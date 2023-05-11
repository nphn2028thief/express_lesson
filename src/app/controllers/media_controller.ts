import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { tmdbApi } from '../../tmdb/tmdb_api';
import accountSchema from '../models/auth_model';
import favoriteSchema from '../models/favorite_model';
import reviewSchema from '../models/review_model';

class MediaController {
  getMediaList = async (req: Request, res: Response) => {
    const { mediaType, mediaCategory } = req.params;

    try {
      const response = await tmdbApi.mediaList({ mediaType, mediaCategory, page: req.query });

      res.json(response);
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };

  getMediaDetail = async (req: Request, res: Response) => {
    const { mediaType, mediaId } = req.params;

    try {
      const mediaDetail = await tmdbApi.mediaDetail({ mediaType, mediaId });
      const recommend = await tmdbApi.mediaRecommend({ mediaType, mediaId });

      mediaDetail.credits = await tmdbApi.mediaCredits({ mediaType, mediaId });
      mediaDetail.videos = await tmdbApi.mediaVideos({ mediaType, mediaId });
      mediaDetail.recommend = recommend.results;
      mediaDetail.image = await tmdbApi.mediaImages({ mediaType, mediaId });

      // const account = await accountSchema.findById({ _id: mongoose.Types.ObjectId.createFromHexString(id) });

      // if (!account) {
      //   return res.status(400).send({
      //     message: 'User authenticate error!',
      //   });
      // }

      // console.log('Lot vao day');

      // const isFavorite = await favoriteSchema.findOne({ accountId: account._id, mediaId });
      // mediaDetail.isFavorite = isFavorite !== null;

      // if (id) {
      //   const _id = mongoose.Types.ObjectId.createFromHexString(id);
      //   const account = await accountSchema.findById(_id);

      //   if (!account) {
      //     return res.status(400).send({
      //       message: 'User authenticate error!',
      //     });
      //   }

      //   const isFavorite = await favoriteSchema.findOne({ accountId: account._id, mediaId });
      //   mediaDetail.isFavorite = isFavorite !== null;
      // }

      // mediaDetail.reviews = await reviewSchema.find({ mediaId }).populate('accountId').sort('-createdAt');
      res.json(mediaDetail);
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };

  getTvEpisode = async (req: Request, res: Response) => {
    const { tvId, seasonNumber } = req.params;

    try {
      const response = await tmdbApi.tvEpisodes({ tvId, seasonNumber });

      res.json(response);
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };

  mediaSearch = async (req: Request, res: Response) => {
    const page = req.query.page;
    const keyword = String(req.query.query);
    const { mediaType } = req.params;

    if (!page) {
      return res.status(400).send({
        message: 'Invalid data 2!',
      });
    }

    try {
      const response = await tmdbApi.mediaSearch({
        mediaType: mediaType === 'people' ? 'person' : mediaType,
        query: keyword,
        page,
      });

      res.json(response);
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };
}

export default new MediaController();
