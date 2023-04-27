import { Router } from 'express';
import genreController from '../app/controllers/genre_controller';

const genreRouter = (router: Router) => {
  router.get('/genre/:mediaType/list', genreController.getMediaGenres);
};

export default genreRouter;
