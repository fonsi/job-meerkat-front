export type CompanyLogo = {
    url: string;
    background?: string;
};

export type CompanyStatus = 'active' | 'disabled';

export type Company = {
    id: string;
    name: string;
    homePage: string;
    logo: CompanyLogo;
    description?: string;
    jobPostsCount?: number;
    /** Missing status means active (backwards compatible). */
    status?: CompanyStatus;
    statusMessage?: string;
    disabledAt?: number;
    /** ms epoch — when the company was added to Jobmeerkat. */
    createdAt?: number;
};

export type CompanySortBy = 'createdAt' | 'name' | 'jobPostsCount';

export const isCompanyDisabled = (company: Company): boolean =>
    company.status === 'disabled';

type CreateCompanyLinkParams = {
    companyId: string;
};

export const createCompanyLink = ({ companyId }: CreateCompanyLinkParams) =>
    `/company/${companyId}/`;

export const filterCompaniesByName = ({
    companies,
    query,
}: {
    companies: Company[];
    query: string;
}): Company[] => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return companies;

    return companies.filter((company) =>
        company.name.toLowerCase().includes(normalized),
    );
};

const compareByName = (a: Company, b: Company): number =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase());

/** 0 = starts with query, 1 = contains query elsewhere. */
const searchMatchRank = (company: Company, normalizedQuery: string): number =>
    company.name.toLowerCase().startsWith(normalizedQuery) ? 0 : 1;

const compareBySort = (
    a: Company,
    b: Company,
    sortBy: CompanySortBy,
): number => {
    if (sortBy === 'name') return compareByName(a, b);

    if (sortBy === 'jobPostsCount') {
        const countDiff = (b.jobPostsCount ?? 0) - (a.jobPostsCount ?? 0);
        if (countDiff !== 0) return countDiff;

        return compareByName(a, b);
    }

    const createdDiff = (b.createdAt ?? 0) - (a.createdAt ?? 0);
    if (createdDiff !== 0) return createdDiff;

    return compareByName(a, b);
};

export const sortCompanies = ({
    companies,
    sortBy,
    query = '',
}: {
    companies: Company[];
    sortBy: CompanySortBy;
    /** When set, prefix matches rank above contains matches. */
    query?: string;
}): Company[] => {
    const normalizedQuery = query.trim().toLowerCase();

    return companies.toSorted((a, b) => {
        if (normalizedQuery) {
            const rankDiff =
                searchMatchRank(a, normalizedQuery) -
                searchMatchRank(b, normalizedQuery);
            if (rankDiff !== 0) return rankDiff;
        }

        return compareBySort(a, b, sortBy);
    });
};
