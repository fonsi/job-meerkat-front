'use client';

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { JobPost } from '@/jobPost/jobPost';
import { getJobPostBySlug } from '@/jobPost/http/getJobPostBySlug';
import { CompanyImage } from '@/company/layout/CompanyImage';
import { Container } from '@/shared/layout/Container';
import { Badge } from '@/shared/layout/Badge';
import { SalaryRange } from '@/jobPost/layout/SalaryRange';
import { Device } from '@/shared/styles/constants';
import { createCompanyLink } from '@/company/company';
import { trackJobPostVisited } from '@/jobPost/anaytics/trackJobPostVisited';

const StyledContainer = styled(Container)`
    padding: 0 8px;

    @media ${Device.laptopL} {
        padding: 0;
    }
`;

const StyledCompanyImage = styled(CompanyImage)`
    display: none;
    height: 100%;

    @media ${Device.tablet} {
        display: block;
    }
`;

const Header = styled.div`
    align-items: center;
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2rem;
    margin-top: 2rem;
    min-height: 115px;
`;

const JobInfo = styled.div`
    flex: 1;
`;

const Title = styled.h1`
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: #ffffff;
`;

const Company = styled(Link)`
    font-size: 1.25rem;
    margin: 0 0 0.5rem 0;
    color: #a0a0a0;
`;

const MetaInfo = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #a0a0a0;
`;

const Description = styled.div`
    color: #d0d0d0;
    line-height: 1.6;
`;

const Actions = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #3d3d3d;
`;

const Button = styled.a`
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;

    &.primary {
        background-color: #1976d2;
        color: white;

        &:hover {
            background-color: #1565c0;
        }
    }

    &.secondary {
        color: #a0a0a0;

        &:hover {
            color: #ffffff;
        }
    }
`;

const NotFoundContentContainer = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 2rem;
`;

const NotFoundContent = () => {
    return (
        <StyledContainer>
            <NotFoundContentContainer>
                <Title>404</Title>
                <Description>Not found</Description>
            </NotFoundContentContainer>
        </StyledContainer>
    );
};

const CategoryContainer = styled.div`
    display: flex;
    margin-bottom: 1.5rem;
`;

const SalaryContainer = styled.div`
    display: flex;
    margin-bottom: 1.5rem;
`;

const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
`;

const Spinner = styled.div`
    width: 40px;
    height: 40px;
    border: 4px solid #3d3d3d;
    border-top: 4px solid #1976d2;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const getJobTitle = (job: JobPost) => {
    return `${job.title} at ${job.company?.name || 'Company'}`;
};

const getJobDescription = (title: string, job: JobPost) => {
    const workplace =
        job.workplace && job.workplace !== 'unknown'
            ? `. ${job.workplace} workplace`
            : '';
    const location =
        job.location && job.location !== 'unknown'
            ? `. Located in ${job.location}`
            : '';
    const type =
        job.type && job.type !== 'unknown' ? `. ${job.type} position` : '';

    return `${title}${workplace}${location}${type}.`;
};

const updateMetadata = (job: JobPost) => {
    const title = getJobTitle(job);
    const description = getJobDescription(title, job);

    document.title = `${title} | JobMeerkat`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.setAttribute('content', title);
    }

    const ogDescription = document.querySelector(
        'meta[property="og:description"]',
    );
    if (ogDescription) {
        ogDescription.setAttribute('content', description);
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && job.company?.logo) {
        ogImage.setAttribute('content', job.company.logo.url);
    }

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
        twitterTitle.setAttribute('content', title);
    }

    const twitterDescription = document.querySelector(
        'meta[name="twitter:description"]',
    );
    if (twitterDescription) {
        twitterDescription.setAttribute('content', description);
    }

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage && job.company?.logo) {
        twitterImage.setAttribute('content', job.company.logo.url);
    }
};

const NotFound = () => {
    const pathname = usePathname();
    const [, jobTag, slug] = pathname.split('/');
    const [isLoading, setIsLoading] = useState(true);
    const [job, setJob] = useState<JobPost | null>(null);
    const [loadingError, setLoadingError] = useState<boolean>(false);
    const isJobPost = jobTag === 'job';

    useEffect(() => {
        if (isJobPost && slug) {
            getJobPostBySlug(slug)
                .then((job) => {
                    setJob(job);
                    updateMetadata(job);
                })
                .catch(() => {
                    setLoadingError(true);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [isJobPost, slug]);

    if (!isJobPost || !slug) {
        return <NotFoundContent />;
    }

    if (isLoading) {
        return (
            <StyledContainer>
                <SpinnerContainer>
                    <Spinner />
                </SpinnerContainer>
            </StyledContainer>
        );
    }

    if (!job || loadingError) {
        return <NotFoundContent />;
    }

    const handleOnTitleClick = () => {
        trackJobPostVisited({ jobPost: job });
    };

    return (
        <StyledContainer>
            <Header>
                {job.company?.logo ? (
                    <StyledCompanyImage company={job.company} $width={80} />
                ) : null}
                <JobInfo>
                    <Title>{job.title}</Title>
                    {job.company ? (
                        <Company
                            href={createCompanyLink({
                                companyId: job.company.id,
                            })}
                        >
                            at {job.company.name}
                        </Company>
                    ) : null}
                </JobInfo>
            </Header>

            <CategoryContainer>
                <Badge>{job.category}</Badge>
            </CategoryContainer>

            {job.salaryRange ? (
                <SalaryContainer>
                    <SalaryRange salaryRange={job.salaryRange} $size="large" />
                </SalaryContainer>
            ) : null}

            <MetaInfo>
                <MetaItem>
                    <span>📍</span>
                    <span>
                        {job.workplace}
                        {job.location ? ` - ${job.location}` : null}
                    </span>
                </MetaItem>
                <MetaItem>
                    <span>💼</span>
                    <span>{job.type}</span>
                </MetaItem>
            </MetaInfo>

            <Actions>
                <Button
                    onClick={handleOnTitleClick}
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="primary"
                >
                    Apply Now
                </Button>
            </Actions>
        </StyledContainer>
    );
};

export default NotFound;
