import { RequestHandler } from 'express';
import * as Status from 'http-status';

import ResJSON from '../../utils/ResJSON';
import ErrorResponse from '../../utils/ErrorResponse';
import UserService from '../../service/user.service';

const AdminUser: {
  getAppUsers: RequestHandler;
  getAdminUsers: RequestHandler;
  getUserProfile: RequestHandler;
  doubleCheck: RequestHandler;
  deleteUser: RequestHandler;
  updateUser: RequestHandler;
} = {
  getAppUsers: async (req, res, next) => {
    try {
      const offset = Number(req.query.offset);
      const limit = Number(req.query.limit);
      const users = await UserService.getAllAppUsers(offset, limit);
      res
        .status(Status.OK)
        .json(
          new ResJSON('모든 유저 프로필을 불러오는데 성공하였습니다.', users),
        );
    } catch (err) {
      next(err);
    }
  },

  getAdminUsers: async (req, res, next) => {
    try {
      if (req.user?.type === 'Owner') {
        const offset = Number(req.query.offset);
        const limit = Number(req.query.limit);
        const users = await UserService.getAllAdminUsers(offset, limit);
        res
          .status(Status.OK)
          .json(
            new ResJSON(
              '모든 어드민 유저 프로필을 불러오는데 성공하였습니다.',
              users,
            ),
          );
      } else
        next(
          new ErrorResponse(
            Status.UNAUTHORIZED,
            '권한이 없습니다. 관리자에게 문의해주세요.',
          ),
        );
    } catch (err) {
      next(err);
    }
  },

  getUserProfile: async (req, res, next) => {
    try {
      if (!req.params.id) {
        res.status(Status.BAD_REQUEST).send('유저 아이디가 없습니다.');
      }
      const id = parseInt(req.params.id, 10);
      const user = await UserService.findUser({ id });
      if (user)
        res
          .status(Status.OK)
          .json(new ResJSON('유저 프로필을 불러오는데 성공하였습니다.', user));
    } catch (err) {
      next(err);
    }
  },

  doubleCheck: async (req, res, next) => {
    try {
      const user = await UserService.findUser(req.query);
      if (!user) {
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

  deleteUser: async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const result = await UserService.deleteUser(userId);
      if (result)
        res
          .status(Status.OK)
          .json(new ResJSON('유저가 성공적으로 삭제되었습니다.', {}));
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await UserService.updateUser(userId, req.body);
      if (user)
        res
          .status(Status.OK)
          .json(new ResJSON('유저 프로필을 성공적으로 수정하였습니다.', user));
    } catch (err) {
      next(err);
    }
  },
};

export default AdminUser;
