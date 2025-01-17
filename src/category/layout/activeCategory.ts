import { CategoryTree, flattenCategoryTree, WebCategory } from '../category';

type IsActiveCategoryParams = {
    href: string;
    pathname: string;
};

type GetActiveCategoryNameParams = {
    categoryTree: CategoryTree;
    pathname: string;
};

export const isActiveCategory = ({
    href,
    pathname,
}: IsActiveCategoryParams): boolean => pathname.includes(href);

export const getActiveCategory = ({
    categoryTree,
    pathname,
}: GetActiveCategoryNameParams): WebCategory | undefined => {
    const categories = flattenCategoryTree(categoryTree);

    return categories.find((category) =>
        isActiveCategory({ pathname, href: makeCategoryHref(category) }),
    );
};

export const makeCategoryHref = (category: WebCategory): string =>
    `/category/${category.slug}`;
