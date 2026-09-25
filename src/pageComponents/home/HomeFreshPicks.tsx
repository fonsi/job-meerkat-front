'use client';

import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import { createCompanyLink } from '@/company/company';
import { CompanyImage } from '@/company/layout/CompanyImage';
import type {
    JobPost,
    SalaryRange as SalaryRangeType,
} from '@/jobPost/http/getJobPosts';
import { Colors, Device } from '@/shared/styles/constants';
import {
    HomeSection,
    SectionEyebrow,
    SectionHead,
    SectionIntro,
    SectionTitle,
} from './homeLayout';
import { HomeTiltCard, HomeTiltRoot } from './homeTiltCard';

type Props = {
    jobs: JobPost[];
};

const List = styled.ul`
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    list-style: none;

    @media ${Device.tablet} {
        grid-auto-rows: minmax(220px, auto);
        grid-template-columns: repeat(6, 1fr);
    }
`;

const CardShell = styled.li<{ $featured?: boolean }>`
    @media ${Device.tablet} {
        grid-column: ${({ $featured }) => ($featured ? 'span 4' : 'span 2')};
    }
`;

const Card = styled.div<{ $featured?: boolean }>`
    background:
        linear-gradient(
            155deg,
            rgba(214, 255, 63, 0.08),
            rgba(255, 255, 255, 0.03) 40%,
            transparent 70%
        ),
        ${Colors.brokenBlack};
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.28),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
    display: flex;
    flex-direction: column;
    gap: 14px;
    height: 100%;
    padding: 22px;
    position: relative;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;

    @media ${Device.tablet} {
        padding: ${({ $featured }) => ($featured ? '22px' : '16px')};
    }

    ${HomeTiltRoot}[data-tilting='true'] & {
        border-color: rgba(214, 255, 63, 0.45);
        box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    &:has(a[data-card-link]:focus-visible) {
        outline: 2px solid ${Colors.accent};
        outline-offset: 2px;
    }
`;

const CardLink = styled(Link)`
    color: inherit;
    text-decoration: none;

    &::after {
        content: '';
        inset: 0;
        position: absolute;
        z-index: 0;
    }

    &:hover {
        text-decoration: none;
    }
`;

const VisuallyHidden = styled.span`
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
`;

const TopRow = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    gap: 12px;
`;

const SalaryBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const SalaryAmount = styled.span<{ $featured?: boolean }>`
    align-self: start;
    background-image: linear-gradient(
        transparent 58%,
        rgba(214, 255, 63, 0.55) 58%,
        rgba(214, 255, 63, 0.55) 94%,
        transparent 94%
    );
    color: ${Colors.brokenWhite};
    font-size: 42px;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.05;

    @media ${Device.tablet} {
        font-size: ${({ $featured }) => ($featured ? '42px' : '28px')};
    }
`;

const SalaryMeta = styled.span`
    color: ${Colors.mediumGrey};
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
`;

const NoSalary = styled.span`
    color: ${Colors.mediumGrey};
    font-size: 15px;
`;

const JobCopy = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: auto;
`;

const JobTitle = styled.span<{ $featured?: boolean }>`
    font-size: 22px;
    font-weight: 600;
    line-height: 1.25;

    @media ${Device.tablet} {
        font-size: ${({ $featured }) => ($featured ? '22px' : '16px')};
    }
`;

const CompanyLine = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 14px;
    position: relative;
    z-index: 1;
`;

const CompanyLink = styled(Link).attrs({ reloadDocument: true })`
    color: inherit;
    font-weight: 600;

    &:hover {
        color: ${Colors.accent};
        text-decoration: underline;
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 2px;
    }
`;

const Meta = styled.div`
    align-items: center;
    color: ${Colors.mediumGrey};
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    gap: 8px;
    letter-spacing: 0.02em;
`;

const Dot = styled.span`
    color: ${Colors.darkGrey};
`;

const beautifySalary = (salary: number): string =>
    salary / 1000 < 1 ? `${salary}` : `${(salary / 1000).toFixed()}K`;

const formatSalaryAmount = (salaryRange: SalaryRangeType): string => {
    if (salaryRange.min && salaryRange.max) {
        return `${beautifySalary(salaryRange.min)}–${beautifySalary(salaryRange.max)}`;
    }
    if (salaryRange.max) return `Up to ${beautifySalary(salaryRange.max)}`;
    if (salaryRange.min) return `From ${beautifySalary(salaryRange.min)}`;
    return '';
};

type FreshPickCardProps = {
    job: JobPost;
    featured: boolean;
};

const FreshPickCard = ({ job, featured }: FreshPickCardProps) => (
    <CardShell $featured={featured}>
        <HomeTiltCard>
            <Card $featured={featured}>
                <CardLink
                    data-card-link
                    to={`/jobpost/${encodeURIComponent(job.slug)}`}
                >
                    <VisuallyHidden>{job.title}</VisuallyHidden>
                </CardLink>
                <TopRow>
                    {job.company ? (
                        <CompanyImage
                            company={job.company}
                            $width={100}
                            $height={48}
                            $sameSize
                        />
                    ) : (
                        <span />
                    )}
                </TopRow>
                {job.salaryRange ? (
                    <SalaryBlock>
                        <SalaryAmount $featured={featured}>
                            {formatSalaryAmount(job.salaryRange)}
                        </SalaryAmount>
                        <SalaryMeta>
                            {job.salaryRange.currency.toUpperCase()} /{' '}
                            {job.salaryRange.period}
                        </SalaryMeta>
                    </SalaryBlock>
                ) : (
                    <NoSalary>Salary not listed</NoSalary>
                )}
                <JobCopy>
                    <JobTitle $featured={featured}>{job.title}</JobTitle>
                    {job.company ? (
                        <CompanyLine>
                            at{' '}
                            <CompanyLink
                                to={createCompanyLink({
                                    companyId: job.company.id,
                                })}
                            >
                                {job.company.name}
                            </CompanyLink>
                        </CompanyLine>
                    ) : null}
                </JobCopy>
                <Meta>
                    <span>{job.category}</span>
                    <Dot aria-hidden="true">·</Dot>
                    <span>
                        {job.workplace}
                        {job.location ? ` — ${job.location}` : ''}
                    </span>
                </Meta>
            </Card>
        </HomeTiltCard>
    </CardShell>
);

export const HomeFreshPicks = ({ jobs }: Props) => {
    if (jobs.length === 0) return null;

    return (
        <HomeSection>
            <SectionHead>
                <div>
                    <SectionEyebrow>Fresh picks</SectionEyebrow>
                    <SectionTitle>Pay first. Then the role.</SectionTitle>
                </div>
                <SectionIntro>
                    Recent openings with salaries shown upfront.
                </SectionIntro>
            </SectionHead>
            <List>
                {jobs.map((job, index) => (
                    <FreshPickCard
                        key={job.id}
                        job={job}
                        featured={index === 0 || index === jobs.length - 1}
                    />
                ))}
            </List>
        </HomeSection>
    );
};
