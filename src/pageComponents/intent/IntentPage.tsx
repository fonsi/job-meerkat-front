'use client';

import { CategoryTree } from '@/category/category';
import { Company } from '@/company/company';
import { CompanyList } from '@/company/layout/CompanyList';
import { IntentDefinition } from '@/intent/intents';
import { SortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { IntentHeader } from '@/pageComponents/intent/IntentHeader';
import { JobPostsListWithCategories } from '@/shared/layout/JobPostsListWithCategories';
import styled from 'styled-components';

type JobsProps = {
    intent: IntentDefinition;
    kind: 'jobs';
    jobPosts: SortedJobPosts;
    categoryTree: CategoryTree;
    resultCount: number;
};

type CompaniesProps = {
    intent: IntentDefinition;
    kind: 'companies';
    companies: Company[];
    resultCount: number;
};

type Props = JobsProps | CompaniesProps;

const CompaniesWrap = styled.div`
    padding-bottom: 48px;
`;

export const IntentPage = (props: Props) => {
    const resultLabel =
        props.kind === 'companies'
            ? `${props.resultCount} compan${props.resultCount === 1 ? 'y' : 'ies'} with public salaries`
            : `${props.resultCount} open role${props.resultCount === 1 ? '' : 's'} with public salaries`;

    return (
        <>
            <IntentHeader
                title={props.intent.h1}
                description={props.intent.description}
                resultLabel={resultLabel}
            />
            {props.kind === 'jobs' ? (
                <JobPostsListWithCategories
                    jobPosts={props.jobPosts}
                    categoryTree={props.categoryTree}
                />
            ) : (
                <CompaniesWrap>
                    <CompanyList companies={props.companies} />
                </CompaniesWrap>
            )}
        </>
    );
};
