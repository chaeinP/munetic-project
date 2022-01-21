import { RequestHandler } from 'express';
import * as Status from 'http-status';
import passport from 'passport';

import ResJSON from '../utils/ResJSON';
import ErrorResponse from '../utils/ErrorResponse';
import Jwt from '../utils/Jwt';

const Auth: {
  login: RequestHandler;
  logout: RequestHandler;
  refresh: RequestHandler;
} = {
  login: async (req, res, next) => {
    try {
      passport.authenticate('local', async (err, user, info) => {
        if (!user)
          return next(new ErrorResponse(Status.UNAUTHORIZED, info.message));
        const accessToken = await Jwt.accessToken(user);
        const { token, cookieOptions } = await Jwt.refreshToken(user);
        res.cookie('refreshToken', token, cookieOptions);
        res.status(Status.OK).json(new ResJSON(accessToken));
      })(req, res, next);
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      res.clearCookie('refreshToken');
      res.status(Status.NO_CONTENT);
    } catch (err) {
      next(err);
    }
  },

  refresh: async (req, res, next) => {
    try {
      const accessToken = await Jwt.accessToken(req.user);
      res.status(Status.OK).json(new ResJSON(accessToken));
    } catch (err) {
      next(err);
    }
  },
};

export default Auth;
