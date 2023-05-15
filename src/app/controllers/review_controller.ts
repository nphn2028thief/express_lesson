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
      const userInfo = await accountSchema.findById({ _id: account });

      const review = await reviewSchema.create({
        account: userInfo,
        mediaType,
        mediaId,
        mediaTitle,
        mediaPoster,
        content,
      });

      await accountSchema.findByIdAndUpdate(
        { _id: account },
        {
          $push: {
            reviews: review._id,
          },
        },
        { new: true, validateModifiedOnly: true },
      );

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
    const account = req.accountId;

    try {
      const foundAndDeleteReview = await reviewSchema.findOneAndDelete({ _id: reviewId, account });
      await accountSchema.findByIdAndUpdate(
        { _id: account },
        {
          $pull: {
            reviews: foundAndDeleteReview?._id,
          },
        },
        { new: true, validateModifiedOnly: true },
      );

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
