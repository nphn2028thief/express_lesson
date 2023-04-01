import { Request, Response } from 'express';
import mongoose from 'mongoose';
import reviewSchema from '../models/review_model';

class ReviewController {
  getReviews = async (req: Request, res: Response) => {
    // const id = req.accountId;

    try {
      // if (id) {
      //   const _id = mongoose.Types.ObjectId.createFromHexString(id);
      //   const reviews = await reviewSchema.find({ accountId: _id }).sort('-createdAt');

      //   res.json(reviews);
      // }
      const reviews = await reviewSchema.find().sort('-createdAt');

      res.json(reviews);
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };

  createReview = async (req: Request, res: Response) => {
    const { mediaId } = req.params;
    const id = req.accountId;
    const { displayName, mediaType, mediaTitle, mediaPoster, content } = req.body;

    if (!displayName || !mediaType || !mediaTitle || !mediaPoster || !content) {
      return res.status(400).send({
        message: 'Invalid data!',
      });
    }

    try {
      if (id) {
        const _id = mongoose.Types.ObjectId.createFromHexString(id);

        const review = await reviewSchema.create({
          accountId: _id,
          displayName,
          mediaType,
          mediaId,
          mediaTitle,
          mediaPoster,
          content,
        });

        res.json(review);
      }
    } catch (error) {
      return res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };

  deleteReview = async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const id = req.accountId;

    try {
      if (id) {
        const _id = mongoose.Types.ObjectId.createFromHexString(id);

        const review = await reviewSchema.findOne({
          _id: mongoose.Types.ObjectId.createFromHexString(reviewId),
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

export default new ReviewController();
