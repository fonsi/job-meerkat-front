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
    gap: 16px;

    @media ${foldableCategorySelectorBreakpoint} {
        flex-direction: row;
        gap: 12px;
    }
`;

const CategoriesContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    @media ${foldableCategorySelectorBreakpoint} {
        width: 200px;
    }
`;

const CategoriesTitle = styled.div`
    align-items: center;
    color: ${Colors.lightGrey};
    display: none;
    font-size: 12px;
    font-weight: 700;
    gap: 8px;
    letter-spacing: 0.14em;
    margin: 8px 0 16px;
    text-transform: uppercase;

    svg {
        height: 16px;
        width: 16px;
    }

    @media ${foldableCategorySelectorBreakpoint} {
        display: flex;
    }
`;

const MobileFilterToggle = styled.button<{ $open: boolean }>`
    align-items: center;
    background: ${Colors.darkGrey};
    border: 1px solid
        ${({ $open }) => ($open ? Colors.accent : Colors.mediumGrey)};
    border-radius: 4px;
    color: ${Colors.brokenWhite};
    cursor: pointer;
    display: flex;
    gap: 10px;
    justify-content: space-between;
    padding: 12px 14px;
    text-align: left;
    transition:
        border-color 0.15s ease,
        background-color 0.15s ease;
    width: 100%;

    &:hover {
        border-color: ${Colors.accent};
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 2px;
    }

    @media ${foldableCategorySelectorBreakpoint} {
        display: none;
    }
`;

const MobileFilterLabel = styled.span`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
`;

const MobileFilterEyebrow = styled.span`
    color: ${Colors.mediumGrey};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
`;

const MobileFilterValue = styled.span`
    color: ${Colors.brokenWhite};
    font-size: 16px;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const MobileFilterIcon = styled.span`
    color: ${Colors.mediumGrey};
    display: flex;
    flex-shrink: 0;

    svg {
        height: 18px;
        width: 18px;
    }
`;

const Chevron = styled.span<{ $open: boolean }>`
    color: ${Colors.mediumGrey};
    display: inline-block;
    font-size: 10px;
    line-height: 1;
    transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
    transition: transform 0.15s ease;
`;

const FiltersPanel = styled.div<{ $isUnfolded: boolean }>`
    display: ${(props) => (props.$isUnfolded ? 'flex' : 'none')};
    flex-direction: column;
    gap: 12px;
    margin-top: 8px;

    @media ${foldableCategorySelectorBreakpoint} {
        display: flex;
        margin-top: 0;
    }
`;

const MobilePanel = styled.div`
    background: ${Colors.darkGrey};
    border: 1px solid ${Colors.darkGrey};
    border-radius: 4px;
    padding: 12px 8px 16px;

    @media ${foldableCategorySelectorBreakpoint} {
        background: transparent;
        border: none;
        padding: 0;
    }
`;

const StyledCategorySelector = styled(CategorySelector)`
    @media ${foldableCategorySelectorBreakpoint} {
        padding: 0;
    }
`;

const StyledJobListFiltersControls = styled(JobListFiltersControls)`
    border-bottom: 1px solid ${Colors.mediumGrey};
    margin: 0 4px 16px;
    padding-bottom: 16px;

    @media ${foldableCategorySelectorBreakpoint} {
        border-bottom-color: ${Colors.darkGrey};
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
                <MobileFilterToggle
                    type="button"
                    $open={isCategorySelectorUnfolded}
                    aria-expanded={isCategorySelectorUnfolded}
                    onClick={() =>
                        setIsCategorySelectorUnfolded(
                            !isCategorySelectorUnfolded,
                        )
                    }
                >
                    <MobileFilterIcon>
                        <Segment />
                    </MobileFilterIcon>
                    <MobileFilterLabel>
                        <MobileFilterEyebrow>Category</MobileFilterEyebrow>
                        <MobileFilterValue>
                            {activeCategory?.name ?? 'All categories'}
                        </MobileFilterValue>
                    </MobileFilterLabel>
                    <Chevron $open={isCategorySelectorUnfolded} aria-hidden>
                        ▼
                    </Chevron>
                </MobileFilterToggle>
                <FiltersPanel $isUnfolded={isCategorySelectorUnfolded}>
                    <MobilePanel>
                        {showJobListFilters ? (
                            <StyledJobListFiltersControls
                                filters={filters}
                                jobPosts={flatJobPosts}
                                onChange={setFilters}
                            />
                        ) : null}
                        <StyledCategorySelector categoryTree={categoryTree} />
                    </MobilePanel>
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
