import { getSortedJobPosts, PublishPeriod } from './getSortedJobPosts';
import { JobPost } from './jobPost';

describe('getSortedJobPosts', () => {
    const mockJobPosts: JobPost[] = [
        { id: '1', title: 'Job 1', createdAt: Date.now() - 1000 } as JobPost, // LastDay
        {
            id: '2',
            title: 'Job 2',
            createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
        } as JobPost, // LastSevenDays
        {
            id: '3',
            title: 'Job 3',
            createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
        } as JobPost, // LastThirtyDays
        {
            id: '4',
            title: 'Job 4',
            createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
        } as JobPost, // BeforeLastThirtyDays
        { id: '5', title: 'Job 5', createdAt: Date.now() - 2000 } as JobPost, // LastDay
        {
            id: '6',
            title: 'Job 6',
            createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
        } as JobPost, // LastSevenDays
    ];

    it('should sort job posts into correct publish periods', () => {
        const result = getSortedJobPosts(mockJobPosts);

        expect(result[PublishPeriod.LastDay]).toEqual([
            mockJobPosts[0],
            mockJobPosts[4],
        ]);
        expect(result[PublishPeriod.LastSevenDays]).toEqual([
            mockJobPosts[1],
            mockJobPosts[5],
        ]);
        expect(result[PublishPeriod.LastThirtyDays]).toEqual([mockJobPosts[2]]);
        expect(result[PublishPeriod.BeforeLastThirtyDays]).toEqual([
            mockJobPosts[3],
        ]);
    });

    it('should handle an empty array of job posts', () => {
        const result = getSortedJobPosts([]);

        expect(result[PublishPeriod.LastDay]).toBeUndefined();
        expect(result[PublishPeriod.LastSevenDays]).toBeUndefined();
        expect(result[PublishPeriod.LastThirtyDays]).toBeUndefined();
        expect(result[PublishPeriod.BeforeLastThirtyDays]).toBeUndefined();
    });

    it('should sort job posts by creation date within each publish period', () => {
        const mockJobPostsUnsorted: JobPost[] = [
            {
                id: '5',
                title: 'Job 5',
                createdAt: Date.now() - 1500,
            } as JobPost, // LastDay
            { id: '6', title: 'Job 6', createdAt: Date.now() - 500 } as JobPost, // LastDay
        ];

        const result = getSortedJobPosts(mockJobPostsUnsorted);

        expect(result[PublishPeriod.LastDay]).toEqual([
            mockJobPostsUnsorted[1],
            mockJobPostsUnsorted[0],
        ]);
    });
});
