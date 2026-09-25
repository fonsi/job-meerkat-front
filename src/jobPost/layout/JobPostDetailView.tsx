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
import { delaGothicVarName } from '@/shared/font/constants';

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
    margin: 40px 0 48px;

    @media ${Device.tablet} {
        margin-top: 48px;
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
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
`;

const Title = styled.h1`
    font-family: var(${delaGothicVarName});
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin: 0;
    min-width: 0;
`;

const SalaryBlock = styled.div`
    margin: 0;
`;

const NoSalary = styled.span`
    color: ${Colors.mediumGrey};
    font-size: 14px;
`;

const CompanyRow = styled.div`
    align-items: center;
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
`;

const CompanyNameLink = styled(Link).attrs({ reloadDocument: true })`
    color: inherit;
    font-size: 18px;
    font-weight: 600;
    text-decoration: none;

    &:hover {
        color: ${Colors.accent};
        text-decoration: none;
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 2px;
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
    background: ${Colors.accent};
    border-radius: 2px;
    color: ${Colors.brokenBlack};
    display: inline-block;
    font-size: 15px;
    font-weight: 700;
    padding: 14px 22px;
    text-decoration: none;
    transition:
        transform 0.2s ease,
        background-color 0.15s ease;

    &:hover {
        background: ${Colors.lightGrey};
        color: ${Colors.brokenBlack};
        text-decoration: none;
        transform: translateY(-2px);
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 3px;
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
                        <SalaryBlock>
                            {jobPost.salaryRange ? (
                                <SalaryRange
                                    salaryRange={jobPost.salaryRange}
                                    $size="lg"
                                />
                            ) : (
                                <NoSalary>Salary not listed</NoSalary>
                            )}
                        </SalaryBlock>
                        <Title>{jobPost.title}</Title>
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
