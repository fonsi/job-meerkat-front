import { getJobPostsByCategory } from './getJobPostsByCategory';
import { JobPost } from './jobPost';

const frontendJobPosts: JobPost[] = [
    {
        title: 'Senior Frontend developer',
        category: 'frontend',
    } as JobPost,
    {
        title: 'Staff Frontend developer',
        category: 'frontend',
    } as JobPost,
];

const backendJobPosts: JobPost[] = [
    {
        title: 'Senior Backend developer',
        category: 'backend',
    } as JobPost,
];

const jobPosts: JobPost[] = [...frontendJobPosts, ...backendJobPosts];

describe('getJobPostsByCategory', () => {
    test('should return a single result', () => {
        expect(
            getJobPostsByCategory({ jobPosts, category: 'backend' }),
        ).toEqual(backendJobPosts);
    });

    test('should return multiple results', () => {
        expect(
            getJobPostsByCategory({ jobPosts, category: 'frontend' }),
        ).toEqual(frontendJobPosts);
    });

    test('should return empty array if no job posts found', () => {
        expect(getJobPostsByCategory({ jobPosts, category: 'sales' })).toEqual(
            [],
        );
    });

    test('should return empty array if jobPosts is an empty array', () => {
        expect(
            getJobPostsByCategory({ jobPosts: [], category: 'sales' }),
        ).toEqual([]);
    });
});
