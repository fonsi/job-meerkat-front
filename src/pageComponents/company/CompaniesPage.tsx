'use client';

import { useState } from 'react';
import styled from 'styled-components';
import {
    Company,
    CompanySortBy,
    filterCompaniesByName,
    isCompanyDisabled,
    sortCompanies,
} from '@/company/company';
import { CompanyList } from '@/company/layout/CompanyList';
import { PageHeader } from '@/shared/layout/PageHeader';
import { delaGothicVarName } from '@/shared/font/constants';
import { Colors, Device } from '@/shared/styles/constants';

type Props = {
    companies: Company[];
};

const Page = styled.div`
    margin-bottom: 48px;
`;

const Toolbar = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 28px;

    @media ${Device.tablet} {
        align-items: center;
        flex-direction: row;
        gap: 16px;
        margin-bottom: 32px;
    }
`;

const SearchInput = styled.input`
    background: transparent;
    border: 1px solid ${Colors.darkGrey};
    border-radius: 4px;
    color: ${Colors.brokenWhite};
    flex: 1;
    font-size: 15px;
    min-width: 0;
    padding: 10px 12px;

    &::placeholder {
        color: ${Colors.mediumGrey};
    }

    &:focus {
        border-color: ${Colors.mediumGrey};
        outline: none;
    }
`;

const SortField = styled.label`
    align-items: center;
    color: ${Colors.mediumGrey};
    display: flex;
    flex-shrink: 0;
    font-size: 13px;
    gap: 8px;
`;

const SortSelect = styled.select`
    appearance: none;
    background-color: transparent;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%23fefefe' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-position: right 12px center;
    background-repeat: no-repeat;
    border: 1px solid ${Colors.darkGrey};
    border-radius: 4px;
    color: ${Colors.brokenWhite};
    font-size: 14px;
    line-height: 1.2;
    padding: 10px 36px 10px 12px;

    &:focus {
        border-color: ${Colors.mediumGrey};
        outline: none;
    }
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

const EmptyState = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 15px;
    margin: 0;
`;

const SORT_OPTIONS: { value: CompanySortBy; label: string }[] = [
    { value: 'createdAt', label: 'Latest added' },
    { value: 'name', label: 'Name' },
    { value: 'jobPostsCount', label: 'Open job posts' },
];

export const CompaniesPage = ({ companies }: Props) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<CompanySortBy>('createdAt');

    const filteredCompanies = filterCompaniesByName({
        companies,
        query: searchQuery,
    });
    const activeCompanies = sortCompanies({
        companies: filteredCompanies.filter(
            (company) => !isCompanyDisabled(company),
        ),
        sortBy,
        query: searchQuery,
    });
    const disabledCompanies = sortCompanies({
        companies: filteredCompanies.filter(isCompanyDisabled),
        sortBy,
        query: searchQuery,
    });

    return (
        <Page>
            <PageHeader
                title="Companies"
                description="Employers tracked on Jobmeerkat — browse open roles with public salaries when they publish pay."
            />
            <Toolbar>
                <SearchInput
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search companies by name"
                    aria-label="Search companies by name"
                />
                <SortField>
                    Sort by
                    <SortSelect
                        value={sortBy}
                        onChange={(event) =>
                            setSortBy(event.target.value as CompanySortBy)
                        }
                        aria-label="Sort companies"
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </SortSelect>
                </SortField>
            </Toolbar>
            <Section>
                {activeCompanies.length > 0 ? (
                    <CompanyList companies={activeCompanies} />
                ) : (
                    <EmptyState>
                        {searchQuery.trim()
                            ? 'No companies match your search.'
                            : 'No companies yet.'}
                    </EmptyState>
                )}
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
