import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { development } from '../config/config';

const { access_secret, refresh_secret, domain } = development;

export default class Jwt {
  private static createPayload(user: Request['user']) {
    return {
      sub: user!.id,
      login_id: user!.login_id,
    };
  }

  static async accessToken(user: Request['user']) {
    const payload = this.createPayload(user);
    const token = await jwt.sign(payload, access_secret!, {
      expiresIn: '24h',
    });
    return token;
  }

  static async refreshToken(user: Request['user']) {
    const payload = this.createPayload(user);
    const token = await jwt.sign(payload, refresh_secret!, {
      expiresIn: '7d',
    });
    const decoded = jwt.decode(token) as any;
    const cookieOptions = {
      domain: `${domain}`,
      path: '/',
      expires: new Date(decoded.exp * 1000),
      sameSite: 'strict' as 'strict',
      httpOnly: true,
      // secure: true, //https 환경에서 on합니다.
    };
    return { token, cookieOptions };
  }
}
