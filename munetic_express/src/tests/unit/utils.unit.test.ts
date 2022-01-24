import { development } from './../../config/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as Status from 'http-status';
import * as httpMocks from 'node-mocks-http';
import { Request } from 'express';
import ErrorResponse from '../../utils/ErrorResponse';
import errorHandler from '../../utils/errorHandler';
import Jwt from '../../utils/Jwt';
import ResJSON from '../../utils/ResJSON';

const { access_secret, refresh_secret, domain } = development;

describe('utils : ErrorResponse class unit test', () => {
  it('두개의 인자를 받아 인스턴스를 생성하면 status와 message값에 접근할 수 있다.', async () => {
    const errorResponse = new ErrorResponse(
      Status.BAD_REQUEST,
      '잘못된 요청입니다.',
    );
    expect(errorResponse.status).toBe(Status.BAD_REQUEST);
    expect(errorResponse.message).toBe('잘못된 요청입니다.');
  });
});

describe('utils : errorHandler function unit test', () => {
  let req: any, res: any, next: any;
  const err = new Error('error');
  const errResponse = new ErrorResponse(
    Status.BAD_REQUEST,
    '잘못된 요청입니다.',
  );
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('err가 ErrorResponse 인스턴스가 아니면 새로운 ErrorResponse 객체를 생성해 응답한다.', async () => {
    await errorHandler(err, req, res, next);
    expect(res.statusCode).toBe(Status.INTERNAL_SERVER_ERROR);
    expect(res._getJSONData()).toBe(
      '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    );
  });
  it('err가 ErrorResponse 인스턴스이면 인스턴스 정보를 사용해 응답한다.', async () => {
    await errorHandler(errResponse, req, res, next);
    expect(res.statusCode).toBe(Status.BAD_REQUEST);
    expect(res._getJSONData()).toStrictEqual(errResponse.message);
  });
});

describe('utils: Jwt class unit test', () => {
  const user = { id: 1, login_id: 'testId' } as Request['user'];
  const payload = { sub: 1, login_id: 'testId' };
  const jwtSignSpy = jest.spyOn(jwt, 'sign');
  const jwtDecodeSpy = jest.spyOn(jwt, 'decode');
  describe('Jwt.accessToken test', () => {
    const expiration = { expiresIn: '24h' };
    it('jwt.sign 함수를 호출한다.', async () => {
      await Jwt.accessToken(user);
      expect(jwtSignSpy).toHaveBeenCalledWith(
        payload,
        access_secret!,
        expiration,
      );
    });
    it('accessToken을 리턴한다.', async () => {
      const token = await Jwt.accessToken(user);
      expect(token).toBe(jwt.sign(payload, access_secret!, expiration));
    });
  });

  describe('Jwt.refreshToken test', () => {
    const expiration = { expiresIn: '7d' };
    const token = jwt.sign(payload, refresh_secret!, expiration);
    it('jwt.sign함수를 호출한다.', async () => {
      await Jwt.refreshToken(user);
      expect(jwtSignSpy).toHaveBeenCalledWith(
        payload,
        refresh_secret!,
        expiration,
      );
    });
    it('jwt.decode를 호출해 exp를 추출한다.', async () => {
      await Jwt.refreshToken(user);
      expect(jwtDecodeSpy).toHaveBeenCalledWith(token);
    });
    it('refreshToken과 cookieOptions을 담은 객체를 리턴한다.', async () => {
      const result = await Jwt.refreshToken(user);
      const decoded = jwt.decode(token) as JwtPayload;
      const cookieOptions = {
        domain: `${domain!}`,
        path: '/',
        expires: new Date(decoded.exp! * 1000),
        sameSite: 'strict' as 'strict',
        httpOnly: true,
      };
      expect(result).toStrictEqual({ token, cookieOptions });
    });
  });
});

describe('utils: ResJSON test', () => {
  it('ResJSON 인스턴스는 message와 data value를 갖는다.', async () => {
    const testData = { test: 'test' };
    const resJson = new ResJSON(testData);
    expect(resJson.message).toBe('request success');
    expect(resJson.data).toStrictEqual(testData);
  });
});
