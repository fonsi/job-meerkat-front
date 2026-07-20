'use client';

import styled from 'styled-components';
import { Company } from '@/company/company';
import { JobPostsList } from '@/jobPost/layout/JobPostList';
import { CompanyHeader } from '@/company/layout/CompanyHeader';
import { Colors, Device } from '@/shared/styles/constants';
import { PublishPeriod, SortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { JobPostsPublishPeriod } from '@/jobPost/layout/JobPostsPublishPeriod';
import { NewsletterInlineSubscribe } from '@/newsletter/layout/NewsletterInlineSubscribe';

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

const ContentLayout = styled.div`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 0 8px 24px;

    @media ${Device.laptop} {
        flex-direction: row;
        gap: 40px;
    }
`;

const JobsColumn = styled.div`
    flex: 1;
    min-width: 0;
    width: 100%;
`;

const Aside = styled.aside`
    flex-shrink: 0;
    order: -1;
    width: 100%;

    @media ${Device.laptop} {
        order: 0;
        position: sticky;
        top: 24px;
        width: 280px;
    }
`;

export const CompanyHome = ({ company, openJobPosts }: Props) => (
    <div>
        <CompanyHeader company={company} />
        <ContentLayout>
            <JobsColumn>
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
                        jobPosts={
                            openJobPosts[PublishPeriod.BeforeLastThirtyDays]
                        }
                        title="More than 30 days ago"
                    />
                </JobPostsList>
            </JobsColumn>
            <Aside>
                <NewsletterInlineSubscribe
                    compact
                    title={`Alert me when ${company.name} posts`}
                    description="Handpicked remote roles with public salaries. Filter for this company after you confirm."
                    submitLabel="Send me alerts"
                />
            </Aside>
        </ContentLayout>
    </div>
);
