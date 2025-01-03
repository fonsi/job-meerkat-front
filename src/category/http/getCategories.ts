import { apiRequest } from '@/shared/http/apiRequest';
import { CategoryTree } from '../category';

type CategoriesResponse = CategoryTree;

export const getCategories = (): Promise<CategoriesResponse> =>
    apiRequest<CategoriesResponse, void>({
        path: '/category',
    });
