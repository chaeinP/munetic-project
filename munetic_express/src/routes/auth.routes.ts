import { Router } from 'express';
import Auth from '../controllers/auth.controller';
import { ptJwt } from '../utils/PassportJwt';

export const path = '/auth';
export const router = Router();

router.post('/login', Auth.login);
router.post('/signup', Auth.signup);
router.get('/signup/user', Auth.isValidInfo);
router.get('/logout', ptJwt.access(), Auth.logout);
router.get('/refresh', ptJwt.refresh(), Auth.refresh);
