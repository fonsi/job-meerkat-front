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
    grid-auto-rows: minmax(70px, auto);
    grid-gap: 16px;
    grid-template-columns: repeat(1, 1fr);
    list-style-type: none;

    @media ${Device.mobileL} {
        grid-template-columns: repeat(2, 1fr);
    }

    @media ${Device.tablet} {
        grid-template-columns: repeat(3, 1fr);
    }

    @media ${Device.laptop} {
        grid-template-columns: repeat(4, 1fr);
    }
`;

const StyledCompanyImage = styled(CompanyImage)`
    height: 50px;
    width: 50px;

    @media ${Device.mobileL} {
        flex-grow: 1;
        height: 70px;
        width: 70px;
    }
`;

const StyledLink = styled(Link)`
    align-items: center;
    border: 1px solid ${Colors.darkGrey};
    border-radius: 4px;
    display: flex;
    gap: 12px;
    padding: 12px;
    transition: background-color 0.1s ease-in;

    &:hover {
        background-color: ${Colors.darkGrey};
        text-decoration: none;
    }

    @media ${Device.mobileL} {
        flex-direction: column;
        gap: unset;
        height: 200px;
    }
`;

const CompanyTexts = styled.div`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    @media ${Device.mobileL} {
        align-items: center;
        flex-grow: 0;
    }
`;

const CompanyName = styled.h2`
    font-size: 18px;
    line-height: 100%;
    margin-top: 4px;
    text-align: left;

    @media ${Device.mobileL} {
        font-size: 20px;
        text-align: center;
    }

    @media ${Device.laptop} {
        font-size: 24px;
    }
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
                        <CompanyTexts>
                            <CompanyName>{company.name}</CompanyName>
                            <OpenJobPosts>
                                {company.jobPostsCount
                                    ? `${company.jobPostsCount} open job posts`
                                    : 'No open job posts'}
                            </OpenJobPosts>
                        </CompanyTexts>
                    </StyledLink>
                </li>
            ))}
        </List>
    );
};
