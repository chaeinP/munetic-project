import { Router } from 'express';
import * as Auth from '../../controllers/admin/auth.controller';
import { ptJwtAdmin } from '../../utils/PassportJwtAdmin';

export const path = '/auth';
export const router = Router();

router.post('/signup', ptJwtAdmin.access(), Auth.signup);
router.post('/login', Auth.login);
router.get('/logout', ptJwtAdmin.access(), Auth.logout);
router.get('/refresh', ptJwtAdmin.refresh(), Auth.refresh);
router.patch('/password', ptJwtAdmin.access(), Auth.updatePassword);
