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
};

export const isCompanyDisabled = (company: Company): boolean =>
    company.status === 'disabled';

type CreateCompanyLinkParams = {
    companyId: string;
};

export const createCompanyLink = ({ companyId }: CreateCompanyLinkParams) =>
    `/company/${companyId}/`;

export const sortCompaniesByName = ({
    companies,
}: {
    companies: Company[];
}): Company[] =>
    companies.toSorted((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        return 0;
    });
