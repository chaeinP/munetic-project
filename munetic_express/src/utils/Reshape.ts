import { Request } from 'express';
import { Account, Gender } from '../models/user';

const Reshape = {
  userObject: (req: Request) => {
    const {
      login_id,
      login_password,
      name,
      nickname,
      birth,
      gender,
      type,
      email,
      phone_number,
    } = req.body as {
      login_id: string;
      login_password: string;
      name: string;
      nickname: string;
      birth: string;
      gender: string;
      type: string;
      email: string | null;
      phone_number: string | null;
    };
    const user = {
      login_id,
      login_password,
      name,
      birth: new Date(birth),
      gender:
        gender === 'Male'
          ? Gender.Male
          : gender === 'Female'
          ? Gender.Female
          : Gender.Other,
      nickname,
      type: type === 'Student' ? Account.Student : Account.Tutor,
      email,
      phone_number,
    };
    return user;
  },

  adminObject: (req: Request) => {
    const { email, name, login_password, type } = req.body as {
      email: string;
      login_password: string;
      name: string;
      type: string;
    };

    const admin = {
      login_id: email,
      login_password,
      name,
      nickname: email,
      birth: new Date(),
      gender: Gender.Other,
      type: type === 'Admin' ? Account.Admin : Account.Owner,
      email,
      phone_number: null,
    };

    return admin;
  },

  lessonObject: (req: Request) => {
    const { category, title, price, location, minute_per_lesson, content } =
      req.body as {
        category: string;
        title: string;
        price?: string | null;
        location: string;
        minute_per_lesson?: number | null;
        content: string;
      };

    const lesson = {
      tutor_id: req.user!.id,
      category: category,
      title: title,
      price: price ? Number(price) : null,
      location: location ? location : null,
      minute_per_lesson: minute_per_lesson ? Number(minute_per_lesson) : null,
      content: content,
    };

    return lesson;
  },
};

export default Reshape;
