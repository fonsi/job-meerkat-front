'use client';

import styled from 'styled-components';
import { JobPost } from '../http/getJobPosts';
import { JobPostRow } from './JobPostRow';
import { Colors } from '@/shared/styles/constants';
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
    color: ${Colors.accent};
    display: flex;
    font-size: 12px;
    font-weight: 700;
    gap: 8px;
    letter-spacing: 0.14em;
    margin: 8px 0 16px;
    text-transform: uppercase;

    svg {
        flex-shrink: 0;
        height: 16px;
        width: 16px;
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
