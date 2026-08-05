import { JobPost, Period, Workplace } from '@/jobPost/http/getJobPosts';

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

export type IntentSlug =
    | 'remote-jobs-with-salary'
    | 'remote-engineering-jobs-with-salary'
    | 'remote-product-jobs-with-salary'
    | 'highest-paying-remote-jobs'
    | 'companies-that-post-salaries';

export type IntentKind = 'jobs' | 'companies';

export type IntentDefinition = {
    slug: IntentSlug;
    path: `/${IntentSlug}/`;
    kind: IntentKind;
    title: string;
    h1: string;
    description: string;
};

export const INTENT_DEFINITIONS: IntentDefinition[] = [
    {
        slug: 'remote-jobs-with-salary',
        path: '/remote-jobs-with-salary/',
        kind: 'jobs',
        title: 'Remote Jobs with Public Salaries | Jobmeerkat',
        h1: 'Remote Jobs with Public Salaries',
        description:
            'Browse remote jobs that show pay upfront. Updated daily from companies tracked on Jobmeerkat.',
    },
    {
        slug: 'remote-engineering-jobs-with-salary',
        path: '/remote-engineering-jobs-with-salary/',
        kind: 'jobs',
        title: 'Remote Engineering Jobs with Public Salaries | Jobmeerkat',
        h1: 'Remote Engineering Jobs with Public Salaries',
        description:
            'Find remote engineering roles with public salaries — frontend, backend, fullstack, and more on Jobmeerkat.',
    },
    {
        slug: 'remote-product-jobs-with-salary',
        path: '/remote-product-jobs-with-salary/',
        kind: 'jobs',
        title: 'Remote Product, Design & Marketing Jobs with Salaries | Jobmeerkat',
        h1: 'Remote Product Jobs with Public Salaries',
        description:
            'Remote product, design, and marketing roles with public salaries. Browse open positions on Jobmeerkat.',
    },
    {
        slug: 'highest-paying-remote-jobs',
        path: '/highest-paying-remote-jobs/',
        kind: 'jobs',
        title: 'Highest Paying Remote Jobs | Jobmeerkat',
        h1: 'Highest Paying Remote Jobs',
        description:
            'See the highest paying remote jobs with public salaries right now on Jobmeerkat.',
    },
    {
        slug: 'companies-that-post-salaries',
        path: '/companies-that-post-salaries/',
        kind: 'companies',
        title: 'Companies That Post Salaries | Jobmeerkat',
        h1: 'Companies That Post Salaries',
        description:
            'Explore companies that publish pay in their remote job posts. Tracked on Jobmeerkat.',
    },
];

export const INTENT_PATHS = INTENT_DEFINITIONS.map((intent) => intent.path);

export const getIntentBySlug = (slug: string): IntentDefinition | null =>
    INTENT_DEFINITIONS.find((intent) => intent.slug === slug) ?? null;

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
