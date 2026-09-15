import { CategoryTree } from '@/category/category';
import { CompanyLogo } from '@/company/company';

export type NewsletterFrequency = 'daily' | 'weekly';

export type WorkplacePreference = 'remote' | 'on-site' | 'hybrid';

export type CompanyRule = {
    companyId: string;
    exclude?: boolean;
    includeAll?: boolean;
    allowedCategorySlugs?: string[] | null;
    allowedWorkplaces?: WorkplacePreference[] | null;
    publicSalaryOnly?: boolean;
};

export type NewsletterPreferences = {
    allowedCategorySlugs: string[] | null;
    allowedCompanyIds: string[] | null;
    allowedWorkplaces: WorkplacePreference[] | null;
    publicSalaryOnly: boolean;
    companyRules?: CompanyRule[] | null;
    updatedAt: number;
};

export type NewsletterCompany = {
    id: string;
    name: string;
    logo: CompanyLogo;
    jobPostsCount: number;
};

export type NewsletterPreferencesResponse = {
    preferences: NewsletterPreferences;
    frequency: NewsletterFrequency;
    email: string;
    categories: CategoryTree;
    companies: NewsletterCompany[];
};

export type NewsletterTokenError =
    | 'token_expired'
    | 'token_invalid'
    | 'not_found'
    | 'already_unsubscribed';
