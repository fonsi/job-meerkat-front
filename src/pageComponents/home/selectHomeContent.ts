import { Company, isCompanyDisabled } from '@/company/company';
import type { JobPost } from '@/jobPost/http/getJobPosts';

export const HOME_FRESH_PICKS_LIMIT = 10;
export const HOME_FEATURED_COMPANIES_LIMIT = 10;
export const HOME_MAX_JOBS_PER_COMPANY = 1;
export const HOME_MAX_JOBS_PER_CATEGORY = 2;

const hasPublicSalary = (jobPost: JobPost) => jobPost.salaryRange?.max != null;

const isRemote = (jobPost: JobPost) => jobPost.workplace === 'remote';

const compareFreshPicks = (a: JobPost, b: JobPost): number => {
    const salaryDiff = Number(hasPublicSalary(b)) - Number(hasPublicSalary(a));
    if (salaryDiff !== 0) return salaryDiff;

    const remoteDiff = Number(isRemote(b)) - Number(isRemote(a));
    if (remoteDiff !== 0) return remoteDiff;

    return b.createdAt - a.createdAt;
};

const canTakeJobWithDiversity = (
    job: JobPost,
    selected: JobPost[],
): boolean => {
    const sameCompany = selected.filter(
        (item) => item.company.id === job.company.id,
    ).length;
    if (sameCompany >= HOME_MAX_JOBS_PER_COMPANY) return false;

    const sameCategory = selected.filter(
        (item) => item.category === job.category,
    ).length;
    if (sameCategory >= HOME_MAX_JOBS_PER_CATEGORY) return false;

    return true;
};

/** Rank open jobs for the homepage: salary → remote → recency, then diversity caps. */
export const selectFreshPicks = (
    jobPosts: JobPost[],
    limit = HOME_FRESH_PICKS_LIMIT,
): JobPost[] => {
    const openJobs = jobPosts
        .filter((job) => job.closedAt == null)
        .toSorted(compareFreshPicks);

    const selected: JobPost[] = [];

    for (const job of openJobs) {
        if (selected.length >= limit) break;
        if (!canTakeJobWithDiversity(job, selected)) continue;
        selected.push(job);
    }

    if (selected.length >= limit) return selected;

    for (const job of openJobs) {
        if (selected.length >= limit) break;
        if (selected.some((item) => item.id === job.id)) continue;
        selected.push(job);
    }

    return selected;
};

/** Active companies with open roles, ranked by open-job count then name. */
export const selectFeaturedCompanies = (
    companies: Company[],
    limit = HOME_FEATURED_COMPANIES_LIMIT,
): Company[] => {
    const eligible = companies.filter(
        (company) =>
            !isCompanyDisabled(company) && (company.jobPostsCount ?? 0) > 0,
    );

    return eligible
        .toSorted((a, b) => {
            const countDiff = (b.jobPostsCount ?? 0) - (a.jobPostsCount ?? 0);
            if (countDiff !== 0) return countDiff;

            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        })
        .slice(0, limit);
};

export const selectHomeContent = ({
    jobPosts,
    companies,
}: {
    jobPosts: JobPost[];
    companies: Company[];
}) => ({
    freshPicks: selectFreshPicks(jobPosts),
    featuredCompanies: selectFeaturedCompanies(companies),
});
