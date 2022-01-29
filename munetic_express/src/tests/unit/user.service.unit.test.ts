import { userCreationAttributes } from './../../models/user';
import User, { Gender, Account } from '../../models/user';
import UserService, {
  NewUserInfo,
  UserSearchOptions,
} from '../../service/user.service';
import userInstance from '../dummy/userInstance';

jest.mock('../../models/user');

describe('findUserList: 전체 유저(삭제 유저 포함)에서 특정 조건에 해당하는 유저 리스트를 반환하는 함수', () => {
  const options = { name: '쿠운리' } as UserSearchOptions;
  const userFindAllSpy = jest.spyOn(User, 'findAll');
  it('findAll 함수 호출', async () => {
    await UserService.findUserList(options);
    expect(userFindAllSpy).toBeCalledWith({
      where: { ...options },
      attributes: { exclude: ['login_password'] },
      paranoid: false,
    });
  });
  it('findAll 함수 결과값 리턴', async () => {
    const data = [userInstance.kunlee];
    userFindAllSpy.mockResolvedValue(data);
    const result = await UserService.findUserList(options);
    expect(result).toStrictEqual(data);
  });
});

describe('findUser: 전체 유저(삭제 유저 포함)에서 유저 id로 유저를 조회하는 함수', () => {
  const userFindByPk = jest.spyOn(User, 'findByPk');
  const userId = 1;
  it('findByPk 함수 호출', async () => {
    await UserService.findUser(userId);
    expect(userFindByPk).toBeCalledWith(userId, {
      attributes: { exclude: ['login_password'] },
      paranoid: false,
    });
  });

  it('findByPk 함수 결과 값 리턴', async () => {
    userFindByPk.mockResolvedValue(userInstance.kunlee);
    const result = await UserService.findUser(userId);
    expect(result).toStrictEqual(userInstance.kunlee);
  });
});

// describe('유저 생성:UserService.createUser unit test', () => {
//   const newUserInfo = {
//     login_id: 'testId',
//     login_password: '1234',
//     name: '박코딩',
//     birth: new Date('1995-11-05'),
//     gender: Gender['Other'],
//     nickname: 'godcoding',
//     type: Account['Student'],
//     email: 'testId@test.com',
//     phone_number: '010-000-0000',
//   } as NewUserInfo;

//   it('save 함수를 호출해 새 정보를 저장한다.', async () => {
//     const newUser = new User(newUserInfo);
//     const newUserSave = jest.spyOn(newUser, 'save');
//     await UserService.createUser(newUserInfo);
//     expect(newUserSave).toBeCalled();
//   });
//   it('성공적으로 저장되면 password가 제외된 유저 객체를 리턴한다.', async () => {
//     const newUser = new User(newUserInfo);
//     const newUserSave = jest.spyOn(newUser, 'save');
//     newUserSave.mockResolvedValue(new User(newUserInfo));
//     const result = await UserService.createUser(newUserInfo);
//     expect(result.login_id).toBe('testId');
//   });
// });
