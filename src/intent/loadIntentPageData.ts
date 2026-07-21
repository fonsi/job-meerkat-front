import { CategoryTree } from '@/category/category';
import { Company } from '@/company/company';
import {
    filterJobPostsByIntent,
    getIntentBySlug,
    IntentDefinition,
    IntentSlug,
} from '@/intent/intents';
import { getSortedJobPosts, SortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { JobPost } from '@/jobPost/http/getJobPosts';
import {
    getCachedCategories,
    getCachedCompanies,
    getCachedJobPosts,
} from '@/shared/http/prerenderCache';

export type IntentJobsPageData = {
    intent: IntentDefinition;
    kind: 'jobs';
    categoryTree: CategoryTree;
    sortedJobPosts: SortedJobPosts;
    resultCount: number;
};

export type IntentCompaniesPageData = {
    intent: IntentDefinition;
    kind: 'companies';
    companies: Company[];
    resultCount: number;
};

export type IntentPageData = IntentJobsPageData | IntentCompaniesPageData;

export const loadIntentPageData = async (
    slug: string,
): Promise<IntentPageData | null> => {
    const intent = getIntentBySlug(slug);
    if (!intent) {
        return null;
    }

    if (intent.kind === 'companies') {
        const [companies, jobPosts] = await Promise.all([
            getCachedCompanies(),
            getCachedJobPosts(),
        ]);
        const salariedJobs = filterJobPostsByIntent(
            intent.slug as IntentSlug,
            jobPosts,
        );
        const companyIds = new Set(salariedJobs.map((job) => job.company.id));
        const matched = companies
            .filter((company) => companyIds.has(company.id))
            .map((company) => ({
                ...company,
                jobPostsCount:
                    salariedJobs.filter((job) => job.company.id === company.id)
                        .length || company.jobPostsCount,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        return {
            intent,
            kind: 'companies',
            companies: matched,
            resultCount: matched.length,
        };
    }

    const [categoryTree, jobPosts] = await Promise.all([
        getCachedCategories(),
        getCachedJobPosts(),
    ]);
    const filtered = filterJobPostsByIntent(
        intent.slug as IntentSlug,
        jobPosts as JobPost[],
    );

    return {
        intent,
        kind: 'jobs',
        categoryTree,
        sortedJobPosts: getSortedJobPosts(filtered),
        resultCount: filtered.length,
    };
};
