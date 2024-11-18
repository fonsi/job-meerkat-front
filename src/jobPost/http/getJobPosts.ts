import { apiRequest } from '@/shared/http/apiRequest';

export enum JobType { FullTime = 'fullTime', PartTime = 'partTime', Contract = 'contract', Unknown = 'unknown' };
export enum Workplace { Remote = 'remote', OnSite = 'onSite', Hybrid = 'hybrid', Unknown = 'unknown' };
export type SalaryRange = {
    min?:  number;
    max:  number;
    currency: string;
}

export type JobPost = {
    id: string;
    title: string;
    url: string;
    type: JobType;
    company: {
        id: string;
        name: string;
    },
    salaryRange: SalaryRange | null,
    workplace: Workplace;
    location: string;
    createdAt: number;
};

export const getJobPosts = (): Promise<JobPost[]> =>
    apiRequest<JobPost[], void>({
        path: '/jobPost'
    });