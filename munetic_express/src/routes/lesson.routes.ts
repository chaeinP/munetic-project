import { Router } from 'express';
import Lesson from '../controllers/lesson.controller';
import { ptJwt } from '../utils/PassportJwt';

export const path = '/lesson';
export const router = Router();

router
  .post('/', ptJwt.access(), Lesson.postLesson)
  .get('/', Lesson.getAllLessons)
  .get('/:id', Lesson.getLessonById)
  .patch('/:id', ptJwt.access(), Lesson.updateLesson)
  .delete('/:id', ptJwt.access(), Lesson.deleteLesson)
  .get('/user/:id', Lesson.getUserLessons);
