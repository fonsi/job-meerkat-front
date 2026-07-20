import { buildJobPostingJsonLd } from './buildJobPostingJsonLd';

jest.mock('@/shared/environment/getSiteUrl', () => ({
    getSiteUrl: () => 'https://jobmeerkat.com',
}));

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

const baseJob = {
    id: 'job-1',
    slug: 'staff-devops-phantom',
    title: 'Staff DevOps Engineer',
    url: 'https://example.com/jobs/1',
    type: 'fullTime',
    company: {
        id: 'co-1',
        name: 'Phantom',
        logo: { url: 'https://cdn.example.com/logo.png' },
    },
    salaryRange: {
        min: 200000,
        max: 250000,
        currency: 'USD',
        period: 'year',
    },
    workplace: 'remote',
    location: 'US, EU, UK',
    createdAt: Date.UTC(2026, 6, 15),
    closedAt: null,
    category: 'devops',
} as Parameters<typeof buildJobPostingJsonLd>[0];

describe('buildJobPostingJsonLd', () => {
    it('builds JobPosting schema for an open remote role with salary', () => {
        const jsonLd = buildJobPostingJsonLd(baseJob);

        expect(jsonLd).toMatchObject({
            '@type': 'JobPosting',
            title: 'Staff DevOps Engineer',
            datePosted: '2026-07-15',
            validThrough: '2026-10-13',
            employmentType: 'FULL_TIME',
            jobLocationType: 'TELECOMMUTE',
            url: 'https://jobmeerkat.com/job/?slug=staff-devops-phantom',
            hiringOrganization: {
                '@type': 'Organization',
                name: 'Phantom',
            },
            baseSalary: {
                '@type': 'MonetaryAmount',
                currency: 'USD',
                value: {
                    '@type': 'QuantitativeValue',
                    minValue: 200000,
                    value: 250000,
                    unitText: 'YEAR',
                },
            },
        });
    });

    it('uses closedAt as validThrough when the job is closed', () => {
        const jsonLd = buildJobPostingJsonLd({
            ...baseJob,
            closedAt: Date.UTC(2026, 7, 1),
        });

        expect(jsonLd.validThrough).toBe('2026-08-01');
    });
});
