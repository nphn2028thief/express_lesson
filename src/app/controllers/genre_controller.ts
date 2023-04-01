import { Request, Response } from 'express';
import { tmdbApi } from '../../tmdb/tmdb_api';

class GenreController {
  getMediaGenres = async (req: Request, res: Response) => {
    const { mediaType } = req.params;

    try {
      const response = await tmdbApi.mediaGenres(mediaType);
      res.json(response);
    } catch (error) {
      res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };
}

export default new GenreController();
