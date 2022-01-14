import { Op } from 'sequelize';
import passport from 'passport';

import UserService from '../service/user.service';
import PassportJwt, { JwtPayload } from './PassportJwt';

export default class PassportJwtAdmin extends PassportJwt {
  constructor() {
    super();
  }

  protected async strategyCallback({ sub, login_id }: JwtPayload, done: any) {
    const user = await UserService.findActiveUser({
      id: sub,
      type: { [Op.or]: ['Admin', 'Owner'] },
    });
    if (user) {
      return done(null, user.toJSON());
    } else {
      return done(null, false);
    }
  }

  access() {
    return passport.authenticate('jwt-admin', { session: false });
  }

  refresh() {
    return passport.authenticate('jwtRefresh-admin', { session: false });
  }
}

export const ptJwtAdmin = new PassportJwtAdmin();
