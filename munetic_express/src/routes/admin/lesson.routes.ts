import { Router } from 'express';
import AdminLesson from '../../controllers/admin/lesson.controller';
import { ptJwtAdmin } from '../../utils/PassportJwtAdmin';

export const path = '/lesson';
export const router = Router();

router.get('/', ptJwtAdmin.access(), AdminLesson.getAllLessons);
router.get('/:id', ptJwtAdmin.access(), AdminLesson.getLessonById);
router.delete('/:id', ptJwtAdmin.access(), AdminLesson.deleteLesson);
router.get('/user/:id', ptJwtAdmin.access(), AdminLesson.getUserLessons);
