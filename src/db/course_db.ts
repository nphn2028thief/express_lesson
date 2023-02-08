import { ICourse } from '../types';
import db from './index';

export class CourserDb {
  getById = (courseId: string): Promise<ICourse[]> => {
    return new Promise((resolve, reject) => {
      db.query<ICourse[]>('SELECT * FROM courses WHERE id = ?', [courseId], (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result);
      });
    });
  };
}
