import { render, screen, within } from '@testing-library/react';
import type { CategoryTree } from '@/category/category';
import type { Company } from '@/company/company';
import type { JobPost } from '@/jobPost/http/getJobPosts';
import { INTENT_DEFINITIONS } from '@/intent/intentDefinitions';
import { HomePage } from './HomePage';

jest.mock('./HomeFreshPicks', () => ({
    HomeFreshPicks: ({
        jobs,
    }: {
        jobs: Array<{ id: string; slug: string; title: string }>;
    }) => (
        <section>
            <h2>Pay first. Then the role.</h2>
            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        <a href={`/jobpost/${job.slug}`}>{job.title}</a>
                    </li>
                ))}
            </ul>
        </section>
    ),
}));

const categoryTree: CategoryTree = [
    {
        name: 'Engineering',
        categories: [
            { name: 'Backend', slug: 'backend' },
            { name: 'Frontend', slug: 'frontend' },
        ],
    },
    {
        name: 'Product',
        categories: [{ name: 'Design', slug: 'design' }],
    },
];

const freshPicks = [
    {
        id: 'job-1',
        slug: 'senior-backend',
        title: 'Senior Backend Engineer',
    },
] as JobPost[];

const featuredCompanies = [
    {
        id: 'acme',
        name: 'Acme',
        homePage: 'https://acme.example',
        logo: { url: '' },
        jobPostsCount: 4,
    },
] as Company[];

describe('HomePage', () => {
    it('renders curated sections, grouped categories, and intent links', () => {
        render(
            <HomePage
                categoryTree={categoryTree}
                freshPicks={freshPicks}
                featuredCompanies={featuredCompanies}
            />,
        );

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: /Jobmeerkat\s+remote jobs with public salaries\s+tracked daily/i,
            }),
        ).toBeTruthy();
        expect(
            screen.getByRole('heading', {
                level: 2,
                name: 'Browse by category',
            }),
        ).toBeTruthy();
        expect(
            screen.getByRole('heading', { level: 3, name: 'Engineering' }),
        ).toBeTruthy();
        expect(
            screen.getByRole('heading', { level: 3, name: 'Product' }),
        ).toBeTruthy();
        expect(
            screen.getByRole('heading', {
                level: 2,
                name: 'Pay first. Then the role.',
            }),
        ).toBeTruthy();
        expect(
            screen.getByRole('heading', {
                level: 2,
                name: 'Hiring right now',
            }),
        ).toBeTruthy();
        expect(
            screen.getByRole('heading', {
                level: 2,
                name: 'Start from a sharper list',
            }),
        ).toBeTruthy();
        expect(
            screen.getByRole('heading', {
                level: 2,
                name: 'Built for clearer job search',
            }),
        ).toBeTruthy();

        expect(
            screen.getByRole('link', { name: 'Backend' }).getAttribute('href'),
        ).toBe('/category/backend/');
        expect(
            screen.getByRole('link', { name: 'Senior Backend Engineer' }),
        ).toBeTruthy();

        const collections = screen
            .getByRole('heading', {
                level: 2,
                name: 'Start from a sharper list',
            })
            .closest('section') as HTMLElement;

        for (const intent of INTENT_DEFINITIONS) {
            expect(
                within(collections)
                    .getByRole('link', { name: new RegExp(intent.h1) })
                    .getAttribute('href'),
            ).toBe(intent.path);
        }

        expect(
            document.querySelector('script[type="application/ld+json"]'),
        ).not.toBeNull();
    });
});
