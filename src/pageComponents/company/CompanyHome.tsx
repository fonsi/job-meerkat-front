'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { Company, isCompanyDisabled } from '@/company/company';
import { getCompanyJobStats } from '@/company/getCompanyJobStats';
import { CompanyDescription } from '@/company/layout/CompanyDescription';
import { CompanyStats } from '@/company/layout/CompanyStats';
import { JobPostsList } from '@/jobPost/layout/JobPostList';
import { CompanyHeader } from '@/company/layout/CompanyHeader';
import { delaGothicVarName } from '@/shared/font/constants';
import { Colors, Device } from '@/shared/styles/constants';
import { PublishPeriod, SortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { JobPostsPublishPeriod } from '@/jobPost/layout/JobPostsPublishPeriod';
import { NewsletterInlineSubscribe } from '@/newsletter/layout/NewsletterInlineSubscribe';
import {
    countJobsMatchingFilters,
    flattenSortedJobPosts,
    JobListFilters,
    resolveInitialJobListFilters,
} from '@/jobPost/jobListFilters';
import { JobListFiltersControls } from '@/jobPost/layout/JobListFiltersControls';
import { EmptyJobListFiltersMessage } from '@/jobPost/layout/EmptyJobListFiltersMessage';

type Props = {
    company: Company;
    openJobPosts: SortedJobPosts;
};

const OpenPositions = styled.h2`
    font-family: var(${delaGothicVarName});
    font-size: clamp(24px, 3.5vw, 32px);
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin: 0 0 24px;
`;

const ContentLayout = styled.div`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 0 0 24px;

    @media ${Device.laptop} {
        flex-direction: row;
        gap: 40px;
    }
`;

const JobsColumn = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 48px;
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

const DisabledContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 0 0 48px;
`;

const StatusMessage = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 15px;
    line-height: 1.55;
    margin: 0;

    @media ${Device.tablet} {
        font-size: 16px;
    }
`;

const FiltersBar = styled.div`
    margin-bottom: 24px;
`;

const formatCategory = (category: string): string =>
    category
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

export const CompanyHome = ({ company, openJobPosts }: Props) => {
    const [filters, setFilters] = useState<JobListFilters>(() =>
        resolveInitialJobListFilters(flattenSortedJobPosts(openJobPosts)),
    );

    if (isCompanyDisabled(company)) {
        return (
            <div>
                <CompanyHeader company={company} showHomePage={false} />
                <DisabledContent>
                    {company.description ? (
                        <CompanyDescription description={company.description} />
                    ) : null}
                    {company.statusMessage ? (
                        <StatusMessage>{company.statusMessage}</StatusMessage>
                    ) : null}
                </DisabledContent>
            </div>
        );
    }

    const flatJobPosts = flattenSortedJobPosts(openJobPosts);
    const stats = getCompanyJobStats(flatJobPosts);
    const hasVisibleJobPosts =
        countJobsMatchingFilters(flatJobPosts, filters) > 0;
    const categoryOptions = [
        {
            value: 'all' as const,
            label: 'All',
            count: countJobsMatchingFilters(flatJobPosts, {
                ...filters,
                category: 'all',
            }),
        },
        ...stats.categories.map(({ category }) => ({
            value: category,
            label: formatCategory(category),
            count: countJobsMatchingFilters(flatJobPosts, {
                ...filters,
                category,
            }),
        })),
    ];

    return (
        <div>
            <CompanyHeader company={company} />
            <ContentLayout>
                <JobsColumn>
                    {company.description ? (
                        <CompanyDescription description={company.description} />
                    ) : null}
                    <CompanyStats stats={stats} />
                    <div>
                        <OpenPositions>Open positions</OpenPositions>
                        <FiltersBar>
                            <JobListFiltersControls
                                filters={filters}
                                jobPosts={flatJobPosts}
                                onChange={setFilters}
                                categoryOptions={
                                    stats.categories.length > 0
                                        ? categoryOptions
                                        : undefined
                                }
                            />
                        </FiltersBar>
                        <JobPostsList>
                            <JobPostsPublishPeriod
                                jobPosts={openJobPosts[PublishPeriod.LastDay]}
                                title="Last 24 hours"
                                filters={filters}
                            />
                            <JobPostsPublishPeriod
                                jobPosts={
                                    openJobPosts[PublishPeriod.LastSevenDays]
                                }
                                title="Last 7 days"
                                filters={filters}
                            />
                            <JobPostsPublishPeriod
                                jobPosts={
                                    openJobPosts[PublishPeriod.LastThirtyDays]
                                }
                                title="Last 30 days"
                                filters={filters}
                            />
                            <JobPostsPublishPeriod
                                jobPosts={
                                    openJobPosts[
                                        PublishPeriod.BeforeLastThirtyDays
                                    ]
                                }
                                title="More than 30 days ago"
                                filters={filters}
                            />
                        </JobPostsList>
                        {!hasVisibleJobPosts && flatJobPosts.length > 0 ? (
                            <EmptyJobListFiltersMessage />
                        ) : null}
                    </div>
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
};
