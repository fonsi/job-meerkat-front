import {
    annualSalaryMax,
    filterJobPostsByIntent,
    INTENT_DEFINITIONS,
} from './intents';
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
        salaryRange: {
            min: 100000,
            max: 150000,
            currency: 'USD',
            period: Period.Year,
        },
        workplace: Workplace.Remote,
        location: 'worldwide',
        createdAt: Date.now(),
        closedAt: null,
        category: 'Frontend',
        ...overrides,
    }) as JobPost;

describe('intent filters', () => {
    it('defines five intent pages', () => {
        expect(INTENT_DEFINITIONS).toHaveLength(5);
    });

    it('filters remote jobs with salary', () => {
        const jobs = [
            job({ id: '1' }),
            job({ id: '2', salaryRange: null }),
            job({ id: '3', workplace: Workplace.OnSite }),
            job({ id: '4', closedAt: Date.now() }),
        ];

        expect(
            filterJobPostsByIntent('remote-jobs-with-salary', jobs).map(
                (item) => item.id,
            ),
        ).toEqual(['1']);
    });

    it('filters engineering categories', () => {
        const jobs = [
            job({ id: '1', category: 'Frontend' }),
            job({ id: '2', category: 'Product' }),
            job({ id: '3', category: 'Backend' }),
        ];

        expect(
            filterJobPostsByIntent(
                'remote-engineering-jobs-with-salary',
                jobs,
            ).map((item) => item.id),
        ).toEqual(['1', '3']);
    });

    it('sorts highest paying and caps results', () => {
        const jobs = [
            job({
                id: 'low',
                salaryRange: {
                    min: 80000,
                    max: 90000,
                    currency: 'USD',
                    period: Period.Year,
                },
            }),
            job({
                id: 'high',
                salaryRange: {
                    min: 180000,
                    max: 220000,
                    currency: 'USD',
                    period: Period.Year,
                },
            }),
        ];

        const result = filterJobPostsByIntent(
            'highest-paying-remote-jobs',
            jobs,
        );
        expect(result[0].id).toBe('high');
        expect(annualSalaryMax(result[0])).toBe(220000);
    });
});
