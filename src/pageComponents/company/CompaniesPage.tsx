'use client';

import styled from 'styled-components';
import {
    Company,
    isCompanyDisabled,
    sortCompaniesByName,
} from '@/company/company';
import { CompanyList } from '@/company/layout/CompanyList';
import { PageHeader } from '@/shared/layout/PageHeader';
import { delaGothicVarName } from '@/shared/font/constants';
import { Device } from '@/shared/styles/constants';

type Props = {
    companies: Company[];
};

const Page = styled.div`
    margin-bottom: 48px;
`;

const Section = styled.section`
    & + & {
        margin-top: 64px;
    }
`;

const SectionTitle = styled.h2`
    font-family: var(${delaGothicVarName});
    font-size: 20px;
    font-weight: 400;
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
        <Page>
            <PageHeader
                title="Companies"
                description="Employers tracked on Jobmeerkat — browse open roles with public salaries when they publish pay."
            />
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
        </Page>
    );
};
