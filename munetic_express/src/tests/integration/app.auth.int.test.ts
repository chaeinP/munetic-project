import request from 'supertest';
import * as Status from 'http-status';

import app from '../../app';
import { sequelize } from '../../models';
import newUserInfo from '../dummy/newUserInfo.json';

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });
  } catch (e) {
    console.log(e);
  }
});

describe('로그인 및 회원가입 /auth + /users', () => {
  let accessToken: string;
  describe('회원 정보 중복 체크 GET + /users/exists', () => {
    it('쿼리 조건이 없으면 BAD_REQUEST로 응답한다.', async () => {
      const response = await request(app).get('/api/users/exists');
      expect(response.statusCode).toBe(Status.BAD_REQUEST);
      expect(response.body).toBe(
        '요청 정보에 유저 검색 조건이 존재하지 않습니다.',
      );
    });
    it('쿼리 조건에 해당하는 유저 정보가 있으면 OK로 응답한다.', async () => {
      const response = await request(app)
        .get('/api/users/exists')
        .query({ email: 'munetic@gmail.com' });
      expect(response.statusCode).toBe(Status.OK);
      expect(response.body).toBe(
        '검색 조건에 해당하는 유저 정보가 존재합니다.',
      );
    });
    it('쿼리 조건에 해당하는 유저 정보가 없으면 NOT_FOUND로 응답한다.', async () => {
      const response = await request(app)
        .get('/api/users/exists')
        .query({ email: newUserInfo.email });
      expect(response.statusCode).toBe(Status.NOT_FOUND);
      expect(response.body).toBe('검색 조건에 해당하는 유저 정보가 없습니다.');
    });
  });

  describe('회원가입 POST + /users', () => {
    it('회원가입이 완료되면 회원정보가 반환된다.', async () => {
      const response = await request(app).post('/api/users').send(newUserInfo);
      expect(response.statusCode).toBe(Status.CREATED);
      expect(response.body.message).toBe('request success');
      expect(response.body.data.login_password).toBeUndefined();
    });
  });

  describe('로그인 POST + /auth/login', () => {
    it('로그인이 완료되면 토큰이 반환된다.', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ login_id: 'pca0046', login_password: '1234' });
      expect(response.statusCode).toBe(Status.OK);
      expect(response.body.message).toBe('request success');
      expect(response.body.data).toBeDefined();
      accessToken = response.body.data;
      expect(response.get('Set-Cookie')).toBeDefined();
      console.log(response.get('Set-Cookie'));
    });
  });
});
