'use client';

import styled from 'styled-components';
import { JobPost } from '../http/getJobPosts'
import { JobPostRow } from './JobPostRow';
import { Colors } from '@/shared/styles/constants';

type Props = {
    jobPosts: JobPost[];
    title: string;
}

const PublishPeriod = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 48px;
`;

const Title = styled.div`
    color: ${Colors.mediumGrey};
    font-size: 24px;
    padding: 0 8px;
`;

export const JobPostsPublishPeriod = ({ jobPosts, title }: Props) => {
    if (!jobPosts?.length) {
        return null;
    }

    return <PublishPeriod>
        <Title>{ title }</Title>
        {
            jobPosts.map((jobPost) =>
                <JobPostRow key={jobPost.id} jobPost={jobPost}></JobPostRow>
            )
        }
    </PublishPeriod>
}