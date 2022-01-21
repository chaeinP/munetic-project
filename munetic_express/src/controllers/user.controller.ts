import { RequestHandler } from 'express';
import * as Status from 'http-status';

import ErrorResponse from '../utils/ErrorResponse';
import ResJSON from '../utils/ResJSON';
import UserService from '../service/user.service';
import Reshape from '../utils/Reshape';

const User: {
  createUser: RequestHandler;
  whetherUserExists: RequestHandler;
  getMyProfile: RequestHandler;
  editUserProfile: RequestHandler;
  getUserProfile: RequestHandler;
  createProfileImg: RequestHandler;
} = {
  createUser: async (req, res, next) => {
    try {
      const userInfo = Reshape.userObject(req);
      const result = await UserService.createUser(userInfo);
      res.status(Status.CREATED).json(new ResJSON(result));
    } catch (err) {
      next(err);
    }
  },

  whetherUserExists: async (req, res, next) => {
    try {
      if (Object.keys(req.query).length === 0)
        next(
          new ErrorResponse(
            Status.BAD_REQUEST,
            '요청 정보에 유저 검색 조건이 존재하지 않습니다.',
          ),
        );
      const userList = await UserService.findUserList(req.query);
      if (userList.length) {
        res
          .status(Status.OK)
          .json('검색 조건에 해당하는 유저 정보가 존재합니다.');
      } else
        throw new ErrorResponse(
          Status.NOT_FOUND,
          '검색 조건에 해당하는 유저 정보가 없습니다.',
        );
    } catch (err) {
      next(err);
    }
  },

  getMyProfile: async (req, res, next) => {
    try {
      const userData = req.user;
      delete userData!.login_password;
      res.status(Status.OK).json(new ResJSON(userData));
    } catch (err) {
      next(err);
    }
  },

  editUserProfile: async (req, res, next) => {
    try {
      const userId = Number(req.user!.id);
      const user = await UserService.updateUser(userId, req.body);
      if (user) res.status(Status.OK).json(new ResJSON(user));
    } catch (err) {
      next(err);
    }
  },

  getUserProfile: async (req, res, next) => {
    try {
      if (!req.params.id)
        next(
          new ErrorResponse(
            Status.BAD_REQUEST,
            '요청 정보에 유저 아이디가 없습니다.',
          ),
        );
      const id = Number(req.params.id);
      const user = await UserService.findActiveUser({ id });
      if (user) res.status(Status.OK).json(new ResJSON(user));
      else
        next(
          new ErrorResponse(
            Status.NOT_FOUND,
            '요청 정보에 해당하는 유저를 찾을 수 없습니다.',
          ),
        );
    } catch (err) {
      next(err);
    }
  },

  createProfileImg: async (req, res, next) => {
    try {
      res.status(Status.OK).json(new ResJSON(req.file?.filename));
    } catch (err) {
      next(err);
    }
  },
};

export default User;
