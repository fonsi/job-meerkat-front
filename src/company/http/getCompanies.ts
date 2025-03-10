import { apiRequest } from '@/shared/http/apiRequest';
import { Company } from '../company';

type GetCompaniesParams = {
    countJobPosts?: boolean;
};

type CompaniesResponse = Company[];

const makePath = ({ countJobPosts = false }: { countJobPosts?: boolean }) => {
    const path = '/company';

    if (!countJobPosts) {
        return path;
    }

    return `${path}?countJobPosts=1`;
};

export const getCompanies = ({
    countJobPosts,
}: GetCompaniesParams = {}): Promise<CompaniesResponse> => {
    return apiRequest<CompaniesResponse, void>({
        path: makePath({ countJobPosts }),
    }).catch((error) => {
        console.error('getCompanies error:', error);
        throw error;
    });
};
