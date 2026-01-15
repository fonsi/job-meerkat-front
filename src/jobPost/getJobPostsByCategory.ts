import { JobPost } from './jobPost';

type GetJobPostsByCategory = {
    jobPosts: JobPost[];
    category: string;
};

export const getJobPostsByCategory = ({
    jobPosts,
    category,
}: GetJobPostsByCategory): JobPost[] =>
    jobPosts.filter((jobPost) => jobPost.category === category);
