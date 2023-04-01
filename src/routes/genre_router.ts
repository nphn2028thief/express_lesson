import { Router } from 'express';
import genreController from '../app/controllers/genre_controller';

const genreRouter = (router: Router) => {
  router.get('/genres/:mediaType', genreController.getMediaGenres);
};

export default genreRouter;
