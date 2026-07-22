import {
    buildCompanyMetaDescription,
    buildCompanyMetaTitle,
    formatSalaryCompact,
    getCompanyJobStats,
} from './getCompanyJobStats';
import {
    JobPost,
    JobType,
    Period,
    Workplace,
} from '@/jobPost/http/getJobPosts';

jest.mock('@/jobPost/http/getJobPosts', () => ({
    JobType: {
        FullTime: 'fullTime',
        PartTime: 'partTime',
        Contract: 'contract',
        Unknown: 'unknown',
    },
    Period: {
        Year: 'year',
        Month: 'month',
        Week: 'week',
        Day: 'day',
        Hour: 'hour',
    },
    Workplace: {
        Remote: 'remote',
        OnSite: 'onSite',
        Hybrid: 'hybrid',
        Unknown: 'unknown',
    },
}));

const now = Date.UTC(2026, 6, 21);

const job = (overrides: Partial<JobPost>): JobPost =>
    ({
        id: '1',
        slug: 'role',
        title: 'Engineer',
        url: 'https://example.com',
        type: JobType.FullTime,
        company: {
            id: 'co',
            name: 'Acme',
            logo: { url: 'https://cdn.example.com/logo.png' },
        },
        salaryRange: null,
        workplace: Workplace.Remote,
        location: 'US',
        createdAt: now - 2 * 24 * 60 * 60 * 1000,
        closedAt: null,
        category: 'engineering',
        ...overrides,
    }) as JobPost;

describe('getCompanyJobStats', () => {
    it('counts open roles, categories, and posts in the last 30 days', () => {
        const stats = getCompanyJobStats(
            [
                job({
                    id: '1',
                    category: 'engineering',
                    createdAt: now - 1 * 24 * 60 * 60 * 1000,
                }),
                job({
                    id: '2',
                    category: 'engineering',
                    createdAt: now - 10 * 24 * 60 * 60 * 1000,
                }),
                job({
                    id: '3',
                    category: 'product',
                    createdAt: now - 40 * 24 * 60 * 60 * 1000,
                }),
                job({
                    id: '4',
                    closedAt: now,
                    createdAt: now - 1 * 24 * 60 * 60 * 1000,
                }),
            ],
            now,
        );

        expect(stats.openCount).toBe(3);
        expect(stats.postedLast30Days).toBe(2);
        expect(stats.categories).toEqual([
            { category: 'engineering', count: 2 },
            { category: 'product', count: 1 },
        ]);
    });

    it('aggregates annualized salary stats for the dominant currency', () => {
        const stats = getCompanyJobStats(
            [
                job({
                    id: '1',
                    salaryRange: {
                        min: 100000,
                        max: 140000,
                        currency: 'usd',
                        period: Period.Year,
                    },
                }),
                job({
                    id: '2',
                    salaryRange: {
                        min: 10000,
                        max: 12000,
                        currency: 'usd',
                        period: Period.Month,
                    },
                }),
                job({
                    id: '3',
                    salaryRange: {
                        min: 50000,
                        max: 60000,
                        currency: 'eur',
                        period: Period.Year,
                    },
                }),
            ],
            now,
        );

        expect(stats.salary).toEqual({
            currency: 'USD',
            min: 100000,
            max: 144000,
            median: 126000,
            jobsWithSalary: 2,
        });
    });

    it('builds numeric meta copy when salary data exists', () => {
        const stats = getCompanyJobStats(
            [
                job({
                    salaryRange: {
                        min: 90000,
                        max: 160000,
                        currency: 'USD',
                        period: Period.Year,
                    },
                }),
                job({
                    id: '2',
                    salaryRange: {
                        min: 110000,
                        max: 150000,
                        currency: 'USD',
                        period: Period.Year,
                    },
                }),
            ],
            now,
        );

        expect(buildCompanyMetaTitle({ companyName: 'Acme', stats })).toBe(
            'Acme — 2 remote roles, 90K USD–160K USD | Jobmeerkat',
        );
        expect(
            buildCompanyMetaDescription({ companyName: 'Acme', stats }),
        ).toContain('from 90K USD–160K USD / year');
        expect(
            buildCompanyMetaDescription({
                companyName: 'Acme',
                stats,
                companyDescription: 'Acme builds collaboration tools.',
            }),
        ).toBe(
            'Acme builds collaboration tools. Explore 2 remote roles at Acme. Public salaries from 90K USD–160K USD / year on Jobmeerkat.',
        );
        expect(formatSalaryCompact(90000, 'USD')).toBe('90K USD');
    });

    it('builds meta for disabled companies without hiring copy', () => {
        const stats = getCompanyJobStats([]);

        expect(
            buildCompanyMetaTitle({
                companyName: 'Rec Room',
                stats,
                isDisabled: true,
            }),
        ).toBe('Rec Room — no longer hiring | Jobmeerkat');
        expect(
            buildCompanyMetaDescription({
                companyName: 'Rec Room',
                stats,
                isDisabled: true,
                statusMessage: 'Rec Room shut down in June 2026.',
            }),
        ).toBe('Rec Room shut down in June 2026.');
    });
});
