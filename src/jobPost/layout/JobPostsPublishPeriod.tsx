'use client';

import styled from 'styled-components';
import { JobPost } from '../http/getJobPosts'
import { JobPostRow } from './JobPostRow';
import { Colors, Device } from '@/shared/styles/constants';
import { Calendar } from '@/shared/image/icons/Calendar';

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

export const JobPostsPublishPeriod = ({ jobPosts, title }: Props) => {
    if (!jobPosts?.length) {
        return null;
    }

    return <PublishPeriod>
        <Title>
            <Calendar />
            { title }
        </Title>
        {
            jobPosts.map((jobPost) =>
                <JobPostRow key={jobPost.id} jobPost={jobPost}></JobPostRow>
            )
        }
    </PublishPeriod>
}