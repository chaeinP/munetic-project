import Category from '../models/category';

const CategoryService = {
  findAllCategory: async () => {
    const categories = await Category.findAll();
    if (categories === null) return '카테고리가 없습니다.';
    return categories;
  },
};

export default CategoryService;
