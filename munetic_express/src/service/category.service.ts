import Category from '../models/category';
import ErrorResponse from '../utils/ErrorResponse';
import * as Status from 'http-status';

const CategoryService = {
  findAllCategory: async () => {
    const categories = await Category.findAll();
    if (!categories)
      throw new ErrorResponse(Status.NOT_FOUND, '카테고리가 없습니다.');
    return categories;
  },
};

export default CategoryService;
