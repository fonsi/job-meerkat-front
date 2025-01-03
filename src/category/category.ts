export type CategoryTree = Array<{
    name: string;
    categories: WebCategory[];
}>;

export type WebCategory = {
    name: string;
    slug: string;
};

type GetCategoriesBySlug = {
    categories: CategoryTree;
    slug: string;
};

export const flattenCategoryTree = (
    categoryTree: CategoryTree,
): WebCategory[] =>
    categoryTree.reduce((acc, categoryRoot) => {
        return [...acc, ...categoryRoot.categories];
    }, [] as WebCategory[]);

export const getWebCategoryBySlug = ({
    categories,
    slug,
}: GetCategoriesBySlug) =>
    flattenCategoryTree(categories).find((category) => category.slug === slug);
