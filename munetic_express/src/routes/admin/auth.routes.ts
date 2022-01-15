import { Router } from 'express';
import AdminAuth from '../../controllers/admin/auth.controller';
import { ptJwtAdmin } from '../../utils/PassportJwtAdmin';

export const path = '/auth';
export const router = Router();

router.post('/login', AdminAuth.login);
router.post('/signup', ptJwtAdmin.access(), AdminAuth.signup);
router.get('/logout', ptJwtAdmin.access(), AdminAuth.logout);
router.get('/refresh', ptJwtAdmin.refresh(), AdminAuth.refresh);
router.patch('/password', ptJwtAdmin.access(), AdminAuth.updatePassword);
