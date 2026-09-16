import {
    JobPost,
    JobType,
    Period,
    Workplace,
} from '@/jobPost/http/getJobPosts';
import { getVisibleJobPostDetailSections } from './jobPostDetailSectionCatalog';

jest.mock('@/shared/http/apiRequest', () => ({
    apiRequest: jest.fn(),
}));

const baseJobPost: JobPost = {
    id: 'job-1',
    slug: 'backend-engineer-at-linear',
    title: 'Backend Engineer',
    url: 'https://example.com/jobs/1',
    type: JobType.FullTime,
    company: {
        id: 'co-1',
        name: 'Linear',
        logo: { url: 'https://cdn.example.com/logo.png' },
    },
    salaryRange: {
        min: 150000,
        max: 180000,
        currency: 'USD',
        period: Period.Year,
    },
    workplace: Workplace.Remote,
    location: 'Europe',
    createdAt: Date.UTC(2026, 8, 1),
    closedAt: null,
    category: 'Backend',
};

describe('getVisibleJobPostDetailSections', () => {
    it('skips missing sections', () => {
        expect(getVisibleJobPostDetailSections(baseJobPost)).toEqual([]);
    });

    it('uses catalog titles and company description as fallback', () => {
        const sections = getVisibleJobPostDetailSections({
            ...baseJobPost,
            company: {
                ...baseJobPost.company,
                description:
                    'Linear builds the issue tracker for software teams.',
            },
            details: {
                summary: 'Build the GraphQL API used by the web app.',
                stack: ['TypeScript', 'GraphQL'],
                hiringProcess: ['Hiring manager screen', 'Onsite'],
            },
        });

        expect(sections).toEqual([
            {
                key: 'summary',
                title: 'About this role',
                kind: 'text',
                value: 'Build the GraphQL API used by the web app.',
            },
            {
                key: 'company',
                title: 'About the company',
                kind: 'text',
                value: 'Linear builds the issue tracker for software teams.',
            },
            {
                key: 'stack',
                title: 'Stack',
                kind: 'chips',
                value: ['TypeScript', 'GraphQL'],
            },
            {
                key: 'hiringProcess',
                title: 'Hiring process',
                kind: 'list',
                value: ['Hiring manager screen', 'Onsite'],
            },
        ]);
    });

    it('shows a named team when present', () => {
        const sections = getVisibleJobPostDetailSections({
            ...baseJobPost,
            details: {
                team: 'ClickHouse operations, part of Infrastructure.',
            },
        });

        expect(sections).toEqual([
            {
                key: 'team',
                title: 'The team',
                kind: 'text',
                value: 'ClickHouse operations, part of Infrastructure.',
            },
        ]);
    });
});
