import { Router } from 'express';
import reviewController from '../app/controllers/review_controller';
import { verifyToken } from '../middleware/auth';

const reviewRouter = (router: Router) => {
  router.get('/reviews', reviewController.getReviews);
  router.post('/reviews/:mediaId', verifyToken, reviewController.createReview);
  router.delete('/reviews/:reviewId', verifyToken, reviewController.deleteReview);
};

export default reviewRouter;
