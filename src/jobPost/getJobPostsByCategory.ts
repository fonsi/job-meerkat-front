import { JobPost } from './http/getJobPosts';

type GetJobPostsByCategory = {
    jobPosts: JobPost[];
    category: string;
};

export const getJobPostsByCategory = ({
    jobPosts,
    category,
}: GetJobPostsByCategory): JobPost[] =>
    jobPosts.filter((jobPost) => jobPost.category === category);
