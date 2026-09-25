'use client';

import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import type { CategoryTree } from '@/category/category';
import { makeCategoryHref } from '@/category/layout/activeCategory';
import { Colors, Device } from '@/shared/styles/constants';
import {
    HomeSection,
    SectionEyebrow,
    SectionHead,
    SectionIntro,
    SectionTitle,
} from './homeLayout';

type Props = {
    categoryTree: CategoryTree;
};

const Groups = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
`;

const Group = styled.div`
    display: grid;
    gap: 14px;

    @media ${Device.tablet} {
        align-items: start;
        gap: 24px;
        grid-template-columns: 160px minmax(0, 1fr);
    }
`;

const GroupTitle = styled.h3`
    color: ${Colors.mediumGrey};
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    padding-top: 8px;
    text-transform: uppercase;
`;

const ChipList = styled.ul`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    list-style: none;
`;

const CategoryLink = styled(Link).attrs({ reloadDocument: true })`
    background: transparent;
    border: 1px solid ${Colors.darkGrey};
    border-radius: 999px;
    display: inline-flex;
    font-size: 14px;
    font-weight: 600;
    padding: 10px 14px;
    transition:
        border-color 0.15s ease,
        background-color 0.15s ease,
        color 0.15s ease;

    &:hover {
        background-color: ${Colors.accent};
        border-color: ${Colors.accent};
        color: ${Colors.brokenBlack};
        text-decoration: none;
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 2px;
    }
`;

export const HomeCategories = ({ categoryTree }: Props) => (
    <HomeSection id="browse-categories">
        <SectionHead>
            <div>
                <SectionEyebrow>Categories</SectionEyebrow>
                <SectionTitle>Browse by category</SectionTitle>
            </div>
            <SectionIntro>Find roles by the kind of work you do.</SectionIntro>
        </SectionHead>
        <Groups>
            {categoryTree.map((group) => (
                <Group key={group.name}>
                    <GroupTitle>{group.name}</GroupTitle>
                    <ChipList>
                        {group.categories.map((category) => (
                            <li key={category.slug}>
                                <CategoryLink to={makeCategoryHref(category)}>
                                    {category.name}
                                </CategoryLink>
                            </li>
                        ))}
                    </ChipList>
                </Group>
            ))}
        </Groups>
    </HomeSection>
);
