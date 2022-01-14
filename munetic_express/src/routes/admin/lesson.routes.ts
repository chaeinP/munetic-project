import { Router } from 'express';
import * as lesson from '../../controllers/admin/lesson.controller';
import { ptJwtAdmin } from '../../utils/PassportJwtAdmin';

export const path = '/lesson';
export const router = Router();

router.get('/', ptJwtAdmin.access(), lesson.getAllLessons);
router.get('/:id', ptJwtAdmin.access(), lesson.getLessonById);
router.delete('/:id', ptJwtAdmin.access(), lesson.deleteLesson);
router.get('/user/:id', ptJwtAdmin.access(), lesson.getUserLessons);
