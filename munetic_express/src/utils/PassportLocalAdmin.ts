import { Op } from 'sequelize';

import UserService from '../service/user.service';
import PassportLocal from './PassportLocal';

export default class PassportLocalAdmin extends PassportLocal {
  protected async strategyCallback(
    login_id: string,
    login_password: string,
    done: any,
  ) {
    const user = await UserService.findActiveUserWithPassword({
      login_id,
      type: {
        [Op.or]: ['Admin', 'Owner'],
      },
    });
    if (!user)
      return done(null, false, {
        message: '입력하신 id에 해당하는 계정이 없습니다.',
      });
    const encryptedPassword = (await user?.toJSON().login_password) as string;
    if (!(await super.verifyPassword(login_password, encryptedPassword)))
      return done(null, false, { message: '잘못된 비밀번호 입니다.' });
    return done(null, user.toJSON());
  }
}

export const ptLocalAdmin = new PassportLocalAdmin();
