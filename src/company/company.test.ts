import {
    createCompanyLink,
    sortCompanies,
    isCompanyDisabled,
    Company,
} from './company';

const company = (
    overrides: Partial<Company> & Pick<Company, 'id' | 'name'>,
): Company => ({
    homePage: '',
    logo: { url: '' },
    ...overrides,
});

describe('createCompanyLink', () => {
    it('should create a valid company link given a companyId', () => {
        const companyId = '123';
        const result = createCompanyLink({ companyId });
        expect(result).toBe('/company/123/');
    });
});

describe('isCompanyDisabled', () => {
    it('returns false when status is missing or active', () => {
        expect(isCompanyDisabled(company({ id: '1', name: 'Acme' }))).toBe(
            false,
        );
        expect(
            isCompanyDisabled(
                company({ id: '1', name: 'Acme', status: 'active' }),
            ),
        ).toBe(false);
    });

    it('returns true when status is disabled', () => {
        expect(
            isCompanyDisabled(
                company({ id: '1', name: 'Acme', status: 'disabled' }),
            ),
        ).toBe(true);
    });
});

describe('sortCompanies', () => {
    it('sorts by createdAt descending by default, then by name', () => {
        const companies: Company[] = [
            company({ id: '1', name: 'Beta', createdAt: 100 }),
            company({ id: '2', name: 'Alpha', createdAt: 300 }),
            company({ id: '3', name: 'Gamma', createdAt: 200 }),
            company({ id: '4', name: 'Zebra', createdAt: 200 }),
        ];

        expect(sortCompanies({ companies, sortBy: 'createdAt' })).toEqual([
            company({ id: '2', name: 'Alpha', createdAt: 300 }),
            company({ id: '3', name: 'Gamma', createdAt: 200 }),
            company({ id: '4', name: 'Zebra', createdAt: 200 }),
            company({ id: '1', name: 'Beta', createdAt: 100 }),
        ]);
    });

    it('sorts alphabetically by name', () => {
        const companies: Company[] = [
            company({ id: '1', name: 'Beta' }),
            company({ id: '2', name: 'Alpha' }),
            company({ id: '3', name: 'Gamma' }),
        ];

        expect(sortCompanies({ companies, sortBy: 'name' })).toEqual([
            company({ id: '2', name: 'Alpha' }),
            company({ id: '1', name: 'Beta' }),
            company({ id: '3', name: 'Gamma' }),
        ]);
    });

    it('sorts by name case-insensitively', () => {
        const companies: Company[] = [
            company({ id: '1', name: 'beta' }),
            company({ id: '2', name: 'Alpha' }),
            company({ id: '3', name: 'gamma' }),
        ];

        expect(sortCompanies({ companies, sortBy: 'name' })).toEqual([
            company({ id: '2', name: 'Alpha' }),
            company({ id: '1', name: 'beta' }),
            company({ id: '3', name: 'gamma' }),
        ]);
    });

    it('sorts by jobPostsCount descending, then by name', () => {
        const companies: Company[] = [
            company({ id: '1', name: 'Beta', jobPostsCount: 2 }),
            company({ id: '2', name: 'Alpha', jobPostsCount: 5 }),
            company({ id: '3', name: 'Gamma', jobPostsCount: 2 }),
            company({ id: '4', name: 'Delta' }),
        ];

        expect(sortCompanies({ companies, sortBy: 'jobPostsCount' })).toEqual([
            company({ id: '2', name: 'Alpha', jobPostsCount: 5 }),
            company({ id: '1', name: 'Beta', jobPostsCount: 2 }),
            company({ id: '3', name: 'Gamma', jobPostsCount: 2 }),
            company({ id: '4', name: 'Delta' }),
        ]);
    });

    it('ranks prefix search matches above contains matches', () => {
        const companies: Company[] = [
            company({ id: '1', name: 'Mega Soft', createdAt: 300 }),
            company({ id: '2', name: 'Soft Corp', createdAt: 100 }),
            company({ id: '3', name: 'Softly', createdAt: 200 }),
        ];

        expect(
            sortCompanies({ companies, sortBy: 'createdAt', query: 'soft' }),
        ).toEqual([
            company({ id: '3', name: 'Softly', createdAt: 200 }),
            company({ id: '2', name: 'Soft Corp', createdAt: 100 }),
            company({ id: '1', name: 'Mega Soft', createdAt: 300 }),
        ]);
    });

    it('returns an empty array if no companies are provided', () => {
        expect(sortCompanies({ companies: [], sortBy: 'createdAt' })).toEqual(
            [],
        );
    });
});
