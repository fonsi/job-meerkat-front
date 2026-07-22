import {
    createCompanyLink,
    sortCompaniesByName,
    isCompanyDisabled,
    Company,
} from './company';

describe('createCompanyLink', () => {
    it('should create a valid company link given a companyId', () => {
        const companyId = '123';
        const result = createCompanyLink({ companyId });
        expect(result).toBe('/company/123/');
    });
});

describe('isCompanyDisabled', () => {
    it('returns false when status is missing or active', () => {
        expect(
            isCompanyDisabled({
                id: '1',
                name: 'Acme',
                homePage: '',
                logo: { url: '' },
            }),
        ).toBe(false);
        expect(
            isCompanyDisabled({
                id: '1',
                name: 'Acme',
                homePage: '',
                logo: { url: '' },
                status: 'active',
            }),
        ).toBe(false);
    });

    it('returns true when status is disabled', () => {
        expect(
            isCompanyDisabled({
                id: '1',
                name: 'Acme',
                homePage: '',
                logo: { url: '' },
                status: 'disabled',
            }),
        ).toBe(true);
    });
});

describe('sortCompaniesByName', () => {
    it('should sort companies alphabetically by name', () => {
        const companies: Company[] = [
            { id: '1', name: 'Beta', homePage: '', logo: { url: '' } },
            { id: '2', name: 'Alpha', homePage: '', logo: { url: '' } },
            { id: '3', name: 'Gamma', homePage: '', logo: { url: '' } },
        ];

        const sortedCompanies = sortCompaniesByName({ companies });

        expect(sortedCompanies).toEqual([
            { id: '2', name: 'Alpha', homePage: '', logo: { url: '' } },
            { id: '1', name: 'Beta', homePage: '', logo: { url: '' } },
            { id: '3', name: 'Gamma', homePage: '', logo: { url: '' } },
        ]);
    });

    it('should handle case-insensitive sorting', () => {
        const companies: Company[] = [
            { id: '1', name: 'beta', homePage: '', logo: { url: '' } },
            { id: '2', name: 'Alpha', homePage: '', logo: { url: '' } },
            { id: '3', name: 'gamma', homePage: '', logo: { url: '' } },
        ];

        const sortedCompanies = sortCompaniesByName({ companies });

        expect(sortedCompanies).toEqual([
            { id: '2', name: 'Alpha', homePage: '', logo: { url: '' } },
            { id: '1', name: 'beta', homePage: '', logo: { url: '' } },
            { id: '3', name: 'gamma', homePage: '', logo: { url: '' } },
        ]);
    });

    it('should return an empty array if no companies are provided', () => {
        const companies: Company[] = [];
        const sortedCompanies = sortCompaniesByName({ companies });
        expect(sortedCompanies).toEqual([]);
    });
});
