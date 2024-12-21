import { apiRequest } from '@/shared/http/apiRequest';
import { Company } from '../company';

type CompaniesResponse = Company[];

export const getCompanies = (): Promise<CompaniesResponse> =>
    apiRequest<CompaniesResponse, void>({
        path: '/company',
    });
