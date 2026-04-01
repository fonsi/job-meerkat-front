import { CategoryTree } from '@/category/category';
import { getCategories } from '@/category/http/getCategories';
import { Company } from '@/company/company';
import { getCompanies } from '@/company/http/getCompanies';
import { getCompany } from '@/company/http/getCompany';
import { JobPost, getJobPosts } from '@/jobPost/http/getJobPosts';

let companiesPromise: Promise<Company[]> | null = null;
let categoriesPromise: Promise<CategoryTree> | null = null;
let jobPostsPromise: Promise<JobPost[]> | null = null;

const companyDetailCache = new Map<string, Promise<Company | null>>();

export const getCachedCompanies = (): Promise<Company[]> => {
    companiesPromise ||= getCompanies({ countJobPosts: true });
    return companiesPromise;
};

export const getCachedCategories = (): Promise<CategoryTree> => {
    categoriesPromise ||= getCategories();
    return categoriesPromise;
};

export const getCachedJobPosts = (): Promise<JobPost[]> => {
    jobPostsPromise ||= getJobPosts();
    return jobPostsPromise;
};

export const getCachedCompanyDetail = (
    companyId: string,
): Promise<Company | null> => {
    const existing = companyDetailCache.get(companyId);
    if (existing) {
        return existing;
    }

    const promise = getCompany(companyId)
        .then(({ company }) => company)
        .catch(() => null);
    companyDetailCache.set(companyId, promise);
    return promise;
};
