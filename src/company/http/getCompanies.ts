import { apiRequest } from '@/shared/http/apiRequest';

type CompaniesResponse = {
    id: string;
    name: string;
    homePage: string;
}[];

export const getCompanies = (): Promise<CompaniesResponse> =>
    apiRequest<CompaniesResponse, void>({
        path: '/company'
    });