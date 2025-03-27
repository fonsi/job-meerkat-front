import { apiRequest } from '@/shared/http/apiRequest';
import { CategoryTree } from '../category';

type CategoriesResponse = CategoryTree;

export const getCategories = (): Promise<CategoriesResponse> => {
    return apiRequest<CategoriesResponse, void>({
        path: '/category',
    }).catch((error) => {
        console.error('getCategories error:', error);
        throw error;
    });
};
