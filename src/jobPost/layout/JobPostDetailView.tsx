'use client';

import styled from 'styled-components';
import { Link } from '@tanstack/react-router';
import { JobPost, Workplace } from '@/jobPost/http/getJobPosts';
import { JobPostDetailSections } from '@/jobPost/layout/JobPostDetailSections';
import { JobPostOriginalApplyLink } from '@/jobPost/layout/JobPostOriginalApplyLink';
import { SalaryRange } from '@/jobPost/layout/SalaryRange';
import { CompanyImage } from '@/company/layout/CompanyImage';
import { createCompanyLink } from '@/company/company';
import { Badge } from '@/shared/layout/Badge';
import { Place } from '@/shared/image/icons/Place';
import { Colors, Device } from '@/shared/styles/constants';
import { Container } from '@/shared/layout/Container';
import { NewsletterInlineSubscribe } from '@/newsletter/layout/NewsletterInlineSubscribe';

type Props = {
    jobPost: JobPost;
};

const workplaceLabel = (w: Workplace): string => {
    const map: Partial<Record<Workplace, string>> = {
        [Workplace.Remote]: 'Remote',
        [Workplace.OnSite]: 'On-site',
        [Workplace.Hybrid]: 'Hybrid',
        [Workplace.Unknown]: 'Workplace',
    };
    return map[w] ?? String(w);
};

const JobPostDetailWrap = styled.div`
    margin: 24px 8px;

    @media ${Device.tablet} {
        margin: 48px 8px;
    }
`;

const Layout = styled.div`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 28px;

    @media ${Device.laptop} {
        flex-direction: row;
        gap: 40px;
    }
`;

const Main = styled.div`
    flex: 1;
    min-width: 0;
`;

const Aside = styled.aside`
    flex-shrink: 0;
    width: 100%;

    @media ${Device.laptop} {
        position: sticky;
        top: 24px;
        width: 280px;
    }
`;

const TopRow = styled.div`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: space-between;
    margin-bottom: 20px;

    @media ${Device.tablet} {
        align-items: flex-start;
        flex-direction: row;
        gap: 16px;
    }
`;

const Title = styled.h1`
    flex: 1;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.25;
    min-width: 0;

    @media ${Device.tablet} {
        font-size: 28px;
    }
`;

const SalarySide = styled.div`
    color: ${Colors.brokenWhite};
    flex-shrink: 0;
    text-align: left;

    @media ${Device.tablet} {
        padding-top: 4px;
        text-align: right;
    }
`;

const CompanyRow = styled.div`
    align-items: center;
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
`;

const CompanyNameLink = styled(Link).attrs({ reloadDocument: true })`
    color: inherit;
    font-size: 18px;
    font-weight: 600;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const MetaRow = styled.div`
    align-items: center;
    color: ${Colors.mediumGrey};
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    font-weight: 300;
    gap: 12px 16px;
    margin-bottom: 12px;
`;

const PlaceWrap = styled.span`
    align-items: center;
    display: inline-flex;
    gap: 4px;

    svg {
        flex-shrink: 0;
        height: 18px;
        width: 18px;
    }
`;

const Published = styled.div`
    color: ${Colors.mediumGrey};
    font-size: 13px;
    margin-bottom: 20px;
`;

const ApplyButton = styled(JobPostOriginalApplyLink)`
    background-color: ${Colors.darkGrey};
    border-radius: 4px;
    color: ${Colors.brokenWhite};
    display: inline-block;
    font-size: 15px;
    font-weight: 600;
    padding: 12px 20px;
    text-decoration: none;
    transition: background-color 0.15s ease;

    &:hover {
        background-color: ${Colors.mediumGrey};
        text-decoration: none;
    }
`;

const OriginalPostClosedText = styled.span`
    color: ${Colors.mediumGrey};
    font-size: 15px;
    font-weight: 400;
`;

export const JobPostDetailView = ({ jobPost }: Props) => (
    <Container>
        <JobPostDetailWrap>
            <Layout>
                <Main>
                    <CompanyRow>
                        <CompanyImage company={jobPost.company} $width={56} />
                        <CompanyNameLink
                            to={createCompanyLink({
                                companyId: jobPost.company.id,
                            })}
                        >
                            {jobPost.company.name}
                        </CompanyNameLink>
                    </CompanyRow>
                    <TopRow>
                        <Title>{jobPost.title}</Title>
                        <SalarySide>
                            {jobPost.salaryRange ? (
                                <SalaryRange
                                    salaryRange={jobPost.salaryRange}
                                />
                            ) : (
                                <span
                                    style={{
                                        color: Colors.mediumGrey,
                                        fontSize: 14,
                                    }}
                                >
                                    Salary not listed
                                </span>
                            )}
                        </SalarySide>
                    </TopRow>
                    <MetaRow>
                        <Badge>{jobPost.category}</Badge>
                        <PlaceWrap>
                            <Place />
                            <span>
                                {workplaceLabel(jobPost.workplace)}
                                {jobPost.location
                                    ? ` — ${jobPost.location}`
                                    : ''}
                            </span>
                        </PlaceWrap>
                    </MetaRow>
                    <Published>
                        Published on{' '}
                        {
                            new Date(jobPost.createdAt)
                                .toISOString()
                                .split('T')[0]
                        }
                    </Published>
                    <JobPostDetailSections jobPost={jobPost} />
                    {jobPost.closedAt != null ? (
                        <OriginalPostClosedText>
                            This job post is closed.
                        </OriginalPostClosedText>
                    ) : (
                        <ApplyButton jobPost={jobPost}>
                            View original job post
                        </ApplyButton>
                    )}
                </Main>
                <Aside>
                    <NewsletterInlineSubscribe
                        compact
                        title="Get jobs like this"
                        description="Remote roles with public salaries — daily or weekly."
                    />
                </Aside>
            </Layout>
        </JobPostDetailWrap>
    </Container>
);
