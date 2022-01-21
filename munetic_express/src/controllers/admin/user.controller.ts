import { RequestHandler } from 'express';
import * as Status from 'http-status';

import ResJSON from '../../utils/ResJSON';
import Reshape from '../../utils/Reshape';
import ErrorResponse from '../../utils/ErrorResponse';
import UserService from '../../service/user.service';

const AdminUser: {
  createUser: RequestHandler;
  getAppUsers: RequestHandler;
  getAdminUsers: RequestHandler;
  getUserProfile: RequestHandler;
  getUsersByOptions: RequestHandler;
  deleteUser: RequestHandler;
  updateUser: RequestHandler;
} = {
  createUser: async (req, res, next) => {
    try {
      if (req.user?.type === 'Owner') {
        const adminInfo = Reshape.adminObject(req);
        const data = await UserService.createUser(adminInfo);
        res.status(Status.CREATED).json(new ResJSON(data));
      } else {
        throw new ErrorResponse(
          Status.UNAUTHORIZED,
          '권한이 없습니다. 관리자에게 문의해주세요.',
        );
      }
    } catch (err) {
      next(err);
    }
  },

  getAppUsers: async (req, res, next) => {
    try {
      const offset = Number(req.query.offset);
      const limit = Number(req.query.limit);
      const users = await UserService.getAllAppUsers(offset, limit);
      res.status(Status.OK).json(new ResJSON(users));
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
        res.status(Status.OK).json(new ResJSON(users));
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
      const user = await UserService.findUserList({ id });
      if (user) res.status(Status.OK).json(new ResJSON(user));
    } catch (err) {
      next(err);
    }
  },

  getUsersByOptions: async (req, res, next) => {
    try {
      const userList = await UserService.findUserList(req.query);
      if (userList.length) {
        res.status(Status.OK).json(new ResJSON(userList));
      } else
        throw new ErrorResponse(
          Status.BAD_REQUEST,
          '해당하는 유저 정보가 없습니다.',
        );
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const result = await UserService.deleteUser(userId);
      if (result) res.status(Status.OK).json(new ResJSON({}));
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await UserService.updateUser(userId, req.body);
      if (user) res.status(Status.OK).json(new ResJSON(user));
    } catch (err) {
      next(err);
    }
  },
};

export default AdminUser;
