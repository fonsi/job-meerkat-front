'use client';

import { CategoryTree, WebCategory } from '@/category/category';
import { SortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { PageHeader } from '@/shared/layout/PageHeader';
import { JobPostsListWithCategories } from '@/shared/layout/JobPostsListWithCategories';

type Props = {
    category: WebCategory;
    jobPosts: SortedJobPosts;
    categoryTree: CategoryTree;
};

export const CategoryPage = ({ category, jobPosts, categoryTree }: Props) => (
    <>
        <PageHeader
            title={`${category.name} open positions`}
            description={`Browse ${category.name} roles with public salaries when employers publish pay. Updated from companies tracked on Jobmeerkat.`}
        />
        <JobPostsListWithCategories
            jobPosts={jobPosts}
            categoryTree={categoryTree}
        />
    </>
);
