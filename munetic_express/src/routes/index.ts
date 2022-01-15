import { Router } from 'express';
export const router = Router();

import * as auth from './auth.routes';
import * as user from './user.routes';
import * as lesson from './lesson.routes';
import * as category from './category.routes';
import * as admin from './admin/admin.routes';

import passport from 'passport';
import { ptLocal } from '../utils/PassportLocal';
import { ptJwt } from '../utils/PassportJwt';

passport.use('local', ptLocal.strategy());
passport.use('jwt', ptJwt.accessStrategy());
passport.use('jwtRefresh', ptJwt.refreshStrategy());

router.use(auth.path, auth.router);
router.use(user.path, user.router);
router.use(lesson.path, lesson.router);
router.use(admin.path, admin.router);
router.use(category.path, category.router);
