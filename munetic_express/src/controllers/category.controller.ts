import { RequestHandler } from 'express';
import * as Status from 'http-status';

import ResJSON from '../utils/ResJSON';
import CategoryService from '../service/category.service';

const Category: { getAllCategories: RequestHandler } = {
  getAllCategories: async (req, res, next) => {
    try {
      const categories = await CategoryService.findAllCategory();
      res.status(Status.OK).json(new ResJSON(categories));
    } catch (err) {
      next(err);
    }
  },
};

export default Category;
