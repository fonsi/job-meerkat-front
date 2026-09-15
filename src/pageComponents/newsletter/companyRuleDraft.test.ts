import { CompanyRule } from '@/newsletter/newsletter';
import {
    companyRuleToDraft,
    draftToCompanyRule,
    emptyCompanyRuleDraft,
} from './companyRuleDraft';

const ACME = 'acme-id';

describe('companyRuleDraft', () => {
    it('starts new custom filters on default for every dimension', () => {
        expect(emptyCompanyRuleDraft(ACME)).toEqual({
            companyId: ACME,
            salary: 'default',
            workplacesMode: 'default',
            workplaces: [],
            categoriesMode: 'default',
            categories: [],
        });
        expect(draftToCompanyRule(emptyCompanyRuleDraft(ACME))).toBeNull();
    });

    it('maps includeAll to all on every field', () => {
        const includeAll: CompanyRule = { companyId: ACME, includeAll: true };
        expect(draftToCompanyRule(companyRuleToDraft(includeAll))).toEqual({
            companyId: ACME,
            publicSalaryOnly: false,
            allowedWorkplaces: null,
            allowedCategorySlugs: null,
        });
    });

    it('round-trips sparse overrides', () => {
        const sparse: CompanyRule = {
            companyId: ACME,
            allowedWorkplaces: null,
            publicSalaryOnly: false,
        };
        expect(draftToCompanyRule(companyRuleToDraft(sparse))).toEqual(sparse);
    });
});
