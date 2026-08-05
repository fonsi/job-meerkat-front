'use client';

import styled from 'styled-components';
import { JobPost } from '../http/getJobPosts';
import { JobPostRow } from './JobPostRow';
import { Colors, Device } from '@/shared/styles/constants';
import { Calendar } from '@/shared/image/icons/Calendar';
import { JobListFilters, matchesJobListFilters } from '../jobListFilters';

type Props = {
    jobPosts: JobPost[];
    title: string;
    filters: JobListFilters;
};

const PublishPeriod = styled.div<{ $hidden: boolean }>`
    display: ${(props) => (props.$hidden ? 'none' : 'flex')};
    flex-direction: column;
    margin-bottom: 48px;
`;

const Title = styled.div`
    align-items: center;
    background-color: ${Colors.brokenWhite};
    color: ${Colors.darkGrey};
    display: flex;
    font-size: 14px;
    gap: 6px;
    margin: 12px 0;
    padding: 12px 8px;

    @media ${Device.laptop} {
        border-radius: 2px;
    }

    svg {
        height: 20px;
        width: 20px;
    }
`;

export const JobPostsPublishPeriod = ({ jobPosts, title, filters }: Props) => {
    if (!jobPosts?.length) {
        return null;
    }

    const hasVisibleJobPosts = jobPosts.some((jobPost) =>
        matchesJobListFilters(jobPost, filters),
    );

    return (
        <PublishPeriod $hidden={!hasVisibleJobPosts}>
            <Title>
                <Calendar />
                {title}
            </Title>
            {jobPosts.map((jobPost) => (
                <JobPostRow
                    key={jobPost.id}
                    jobPost={jobPost}
                    isFilteredOut={!matchesJobListFilters(jobPost, filters)}
                />
            ))}
        </PublishPeriod>
    );
};
