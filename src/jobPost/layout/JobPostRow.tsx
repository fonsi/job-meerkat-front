'use client'

import styled from 'styled-components';
import Link from 'next/link';
import { Colors, Device } from '@/shared/styles/constants';
import { JobPost } from '../http/getJobPosts';
import { SalaryRange } from './SalaryRange';

type Props = {
    jobPost: JobPost;
}

const StyledJobPostRow = styled.li`
    border-bottom: 1px solid ${Colors.mediumGrey};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px 8px;

    @media ${Device.tablet} { 
        flex-direction: row;
    }
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const TitleContainer = styled.div`
    align-items: baseline;
    display: flex;
    flex-direction: column;
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
        margin-top: 0;
    }
`;

const PublishDate = styled.span`
    color: ${Colors.mediumGrey};
    text-align: right;
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
            {
                jobPost.company ?
                    <Company href={`/company/${jobPost.company.id}`}>{jobPost.company.name}</Company> :
                    null
            }
            <Title target='_blank' href={jobPost.url}>{ jobPost.title }</Title>
        </TitleContainer>
        <LocationContainer>
            <span>{jobPost.workplace}</span>
            {
                jobPost.location ?
                    <span>&nbsp;-&nbsp;{jobPost.location}</span> :
                    null
            }
            {
                jobPost.type ?
                    <span>&nbsp;-&nbsp;{jobPost.type}</span>:
                    null
            }
        </LocationContainer>
    </InfoContainer>
    {
        jobPost.salaryRange ? 
            <SalaryContainer>
                <SalaryRange salaryRange={jobPost.salaryRange} />
                <PublishDate>{new Date(jobPost.createdAt).toJSON().split('T')[0]}</PublishDate>
            </SalaryContainer>:
            null
    }
</StyledJobPostRow>;