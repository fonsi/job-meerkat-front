'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { Colors, Device } from '@/shared/styles/constants';
import { JobPost } from '../jobPost';
import { SalaryRange } from './SalaryRange';
import { CompanyImage } from '@/company/layout/CompanyImage';
import { Badge } from '@/shared/layout/Badge';
import { Place } from '@/shared/image/icons/Place';
import { createCompanyLink } from '@/company/company';
import { trackJobPostVisited } from '../anaytics/trackJobPostVisited';

type Props = {
    jobPost: JobPost;
};

const StyledJobPostRow = styled.li`
    border-bottom: 1px solid ${Colors.darkGrey};
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: flex-start;
    min-height: 110px;
    padding: 24px 8px;

    @media ${Device.tablet} {
        flex-direction: row;
    }
`;

const InfoContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
`;

const Title = styled(Link)`
    font-size: 18px;
    font-weight: 600;
`;

const Company = styled(Link)`
    font-size: 14px;
    font-weight: 300;
    margin-bottom: 4px;
`;

const SalaryContainer = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 16px;

    @media ${Device.tablet} {
        align-items: flex-end;
        flex-direction: column;
        gap: 8px;
        justify-content: flex-start;
        margin-top: 0;
    }
`;

const PublishDate = styled.span`
    text-align: right;
    color: ${Colors.mediumGrey};
    font-size: 12px;

    span {
        display: none;
    }

    @media ${Device.mobileL} {
        span {
            display: unset;
        }
    }
`;

const JobType = styled.span`
    text-align: right;
    color: ${Colors.mediumGrey};
    display: none;
    font-size: 12px;

    @media ${Device.tablet} {
        display: block;
    }
`;

const DetailsContainer = styled.div`
    align-items: center;
    color: ${Colors.mediumGrey};
    display: flex;
    font-size: 14px;
    font-weight: 300;
    gap: 16px;
    margin-top: 8px;
`;

const PlaceContainer = styled.span`
    align-items: center;
    display: flex;

    svg {
        height: 20px;
        margin-right: 4px;
        width: 20px;
    }
`;

export const JobPostRow = ({ jobPost }: Props) => {
    const handleOnTitleClick = () => {
        trackJobPostVisited({ jobPost });
    };

    return (
        <StyledJobPostRow>
            {jobPost.company ? (
                <CompanyImage company={jobPost.company} $width={50} />
            ) : null}
            <InfoContainer>
                <Title
                    onClick={handleOnTitleClick}
                    href={`/job/${jobPost.company.id}_${jobPost.id}`}
                >
                    {jobPost.title}
                </Title>
                {jobPost.company ? (
                    <Company
                        href={createCompanyLink({
                            companyId: jobPost.company.id,
                        })}
                    >
                        at {jobPost.company.name}
                    </Company>
                ) : null}
                <DetailsContainer>
                    <Badge>{jobPost.category}</Badge>
                    <PlaceContainer>
                        <Place />
                        {jobPost.workplace}
                        {jobPost.location ? (
                            <>&nbsp;-&nbsp;{jobPost.location}</>
                        ) : null}
                    </PlaceContainer>
                </DetailsContainer>
            </InfoContainer>
            <SalaryContainer>
                {jobPost.salaryRange ? (
                    <SalaryRange salaryRange={jobPost.salaryRange} />
                ) : (
                    <div></div>
                )}
                <JobType>
                    {jobPost.type ? <span>{jobPost.type}</span> : null}
                </JobType>
                <PublishDate>
                    <span>published on </span>
                    {new Date(jobPost.createdAt).toJSON().split('T')[0]}
                </PublishDate>
            </SalaryContainer>
        </StyledJobPostRow>
    );
};
