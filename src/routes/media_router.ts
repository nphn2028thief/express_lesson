import { Router } from 'express';
import mediaController from '../app/controllers/media_controller';

const mediaRouter = (router: Router) => {
  router.get('/:mediaType/:mediaCategory', mediaController.getMediaList);
  router.get('/:mediaType/detail/:mediaId', mediaController.getMediaDetail);
  router.get('/tv/:tvId/season/:seasonNumber', mediaController.getTvEpisode);
  router.get('/search/:mediaType', mediaController.mediaSearch);
};

export default mediaRouter;
