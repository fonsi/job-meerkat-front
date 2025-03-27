import { flattenCategoryTree, getWebCategoryBySlug } from '@/category/category';
import { getCategories } from '@/category/http/getCategories';
import { getJobPostsByCategory } from '@/jobPost/getJobPostsByCategory';
import { getSortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { getJobPosts } from '@/jobPost/http/getJobPosts';
import { CategoryPage } from '@/pageComponents/category/CategoryPage';
import { Container } from '@/shared/layout/Container';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isProd } from '@/shared/environment/isProd';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    console.log('Generating metadata for category pages');
    const { slug } = await params;
    const categoryTree = await getCategories();
    const category = getWebCategoryBySlug({ categories: categoryTree, slug });

    if (!category) {
        notFound();
    }

    return {
        title: `${category.name} open positions | Jobmeerkat`,
        description: `Explore top ${category.name} jobs with JobMeerkat! Find the best remote opportunities tailored to your skills. Most job listings include public salaries, so you know what to expect. Join the Meerkat community and take the next step in your ${category.name} career today!`,
        robots: {
            index: isProd,
            follow: isProd,
        },
    };
}

export async function generateStaticParams() {
    console.log('Generating static params for category pages');
    const categoryTree = await getCategories();
    const flattenCategories = flattenCategoryTree(categoryTree);

    return flattenCategories.map((category) => ({
        slug: category.slug,
    }));
}

const Category = async ({ params }: Props) => {
    const { slug } = await params;
    console.log('Rendering category page', slug);
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
