'use client';

import styled from 'styled-components';
import { Link, useRouterState } from '@tanstack/react-router';
import { CategoryTree } from '@/category/category';
import {
    isActiveCategory,
    makeCategoryHref,
} from '@/category/layout/activeCategory';
import { Colors } from '@/shared/styles/constants';

type Props = {
    categoryTree: CategoryTree;
    className?: string;
};

const CategoryTreeContainer = styled.nav`
    display: flex;
    flex-direction: column;
`;

const CategoryGroup = styled.ul`
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
`;

const CategoryGroupTitle = styled.li`
    border-bottom: 1px solid ${Colors.darkGrey};
    color: ${Colors.mediumGrey};
    display: flex;
    margin-bottom: 4px;
    padding: 4px 12px;
`;

const Category = styled.li<{ $isActive: boolean }>`
    display: flex;
    padding: 4px 0 4px 20px;
    font-weight: ${(props) => (props.$isActive ? 900 : 400)};
`;

export const CategorySelector = ({ categoryTree, className }: Props) => {
    const pathname = useRouterState({
        select: (state) => state.location.pathname,
    });

    return (
        <CategoryTreeContainer className={className}>
            {categoryTree.map((categoryGroup) => (
                <CategoryGroup key={categoryGroup.name}>
                    <CategoryGroupTitle>
                        {categoryGroup.name}
                    </CategoryGroupTitle>
                    {categoryGroup.categories.map((category) => {
                        const href = makeCategoryHref(category);
                        const isActive = isActiveCategory({ href, pathname });

                        return (
                            <Category key={category.slug} $isActive={isActive}>
                                <Link to={href}>{category.name}</Link>
                            </Category>
                        );
                    })}
                </CategoryGroup>
            ))}
        </CategoryTreeContainer>
    );
};
