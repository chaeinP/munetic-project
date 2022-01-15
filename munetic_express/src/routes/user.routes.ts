import { Router } from 'express';
import User from '../controllers/user.controller';
import * as storage from '../utils/imgCreateMiddleware';
import { ptJwt } from '../utils/PassportJwt';

export const path = '/user';
export const router = Router();

router.get('/', ptJwt.access(), User.getMyProfile);
router.patch('/', ptJwt.access(), User.editUserProfile);
router.get('/:id', User.getUserProfile);
router.post('/image', ptJwt.access(), storage.imgUpload, User.createProfileImg);
