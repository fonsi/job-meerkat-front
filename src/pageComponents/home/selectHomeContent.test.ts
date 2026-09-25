import type { Company } from '@/company/company';
import type { JobPost } from '@/jobPost/http/getJobPosts';
import {
    HOME_FEATURED_COMPANIES_LIMIT,
    HOME_FRESH_PICKS_LIMIT,
    selectFeaturedCompanies,
    selectFreshPicks,
    selectHomeContent,
} from './selectHomeContent';

const NOW = 1_700_000_000_000;

const makeJob = (
    overrides: { id: string } & Record<string, unknown>,
): JobPost =>
    ({
        slug: overrides.id,
        title: `Job ${overrides.id}`,
        url: 'https://example.com',
        type: 'fullTime',
        company: {
            id: `company-${overrides.id}`,
            name: `Company ${overrides.id}`,
            logo: { url: '' },
        },
        salaryRange: {
            max: 100000,
            currency: 'USD',
            period: 'year',
        },
        workplace: 'remote',
        location: 'Worldwide',
        createdAt: NOW,
        category: 'Backend',
        ...overrides,
    }) as JobPost;

const makeCompany = (
    overrides: Partial<Company> & Pick<Company, 'id' | 'name'>,
): Company => ({
    homePage: 'https://example.com',
    logo: { url: '' },
    jobPostsCount: 1,
    status: 'active',
    ...overrides,
});

describe('selectFreshPicks', () => {
    it('excludes closed jobs', () => {
        const jobs = [
            makeJob({ id: 'open', createdAt: NOW }),
            makeJob({
                id: 'closed',
                createdAt: NOW + 1,
                closedAt: NOW,
            }),
        ];

        expect(selectFreshPicks(jobs).map((job) => job.id)).toEqual(['open']);
    });

    it('caps results at the homepage limit', () => {
        const jobs = Array.from({ length: 20 }, (_, index) =>
            makeJob({
                id: String(index),
                company: {
                    id: `c-${index}`,
                    name: `C ${index}`,
                    logo: { url: '' },
                },
                category: `Cat-${index}`,
                createdAt: NOW - index,
            }),
        );

        expect(selectFreshPicks(jobs)).toHaveLength(HOME_FRESH_PICKS_LIMIT);
    });

    it('ranks salary and remote jobs ahead of older matches', () => {
        const jobs = [
            makeJob({
                id: 'old-salary-remote',
                createdAt: NOW - 1000,
                salaryRange: {
                    max: 120000,
                    currency: 'USD',
                    period: 'year',
                },
                workplace: 'remote',
            }),
            makeJob({
                id: 'new-no-salary',
                createdAt: NOW,
                salaryRange: null,
                workplace: 'remote',
            }),
            makeJob({
                id: 'new-salary-onsite',
                createdAt: NOW,
                salaryRange: {
                    max: 90000,
                    currency: 'USD',
                    period: 'year',
                },
                workplace: 'onSite',
            }),
            makeJob({
                id: 'newest-salary-remote',
                createdAt: NOW + 1,
                salaryRange: {
                    max: 110000,
                    currency: 'USD',
                    period: 'year',
                },
                workplace: 'remote',
            }),
        ];

        expect(selectFreshPicks(jobs, 3).map((job) => job.id)).toEqual([
            'newest-salary-remote',
            'old-salary-remote',
            'new-salary-onsite',
        ]);
    });

    it('applies company and category diversity before filling remaining slots', () => {
        const jobs = [
            makeJob({
                id: 'a1',
                company: { id: 'acme', name: 'Acme', logo: { url: '' } },
                category: 'Backend',
                createdAt: NOW,
            }),
            makeJob({
                id: 'a2',
                company: { id: 'acme', name: 'Acme', logo: { url: '' } },
                category: 'Frontend',
                createdAt: NOW - 1,
            }),
            makeJob({
                id: 'b1',
                company: { id: 'beta', name: 'Beta', logo: { url: '' } },
                category: 'Backend',
                createdAt: NOW - 2,
            }),
            makeJob({
                id: 'c1',
                company: { id: 'gamma', name: 'Gamma', logo: { url: '' } },
                category: 'Backend',
                createdAt: NOW - 3,
            }),
            makeJob({
                id: 'd1',
                company: { id: 'delta', name: 'Delta', logo: { url: '' } },
                category: 'Design',
                createdAt: NOW - 4,
            }),
        ];

        expect(selectFreshPicks(jobs, 4).map((job) => job.id)).toEqual([
            'a1',
            'b1',
            'd1',
            'a2',
        ]);
    });

    it('fills remaining slots without diversity when needed', () => {
        const jobs = [
            makeJob({
                id: '1',
                company: { id: 'acme', name: 'Acme', logo: { url: '' } },
                category: 'Backend',
                createdAt: NOW,
            }),
            makeJob({
                id: '2',
                company: { id: 'acme', name: 'Acme', logo: { url: '' } },
                category: 'Backend',
                createdAt: NOW - 1,
            }),
            makeJob({
                id: '3',
                company: { id: 'acme', name: 'Acme', logo: { url: '' } },
                category: 'Backend',
                createdAt: NOW - 2,
            }),
        ];

        expect(selectFreshPicks(jobs, 3).map((job) => job.id)).toEqual([
            '1',
            '2',
            '3',
        ]);
    });
});

describe('selectFeaturedCompanies', () => {
    it('excludes disabled and empty companies', () => {
        const companies = [
            makeCompany({ id: '1', name: 'Alpha', jobPostsCount: 3 }),
            makeCompany({
                id: '2',
                name: 'Beta',
                jobPostsCount: 5,
                status: 'disabled',
            }),
            makeCompany({ id: '3', name: 'Gamma', jobPostsCount: 0 }),
            makeCompany({ id: '4', name: 'Delta', jobPostsCount: undefined }),
        ];

        expect(
            selectFeaturedCompanies(companies).map((company) => company.id),
        ).toEqual(['1']);
    });

    it('ranks by open job count then alphabetical name', () => {
        const companies = [
            makeCompany({ id: '1', name: 'Zebra', jobPostsCount: 2 }),
            makeCompany({ id: '2', name: 'Alpha', jobPostsCount: 5 }),
            makeCompany({ id: '3', name: 'Beta', jobPostsCount: 5 }),
            makeCompany({ id: '4', name: 'Gamma', jobPostsCount: 1 }),
        ];

        expect(
            selectFeaturedCompanies(companies, 3).map(
                (company) => company.name,
            ),
        ).toEqual(['Alpha', 'Beta', 'Zebra']);
    });

    it('caps featured companies at the homepage limit', () => {
        const companies = Array.from({ length: 10 }, (_, index) =>
            makeCompany({
                id: String(index),
                name: `Company ${index}`,
                jobPostsCount: index + 1,
            }),
        );

        expect(selectFeaturedCompanies(companies)).toHaveLength(
            HOME_FEATURED_COMPANIES_LIMIT,
        );
    });
});

describe('selectHomeContent', () => {
    it('returns fresh picks and featured companies together', () => {
        const result = selectHomeContent({
            jobPosts: [makeJob({ id: 'job-1' })],
            companies: [
                makeCompany({ id: 'co-1', name: 'Acme', jobPostsCount: 2 }),
            ],
        });

        expect(result.freshPicks).toHaveLength(1);
        expect(result.featuredCompanies).toHaveLength(1);
    });
});
