import { render, screen } from '@testing-library/react';
import { SortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { CategoryPage } from './CategoryPage';

jest.mock('@/shared/layout/JobPostsListWithCategories', () => ({
    JobPostsListWithCategories: () => <div data-testid="job-list" />,
}));

describe('CategoryPage', () => {
    it('renders a category-specific H1 instead of the homepage claim', () => {
        const jobPosts = {} as unknown as SortedJobPosts;

        render(
            <CategoryPage
                category={{ name: 'Backend', slug: 'backend' }}
                jobPosts={jobPosts}
                categoryTree={[]}
            />,
        );

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: 'Backend open positions',
            }),
        ).toBeTruthy();
        expect(
            screen.queryByText(/Jobmeerkat — remote jobs, tracked daily/i),
        ).toBeNull();
        expect(screen.getByTestId('job-list')).toBeTruthy();
    });
});
