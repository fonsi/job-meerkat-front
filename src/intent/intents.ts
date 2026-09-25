import type { JobPost } from '@/jobPost/http/getJobPosts';
import { Period, Workplace } from '@/jobPost/http/getJobPosts';
import {
    type IntentSlug,
    getIntentBySlug,
    INTENT_DEFINITIONS,
    INTENT_PATHS,
} from './intentDefinitions';

export type {
    IntentDefinition,
    IntentKind,
    IntentSlug,
} from './intentDefinitions';
export { getIntentBySlug, INTENT_DEFINITIONS, INTENT_PATHS };

const ENGINEERING_CATEGORIES = new Set([
    'Backend',
    'Frontend',
    'Fullstack',
    'Blockchain',
    'AI',
    'Mobile',
    'QA',
    'DevOps',
    'Data',
    'Game developer',
    'Machine learning',
    'Engineering manager',
]);

const PRODUCT_CATEGORIES = new Set(['Product', 'Design', 'Marketing']);

export const toAnnualSalary = (amount: number, period: Period): number => {
    switch (period) {
        case Period.Month:
            return amount * 12;
        case Period.Week:
            return amount * 52;
        case Period.Day:
            return amount * 260;
        case Period.Hour:
            return amount * 2080;
        default:
            return amount;
    }
};

export const annualSalaryMax = (jobPost: JobPost): number => {
    if (!jobPost.salaryRange?.max) {
        return 0;
    }
    return toAnnualSalary(jobPost.salaryRange.max, jobPost.salaryRange.period);
};

const hasPublicSalary = (jobPost: JobPost) => jobPost.salaryRange?.max != null;

const isRemote = (jobPost: JobPost) => jobPost.workplace === Workplace.Remote;

export const filterJobPostsByIntent = (
    slug: IntentSlug,
    jobPosts: JobPost[],
): JobPost[] => {
    const open = jobPosts.filter((job) => job.closedAt == null);

    switch (slug) {
        case 'remote-jobs-with-salary':
            return open.filter((job) => hasPublicSalary(job) && isRemote(job));
        case 'remote-engineering-jobs-with-salary':
            return open.filter(
                (job) =>
                    hasPublicSalary(job) &&
                    isRemote(job) &&
                    ENGINEERING_CATEGORIES.has(job.category),
            );
        case 'remote-product-jobs-with-salary':
            return open.filter(
                (job) =>
                    hasPublicSalary(job) &&
                    isRemote(job) &&
                    PRODUCT_CATEGORIES.has(job.category),
            );
        case 'highest-paying-remote-jobs':
            return open
                .filter((job) => hasPublicSalary(job) && isRemote(job))
                .sort((a, b) => annualSalaryMax(b) - annualSalaryMax(a))
                .slice(0, 40);
        case 'companies-that-post-salaries':
            return open.filter((job) => hasPublicSalary(job));
    }
};
