import { FindOptions } from 'sequelize/dist';
import * as Status from 'http-status';

import Category from '../models/category';
import Lesson from '../models/lesson';
import User from '../models/user';
import ErrorResponse from '../utils/ErrorResponse';
import { Request } from 'express';

const lessonQueryOptions: FindOptions = {
  include: [
    { model: Category, attributes: ['name'] },
    {
      model: User,
      attributes: ['id', 'login_id', 'name', 'nickname', 'image_url'],
      paranoid: false,
    },
  ],
};

const lessonQueryOptionsforAll: FindOptions = {
  ...lessonQueryOptions,
  paranoid: false,
};

interface LessonObject {
  tutor_id: number;
  title: string;
  category?: string;
  price: number | null;
  minute_per_lesson: number | null;
  content: string;
  category_id?: number;
}

const LessonService = {
  createLesson: async (lessonInfo: LessonObject) => {
    const category = await Category.findOne({
      where: { name: lessonInfo.category },
      attributes: ['id'],
    });
    lessonInfo.category_id = category!.id;
    delete lessonInfo.category;
    const newLesson = await Lesson.create({ ...lessonInfo } as Lesson);
    return newLesson;
  },

  updateLesson: async (id: number, lessonInfo: LessonObject) => {
    let category: Category | null;
    if (lessonInfo.category) {
      category = await Category.findOne({
        where: { name: lessonInfo.category },
        attributes: ['id'],
      });
      lessonInfo.category_id = category!.id;
      delete lessonInfo.category;
    }
    const result = await Lesson.update(lessonInfo as Lesson, {
      where: { id },
    });
    if (!result)
      throw new ErrorResponse(
        Status.BAD_REQUEST,
        '레슨 업데이트에 실패했습니다.',
      );
    const newLesson = await Lesson.findOne({
      ...lessonQueryOptions,
      where: { id },
    });
    return newLesson;
  },

  deleteLesson: async (id: number, user: Request['user']) => {
    const lesson = await Lesson.findOne({
      where: { id },
    });
    if (!lesson)
      throw new ErrorResponse(
        Status.BAD_REQUEST,
        '해당하는 레슨을 찾을 수 없습니다.',
      );
    if (user!.id !== lesson.tutor_id)
      throw new ErrorResponse(
        Status.FORBIDDEN,
        '레슨 작성자가 일치하지 않습니다.',
      );
    await lesson.destroy();
    return true;
  },

  findActiveLesson: async (id: number) => {
    const lesson = await Lesson.findOne({
      ...lessonQueryOptions,
      where: { id },
    });
    return lesson;
  },

  findActiveLessonsByUserId: async (
    id: number,
    offset: number,
    limit: number,
  ) => {
    const lessonList = await Lesson.findAndCountAll({
      ...lessonQueryOptions,
      offset,
      limit,
      raw: true,
      nest: true,
      where: { tutor_id: id },
    });
    return lessonList;
  },

  getAllActiveLessons: async (offset: number, limit: number) => {
    const lessonLists = await Lesson.findAndCountAll({
      ...lessonQueryOptions,
      offset,
      limit,
      raw: true,
      nest: true,
    });
    return lessonLists;
  },

  findLesson: async (id: number) => {
    const lesson = await Lesson.findOne({
      ...lessonQueryOptionsforAll,
      where: { id },
    });
    return lesson;
  },

  findLessonsByUserId: async (id: number, offset: number, limit: number) => {
    const lessonLists = await Lesson.findAndCountAll({
      ...lessonQueryOptionsforAll,
      offset,
      limit,
      raw: true,
      nest: true,
    });
    return lessonLists;
  },

  getAllLessons: async (offset: number, limit: number) => {
    const lessonLists = await Lesson.findAndCountAll({
      ...lessonQueryOptionsforAll,
      offset,
      limit,
      raw: true,
      nest: true,
    });
    return lessonLists;
  },
};

export default LessonService;
