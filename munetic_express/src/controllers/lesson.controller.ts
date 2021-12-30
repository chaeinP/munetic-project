import { NextFunction, Request, RequestHandler, Response } from 'express';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { Gender } from '../models/user.model';
import {
  createLesson,
  editLesson,
  findLesson,
  LessonAllInfo,
  LessonEditable,
  removeLesson,
} from '../service/lesson.service';
import { ResJSON, ResponseData } from '../types';

// need preprocessing of JSON-parser

export interface LessonRes extends ResponseData {
  lesson_id: number;
  tutor_id: number;
  tutor_name: string;
  gender?: Gender;
  birth: Date;
  image_url?: string;
  editable: LessonEditable;
}

/**
 * check if the argument is a valid `LessonEditable`
 *
 * @param unchecked Unknown parameter to be checked
 */
export const checkLessonEditable = (unchecked: any): LessonEditable | null => {
  let propertyNum = 0;
  if (unchecked && unchecked.category && typeof unchecked.category === 'string')
    propertyNum++;
  if (unchecked && unchecked.title && typeof unchecked.title === 'string')
    propertyNum++;
  if (unchecked && unchecked.price && typeof unchecked.price === 'number')
    propertyNum++;
  if (unchecked && unchecked.location && typeof unchecked.location === 'string')
    propertyNum++;
  if (
    unchecked &&
    unchecked.minute_per_lesson &&
    typeof unchecked.minute_per_lesson === 'number'
  )
    propertyNum++;
  if (unchecked && unchecked.content && typeof unchecked.content === 'string')
    propertyNum++;
  // // check existence and type of each property and turn into 1 thorugh boolean value
  // propertyNum +=
  //   +!!unchecked?.category?.concat?.(' ', 'c') +
  //   +!!unchecked?.title?.concat?.(' ', 'c') +
  //   +!!unchecked?.price?.toString?.() +
  //   +!!unchecked?.location?.concat?.(' ', 'c') +
  //   +!!unchecked?.minute_per_lesson?.concat?.(' ', 'c') +
  //   +!!unchecked?.content?.concat?.(' ', 'c');

  const uncheckedNum = Object.keys(unchecked).length;
  if (uncheckedNum !== 0 && uncheckedNum === propertyNum) return unchecked;
  return null;
};

/**
 * Convert LessonAllInfo to LessonRes
 */
const lessonAllInfoToRes = ({
  lesson_id,
  tutor_id,
  title,
  price = undefined,
  location = undefined,
  minute_per_lesson = undefined,
  content = undefined,
  Category: { name: category },
  User: { name, nickname, name_public, gender, birth, image_url: image_url },
}: LessonAllInfo): LessonRes => {
  return {
    lesson_id,
    tutor_id,
    tutor_name: (name_public ? name : nickname) as string,
    gender,
    birth,
    image_url,
    editable: {
      category,
      title,
      price,
      location,
      minute_per_lesson,
      content,
    },
  };
};

const processService = <T>(
  promise: Promise<T | string>,
  res: Response,
  next: NextFunction,
  processingFunc: (result: T) => ResponseData,
) => {
  promise
    .then(result => {
      if (typeof result === 'string') {
        res.status(BAD_REQUEST).json(new ResJSON(result));
      } else {
        res
          .status(OK)
          .json(new ResJSON('Successfully Retrieved', processingFunc(result)));
      }
    })
    .catch((err: any) => {
      next(err);
    });
};

export const postLesson: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.query.tutor_id)
    res.status(BAD_REQUEST).send('No tutor_id requested');

  const lessonEditable = checkLessonEditable(req.body);
  if (lessonEditable === null) {
    res.status(BAD_REQUEST).send('Invalid data passed');
    return;
  }
  if (typeof lessonEditable.category === undefined)
    res.status(BAD_REQUEST).send('Category name required');
  if (lessonEditable.title === undefined)
    res.status(BAD_REQUEST).send('Title required');

  createLesson(parseInt(req.query.tutor_id as string), lessonEditable)
    .then(result => {
      if (typeof result === 'string') {
        res.status(BAD_REQUEST).json(new ResJSON(result));
      } else {
        res
          .status(OK)
          .json(
            new ResJSON('Successfully Retrieved', lessonAllInfoToRes(result)),
          );
      }
    })
    .catch((err: any) => {
      next(err);
    });
};

export const getLesson: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.params.id)
    res.status(BAD_REQUEST).send(new ResJSON('No lesson_id requested'));

  processService(
    findLesson(parseInt(req.params.id)),
    res,
    next,
    lessonAllInfoToRes,
  );
};

export const patchLesson: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.params.id) res.status(BAD_REQUEST).send('No lesson_id requested');

  const lessonEditable = checkLessonEditable(req.body);
  if (lessonEditable === null) {
    res.status(BAD_REQUEST).send(new ResJSON('Invalid data passed'));
    return;
  }

  processService(
    editLesson(parseInt(req.params.id as string), lessonEditable),
    res,
    next,
    lessonAllInfoToRes,
  );
};

export const deleteLesson: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.params.id)
    res.status(BAD_REQUEST).send(new ResJSON('No lesson_id requested'));

  processService(
    removeLesson(parseInt(req.params.id)),
    res,
    next,
    (_: any) => _,
  );
};
