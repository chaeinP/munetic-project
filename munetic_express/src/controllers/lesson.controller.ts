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
        res.status(Status.OK).json(new ResJSON(result));
      } else
        next(
          new ErrorResponse(
            Status.FORBIDDEN,
            '레슨 등록은 Tutor 계정만 가능합니다.',
          ),
        );
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
      res.status(Status.OK).json(new ResJSON(result));
    } catch (err) {
      next(err);
    }
  },

  deleteLesson: async (req, res, next) => {
    try {
      await LessonService.deleteLesson(Number(req.params.id), req.user);
      res.status(Status.NO_CONTENT);
    } catch (err) {
      next(err);
    }
  },

  getLessonById: async (req, res, next) => {
    try {
      const result = LessonService.findActiveLesson(Number(req.params.id));
      if (result) res.status(Status.OK).json(new ResJSON(result));
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
      if (!req.query.offset || !req.query.limit)
        next(
          new ErrorResponse(
            Status.BAD_REQUEST,
            'offset/limit 조건이 없습니다.',
          ),
        );
      const offset = Number(req.query.offset);
      const limit = Number(req.query.limit);
      const result = await LessonService.getAllActiveLessons(offset, limit);
      res.status(Status.OK).json(new ResJSON(result));
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
      const result = LessonService.findActiveLessonsByUserId(
        userId,
        offset,
        limit,
      );
      res.status(Status.OK).json(new ResJSON(result));
    } catch (err) {
      next(err);
    }
  },
};

export default Lesson;
