import { JobPostsList } from '@/jobPost/layout/JobPostList';
import { HomeHeader } from './HomeHeader';
import { PublishPeriod, SortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { JobPostsPublishPeriod } from '@/jobPost/layout/JobPostsPublishPeriod';

type Props = {
    jobPosts: SortedJobPosts;
};

export const HomePage = ({ jobPosts }: Props) => {
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
