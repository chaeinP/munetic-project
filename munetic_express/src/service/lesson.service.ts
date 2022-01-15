import { FindOptions } from 'sequelize/dist';
import Category from '../models/category';
import Lesson from '../models/lesson';
import User from '../models/user';
import ErrorResponse from '../utils/ErrorResponse';
import * as Status from 'http-status';

const lessonQueryOptions: FindOptions = {
  attributes: [
    ['id', 'lesson_id'],
    'tutor_id',
    'title',
    'price',
    'location',
    'minute_per_lesson',
    'content',
  ],
  include: [
    { model: Category, attributes: ['name'] },
    {
      model: User,
      attributes: [
        'name',
        'nickname',
        'name_public',
        'phone_number',
        'birth',
        'gender',
        'image_url',
      ],
    },
  ],
};

const lessonQueryOptionsforAll: FindOptions = {
  ...lessonQueryOptions,
  include: [
    { model: Category, attributes: ['name'] },
    {
      model: User,
      attributes: [
        'login_id',
        'name',
        'nickname',
        'name_public',
        'phone_number',
        'birth',
        'gender',
        'image_url',
      ],
      paranoid: false,
    },
  ],
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

  deleteLesson: async (id: number) => {
    const lesson = await Lesson.findOne({
      where: { id },
    });
    if (!lesson)
      throw new ErrorResponse(
        Status.BAD_REQUEST,
        '해당하는 레슨을 찾을 수 없습니다.',
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
    });
    return lessonLists;
  },

  getAllLessons: async (offset: number, limit: number) => {
    const lessonLists = await Lesson.findAndCountAll({
      ...lessonQueryOptionsforAll,
      offset,
      limit,
      raw: true,
    });
    return lessonLists;
  },
};

export default LessonService;
