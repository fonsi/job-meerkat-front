'use client';

import styled from 'styled-components';
import { Company } from '@/company/company';
import { Colors, Device } from '@/shared/styles/constants';
import { CompanyImage } from './CompanyImage';

type Props = {
    company: Company;
};

const Header = styled.div`
    display: flex;
    margin: 24px 8px;

    @media ${Device.tablet} {
        margin: 48px 8px;
    }
`;

const CompanyName = styled.h1`
    font-size: 24px;

    @media ${Device.tablet} {
        font-size: 48px;
    }
`;

const CompanyUrl = styled.a`
    color: ${Colors.mediumGrey};
    font-size: 16px;
`;

const CompanyInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 24px;
`;

export const CompanyHeader = ({ company }: Props) => (
    <Header>
        <CompanyImage company={company} />
        <CompanyInfo>
            <CompanyName>{company.name}</CompanyName>
            <CompanyUrl target="_blank" href={company.homePage}>
                {company.homePage}
            </CompanyUrl>
        </CompanyInfo>
    </Header>
);
