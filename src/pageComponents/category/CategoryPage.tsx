import { SortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { HomeHeader } from '../home/HomeHeader';
import { CategoryTree } from '@/category/category';
import { JobPostsListWithCategories } from '@/shared/layout/JobPostsListWithCategories';

type Props = {
    jobPosts: SortedJobPosts;
    categoryTree: CategoryTree;
};

export const CategoryPage = ({ jobPosts, categoryTree }: Props) => {
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
