'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { CategoryTree } from '@/category/category';
import { PublishPeriod, SortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { JobPostsList } from '@/jobPost/layout/JobPostList';
import { JobPostsPublishPeriod } from '@/jobPost/layout/JobPostsPublishPeriod';
import { CategorySelector } from '@/pageComponents/category/CategorySelector';
import { Colors, Device } from '../styles/constants';
import { Segment } from '../image/icons/Segment';
import { getActiveCategory } from '@/category/layout/activeCategory';
import {
    countJobsMatchingFilters,
    flattenSortedJobPosts,
    JobListFilters,
    PASSTHROUGH_JOB_LIST_FILTERS,
    resolveInitialJobListFilters,
} from '@/jobPost/jobListFilters';
import { JobListFiltersControls } from '@/jobPost/layout/JobListFiltersControls';
import { EmptyJobListFiltersMessage } from '@/jobPost/layout/EmptyJobListFiltersMessage';

type Props = {
    jobPosts: SortedJobPosts;
    categoryTree: CategoryTree;
    showJobListFilters?: boolean;
};

const foldableCategorySelectorBreakpoint = Device.tablet;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;

    @media ${foldableCategorySelectorBreakpoint} {
        flex-direction: row;
    }
`;

const CategoriesContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
`;

const CategoriesTitle = styled.div`
    align-items: center;
    background-color: ${Colors.brokenWhite};
    border-radius: 2px;
    color: ${Colors.darkGrey};
    display: none;
    font-size: 14px;
    gap: 6px;
    margin: 12px 0;
    padding: 12px 8px;

    svg {
        height: 20px;
        width: 20px;
    }

    @media ${foldableCategorySelectorBreakpoint} {
        display: flex;
    }
`;

const FoldableCategoriesTitle = styled.div<{ $isUnfolded: boolean }>`
    align-items: center;
    background-color: ${(props) =>
        props.$isUnfolded ? Colors.darkGrey : 'unset'};
    border-radius: 2px;
    color: ${Colors.brokenWhite};
    display: flex;
    font-size: 14px;
    gap: 6px;
    padding: 8px 8px 0;

    svg {
        height: 20px;
        width: 20px;
    }

    @media ${foldableCategorySelectorBreakpoint} {
        display: none;
    }
`;

const FiltersPanel = styled.div<{ $isUnfolded: boolean }>`
    background-color: ${Colors.darkGrey};
    display: ${(props) => (props.$isUnfolded ? 'flex' : 'none')};
    flex-direction: column;

    @media ${foldableCategorySelectorBreakpoint} {
        background-color: unset;
        display: flex;
    }
`;

const StyledCategorySelector = styled(CategorySelector)`
    padding: 8px 24px;

    @media ${foldableCategorySelectorBreakpoint} {
        padding: 0;
    }
`;

const StyledJobListFiltersControls = styled(JobListFiltersControls)`
    border-bottom: 1px solid ${Colors.darkGrey};
    margin: 8px 12px 16px;
    padding-bottom: 16px;

    @media ${foldableCategorySelectorBreakpoint} {
        margin: 0 0 20px;
        padding-bottom: 20px;
    }
`;

const JobsColumn = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
`;

const StyledJobPostList = styled(JobPostsList)`
    flex-grow: 1;
`;

export const JobPostsListWithCategories = ({
    jobPosts,
    categoryTree,
    showJobListFilters = false,
}: Props) => {
    const pathname = useRouterState({
        select: (state) => state.location.pathname,
    });
    const [isCategorySelectorUnfolded, setIsCategorySelectorUnfolded] =
        useState(false);
    const [filters, setFilters] = useState<JobListFilters>(() =>
        showJobListFilters
            ? resolveInitialJobListFilters(flattenSortedJobPosts(jobPosts))
            : PASSTHROUGH_JOB_LIST_FILTERS,
    );

    const activeCategory = getActiveCategory({ categoryTree, pathname });
    const flatJobPosts = flattenSortedJobPosts(jobPosts);
    const activeFilters = showJobListFilters
        ? filters
        : PASSTHROUGH_JOB_LIST_FILTERS;
    const hasVisibleJobPosts =
        countJobsMatchingFilters(flatJobPosts, activeFilters) > 0;

    return (
        <Container>
            <CategoriesContainer>
                <CategoriesTitle>
                    <Segment /> Filter
                </CategoriesTitle>
                <FoldableCategoriesTitle
                    $isUnfolded={isCategorySelectorUnfolded}
                    onClick={() =>
                        setIsCategorySelectorUnfolded(
                            !isCategorySelectorUnfolded,
                        )
                    }
                >
                    <Segment />
                    {activeCategory ? (
                        <>
                            You are viewing{' '}
                            <strong>{activeCategory.name}</strong> job posts
                        </>
                    ) : (
                        'Filter job posts...'
                    )}
                </FoldableCategoriesTitle>
                <FiltersPanel $isUnfolded={isCategorySelectorUnfolded}>
                    {showJobListFilters ? (
                        <StyledJobListFiltersControls
                            filters={filters}
                            jobPosts={flatJobPosts}
                            onChange={setFilters}
                        />
                    ) : null}
                    <StyledCategorySelector categoryTree={categoryTree} />
                </FiltersPanel>
            </CategoriesContainer>
            <JobsColumn>
                <StyledJobPostList>
                    <JobPostsPublishPeriod
                        jobPosts={jobPosts[PublishPeriod.LastDay]}
                        title="Last 24 hours"
                        filters={activeFilters}
                    />
                    <JobPostsPublishPeriod
                        jobPosts={jobPosts[PublishPeriod.LastSevenDays]}
                        title="Last 7 days"
                        filters={activeFilters}
                    />
                    <JobPostsPublishPeriod
                        jobPosts={jobPosts[PublishPeriod.LastThirtyDays]}
                        title="Last 30 days"
                        filters={activeFilters}
                    />
                    <JobPostsPublishPeriod
                        jobPosts={jobPosts[PublishPeriod.BeforeLastThirtyDays]}
                        title="More than 30 days ago"
                        filters={activeFilters}
                    />
                </StyledJobPostList>
                {showJobListFilters &&
                !hasVisibleJobPosts &&
                flatJobPosts.length > 0 ? (
                    <EmptyJobListFiltersMessage />
                ) : null}
            </JobsColumn>
        </Container>
    );
};
