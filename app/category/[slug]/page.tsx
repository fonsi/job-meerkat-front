import { flattenCategoryTree, getWebCategoryBySlug } from '@/category/category';
import { getCategories } from '@/category/http/getCategories';
import { getJobPostsByCategory } from '@/jobPost/getJobPostsByCategory';
import { getSortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { getJobPosts } from '@/jobPost/http/getJobPosts';
import { CategoryPage } from '@/pageComponents/category/CategoryPage';
import { Container } from '@/shared/layout/Container';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const { slug } = await params;
    const categoryTree = await getCategories();
    const category = getWebCategoryBySlug({ categories: categoryTree, slug });

    if (!category) {
        notFound();
    }

    const parentMetadata = ((await parent) || {}) as Metadata;

    return {
        ...parentMetadata,
        title: `${category.name} open positions | Jobmeerkat`,
        description: `Explore ${category!.name} open positions. Find here the next step in your ${category.name} career.`,
    };
}

export async function generateStaticParams() {
    const categoryTree = await getCategories();
    const flattenCategories = flattenCategoryTree(categoryTree);

    return flattenCategories.map((category) => ({
        slug: category.slug,
    }));
}

const Category = async ({ params }: Props) => {
    const { slug } = await params;
    const categoryTree = await getCategories();
    const category = getWebCategoryBySlug({ categories: categoryTree, slug });

    if (!category) {
        notFound();
    }

    const jobPosts = await getJobPosts();
    const categoryJobPosts = getJobPostsByCategory({
        jobPosts,
        category: category.name,
    });
    const sortedJobPosts = getSortedJobPosts(categoryJobPosts);

    return (
        <Container>
            <CategoryPage
                jobPosts={sortedJobPosts}
                categoryTree={categoryTree}
            />
        </Container>
    );
};

export default Category;