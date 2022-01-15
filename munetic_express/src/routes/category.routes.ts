import { Router } from 'express';
import Category from '../controllers/category.controller';

export const path = '/category';
export const router = Router();

router.get('/', Category.getAllCategories);
