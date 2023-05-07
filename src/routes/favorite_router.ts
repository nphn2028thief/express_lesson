import { Router } from 'express';
import favoriteController from '../app/controllers/favorite_controller';
import { verifyToken } from '../middleware/auth';

const favoriteRouter = (router: Router) => {
  router.post('/favorites/check', verifyToken, favoriteController.checkFavorite);
  router.get('/favorites', verifyToken, favoriteController.getMyFavorites);
  router.post('/favorites', verifyToken, favoriteController.addFavorite);
  router.delete('/favorites/:favoriteId', verifyToken, favoriteController.deleteFavorite);
};

export default favoriteRouter;
