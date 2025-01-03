import { JobPostsList } from '@/jobPost/layout/JobPostList';
import { PublishPeriod, SortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { JobPostsPublishPeriod } from '@/jobPost/layout/JobPostsPublishPeriod';
import { HomeHeader } from '../home/HomeHeader';

type Props = {
    jobPosts: SortedJobPosts;
};

export const CategoryPage = ({ jobPosts }: Props) => {
    return (
        <>
            <HomeHeader />
            <JobPostsList>
                <JobPostsPublishPeriod
                    jobPosts={jobPosts[PublishPeriod.LastDay]}
                    title="Last 24 hours"
                />
                <JobPostsPublishPeriod
                    jobPosts={jobPosts[PublishPeriod.LastSevenDays]}
                    title="Last 7 days"
                />
                <JobPostsPublishPeriod
                    jobPosts={jobPosts[PublishPeriod.LastThirtyDays]}
                    title="Last 30 days"
                />
                <JobPostsPublishPeriod
                    jobPosts={jobPosts[PublishPeriod.BeforeLastThirtyDays]}
                    title="More than 30 days ago"
                />
            </JobPostsList>
        </>
    );
};
