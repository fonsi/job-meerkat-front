import { JobPost } from './jobPost';

export enum PublishPeriod {
    LastDay,
    LastSevenDays,
    LastThirtyDays,
    BeforeLastThirtyDays,
}

export type SortedJobPosts = {
    [published in PublishPeriod]: JobPost[];
};

const ONE_MINUTE = 60000;
const ONE_HOUR = ONE_MINUTE * 60;
const TWENTY_FOUR_HOURS = ONE_HOUR * 24;
const SEVEN_DAYS = TWENTY_FOUR_HOURS * 7;
const THIRTY_DAYS = TWENTY_FOUR_HOURS * 30;

const getPublishPeriodKey = (timeSincePublished: number): PublishPeriod => {
    if (timeSincePublished < TWENTY_FOUR_HOURS) {
        return PublishPeriod.LastDay;
    }

    if (timeSincePublished < SEVEN_DAYS) {
        return PublishPeriod.LastSevenDays;
    }

    if (timeSincePublished < THIRTY_DAYS) {
        return PublishPeriod.LastThirtyDays;
    }

    return PublishPeriod.BeforeLastThirtyDays;
};

export const getSortedJobPosts = (jobPosts: JobPost[]): SortedJobPosts => {
    const sortedJobPosts = jobPosts.toSorted(
        (a, b) => a.createdAt - b.createdAt,
    );

    return sortedJobPosts.reduce((acc, jobPost) => {
        const timeSincePublished = Date.now() - jobPost.createdAt;
        const publishPeriodKey = getPublishPeriodKey(timeSincePublished);

        return {
            ...acc,
            [publishPeriodKey]: [jobPost, ...(acc[publishPeriodKey] || [])],
        };
    }, {} as SortedJobPosts);
};
