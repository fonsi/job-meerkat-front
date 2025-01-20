import Company from '../../app/company/[id]/page';

export type CompanyLogo = {
    url: string;
    background?: string;
};

export type Company = {
    id: string;
    name: string;
    homePage: string;
    logo: CompanyLogo;
    jobPostsCount?: number;
};

type CreateCompanyLinkParams = {
    companyId: string;
};

export const createCompanyLink = ({ companyId }: CreateCompanyLinkParams) =>
    `/company/${companyId}`;

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
