import { Request, Response } from 'express';
import mongoose from 'mongoose';
import reviewSchema from '../models/review_model';

class ReviewController {
  getReviews = async (req: Request, res: Response) => {
    const accountId = req.accountId;

    try {
      const reviews = await reviewSchema.find({ accountId }).sort('-createdAt');
      res.json(reviews);
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };

  getReviewsByMediaId = async (req: Request, res: Response) => {
    const { mediaType, mediaId } = req.params;

    if (!mediaType || !mediaId) {
      return res.status(400).send({
        message: 'Invalid data!',
      });
    }

    try {
      const reviews = await reviewSchema.find({ mediaType, mediaId }).sort('-createdAt');
      res.json(reviews);
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };

  createReview = async (req: Request, res: Response) => {
    const accountId = req.accountId;
    const { mediaType, mediaId, mediaTitle, mediaPoster, content } = req.body;

    if (!mediaType || !mediaId || !mediaTitle || !mediaPoster || !content) {
      return res.status(400).send({
        message: 'Invalid data!',
      });
    }

    try {
      const review = await reviewSchema.create({
        accountId,
        mediaType,
        mediaId,
        mediaTitle,
        mediaPoster,
        content,
      });

      res.json(review);
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
          messagE: 'Delete review successfully!',
          reviewId,
        });
      }

      return res.status(404).send({
        message: 'No review found!',
      });
    } catch (error) {
      return res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };
}

export default new ReviewController();
