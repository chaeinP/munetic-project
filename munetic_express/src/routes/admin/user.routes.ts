import { Router } from 'express';
import * as UserApi from '../../controllers/admin/user.controller';
import { ptJwtAdmin } from '../../utils/PassportJwtAdmin';

export const path = '/user';
export const router = Router();

router.get('/app', ptJwtAdmin.access(), UserApi.getAppUserList);
router.get('/admin', ptJwtAdmin.access(), UserApi.getAdminUserList);
router.get('/check', ptJwtAdmin.access(), UserApi.doubleCheck);
router.get('/:id', ptJwtAdmin.access(), UserApi.getUserInfo);
router.patch('/:id', ptJwtAdmin.access(), UserApi.patchUserByAdmin);
router.delete('/:id', ptJwtAdmin.access(), UserApi.deleteUserByAdmin);
