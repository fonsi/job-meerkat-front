import { Company } from './company'
import { createCompany as createCompanyRequest } from './http/createCompany';

type CreateCompanyCommand = {
    name: string;
    homePage: string;
}

export const createCompany = async ({ name, homePage }: CreateCompanyCommand): Promise<Company> => {
    return createCompanyRequest({ name, homePage });
}