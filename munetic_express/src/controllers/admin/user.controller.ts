import { RequestHandler } from 'express';
import * as Status from 'http-status';

import ResJSON from '../../utils/ResJSON';
import Reshape from '../../utils/Reshape';
import ErrorResponse from '../../utils/ErrorResponse';
import UserService from '../../service/user.service';

const AdminUser: {
  createAdminUser: RequestHandler;
  getAppUsers: RequestHandler;
  getAdminUsers: RequestHandler;
  getUserProfile: RequestHandler;
  whetherUserExists: RequestHandler;
  deleteUser: RequestHandler;
  updateUser: RequestHandler;
  updateMyProfile: RequestHandler;
} = {
  createAdminUser: async (req, res, next) => {
    try {
      if (req.user?.type === 'Owner') {
        const adminInfo = Reshape.adminObject(req);
        const data = await UserService.createUser(adminInfo);
        res.status(Status.CREATED).json(new ResJSON(data));
      } else {
        throw new ErrorResponse(
          Status.FORBIDDEN,
          '권한이 없습니다. 관리자에게 문의해주세요.',
        );
      }
    } catch (err) {
      next(err);
    }
  },

  getAppUsers: async (req, res, next) => {
    try {
      if (!req.query.offset || !req.query.limit)
        next(
          new ErrorResponse(
            Status.BAD_REQUEST,
            'offset/limit 조건이 없습니다.',
          ),
        );
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
      if (!req.query.offset || !req.query.limit)
        next(
          new ErrorResponse(
            Status.BAD_REQUEST,
            'offset/limit 조건이 없습니다.',
          ),
        );
      if (req.user?.type === 'Owner') {
        const offset = Number(req.query.offset);
        const limit = Number(req.query.limit);
        const users = await UserService.getAllAdminUsers(offset, limit);
        res.status(Status.OK).json(new ResJSON(users));
      } else
        next(
          new ErrorResponse(
            Status.FORBIDDEN,
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
        res
          .status(Status.BAD_REQUEST)
          .send('요청 정보에 유저 아이디가 없습니다.');
      }
      const id = parseInt(req.params.id, 10);
      const user = await UserService.findUser(id);
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

  deleteUser: async (req, res, next) => {
    try {
      if (!req.params.id) {
        res
          .status(Status.BAD_REQUEST)
          .send('요청 정보에 유저 아이디가 없습니다.');
      }
      const userId = Number(req.params.id);
      const result = await UserService.deleteUser(userId);
      if (result) res.status(Status.OK).json(result);
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      if (!req.params.id) {
        res
          .status(Status.BAD_REQUEST)
          .send('요청 정보에 유저 아이디가 없습니다.');
      }
      const userId = Number(req.params.id);
      const user = await UserService.updateUser(userId, req.body);
      if (user) res.status(Status.OK).json(new ResJSON(user));
    } catch (err) {
      next(err);
    }
  },

  updateMyProfile: async (req, res, next) => {
    try {
      // console.log('hihi');
      const userId = req.user?.id;
      const user = await UserService.updateUser(userId!, req.body);
      if (user) res.status(Status.OK).json(new ResJSON(user));
    } catch (err) {
      next(err);
    }
  }
};

export default AdminUser;
