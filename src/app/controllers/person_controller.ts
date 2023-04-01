import { Request, Response } from 'express';
import { tmdbApi } from '../../tmdb/tmdb_api';

class PersonController {
  getPersonDetail = async (req: Request, res: Response) => {
    const { personId } = req.params;

    try {
      const person = await tmdbApi.personDetail(personId);
      res.json(person);
    } catch (error) {
      return res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };

  getPersonMedias = async (req: Request, res: Response) => {
    const { personId } = req.params;

    try {
      const medias = await tmdbApi.personMedias(personId);
      res.json(medias);
    } catch (error) {
      return res.status(500).send({
        message: 'Oops! Something Went Wrong!',
      });
    }
  };
}

export default new PersonController();
