import { RequestHandler } from 'express';
import * as Status from 'http-status';

import ResJSON from '../../utils/ResJSON';
import LessonService from '../../service/lesson.service';
import ErrorResponse from '../../utils/ErrorResponse';

const AdminLesson: {
  getAllLessons: RequestHandler;
  getUserLessons: RequestHandler;
  getLessonById: RequestHandler;
  deleteLesson: RequestHandler;
} = {
  getAllLessons: async (req, res, next) => {
    try {
      if (!req.query.offset || !req.query.limit)
        next(
          new ErrorResponse(
            Status.BAD_REQUEST,
            'offset/limit 조건이 없습니다.',
          ),
        );
      const offset = Number(req.query.offset);
      const limit = Number(req.query.limit);
      const lessons = await LessonService.getAllLessons(offset, limit);
      res.status(Status.OK).json(new ResJSON(lessons));
    } catch (err) {
      next(err);
    }
  },

  getUserLessons: async (req, res, next) => {
    try {
      if (!req.query.offset || !req.query.limit)
        next(
          new ErrorResponse(
            Status.BAD_REQUEST,
            'offset/limit 조건이 없습니다.',
          ),
        );
      const offset = Number(req.query.offset);
      const limit = Number(req.query.limit);
      const userId = Number(req.params.id);
      const lessons = await LessonService.findLessonsByUserId(
        userId,
        offset,
        limit,
      );
      res.status(Status.OK).json(new ResJSON(lessons));
    } catch (err) {
      next(err);
    }
  },

  getLessonById: async (req, res, next) => {
    try {
      const lessonId = Number(req.params.id);
      const lesson = await LessonService.findLesson(lessonId);
      if (lesson) res.status(Status.OK).json(new ResJSON(lesson));
      else
        next(
          new ErrorResponse(
            Status.BAD_REQUEST,
            '유효하지 않은 레슨 아이디입니다.',
          ),
        );
    } catch (err) {
      next(err);
    }
  },

  deleteLesson: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await LessonService.deleteLesson(id, req.user);
      if (!result)
        next(
          new ErrorResponse(
            Status.BAD_REQUEST,
            '유효하지 않은 레슨 아이디입니다.',
          ),
        );
      else res.status(Status.OK).json(new ResJSON(result));
    } catch (err) {
      next(err);
    }
  },
};

export default AdminLesson;
