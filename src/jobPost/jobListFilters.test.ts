import {
    countJobsMatchingFilters,
    DEFAULT_JOB_LIST_FILTERS,
    matchesJobListFilters,
    resolveInitialJobListFilters,
} from './jobListFilters';
import type { JobPost } from './http/getJobPosts';

const job = (overrides: Record<string, unknown> = {}): JobPost =>
    ({
        id: '1',
        category: 'devops',
        salaryRange: { max: 100, currency: 'USD', period: 'year' },
        workplace: 'remote',
        ...overrides,
    }) as JobPost;

describe('matchesJobListFilters', () => {
    it('hides jobs without salary by default', () => {
        expect(
            matchesJobListFilters(
                job({ salaryRange: null }),
                DEFAULT_JOB_LIST_FILTERS,
            ),
        ).toBe(false);
    });

    it('shows jobs without salary when includeWithoutSalary is true', () => {
        expect(
            matchesJobListFilters(job({ salaryRange: null }), {
                category: 'all',
                includeWithoutSalary: true,
                workplace: 'remote',
            }),
        ).toBe(true);
    });

    it('shows only the selected workplace', () => {
        expect(
            matchesJobListFilters(job({ workplace: 'hybrid' }), {
                category: 'all',
                includeWithoutSalary: false,
                workplace: 'remote',
            }),
        ).toBe(false);
        expect(
            matchesJobListFilters(job({ workplace: 'hybrid' }), {
                category: 'all',
                includeWithoutSalary: false,
                workplace: 'hybrid',
            }),
        ).toBe(true);
    });

    it('shows unknown workplace only when all is selected', () => {
        expect(
            matchesJobListFilters(job({ workplace: 'unknown' }), {
                category: 'all',
                includeWithoutSalary: false,
                workplace: 'remote',
            }),
        ).toBe(false);
        expect(
            matchesJobListFilters(job({ workplace: 'unknown' }), {
                category: 'all',
                includeWithoutSalary: false,
                workplace: 'hybrid',
            }),
        ).toBe(false);
        expect(
            matchesJobListFilters(job({ workplace: 'unknown' }), {
                category: 'all',
                includeWithoutSalary: false,
                workplace: 'all',
            }),
        ).toBe(true);
    });

    it('filters by category and keeps all selected by default', () => {
        expect(
            matchesJobListFilters(job({ category: 'frontend' }), {
                category: 'all',
                includeWithoutSalary: false,
                workplace: 'remote',
            }),
        ).toBe(true);
        expect(
            matchesJobListFilters(job({ category: 'frontend' }), {
                category: 'devops',
                includeWithoutSalary: false,
                workplace: 'remote',
            }),
        ).toBe(false);
        expect(
            matchesJobListFilters(job({ category: 'devops' }), {
                category: 'devops',
                includeWithoutSalary: false,
                workplace: 'remote',
            }),
        ).toBe(true);
    });
});

describe('countJobsMatchingFilters', () => {
    it('counts jobs that match the given filters', () => {
        const jobs = [
            job({ salaryRange: { max: 1 }, workplace: 'remote' }),
            job({ salaryRange: null, workplace: 'remote' }),
            job({ salaryRange: { max: 1 }, workplace: 'onSite' }),
        ];

        expect(countJobsMatchingFilters(jobs, DEFAULT_JOB_LIST_FILTERS)).toBe(
            1,
        );
        expect(
            countJobsMatchingFilters(jobs, {
                category: 'all',
                includeWithoutSalary: true,
                workplace: 'remote',
            }),
        ).toBe(2);
        expect(
            countJobsMatchingFilters(jobs, {
                category: 'all',
                includeWithoutSalary: false,
                workplace: 'all',
            }),
        ).toBe(2);
    });
});

describe('resolveInitialJobListFilters', () => {
    it('keeps defaults when remote salary jobs exist', () => {
        expect(resolveInitialJobListFilters([job()])).toEqual(
            DEFAULT_JOB_LIST_FILTERS,
        );
        expect(resolveInitialJobListFilters([job()]).category).toBe('all');
    });

    it('widens to all workplaces when no remote salary jobs', () => {
        expect(
            resolveInitialJobListFilters([job({ workplace: 'onSite' })]),
        ).toEqual({
            category: 'all',
            includeWithoutSalary: false,
            workplace: 'all',
        });
    });

    it('includes no-salary jobs when nothing else matches', () => {
        expect(
            resolveInitialJobListFilters([
                job({ salaryRange: null, workplace: 'onSite' }),
            ]),
        ).toEqual({
            category: 'all',
            includeWithoutSalary: true,
            workplace: 'all',
        });
    });
});
