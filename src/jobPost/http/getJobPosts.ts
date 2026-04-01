import { CompanyLogo } from '@/company/company';
import { apiRequest } from '@/shared/http/apiRequest';

export enum JobType {
    FullTime = 'fullTime',
    PartTime = 'partTime',
    Contract = 'contract',
    Unknown = 'unknown',
}
export enum Workplace {
    Remote = 'remote',
    OnSite = 'onSite',
    Hybrid = 'hybrid',
    Unknown = 'unknown',
}
export enum Period {
    Year = 'year',
    Month = 'month',
    Week = 'week',
    Day = 'day',
    Hour = 'hour',
}
export type SalaryRange = {
    min?: number;
    max: number;
    currency: string;
    period: Period;
};

export type JobPost = {
    id: string;
    slug: string;
    title: string;
    url: string;
    type: JobType;
    company: {
        id: string;
        name: string;
        logo: CompanyLogo;
    };
    salaryRange: SalaryRange | null;
    workplace: Workplace;
    location: string;
    createdAt: number;
    /** When set, the job is closed and external / in-app apply links should not be used. */
    closedAt?: number | null;
    category: string;
};

export const getJobPosts = (): Promise<JobPost[]> => {
    return apiRequest<JobPost[], void>({
        path: '/jobPost',
    }).catch((error) => {
        console.error('getJobPosts error:', error);
        throw error;
    });
};

export const getJobPostBySlug = (slug: string): Promise<JobPost> => {
    return apiRequest<JobPost, void>({
        path: `/jobpost/${encodeURIComponent(slug)}`,
    }).catch((error) => {
        console.error('getJobPostBySlug error:', error);
        throw error;
    });
};
