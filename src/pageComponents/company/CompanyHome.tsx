'use client'

import { Company } from '@/company/company'
import { JobPost } from '@/jobPost/http/getJobPosts';
import { JobPostsList } from '@/jobPost/layout/JobPostList';
import { JobPostRow } from '@/jobPost/layout/JobPostRow';
import { CompanyHeader } from './CompanyHeader';
import styled from 'styled-components';
import { Colors } from '@/shared/styles/constants';

type Props = {
    company: Company;
    openJobPosts: JobPost[];
}

const OpenPositions = styled.h2`
    border-bottom: 1px solid ${Colors.brokenWhite};
    margin-bottom: 4px;
    padding: 0 8px 16px;
`;

export const CompanyHome = ({ company, openJobPosts }: Props) =>
    <div>
        <CompanyHeader company={company} />
        <OpenPositions>Open positions</OpenPositions>
        <JobPostsList>
        {
            openJobPosts.map(jobPost =>
                <JobPostRow key={jobPost.id} jobPost={jobPost} />
            )
        }
        </JobPostsList>
    </div>