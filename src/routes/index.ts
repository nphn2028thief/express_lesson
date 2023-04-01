import express from 'express';
import authRouter from './auth_router';
import favoriteRouter from './favorite_router';
import genreRouter from './genre_router';
import mediaRouter from './media_router';
import personRouter from './person_router';
import reviewRouter from './review_router';

const router = express.Router();

const routes = () => {
  authRouter(router);
  favoriteRouter(router);
  mediaRouter(router);
  personRouter(router);
  reviewRouter(router);
  genreRouter(router);

  return router;
};

export default routes;
