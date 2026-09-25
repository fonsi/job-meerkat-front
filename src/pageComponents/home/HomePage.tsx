import type { CategoryTree } from '@/category/category';
import type { Company } from '@/company/company';
import type { JobPost } from '@/jobPost/http/getJobPosts';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { Container } from '@/shared/layout/Container';
import { HomeCategories } from './HomeCategories';
import { HomeCollections } from './HomeCollections';
import { HomeFeaturedCompanies } from './HomeFeaturedCompanies';
import { HomeFreshPicks } from './HomeFreshPicks';
import { HomeHeader } from './HomeHeader';
import { HomeWhyJobmeerkat } from './HomeWhyJobmeerkat';
import { buildHomeJsonLd } from './homeSeo';

type Props = {
    categoryTree: CategoryTree;
    freshPicks: JobPost[];
    featuredCompanies: Company[];
};

const jsonLdScript = (jsonLd: Record<string, unknown>): string =>
    JSON.stringify(jsonLd).replace(/</g, '\\u003c');

export const HomePage = ({
    categoryTree,
    freshPicks,
    featuredCompanies,
}: Props) => {
    const jsonLd = buildHomeJsonLd(getSiteUrl());

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
            />
            <HomeHeader />
            <Container>
                <HomeFreshPicks jobs={freshPicks} />
                <HomeFeaturedCompanies companies={featuredCompanies} />
                <HomeCategories categoryTree={categoryTree} />
                <HomeCollections />
                <HomeWhyJobmeerkat />
            </Container>
        </>
    );
};
