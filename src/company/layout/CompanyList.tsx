'use client';

import Link from 'next/link';
import { Company, createCompanyLink } from '../company';
import { CompanyImage } from './CompanyImage';
import styled from 'styled-components';
import { Colors, Device } from '@/shared/styles/constants';

type Params = {
    companies: Company[];
};

const List = styled.ul`
    display: grid;
    grid-auto-rows: minmax(100px, auto);
    grid-gap: 16px;
    grid-template-columns: repeat(1, 1fr);
    list-style-type: none;

    @media ${Device.mobileL} {
        grid-template-columns: repeat(2, 1fr);
    }

    @media ${Device.laptop} {
        grid-template-columns: repeat(4, 1fr);
    }
`;

const StyledCompanyImage = styled(CompanyImage)`
    flex-grow: 1;
`;

const StyledLink = styled(Link)`
    align-items: center;
    border: 1px solid ${Colors.mediumGrey};
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    height: 200px;
    padding: 12px;
    transition: background-color 0.1s ease-in;

    &:hover {
        background-color: ${Colors.darkGrey};
        text-decoration: none;
    }
`;

const CompanyName = styled.h2`
    line-height: 100%;
    margin-top: 4px;
    text-align: center;
`;

const OpenJobPosts = styled.div`
    color: ${Colors.mediumGrey};
    font-size: 13px;
    margin-top: 6px;
`;

export const CompanyList = ({ companies }: Params) => {
    return (
        <List>
            {companies.map((company) => (
                <li key={company.id}>
                    <StyledLink
                        href={createCompanyLink({ companyId: company.id })}
                    >
                        <StyledCompanyImage company={company} $width={80} />
                        <CompanyName>{company.name}</CompanyName>
                        <OpenJobPosts>
                            {company.jobPostsCount
                                ? `${company.jobPostsCount} open job posts`
                                : 'No open job posts'}
                        </OpenJobPosts>
                    </StyledLink>
                </li>
            ))}
        </List>
    );
};
