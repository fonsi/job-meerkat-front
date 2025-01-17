'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { CategoryTree } from '@/category/category';
import { PublishPeriod, SortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { JobPostsList } from '@/jobPost/layout/JobPostList';
import { JobPostsPublishPeriod } from '@/jobPost/layout/JobPostsPublishPeriod';
import { CategorySelector } from '@/pageComponents/category/CategorySelector';
import { Colors, Device } from '../styles/constants';
import { Segment } from '../image/icons/Segment';
import { getActiveCategory } from '@/category/layout/activeCategory';

type Props = {
    jobPosts: SortedJobPosts;
    categoryTree: CategoryTree;
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

const StyledCategorySelector = styled(CategorySelector)<{
    $isUnfolded: boolean;
}>`
    background-color: ${Colors.darkGrey};
    display: ${(props) => (props.$isUnfolded ? 'flex' : 'none')};
    padding: 8px 24px;

    @media ${foldableCategorySelectorBreakpoint} {
        background-color: unset;
        display: flex;
        padding: 0;
    }
`;

const StyledJobPostList = styled(JobPostsList)`
    flex-grow: 1;
`;

export const JobPostsListWithCategories = ({
    jobPosts,
    categoryTree,
}: Props) => {
    const pathname = usePathname();
    const [isCategorySelectorUnfolded, setIsCategorySelectorUnfolded] =
        useState(false);

    const activeCategory = getActiveCategory({ categoryTree, pathname });

    return (
        <Container>
            <CategoriesContainer
                onClick={() =>
                    setIsCategorySelectorUnfolded(!isCategorySelectorUnfolded)
                }
            >
                <CategoriesTitle>
                    <Segment /> Filter
                </CategoriesTitle>
                <FoldableCategoriesTitle
                    $isUnfolded={isCategorySelectorUnfolded}
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
                <StyledCategorySelector
                    $isUnfolded={isCategorySelectorUnfolded}
                    categoryTree={categoryTree}
                />
            </CategoriesContainer>
            <StyledJobPostList>
                <JobPostsPublishPeriod
                    jobPosts={jobPosts[PublishPeriod.LastDay]}
                    title="Last 24 hours"
                />
                <JobPostsPublishPeriod
                    jobPosts={jobPosts[PublishPeriod.LastSevenDays]}
                    title="Last 7 days"
                />
                <JobPostsPublishPeriod
                    jobPosts={jobPosts[PublishPeriod.LastThirtyDays]}
                    title="Last 30 days"
                />
                <JobPostsPublishPeriod
                    jobPosts={jobPosts[PublishPeriod.BeforeLastThirtyDays]}
                    title="More than 30 days ago"
                />
            </StyledJobPostList>
        </Container>
    );
};
