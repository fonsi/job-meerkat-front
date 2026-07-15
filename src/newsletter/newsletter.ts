import { CategoryTree } from '@/category/category';
import { CompanyLogo } from '@/company/company';

export type NewsletterFrequency = 'daily' | 'weekly';

export type NewsletterPreferences = {
    allowedCategorySlugs: string[] | null;
    allowedCompanyIds: string[] | null;
    allowedWorkplaces: ('remote' | 'on-site' | 'hybrid')[] | null;
    publicSalaryOnly: boolean;
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
