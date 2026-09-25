'use client';

import styled from 'styled-components';
import { Company } from '@/company/company';
import { delaGothicVarName } from '@/shared/font/constants';
import { Colors, Device } from '@/shared/styles/constants';
import { CompanyImage } from './CompanyImage';

type Props = {
    company: Company;
    showHomePage?: boolean;
};

const Header = styled.div`
    display: flex;
    margin: 40px 0 28px;

    @media ${Device.tablet} {
        margin: 48px 0 32px;
    }
`;

const CompanyName = styled.h1`
    font-family: var(${delaGothicVarName});
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 1.15;
`;

const CompanyUrl = styled.a`
    color: ${Colors.mediumGrey};
    font-size: 15px;
    margin-top: 6px;

    &:hover {
        color: ${Colors.accent};
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 2px;
    }
`;

const CompanyInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 20px;
    min-width: 0;
`;

export const CompanyHeader = ({ company, showHomePage = true }: Props) => (
    <Header>
        <CompanyImage company={company} $width={64} $sameSize />
        <CompanyInfo>
            <CompanyName>{company.name}</CompanyName>
            {showHomePage ? (
                <CompanyUrl target="_blank" href={company.homePage}>
                    {company.homePage}
                </CompanyUrl>
            ) : null}
        </CompanyInfo>
    </Header>
);
