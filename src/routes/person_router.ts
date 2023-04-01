import { Router } from 'express';
import personController from '../app/controllers/person_controller';

const personRouter = (router: Router) => {
  router.get('/person/:personId', personController.getPersonDetail);
  router.get('/person/medias/:personId', personController.getPersonMedias);
};

export default personRouter;
