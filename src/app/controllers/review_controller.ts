import { Request, Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import reviewSchema from '../models/review_model';
import accountSchema from '../models/auth_model';

class ReviewController {
  getReviews = async (req: Request, res: Response) => {
    const account = req.accountId;

    try {
      const reviews = await reviewSchema.find({ account }).sort('-createdAt');
      res.json(reviews);
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };

  getReviewsByMedia = async (req: Request, res: Response) => {
    const { mediaType, mediaId } = req.params;

    if (!mediaType || !mediaId) {
      return res.status(400).send({
        message: 'Invalid data!',
      });
    }

    try {
      // const reviews = await reviewSchema.find({ mediaType, mediaId }).sort('-createdAt');
      // let user_ids: ObjectId[] = [];

      // for (let i = 0; i < reviews.length; i++) {
      //   user_ids.push(reviews[i].accountId);
      // }

      // const users = await accountSchema.find({ _id: { $in: user_ids } });

      // res.json({
      //   reviews,
      //   users,
      // });

      const reviews = await reviewSchema.find({ mediaType, mediaId }).populate('account').sort('-createdAt');
      res.json(reviews);
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };

  createReview = async (req: Request, res: Response) => {
    const account = req.accountId;
    const { mediaType, mediaId, mediaTitle, mediaPoster, content } = req.body;

    if (!mediaType || !mediaId || !mediaTitle || !mediaPoster || !content) {
      return res.status(400).send({
        message: 'Invalid data!',
      });
    }

    try {
      const review = await reviewSchema.create({
        account,
        mediaType,
        mediaId,
        mediaTitle,
        mediaPoster,
        content,
      });

      res.json({
        message: 'Add review successfully!',
        data: review,
      });
    } catch (error) {
      return res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };

  deleteReview = async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const accountId = req.accountId;

    try {
      const _reviewId = mongoose.Types.ObjectId.createFromHexString(reviewId);

      const foundAndDeleteReview = await reviewSchema.findOneAndDelete({ _id: _reviewId, accountId });

      if (foundAndDeleteReview) {
        return res.json({
          message: 'Delete review successfully!',
          reviewId,
        });
      }

      return res.status(404).send({
        message: 'No review found!',
        reviewId,
      });
    } catch (error) {
      return res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };
}

export default new ReviewController();
