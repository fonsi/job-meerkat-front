'use client';

import styled from 'styled-components';
import { Company } from '@/company/company';
import { JobPostsList } from '@/jobPost/layout/JobPostList';
import { CompanyHeader } from '@/company/layout/CompanyHeader';
import { Colors, Device } from '@/shared/styles/constants';
import { PublishPeriod, SortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { JobPostsPublishPeriod } from '@/jobPost/layout/JobPostsPublishPeriod';

type Props = {
    company: Company;
    openJobPosts: SortedJobPosts;
};

const OpenPositions = styled.h2`
    border-bottom: 1px solid ${Colors.brokenWhite};
    font-size: 16px;
    margin-bottom: 24px;
    padding: 8px;

    @media ${Device.tablet} {
        font-size: 18px;
        padding: 0 8px 16px;
    }
`;

export const CompanyHome = ({ company, openJobPosts }: Props) => (
    <div>
        <CompanyHeader company={company} />
        <OpenPositions>Open positions</OpenPositions>
        <JobPostsList>
            <JobPostsPublishPeriod
                jobPosts={openJobPosts[PublishPeriod.LastDay]}
                title="Last 24 hours"
            />
            <JobPostsPublishPeriod
                jobPosts={openJobPosts[PublishPeriod.LastSevenDays]}
                title="Last 7 days"
            />
            <JobPostsPublishPeriod
                jobPosts={openJobPosts[PublishPeriod.LastThirtyDays]}
                title="Last 30 days"
            />
            <JobPostsPublishPeriod
                jobPosts={openJobPosts[PublishPeriod.BeforeLastThirtyDays]}
                title="More than 30 days ago"
            />
        </JobPostsList>
    </div>
);
