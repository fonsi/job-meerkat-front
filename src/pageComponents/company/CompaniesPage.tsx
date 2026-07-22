'use client';

import styled from 'styled-components';
import {
    Company,
    isCompanyDisabled,
    sortCompaniesByName,
} from '@/company/company';
import { Device } from '@/shared/styles/constants';
import { CompanyList } from '@/company/layout/CompanyList';

type Props = {
    companies: Company[];
};

const Container = styled.div`
    margin: 48px 12px;

    @media ${Device.laptopL} {
        margin: 48px 0;
    }
`;

const Section = styled.section`
    & + & {
        margin-top: 64px;
    }
`;

const SectionTitle = styled.h2`
    font-size: 20px;
    margin: 0 0 24px;

    @media ${Device.tablet} {
        font-size: 24px;
    }
`;

export const CompaniesPage = ({ companies }: Props) => {
    const activeCompanies = sortCompaniesByName({
        companies: companies.filter((company) => !isCompanyDisabled(company)),
    });
    const disabledCompanies = sortCompaniesByName({
        companies: companies.filter(isCompanyDisabled),
    });

    return (
        <Container>
            <Section>
                <CompanyList companies={activeCompanies} />
            </Section>
            {disabledCompanies.length > 0 ? (
                <Section>
                    <SectionTitle>No longer hiring</SectionTitle>
                    <CompanyList
                        companies={disabledCompanies}
                        showAddCompany={false}
                        showJobPostsCount={false}
                    />
                </Section>
            ) : null}
        </Container>
    );
};
