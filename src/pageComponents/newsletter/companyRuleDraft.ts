import { CompanyRule, WorkplacePreference } from '@/newsletter/newsletter';

export type SalaryMode = 'default' | 'yes' | 'all';
export type ListMode = 'default' | 'all' | 'custom';

export type CompanyRuleDraft = {
    companyId: string;
    salary: SalaryMode;
    workplacesMode: ListMode;
    workplaces: WorkplacePreference[];
    categoriesMode: ListMode;
    categories: string[];
};

export const WORKPLACE_OPTIONS: {
    value: WorkplacePreference;
    label: string;
}[] = [
    { value: 'remote', label: 'Remote' },
    { value: 'on-site', label: 'On-site' },
    { value: 'hybrid', label: 'Hybrid' },
];

export const DEFAULT_WORKPLACES: WorkplacePreference[] = ['remote'];

export const emptyCompanyRuleDraft = (companyId: string): CompanyRuleDraft => ({
    companyId,
    salary: 'default',
    workplacesMode: 'default',
    workplaces: [],
    categoriesMode: 'default',
    categories: [],
});

export const companyRuleToDraft = (rule: CompanyRule): CompanyRuleDraft => {
    const draft = emptyCompanyRuleDraft(rule.companyId);
    if (rule.includeAll) {
        return {
            ...draft,
            salary: 'all',
            workplacesMode: 'all',
            categoriesMode: 'all',
        };
    }
    if (typeof rule.publicSalaryOnly === 'boolean') {
        draft.salary = rule.publicSalaryOnly ? 'yes' : 'all';
    }
    if ('allowedWorkplaces' in rule) {
        if (rule.allowedWorkplaces == null) {
            draft.workplacesMode = 'all';
        } else {
            draft.workplacesMode = 'custom';
            draft.workplaces = rule.allowedWorkplaces;
        }
    }
    if ('allowedCategorySlugs' in rule) {
        if (rule.allowedCategorySlugs == null) {
            draft.categoriesMode = 'all';
        } else {
            draft.categoriesMode = 'custom';
            draft.categories = rule.allowedCategorySlugs;
        }
    }

    return draft;
};

export const draftToCompanyRule = (
    draft: CompanyRuleDraft,
): CompanyRule | null => {
    const rule: CompanyRule = { companyId: draft.companyId };
    if (draft.salary === 'yes') {
        rule.publicSalaryOnly = true;
    }
    if (draft.salary === 'all') {
        rule.publicSalaryOnly = false;
    }
    if (draft.workplacesMode === 'all') {
        rule.allowedWorkplaces = null;
    }
    if (draft.workplacesMode === 'custom') {
        rule.allowedWorkplaces = draft.workplaces.length
            ? draft.workplaces
            : [...DEFAULT_WORKPLACES];
    }
    if (draft.categoriesMode === 'all') {
        rule.allowedCategorySlugs = null;
    }
    if (draft.categoriesMode === 'custom') {
        rule.allowedCategorySlugs = draft.categories.length
            ? draft.categories
            : null;
    }

    if (
        !('publicSalaryOnly' in rule) &&
        !('allowedWorkplaces' in rule) &&
        !('allowedCategorySlugs' in rule)
    ) {
        return null;
    }

    return rule;
};

export const companyRuleSectionId = (companyId: string) =>
    `company-rule-${companyId}`;
