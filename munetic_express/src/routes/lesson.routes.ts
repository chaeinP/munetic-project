import { Router } from 'express';
import Lesson from '../controllers/lesson.controller';
import { ptJwt } from '../utils/PassportJwt';

export const path = '/lessons';
export const router = Router();

router
  .get('/', Lesson.getAllLessons)
  .post('/', ptJwt.access(), Lesson.postLesson)
  .get('/:id', Lesson.getLessonById)
  .patch('/:id', ptJwt.access(), Lesson.updateLesson)
  .delete('/:id', ptJwt.access(), Lesson.deleteLesson)
  .get('/user/:id', Lesson.getUserLessons);
