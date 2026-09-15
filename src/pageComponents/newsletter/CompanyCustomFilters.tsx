import { CategoryTree, flattenCategoryTree } from '@/category/category';
import { createCompanyLink } from '@/company/company';
import {
    NewsletterCompany,
    WorkplacePreference,
} from '@/newsletter/newsletter';
import {
    CheckboxRow,
    CompanyOptionImage,
    CompanyOptionLink,
    CompanyOptionMeta,
    CompanyOptionName,
    CompanyOptionOpenIcon,
    CompanyOptionTexts,
    CompanyRuleActions,
    CompanyRuleHeader,
    CompanyRuleHint,
    CompanyRuleIdentity,
    CompanyRuleSection,
    Fieldset,
    FilterRow,
    FilterRowExtra,
    FilterRowLabel,
    FilterRowMain,
    FilterSelect,
    Legend,
    RuleAction,
    RuleActionDanger,
} from './newsletterLayout';
import { CategoryColumnsPicker } from './CategoryColumnsPicker';
import {
    CompanyRuleDraft,
    DEFAULT_WORKPLACES,
    ListMode,
    SalaryMode,
    WORKPLACE_OPTIONS,
    companyRuleSectionId,
} from './companyRuleDraft';

type Props = {
    drafts: CompanyRuleDraft[];
    companies: NewsletterCompany[];
    categories: CategoryTree;
    globalPublicSalaryOnly: boolean;
    globalWorkplaces: WorkplacePreference[];
    globalCategories: string[];
    onChange: (companyId: string, patch: Partial<CompanyRuleDraft>) => void;
    onRemove: (companyId: string) => void;
    onExclude: (companyId: string) => void;
};

const openJobsLabel = (count: number) =>
    count === 1 ? '1 open job post' : `${count} open job posts`;

export const CompanyCustomFilters = ({
    drafts,
    companies,
    categories,
    globalPublicSalaryOnly,
    globalWorkplaces,
    globalCategories,
    onChange,
    onRemove,
    onExclude,
}: Props) => {
    if (drafts.length === 0) {
        return null;
    }

    const globalSalaryLabel = globalPublicSalaryOnly
        ? 'public salary only'
        : 'any salary';
    const globalWorkplaceLabel = summarizeWorkplaces(globalWorkplaces);
    const globalCategoryLabel = summarizeCategories(
        globalCategories,
        categories,
    );

    return (
        <Fieldset>
            <Legend>Custom company filters</Legend>
            <CompanyRuleHint>
                These companies leave the list below. Change only what should
                differ from the filters above.
            </CompanyRuleHint>
            {drafts.map((draft) => {
                const company = companies.find((c) => c.id === draft.companyId);

                return (
                    <CompanyRuleSection
                        key={draft.companyId}
                        id={companyRuleSectionId(draft.companyId)}
                    >
                        <CompanyRuleHeader>
                            <CompanyRuleIdentity>
                                {company ? (
                                    <CompanyOptionImage
                                        company={{
                                            id: company.id,
                                            name: company.name,
                                            logo: company.logo,
                                        }}
                                    />
                                ) : null}
                                <CompanyOptionTexts>
                                    {company ? (
                                        <CompanyOptionLink
                                            to={createCompanyLink({
                                                companyId: company.id,
                                            })}
                                        >
                                            <CompanyOptionName>
                                                {company.name}
                                            </CompanyOptionName>
                                            <CompanyOptionOpenIcon />
                                        </CompanyOptionLink>
                                    ) : (
                                        <CompanyOptionName>
                                            {draft.companyId}
                                        </CompanyOptionName>
                                    )}
                                    <CompanyOptionMeta>
                                        {company?.jobPostsCount
                                            ? openJobsLabel(
                                                  company.jobPostsCount,
                                              )
                                            : 'No open job posts'}
                                    </CompanyOptionMeta>
                                </CompanyOptionTexts>
                            </CompanyRuleIdentity>
                            <CompanyRuleActions>
                                <RuleAction
                                    type="button"
                                    onClick={() => onRemove(draft.companyId)}
                                >
                                    Use global filters
                                </RuleAction>
                                <RuleActionDanger
                                    type="button"
                                    onClick={() => onExclude(draft.companyId)}
                                >
                                    Exclude
                                </RuleActionDanger>
                            </CompanyRuleActions>
                        </CompanyRuleHeader>
                        <FilterRow>
                            <FilterRowMain>
                                <FilterRowLabel>Public salary</FilterRowLabel>
                                <FilterSelect
                                    value={draft.salary}
                                    onChange={(event) =>
                                        onChange(draft.companyId, {
                                            salary: event.target
                                                .value as SalaryMode,
                                        })
                                    }
                                >
                                    <option value="default">
                                        Same as global ({globalSalaryLabel})
                                    </option>
                                    <option value="yes">
                                        Public salary only
                                    </option>
                                    <option value="all">Any offer</option>
                                </FilterSelect>
                            </FilterRowMain>
                        </FilterRow>
                        <FilterRow>
                            <FilterRowMain>
                                <FilterRowLabel>Workplaces</FilterRowLabel>
                                <FilterSelect
                                    value={draft.workplacesMode}
                                    onChange={(event) => {
                                        const workplacesMode = event.target
                                            .value as ListMode;
                                        onChange(draft.companyId, {
                                            workplacesMode,
                                            workplaces:
                                                workplacesMode === 'custom' &&
                                                draft.workplaces.length === 0
                                                    ? globalWorkplaces.length
                                                        ? [...globalWorkplaces]
                                                        : [
                                                              ...DEFAULT_WORKPLACES,
                                                          ]
                                                    : draft.workplaces,
                                        });
                                    }}
                                >
                                    <option value="default">
                                        Same as global ({globalWorkplaceLabel})
                                    </option>
                                    <option value="all">Any workplace</option>
                                    <option value="custom">Choose…</option>
                                </FilterSelect>
                            </FilterRowMain>
                            {draft.workplacesMode === 'custom' ? (
                                <FilterRowExtra>
                                    {WORKPLACE_OPTIONS.map((option) => (
                                        <CheckboxRow key={option.value}>
                                            <input
                                                type="checkbox"
                                                checked={draft.workplaces.includes(
                                                    option.value,
                                                )}
                                                onChange={() =>
                                                    onChange(draft.companyId, {
                                                        workplaces:
                                                            toggleWorkplace(
                                                                draft.workplaces,
                                                                option.value,
                                                            ),
                                                    })
                                                }
                                            />
                                            {option.label}
                                        </CheckboxRow>
                                    ))}
                                </FilterRowExtra>
                            ) : null}
                        </FilterRow>
                        <FilterRow>
                            <FilterRowMain>
                                <FilterRowLabel>Categories</FilterRowLabel>
                                <FilterSelect
                                    value={draft.categoriesMode}
                                    onChange={(event) => {
                                        const categoriesMode = event.target
                                            .value as ListMode;
                                        onChange(draft.companyId, {
                                            categoriesMode,
                                            categories:
                                                categoriesMode === 'custom' &&
                                                draft.categories.length === 0
                                                    ? [...globalCategories]
                                                    : draft.categories,
                                        });
                                    }}
                                >
                                    <option value="default">
                                        Same as global ({globalCategoryLabel})
                                    </option>
                                    <option value="all">Any category</option>
                                    <option value="custom">Choose…</option>
                                </FilterSelect>
                            </FilterRowMain>
                            {draft.categoriesMode === 'custom' ? (
                                <FilterRowExtra>
                                    <CategoryColumnsPicker
                                        categories={categories}
                                        selected={draft.categories}
                                        onChange={(next) =>
                                            onChange(draft.companyId, {
                                                categories: next,
                                            })
                                        }
                                    />
                                </FilterRowExtra>
                            ) : null}
                        </FilterRow>
                    </CompanyRuleSection>
                );
            })}
        </Fieldset>
    );
};

const summarizeWorkplaces = (values: WorkplacePreference[]) => {
    if (!values.length) {
        return 'any workplace';
    }

    return values
        .map(
            (value) =>
                WORKPLACE_OPTIONS.find((option) => option.value === value)
                    ?.label ?? value,
        )
        .join(', ');
};

const summarizeCategories = (slugs: string[], tree: CategoryTree) => {
    if (!slugs.length) {
        return 'all categories';
    }

    const names = flattenCategoryTree(tree)
        .filter((category) => slugs.includes(category.slug))
        .map((category) => category.name);

    if (names.length <= 2) {
        return names.join(', ') || `${slugs.length} categories`;
    }

    return `${names.length} categories`;
};

const toggleWorkplace = (
    values: WorkplacePreference[],
    value: WorkplacePreference,
): WorkplacePreference[] => {
    const next = values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value];

    return next.length ? next : [...DEFAULT_WORKPLACES];
};
