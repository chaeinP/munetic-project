import { Router } from 'express';
import * as UserAPI from '../controllers/user.controller';
import * as storage from '../utils/imgCreateMiddleware';
import { ptJwt } from '../utils/PassportJwt';

export const path = '/user';
export const router = Router();

router.get('/', ptJwt.access(), UserAPI.getMyProfile);
router.patch('/', ptJwt.access(), UserAPI.editUserProfile);
router.get('/:id', UserAPI.getUserProfile);
router.post(
  '/image',
  ptJwt.access(),
  storage.imgUpload,
  UserAPI.createProfileImg,
);
