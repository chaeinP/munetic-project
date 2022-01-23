import { Router } from 'express';

import User from '../controllers/user.controller';
import * as storage from '../utils/imgCreateMiddleware';
import { ptJwt } from '../utils/PassportJwt';

export const path = '/users';
export const router = Router();

router.post('/', User.createUser);
router.get('/exists', User.whetherUserExists);
router.get('/profile', ptJwt.access(), User.getMyProfile);
router.patch('/profile', ptJwt.access(), User.editUserProfile);
router.get('/profile/:id', User.getUserProfile);
router.post(
  '/profile/image',
  ptJwt.access(),
  storage.imgUpload,
  User.createProfileImg,
);
