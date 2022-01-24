import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import passportLocal from 'passport-local';

import UserService from '../service/user.service';

const Strategy = passportLocal.Strategy;

export default class PassportLocal {
  static async verifyPassword(password: string, encryptedPassword: string) {
    return await bcrypt.compareSync(password, encryptedPassword);
  }

  protected async strategyCallback(
    login_id: string,
    login_password: string,
    done: any,
  ) {
    const user = await UserService.findActiveUserWithPassword({
      login_id,
      type: {
        [Op.or]: ['Tutor', 'Student'],
      },
    });
    if (!user)
      return done(null, false, {
        message: '입력하신 id에 해당하는 계정이 없습니다.',
      });
    const encryptedPassword = user.login_password;
    if (!PassportLocal.verifyPassword(login_password, encryptedPassword))
      return done(null, false, { message: '잘못된 비밀번호 입니다.' });
    return done(null, user.toJSON());
  }

  strategy() {
    return new Strategy(
      { usernameField: 'login_id', passwordField: 'login_password' },
      this.strategyCallback,
    );
  }
}

export const ptLocal = new PassportLocal();
