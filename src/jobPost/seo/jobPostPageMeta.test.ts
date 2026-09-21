import {
    JobType,
    Period,
    Workplace,
    type JobPost,
} from '@/jobPost/http/getJobPosts';
import {
    buildJobPostPath,
    buildJobPostPathUrl,
    buildJobPostSearchUrl,
    jobMetaDescription,
    jobMetaTitle,
    jobPostRobotsContent,
    normalizeSlugParam,
} from './jobPostPageMeta';

jest.mock('@/shared/environment/isProd', () => ({
    isProd: true,
}));

jest.mock('@/shared/http/apiRequest', () => ({
    apiRequest: jest.fn(),
}));

const job = (overrides: Partial<JobPost> = {}): JobPost =>
    ({
        id: '1',
        slug: 'role-at-acme',
        title: 'Engineer',
        url: 'https://example.com',
        type: JobType.FullTime,
        company: { id: 'c', name: 'Acme', logo: { url: '' } },
        salaryRange: null,
        workplace: Workplace.Remote,
        location: 'Worldwide',
        createdAt: 1,
        category: 'engineering',
        ...overrides,
    }) as JobPost;

describe('jobPostPageMeta', () => {
    it('normalizes a trailing slash on the slug', () => {
        expect(normalizeSlugParam('foo/')).toBe('foo');
    });

    it('builds search and path URLs', () => {
        expect(buildJobPostSearchUrl('https://jobmeerkat.com', 'a b')).toBe(
            'https://jobmeerkat.com/job/?slug=a%20b',
        );
        expect(buildJobPostPath('a b')).toBe('/jobpost/a%20b');
        expect(buildJobPostPathUrl('https://jobmeerkat.com', 'a b')).toBe(
            'https://jobmeerkat.com/jobpost/a%20b',
        );
    });

    it('titles the role and company without claiming salary', () => {
        expect(jobMetaTitle(job())).toBe('Engineer at Acme | Jobmeerkat');
    });

    it('includes a salary range in the title when listed', () => {
        expect(
            jobMetaTitle(
                job({
                    salaryRange: {
                        min: 90000,
                        max: 120000,
                        currency: 'usd',
                        period: Period.Year,
                    },
                }),
            ),
        ).toBe('Engineer at Acme (90K–120K USD / year) | Jobmeerkat');
    });

    it('omits company from the title when the name is missing', () => {
        expect(
            jobMetaTitle(
                job({ company: { id: 'c', name: '', logo: { url: '' } } }),
            ),
        ).toBe('Engineer | Jobmeerkat');
    });

    it('describes workplace and location without claiming salary', () => {
        expect(jobMetaDescription(job())).toBe(
            'Engineer at Acme. Full-time · Remote — Worldwide.',
        );
    });

    it('includes a salary range when listed', () => {
        expect(
            jobMetaDescription(
                job({
                    salaryRange: {
                        min: 90000,
                        max: 120000,
                        currency: 'usd',
                        period: Period.Year,
                    },
                }),
            ),
        ).toBe(
            'Engineer at Acme. Full-time · Remote — Worldwide. 90K–120K USD / year.',
        );
    });

    it('uses the actual workplace and max-only salary', () => {
        expect(
            jobMetaDescription(
                job({
                    workplace: Workplace.Hybrid,
                    location: 'Madrid',
                    salaryRange: {
                        max: 80000,
                        currency: 'EUR',
                        period: Period.Year,
                    },
                }),
            ),
        ).toBe(
            'Engineer at Acme. Full-time · Hybrid — Madrid. Up to 80K EUR / year.',
        );
    });

    it('omits company and unknown workplace', () => {
        expect(
            jobMetaDescription(
                job({
                    company: { id: 'c', name: '', logo: { url: '' } },
                    workplace: Workplace.Unknown,
                    location: 'Berlin',
                    type: JobType.Unknown,
                }),
            ),
        ).toBe('Engineer. Berlin.');
    });

    it('noindexes closed jobs in production', () => {
        expect(jobPostRobotsContent(true)).toBe('noindex,nofollow');
        expect(jobPostRobotsContent(false)).toBe('index,follow');
    });
});
