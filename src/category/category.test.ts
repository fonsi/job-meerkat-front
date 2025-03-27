import {
    CategoryTree,
    flattenCategoryTree,
    getWebCategoryBySlug,
} from './category';

const categoryTree: CategoryTree = [
    {
        name: 'engineering',
        categories: [
            {
                name: 'Frontend',
                slug: 'frontend',
            },
            {
                name: 'Backend',
                slug: 'backend',
            },
        ],
    },
    {
        name: 'product',
        categories: [
            {
                name: 'Design',
                slug: 'design',
            },
        ],
    },
];

describe('category', () => {
    describe('flattenCategoryTree', () => {
        test('should return all categories in a single array', () => {
            const expectedCategories = [
                {
                    name: 'Frontend',
                    slug: 'frontend',
                },
                {
                    name: 'Backend',
                    slug: 'backend',
                },
                {
                    name: 'Design',
                    slug: 'design',
                },
            ];

            expect(flattenCategoryTree(categoryTree)).toEqual(
                expectedCategories,
            );
        });

        test('should return all categories in a single array if a categories array is empty', () => {
            const categoryTreeWithEmptyArray = [
                categoryTree[0],
                {
                    name: 'product',
                    categories: [],
                },
            ];
            const expectedCategories = [
                {
                    name: 'Frontend',
                    slug: 'frontend',
                },
                {
                    name: 'Backend',
                    slug: 'backend',
                },
            ];

            expect(flattenCategoryTree(categoryTreeWithEmptyArray)).toEqual(
                expectedCategories,
            );
        });

        test('should return an empty array if the category tree is empty', () => {
            const emptyCategoryTree: CategoryTree = [];
            const expectedCategories: string[] = [];

            expect(flattenCategoryTree(emptyCategoryTree)).toEqual(
                expectedCategories,
            );
        });
    });

    describe('getWebCategoryBySlug', () => {
        test('should return the category by slug', () => {
            const frontendCategory = {
                name: 'Frontend',
                slug: 'frontend',
            };

            expect(
                getWebCategoryBySlug({
                    categories: categoryTree,
                    slug: 'frontend',
                }),
            ).toEqual(frontendCategory);
        });

        test('should return undefined if no category is found', () => {
            expect(
                getWebCategoryBySlug({
                    categories: categoryTree,
                    slug: 'unknown',
                }),
            ).toBeUndefined();
        });

        test('should return undefined if there are no categories', () => {
            expect(
                getWebCategoryBySlug({ categories: [], slug: 'frontend' }),
            ).toBeUndefined();
        });
    });
});
