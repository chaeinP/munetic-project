import { RequestHandler } from 'express';
import * as Status from 'http-status';
import passport from 'passport';
import bcrypt from 'bcrypt';

import UserService from '../../service/user.service';
import Reshape from '../../utils/Reshape';
import ErrorResponse from '../../utils/ErrorResponse';
import ResJSON from '../../utils/ResJSON';
import Jwt from '../../utils/Jwt';

const AdminAuth: {
  login: RequestHandler;
  logout: RequestHandler;
  refresh: RequestHandler;
  updatePassword: RequestHandler;
} = {
  login: async (req, res, next) => {
    try {
      passport.authenticate('admin', async (err, user, info) => {
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

  logout: (req, res, next) => {
    try {
      res.clearCookie('refreshToken');
      res.status(Status.OK).json(new ResJSON({}));
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

  updatePassword: async (req, res, next) => {
    try {
      let { login_password } = req.body;
      login_password = bcrypt.hashSync(login_password, 10);
      await UserService.updateUser(req.user!.id, { login_password });
      res.status(Status.OK).json(new ResJSON({}));
    } catch (err) {
      next(err);
    }
  },
};

export default AdminAuth;
