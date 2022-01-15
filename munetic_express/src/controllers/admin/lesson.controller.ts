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
      const offset = parseInt(req.query.offset as string, 10);
      const limit = parseInt(req.query.limit as string, 10);
      const lessons = await LessonService.getAllLessons(offset, limit);
      res
        .status(Status.OK)
        .json(
          new ResJSON('모든 레슨 프로필을 불러오는데 성공하였습니다.', lessons),
        );
    } catch (err) {
      next(err);
    }
  },

  getUserLessons: async (req, res, next) => {
    try {
      const offset = Number(req.query.offset);
      const limit = Number(req.query.limit);
      const userId = Number(req.params.id);
      const lessons = await LessonService.findLessonsByUserId(
        userId,
        offset,
        limit,
      );
      res
        .status(Status.OK)
        .json(
          new ResJSON('모든 유저 게시물을 불러오는데 성공하였습니다.', lessons),
        );
    } catch (err) {
      next(err);
    }
  },

  getLessonById: async (req, res, next) => {
    try {
      const lessonId = parseInt(req.params.id, 10);
      const lesson = await LessonService.findLesson(lessonId);
      if (lesson)
        res
          .status(Status.OK)
          .json(
            new ResJSON('레슨 게시물을 불러오는데 성공하였습니다.', lesson),
          );
    } catch (err) {
      next(err);
    }
  },

  deleteLesson: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await LessonService.deleteLesson(id);
      if (!result) next(new ErrorResponse(Status.BAD_REQUEST, ''));
      res
        .status(Status.OK)
        .json(new ResJSON('게시물이 정상적으로 삭제되었습니다.', {}));
    } catch (err) {
      next(err);
    }
  },
};

export default AdminLesson;
