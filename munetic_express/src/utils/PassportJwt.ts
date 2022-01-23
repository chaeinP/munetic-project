import { Request } from 'express';
import { Op } from 'sequelize';
import passport from 'passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import UserService from '../service/user.service';
import { development } from '../config/config';

const { access_secret, refresh_secret } = development;

export interface JwtPayload {
  sub: number;
  login_id: string;
}

export default class PassportJwt {
  protected accessOpts: StrategyOptions;
  protected refreshOpts: StrategyOptions;

  constructor() {
    this.accessOpts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: access_secret,
    };
    this.refreshOpts = {
      jwtFromRequest: ExtractJwt.fromExtractors([this.cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: refresh_secret,
    };
  }

  protected cookieExtractor(req: Request) {
    var token = null;
    if (req && req.cookies) {
      token = req.cookies['refreshToken'];
    }
    return token;
  }

  protected async strategyCallback({ sub, login_id }: JwtPayload, done: any) {
    const user = await UserService.findActiveUser({
      id: sub,
      type: {
        [Op.or]: ['Tutor', 'Student'],
      },
    });
    if (user) {
      return done(null, user.toJSON());
    } else {
      return done(null, false);
    }
  }

  accessStrategy() {
    return new Strategy(this.accessOpts, this.strategyCallback);
  }

  refreshStrategy() {
    return new Strategy(this.refreshOpts, this.strategyCallback);
  }

  access() {
    return passport.authenticate('jwt', { session: false });
  }

  refresh() {
    return passport.authenticate('jwtRefresh', { session: false });
  }
}

export const ptJwt = new PassportJwt();
