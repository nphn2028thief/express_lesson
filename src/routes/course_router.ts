import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '../middleware/auth';
import db from '../db';
import { IAssocUserCourse, ICourse } from '../types';
import { CourseApp } from '../app/course';

export const courseRouter = (router: Router) => {
  router.get('/courses', verifyToken, (req, res) => {
    db.query<ICourse[]>('SELECT * FROM courses', (err, courses) => {
      if (err) {
        throw err;
      }

      res.send(courses);
    });
  });

  router.get('/courses/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const course = await new CourseApp().getCourseById(id);
      let courseItem = {};
      if (course && course.length) {
        courseItem = course[0];
      }
      res.json(courseItem);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi hệ thống' });
    }

    // db.query<ICourse[]>('SELECT * FROM courses WHERE id = ?', [id], (err, courses) => {
    //   if (err) {
    //     throw 'Get course is error: ' + err;
    //   }

    //   if (!courses.length) {
    //     return res.status(404).send({
    //       code: 404,
    //       message: 'Không tìm thấy khóa học!',
    //     });
    //   }

    //   res.send(courses[0]);
    // });
  });

  // Get courses by userId
  router.get('/users/:id/courses', (req, res) => {
    const { id } = req.params;

    db.query<ICourse[]>('SELECT * FROM courses WHERE userId = ?', [id], (err, results) => {
      if (err) {
        throw 'Get courses for userId is error: ' + err;
      }

      console.log(results);
      res.send('Hello');
    });
  });

  // Create courses with userId and courseId
  router.post('/users/:id/courses', (req, res) => {
    const userId = req.params.id;
    const courseId = uuidv4();
    const { name, description, image, level } = req.body;

    if (!name || !description || !image || !level) {
      return res.status(400).send({
        code: 400,
        message: 'Dữ liệu không hợp lệ!',
      });
    }

    db.query<ICourse[]>(
      'INSERT INTO courses (id, name, description, image, level, userId) VALUE (?, ?, ?, ?, ?, ?)',
      [courseId, name, description, image, level, userId],
      (err) => {
        if (err) {
          throw 'Create course is error: ' + err;
        }

        const assocId = uuidv4();

        db.query<IAssocUserCourse[]>(
          'INSERT INTO users_and_courses (id, userId, courseId) VALUE (?, ?, ?)',
          [assocId, userId, courseId],
          (err) => {
            if (err) {
              throw err;
            }
          },
        );

        res.send({ courseId, name, description, image, level });
      },
    );
  });

  router.post('/courses', (req, res) => {
    const id = uuidv4();
    const { name, description, image, level } = req.body;

    if (!name || !description || !image || !level) {
      return res.status(400).send({
        code: 400,
        message: 'Dữ liệu không hợp lệ!',
      });
    }

    db.query<ICourse[]>(
      'INSERT INTO courses (id, name, description, image, level) VALUE (?, ?, ?, ?, ?)',
      [id, name, description, image, level],
      (err) => {
        if (err) {
          throw 'Create course is error: ' + err;
        }

        res.send({ id, name, description, image, level });
      },
    );
  });

  router.patch('/courses/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, image, level } = req.body;

    if (!name || !description || !image || !level) {
      return res.status(400).send({
        code: 400,
        message: 'Dữ liệu không hợp lệ!',
      });
    }

    db.query<ICourse[]>('SELECT * FROM courses WHERE id = ?', [id], (err, courses) => {
      if (err) {
        throw 'Get course for update is error: ' + err;
      }

      if (!courses.length) {
        return res.status(404).send({
          code: 404,
          message: 'Không tìm thấy khóa học này!',
        });
      }

      db.query<ICourse[]>(
        'UPDATE courses SET name = ?, description = ?, image = ?, level = ? WHERE id = ?',
        [name, description, image, level, id],
        (err) => {
          if (err) {
            throw 'Update course is error: ' + err;
          }

          const newCourse = { id, name, description, image, level };
          res.send(newCourse);
        },
      );
    });
  });

  router.delete('/courses/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM courses WHERE id = ?', [id], (err) => {
      if (err) {
        throw 'Delete is error: ' + err;
      }

      res.send(id);
    });
  });
};
