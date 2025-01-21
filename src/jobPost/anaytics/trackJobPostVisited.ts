import { tracker } from '@/shared/analytics/tracker';
import { JobPost } from '../http/getJobPosts';

const JOB_POST_VISITED_EVENT = 'job-post-visited';

type TrackJobPostVisited = {
    jobPost: JobPost;
};

export const trackJobPostVisited = ({ jobPost }: TrackJobPostVisited): void => {
    tracker.trackEvent({
        event: JOB_POST_VISITED_EVENT,
        data: {
            id: jobPost.id,
            title: jobPost.title,
            category: jobPost.category,
            workplace: jobPost.workplace,
            type: jobPost.type,
            hasSalary: !!jobPost.salaryRange,
            location: jobPost.location,
            company: jobPost.company.name,
        },
    });
};
