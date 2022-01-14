import { RequestHandler } from 'express';
import * as Status from 'http-status';
import passport from 'passport';
import bcrypt from 'bcrypt';

import User from '../models/user';
import UserService from '../service/user.service';
import { ResJSON } from '../utils/response';
import ErrorResponse from '../utils/ErrorResponse';
import * as Reshape from './../utils/reshape';
import Jwt from '../utils/Jwt';

const Auth: {
  login: RequestHandler;
  logout: RequestHandler;
  signup: RequestHandler;
  refresh: RequestHandler;
  isValidInfo: RequestHandler;
} = {
  login: async (req, res, next) => {
    try {
      passport.authenticate('local', async (err, user, info) => {
        if (!user)
          return next(new ErrorResponse(Status.UNAUTHORIZED, info.message));
        const accessToken = await Jwt.accessToken(user);
        const { token, cookieOptions } = await Jwt.refreshToken(user);
        res.cookie('refreshToken', token, cookieOptions);
        res.status(Status.OK).json(new ResJSON('request success', accessToken));
      })(req, res, next);
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      res.clearCookie('refreshToken');
      res.status(Status.OK).json(new ResJSON('logout complete', {}));
    } catch (err) {
      next(err);
    }
  },

  signup: async (req, res, next) => {
    try {
      const userInfo = Reshape.userObject(req);
      userInfo.login_password = bcrypt.hashSync(userInfo.login_password, 10);
      const result = await UserService.createUser(new User({ ...userInfo }));
      if (result)
        res.status(Status.CREATED).json(new ResJSON('request success', {}));
    } catch (err) {
      next(err);
    }
  },

  refresh: async (req, res, next) => {
    try {
      const accessToken = await Jwt.accessToken(req.user);
      res.status(Status.OK).json(new ResJSON('request success', accessToken));
    } catch (err) {
      next(err);
    }
  },

  isValidInfo: async (req, res, next) => {
    try {
      const userList = await UserService.findUser(req.query);
      if (!userList) {
        res
          .status(Status.OK)
          .json(new ResJSON('사용할 수 있는 유저 정보 입니다.', {}));
      } else
        throw new ErrorResponse(
          Status.BAD_REQUEST,
          '이미 존재하는 유저 정보 입니다.',
        );
    } catch (err) {
      next(err);
    }
  },
};

export default Auth;
