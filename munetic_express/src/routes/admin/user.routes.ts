import { Router } from 'express';
import AdminUser from '../../controllers/admin/user.controller';
import { ptJwtAdmin } from '../../utils/PassportJwtAdmin';

export const path = '/users';
export const router = Router();

router.get('/app', ptJwtAdmin.access(), AdminUser.getAppUsers);
router.get('/admin', ptJwtAdmin.access(), AdminUser.getAdminUsers);
router.get('/options', ptJwtAdmin.access(), AdminUser.getUsersByOptions);
router.get('/:id', ptJwtAdmin.access(), AdminUser.getUserProfile);
router.patch('/:id', ptJwtAdmin.access(), AdminUser.updateUser);
router.delete('/:id', ptJwtAdmin.access(), AdminUser.deleteUser);
