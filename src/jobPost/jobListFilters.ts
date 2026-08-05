import type { JobPost } from './http/getJobPosts';
import type { SortedJobPosts } from './getSortedJobPosts';

export type WorkplaceFilter = 'all' | 'remote' | 'hybrid' | 'onSite';
export type CategoryFilter = 'all' | string;

export type JobListFilters = {
    category: CategoryFilter;
    includeWithoutSalary: boolean;
    workplace: WorkplaceFilter;
};

export const DEFAULT_JOB_LIST_FILTERS: JobListFilters = {
    category: 'all',
    includeWithoutSalary: false,
    workplace: 'remote',
};

export const jobCategoryKey = (jobPost: JobPost): string =>
    jobPost.category || 'other';

export const WORKPLACE_FILTER_OPTIONS: {
    value: WorkplaceFilter;
    label: string;
}[] = [
    { value: 'all', label: 'All' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'onSite', label: 'On-site' },
];

export const SALARY_FILTER_OPTIONS: {
    value: boolean;
    label: string;
}[] = [
    { value: true, label: 'All' },
    { value: false, label: 'Public' },
];

export const matchesJobListFilters = (
    jobPost: JobPost,
    filters: JobListFilters,
): boolean => {
    if (
        filters.category !== 'all' &&
        jobCategoryKey(jobPost) !== filters.category
    ) {
        return false;
    }
    if (!filters.includeWithoutSalary && !jobPost.salaryRange) return false;
    if (filters.workplace === 'all') return true;

    return jobPost.workplace === filters.workplace;
};

/** Show every job — used when the page loader already applied the filters. */
export const PASSTHROUGH_JOB_LIST_FILTERS: JobListFilters = {
    category: 'all',
    includeWithoutSalary: true,
    workplace: 'all',
};

export const countJobsMatchingFilters = (
    jobPosts: JobPost[],
    filters: JobListFilters,
): number =>
    jobPosts.reduce(
        (count, jobPost) =>
            matchesJobListFilters(jobPost, filters) ? count + 1 : count,
        0,
    );

export const flattenSortedJobPosts = (jobPosts: SortedJobPosts): JobPost[] =>
    Object.values(jobPosts).flat();

/**
 * Prefer remote + salary. If that yields nothing, widen workplace to all.
 * If still nothing, also include offers without salary.
 */
export const resolveInitialJobListFilters = (
    jobPosts: JobPost[],
): JobListFilters => {
    if (
        jobPosts.some((job) =>
            matchesJobListFilters(job, DEFAULT_JOB_LIST_FILTERS),
        )
    ) {
        return DEFAULT_JOB_LIST_FILTERS;
    }

    const allLocations: JobListFilters = {
        category: 'all',
        includeWithoutSalary: false,
        workplace: 'all',
    };
    if (jobPosts.some((job) => matchesJobListFilters(job, allLocations))) {
        return allLocations;
    }

    return { category: 'all', includeWithoutSalary: true, workplace: 'all' };
};
