import { Router } from 'express';
import * as auth from './auth.routes';
import * as user from './user.routes';
import * as lesson from './lesson.routes';

export const path = '/admin';
export const router = Router();

import passport from 'passport';
import { ptLocalAdmin } from '../../utils/PassportLocalAdmin';
import { ptJwtAdmin } from '../../utils/PassportJwtAdmin';

passport.use('admin', ptLocalAdmin.strategy());
passport.use('jwt-admin', ptJwtAdmin.accessStrategy());
passport.use('jwtRefresh-admin', ptJwtAdmin.refreshStrategy());

router.use(auth.path, auth.router);
router.use(user.path, user.router);
router.use(lesson.path, lesson.router);
