import { Op } from 'sequelize';
import * as Status from 'http-status';

import User, { Account, Gender, userCreationAttributes } from '../models/user';
import ErrorResponse from '../utils/ErrorResponse';

export interface UserSearchOptions {
  id?: number;
  login_id?: string;
  nickname?: string;
  name?: string;
  email?: string;
  type?: object;
}

export interface NewUserInfo {
  login_id: string;
  login_password: string;
  name: string;
  birth: Date;
  gender: Gender;
  nickname: string;
  type: Account;
  email?: string | null;
  phone_number?: string | null;
}

interface NewProfileInfo {
  type?: Account;
  nickname?: string;
  name_public?: boolean;
  phone_public?: boolean;
  image_url?: string | null;
  introduction?: string | null;
  login_password?: string;
}

const UserService = {
  createUser: async (userInfo: NewUserInfo) => {
    const newUser = new User(userInfo);
    const data = (await newUser.save()).toJSON() as userCreationAttributes;
    delete data.login_password;
    return data;
  },

  deleteUser: async (id: number) => {
    const user = await User.findByPk(id);
    if (!user)
      throw new ErrorResponse(
        Status.BAD_REQUEST,
        '유효하지 않은 유저 id입니다.',
      );
    await user.destroy();
    return true;
  },

  updateUser: async (id: number, newProfileInfo: NewProfileInfo) => {
    await User.update(newProfileInfo, {
      where: { id },
    });
    const newProfile = await User.findByPk(id, {
      attributes: {
        exclude: ['login_password'],
      },
    });
    return newProfile;
  },

  findUserList: async (options: UserSearchOptions) => {
    const data = await User.findAll({
      where: { ...options },
      attributes: { exclude: ['login_password'] },
      paranoid: false,
    });
    return data;
  },

  findUser: async (userId: number) => {
    const data = await User.findByPk(userId, {
      attributes: { exclude: ['login_password'] },
      paranoid: false,
    });
    return data;
  },

  findActiveUser: async (options: UserSearchOptions) => {
    const data = await User.findOne({
      where: { ...options },
      attributes: { exclude: ['login_password'] },
    });
    return data;
  },

  findActiveUserWithPassword: async (options: UserSearchOptions) => {
    const data = await User.findOne({
      where: { ...options },
    });
    return data;
  },

  getAllAppUsers: async (offset: number, limit: number) => {
    const users = await User.findAndCountAll({
      where: {
        type: {
          [Op.or]: ['Tutor', 'Student'],
        },
      },
      attributes: { exclude: ['login_password'] },
      offset,
      limit,
      paranoid: false,
    });
    return users;
  },

  getAllAdminUsers: async (offset: number, limit: number) => {
    const users = await User.findAndCountAll({
      where: {
        type: {
          [Op.or]: ['Owner', 'Admin'],
        },
      },
      attributes: { exclude: ['login_password'] },
      offset,
      limit,
      paranoid: false,
    });
    return users;
  },
};

export default UserService;
