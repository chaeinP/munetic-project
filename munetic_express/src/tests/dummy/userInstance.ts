import User, { Account, Gender } from '../../models/user';

const userInstance = {
  kunlee: new User({
    id: 1,
    type: Account.Student,
    login_id: '42kunlee',
    login_password:
      '$2b$10$fO/O6fF5w1HDkXNab8AMBOYE/9ByW8/sjIeXpQONQgJxkegxdFDIq',
    nickname: 'kunlee',
    name: '쿠운리',
    name_public: true,
    gender: Gender.Male,
    birth: new Date('1992-10-05'),
    email: '42.kunlee@gmail.com',
    phone_number: '010-1234-1234',
    phone_public: true,
    image_url: '../../munetic_app/public/img/testImg.png',
    introduction: '안녕하세요. kunlee입니다. test data입니다.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),

  jolim: new User({
    id: 2,
    type: Account.Tutor,
    login_id: '42jolim',
    login_password:
      '$2b$10$fO/O6fF5w1HDkXNab8AMBOYE/9ByW8/sjIeXpQONQgJxkegxdFDIq',
    nickname: 'jolim',
    name: '조올림',
    name_public: true,
    gender: Gender.Male,
    birth: new Date('1992-10-05'),
    email: '42.jolim@gmail.com',
    phone_number: '010-5678-5678',
    phone_public: false,
    image_url: '../../munetic_app/public/img/testImg.png',
    introduction: '안녕하세요. jolim입니다. test data입니다.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),

  chaepark: new User({
    id: 3,
    type: Account.Student,
    login_id: '42chaepark',
    login_password:
      '$2b$10$fO/O6fF5w1HDkXNab8AMBOYE/9ByW8/sjIeXpQONQgJxkegxdFDIq',
    nickname: 'chaepark',
    name: '채애팤',
    name_public: false,
    gender: Gender.Female,
    birth: new Date('1992-10-05'),
    email: '42.chaepark@gmail.com',
    phone_number: '010-1234-5678',
    phone_public: true,
    image_url: '../../munetic_app/public/img/testImg.png',
    introduction: '안녕하세요. chaepark입니다. test data입니다.',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  }),
};

export default userInstance;
