import { RequestHandler } from 'express';
import * as Status from 'http-status';

import ErrorResponse from '../utils/ErrorResponse';
import ResJSON from '../utils/ResJSON';
import LessonService from '../service/lesson.service';
import Reshape from '../utils/Reshape';

const Lesson: {
  postLesson: RequestHandler;
  updateLesson: RequestHandler;
  deleteLesson: RequestHandler;
  getLessonById: RequestHandler;
  getUserLessons: RequestHandler;
  getAllLessons: RequestHandler;
} = {
  postLesson: async (req, res, next) => {
    try {
      if (req.user?.type === 'Tutor') {
        const newLessonInfo = Reshape.lessonObject(req);
        const result = LessonService.createLesson(newLessonInfo);
        res
          .status(Status.OK)
          .json(new ResJSON('레슨 등록에 성공했습니다.', result));
      } else next(new ErrorResponse(Status.UNAUTHORIZED, '권한이 없습니다.'));
    } catch (err) {
      next(err);
    }
  },

  updateLesson: async (req, res, next) => {
    try {
      const newLessonInfo = Reshape.lessonObject(req);
      const result = LessonService.updateLesson(
        Number(req.params.id),
        newLessonInfo,
      );
      res
        .status(Status.OK)
        .json(new ResJSON('레슨이 성공적으로 수정되었습니다.', result));
    } catch (err) {
      next(err);
    }
  },

  deleteLesson: async (req, res, next) => {
    try {
      await LessonService.deleteLesson(Number(req.params.id));
      res.status(Status.OK).json(new ResJSON('레슨을 삭제했습니다.', {}));
    } catch (err) {
      next(err);
    }
  },

  getLessonById: async (req, res, next) => {
    try {
      const result = LessonService.findActiveLesson(Number(req.params.id));
      if (result)
        res
          .status(Status.OK)
          .json(new ResJSON('레슨을 불러오는데 성곡했습니다.', result));
      else
        next(
          new ErrorResponse(
            Status.BAD_REQUEST,
            '해당하는 레슨이 존재하지 않습니다.',
          ),
        );
    } catch (err) {
      next(err);
    }
  },

  getAllLessons: async (req, res, next) => {
    try {
      const offset = Number(req.query.offset);
      const limit = Number(req.query.limit);
      const result = LessonService.getAllActiveLessons(offset, limit);
      res
        .status(Status.OK)
        .json(new ResJSON('레슨 리스트를 성공적으로 불러왔습니다.', result));
    } catch (err) {
      next(err);
    }
  },

  getUserLessons: async (req, res, next) => {
    try {
      const offset = Number(req.query.offset);
      const limit = Number(req.query.limit);
      const userId = Number(req.params.id);
      const result = LessonService.findActiveLessonsByUserId(
        userId,
        offset,
        limit,
      );
      res
        .status(Status.OK)
        .json(
          new ResJSON('유저 레슨 리스트를 성공적으로 불러왔습니다.', result),
        );
    } catch (err) {
      next(err);
    }
  },
};

export default Lesson;
