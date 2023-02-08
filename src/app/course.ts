import { CourserDb } from '../db/course_db';

export class CourseApp {
  getCourseById = async (courseId: string) => {
    try {
      const result = await new CourserDb().getById(courseId);
      return result;
    } catch (error) {
      throw error;
    }
  };
}
