'use client'

import styled from 'styled-components';
import Link from 'next/link';
import { Colors } from '@/shared/styles/constants';
import { JobPost } from '../http/getJobPosts';
import { SalaryRange } from './SalaryRange';

type Props = {
    jobPost: JobPost;
}

const StyledJobPostRow = styled.li`
    border-bottom: 1px solid ${Colors.mediumGrey};
    display: flex;
    justify-content: space-between;
    padding: 16px 8px;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const TitleContainer = styled.div`
    align-items: baseline;
    display: flex;
`;

const Title = styled(Link)`
    font-size: 18px;
    font-weight: 600;
`;

const Company = styled(Link)`
    color: ${Colors.mediumGrey};
    margin-left: 12px;
`;

const SalaryContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const JobType = styled.span`
    color: ${Colors.mediumGrey};
    text-align: right;
    margin-top: 4px;
`;

const LocationContainer = styled.div`
    color: ${Colors.mediumGrey};
    display: flex;
    font-weight: 300;
    margin-top: 4px;
`;

export const JobPostRow = ({ jobPost }: Props) => <StyledJobPostRow>
    <InfoContainer>
        <TitleContainer>
            <Title target='_blank' href={jobPost.url}>{ jobPost.title }</Title>
            {
                jobPost.company ?
                    <Company href={`/company/${jobPost.company.id}`}>{jobPost.company.name}</Company> :
                    null
            }
        </TitleContainer>
        <LocationContainer>
            <span>{jobPost.workplace}</span>
            {
                jobPost.location ?
                    <span>&nbsp;-&nbsp;{jobPost.location}</span> :
                    null
            }
        </LocationContainer>
    </InfoContainer>
    {
        jobPost.salaryRange ? 
            <SalaryContainer>
                <SalaryRange salaryRange={jobPost.salaryRange} />
                {
                    jobPost.type ?
                     <JobType>{jobPost.type}</JobType>:
                     null
                }
            </SalaryContainer>:
            null
    }
</StyledJobPostRow>;