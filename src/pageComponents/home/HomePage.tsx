import { CategoryTree } from '@/category/category';
import { HomeHeader } from './HomeHeader';
import { SortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { JobPostsListWithCategories } from '@/shared/layout/JobPostsListWithCategories';

type Props = {
    jobPosts: SortedJobPosts;
    categoryTree: CategoryTree;
};

export const HomePage = ({ jobPosts, categoryTree }: Props) => {
    return (
        <>
            <HomeHeader />
            <JobPostsListWithCategories
                jobPosts={jobPosts}
                categoryTree={categoryTree}
            />
        </>
    );
};
