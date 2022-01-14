import { Op } from 'sequelize';
import User, { Account } from '../models/user';
import * as Status from 'http-status';
import ErrorResponse from '../utils/ErrorResponse';

interface UserSearchOptions {
  id?: number;
  login_id?: string;
  nickname?: string;
  name?: string;
  email?: string;
  type?: object;
}

interface NewProfileInfo {
  type?: Account;
  nickname?: string;
  name_public?: boolean;
  phone_public?: boolean;
  image_url?: string | null;
  introduction?: string | null;
  login_password?: string | null;
}

const UserService = {
  createUser: async (userInfo: User) => {
    const data = await userInfo.save();
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

  findUser: async (options: UserSearchOptions) => {
    const data = await User.findOne({
      where: {
        ...options,
      },
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
