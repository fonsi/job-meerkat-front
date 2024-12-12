import { apiRequest, Method } from '@/shared/http/apiRequest';
import { Company } from '../company';


type CreateCompanyData = {
    name: string;
    homePage: string;
}

export const createCompany = (data: CreateCompanyData): Promise<Company> =>
    apiRequest<Company, CreateCompanyData>({
        method: Method.POST,
        path: '/company',
        data,
    });