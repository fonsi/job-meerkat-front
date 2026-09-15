'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { CategoryTree } from '@/category/category';
import { createCompanyLink } from '@/company/company';
import {
    getNewsletterPreferences,
    parseTokenError,
    putNewsletterPreferences,
    requestNewsletterLink,
} from '@/newsletter/http/newsletterApi';
import {
    NewsletterCompany,
    NewsletterFrequency,
    WorkplacePreference,
} from '@/newsletter/newsletter';
import { Button } from '@/shared/layout/Button';
import {
    Form,
    FormFooter,
    FormGroup,
    Input,
    Label,
} from '@/shared/layout/Form';
import { CategoryColumnsPicker } from './CategoryColumnsPicker';
import { CompanyCustomFilters } from './CompanyCustomFilters';
import {
    CompanyRuleDraft,
    DEFAULT_WORKPLACES,
    WORKPLACE_OPTIONS,
    companyRuleSectionId,
    companyRuleToDraft,
    draftToCompanyRule,
    emptyCompanyRuleDraft,
} from './companyRuleDraft';
import {
    CheckboxRow,
    CompanyGrid,
    CompanyOption,
    CompanyOptionAction,
    CompanyOptionImage,
    CompanyOptionLink,
    CompanyOptionMain,
    CompanyOptionMeta,
    CompanyOptionName,
    CompanyOptionOpenIcon,
    CompanyOptionTexts,
    DimensionLabel,
    Fieldset,
    Legend,
    LegendAll,
    NewsletterBanner,
    NewsletterContainer,
    NewsletterText,
    NewsletterTitle,
    SettingsEmail,
    SettingsHeader,
    SettingsRow,
    SettingsTitle,
    SettingsTitleBlock,
} from './newsletterLayout';

type Props = {
    token?: string;
};

const toggleValue = <T,>(values: T[], value: T): T[] =>
    values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value];

const toAllowList = <T,>(selected: T[]): T[] | null =>
    selected.length ? selected : null;

const openJobsLabel = (count: number) =>
    count === 1 ? '1 open job post' : `${count} open job posts`;

const scrollToCompanyRule = (companyId: string) => {
    document
        .getElementById(companyRuleSectionId(companyId))
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const SettingsNewsletterPage = ({ token }: Props) => {
    const [loading, setLoading] = useState(!!token);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [expired, setExpired] = useState(false);
    const [requestEmail, setRequestEmail] = useState('');
    const [linkSent, setLinkSent] = useState(false);
    const [frequency, setFrequency] = useState<NewsletterFrequency>('daily');
    const [publicSalaryOnly, setPublicSalaryOnly] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedWorkplaces, setSelectedWorkplaces] =
        useState<WorkplacePreference[]>(DEFAULT_WORKPLACES);
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
    const [companyRuleDrafts, setCompanyRuleDrafts] = useState<
        CompanyRuleDraft[]
    >([]);
    const [categories, setCategories] = useState<CategoryTree>([]);
    const [companies, setCompanies] = useState<NewsletterCompany[]>([]);
    const [email, setEmail] = useState('');

    const loadPreferences = useCallback(async (activeToken: string) => {
        setLoading(true);
        setExpired(false);

        try {
            const data = await getNewsletterPreferences(activeToken);
            setFrequency(data.frequency);
            setPublicSalaryOnly(data.preferences.publicSalaryOnly ?? true);
            setSelectedCategories(data.preferences.allowedCategorySlugs ?? []);
            setSelectedWorkplaces(
                data.preferences.allowedWorkplaces ?? [...DEFAULT_WORKPLACES],
            );
            const storedRules = data.preferences.companyRules ?? [];
            const excludedIds = new Set(
                storedRules
                    .filter((rule) => rule.exclude)
                    .map((rule) => rule.companyId),
            );
            const customRules = storedRules.filter((rule) => !rule.exclude);
            const customIds = new Set(
                customRules.map((rule) => rule.companyId),
            );
            const nameOf = (id: string) =>
                data.companies.find((c) => c.id === id)?.name ?? id;
            setCompanyRuleDrafts(
                customRules
                    .map(companyRuleToDraft)
                    .sort((a, b) =>
                        nameOf(a.companyId).localeCompare(
                            nameOf(b.companyId),
                            undefined,
                            { sensitivity: 'base' },
                        ),
                    ),
            );
            const gridIds = data.companies
                .filter((company) => !customIds.has(company.id))
                .map((company) => company.id);
            if (data.preferences.allowedCompanyIds == null) {
                setSelectedCompanies(
                    gridIds.filter((id) => !excludedIds.has(id)),
                );
            } else {
                setSelectedCompanies(
                    data.preferences.allowedCompanyIds.filter(
                        (id) => !customIds.has(id) && !excludedIds.has(id),
                    ),
                );
            }
            setCategories(data.categories);
            setCompanies(data.companies);
            setEmail(data.email);
        } catch (error) {
            const tokenError = parseTokenError(error);
            if (tokenError) {
                setExpired(true);
                window.history.replaceState({}, '', '/newsletter/settings/');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (token) {
            void loadPreferences(token);
        }
    }, [token, loadPreferences]);

    const onRequestLink = async (event: FormEvent) => {
        event.preventDefault();
        await requestNewsletterLink(requestEmail.trim());
        setLinkSent(true);
    };

    const onSave = async (event: FormEvent) => {
        event.preventDefault();
        if (!token) {
            return;
        }

        setSaving(true);
        setSaved(false);

        const customIds = companyRuleDrafts.map((d) => d.companyId);
        const gridIds = companies
            .filter((company) => !customIds.includes(company.id))
            .map((company) => company.id);
        const allGridSelected = gridIds.every((id) =>
            selectedCompanies.includes(id),
        );
        const companyRules = companyRuleDrafts
            .map(draftToCompanyRule)
            .filter((rule) => rule != null);
        const allowedCompanyIds = allGridSelected
            ? null
            : [
                  ...new Set([
                      ...selectedCompanies.filter(
                          (id) => !customIds.includes(id),
                      ),
                      ...companyRules.map((rule) => rule.companyId),
                  ]),
              ];

        try {
            const result = await putNewsletterPreferences(token, {
                frequency,
                allowedCategorySlugs: toAllowList(selectedCategories),
                allowedCompanyIds,
                allowedWorkplaces: selectedWorkplaces.length
                    ? selectedWorkplaces
                    : [...DEFAULT_WORKPLACES],
                publicSalaryOnly,
                companyRules: companyRules.length ? companyRules : null,
            });
            setFrequency(result.frequency);
            setCompanyRuleDrafts(
                companyRules.map((rule) => companyRuleToDraft(rule)),
            );
            setSaved(true);
        } finally {
            setSaving(false);
        }
    };

    const onToggleCompany = (companyId: string) => {
        setSelectedCompanies((current) => toggleValue(current, companyId));
    };

    const addCustomFilters = (companyId: string) => {
        if (companyRuleDrafts.some((d) => d.companyId === companyId)) {
            scrollToCompanyRule(companyId);
            return;
        }

        setCompanyRuleDrafts((current) => [
            emptyCompanyRuleDraft(companyId),
            ...current,
        ]);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => scrollToCompanyRule(companyId));
        });
    };

    const removeCustomFilters = (companyId: string) => {
        setCompanyRuleDrafts((current) =>
            current.filter((d) => d.companyId !== companyId),
        );
        setSelectedCompanies((current) =>
            current.includes(companyId) ? current : [...current, companyId],
        );
    };

    const excludeCompany = (companyId: string) => {
        setCompanyRuleDrafts((current) =>
            current.filter((d) => d.companyId !== companyId),
        );
        setSelectedCompanies((current) =>
            current.filter((id) => id !== companyId),
        );
    };

    const patchCompanyRule = (
        companyId: string,
        patch: Partial<CompanyRuleDraft>,
    ) => {
        setCompanyRuleDrafts((current) =>
            current.map((d) =>
                d.companyId === companyId ? { ...d, ...patch } : d,
            ),
        );
    };

    if (!token || expired) {
        return (
            <NewsletterContainer>
                <NewsletterTitle>Manage your subscription</NewsletterTitle>
                {expired ? (
                    <NewsletterBanner $variant="error">
                        Your session expired. Request a new link below.
                    </NewsletterBanner>
                ) : (
                    <NewsletterText>
                        Enter your email and we&apos;ll send you a link to
                        manage your newsletter settings.
                    </NewsletterText>
                )}

                {linkSent ? (
                    <NewsletterBanner $variant="success">
                        Check your inbox. If this email is subscribed, we sent a
                        login link.
                    </NewsletterBanner>
                ) : (
                    <Form onSubmit={onRequestLink}>
                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={requestEmail}
                                onChange={(e) =>
                                    setRequestEmail(e.target.value)
                                }
                            />
                        </FormGroup>
                        <FormFooter>
                            <Button type="submit">Email me a login link</Button>
                        </FormFooter>
                    </Form>
                )}

                <NewsletterText>
                    <Link reloadDocument to="/newsletter/">
                        Subscribe to the newsletter
                    </Link>
                </NewsletterText>
            </NewsletterContainer>
        );
    }

    if (loading) {
        return (
            <NewsletterContainer>
                <NewsletterTitle>Loading settings…</NewsletterTitle>
            </NewsletterContainer>
        );
    }

    const customCompanyIds = new Set(
        companyRuleDrafts.map((draft) => draft.companyId),
    );
    const gridCompanies = companies.filter(
        (company) => !customCompanyIds.has(company.id),
    );
    const allGridSelected =
        gridCompanies.length === 0 ||
        gridCompanies.every((company) =>
            selectedCompanies.includes(company.id),
        );

    return (
        <NewsletterContainer>
            {saved ? (
                <NewsletterBanner $variant="success">
                    Your preferences were saved.
                </NewsletterBanner>
            ) : null}

            <Form onSubmit={onSave}>
                <SettingsHeader>
                    <SettingsTitleBlock>
                        <SettingsTitle>Newsletter settings</SettingsTitle>
                        {email ? <SettingsEmail>{email}</SettingsEmail> : null}
                    </SettingsTitleBlock>
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Saving…' : 'Save preferences'}
                    </Button>
                </SettingsHeader>

                <SettingsRow>
                    <Fieldset>
                        <Legend>Frequency</Legend>
                        <CheckboxRow>
                            <input
                                type="radio"
                                name="frequency"
                                checked={frequency === 'daily'}
                                onChange={() => setFrequency('daily')}
                            />
                            Daily digest
                        </CheckboxRow>
                        <CheckboxRow>
                            <input
                                type="radio"
                                name="frequency"
                                checked={frequency === 'weekly'}
                                onChange={() => setFrequency('weekly')}
                            />
                            Weekly digest (Mondays)
                        </CheckboxRow>
                    </Fieldset>

                    <Fieldset>
                        <Legend>Filters</Legend>
                        <CheckboxRow>
                            <input
                                type="checkbox"
                                checked={publicSalaryOnly}
                                onChange={(e) =>
                                    setPublicSalaryOnly(e.target.checked)
                                }
                            />
                            Public salary offers only
                        </CheckboxRow>
                        <DimensionLabel>Workplaces</DimensionLabel>
                        {WORKPLACE_OPTIONS.map((option) => (
                            <CheckboxRow key={option.value}>
                                <input
                                    type="checkbox"
                                    checked={selectedWorkplaces.includes(
                                        option.value,
                                    )}
                                    onChange={() =>
                                        setSelectedWorkplaces((current) => {
                                            const next = toggleValue(
                                                current,
                                                option.value,
                                            );

                                            return next.length
                                                ? next
                                                : [...DEFAULT_WORKPLACES];
                                        })
                                    }
                                />
                                {option.label}
                            </CheckboxRow>
                        ))}
                    </Fieldset>
                </SettingsRow>

                <Fieldset>
                    <Legend>
                        Categories
                        <LegendAll>
                            <input
                                type="checkbox"
                                checked={selectedCategories.length === 0}
                                onChange={() => {
                                    if (selectedCategories.length > 0) {
                                        setSelectedCategories([]);
                                    }
                                }}
                            />
                            all
                        </LegendAll>
                    </Legend>
                    <CategoryColumnsPicker
                        categories={categories}
                        selected={selectedCategories}
                        onChange={setSelectedCategories}
                    />
                </Fieldset>

                <CompanyCustomFilters
                    drafts={companyRuleDrafts}
                    companies={companies}
                    categories={categories}
                    globalPublicSalaryOnly={publicSalaryOnly}
                    globalWorkplaces={selectedWorkplaces}
                    globalCategories={selectedCategories}
                    onChange={patchCompanyRule}
                    onRemove={removeCustomFilters}
                    onExclude={excludeCompany}
                />

                <Fieldset>
                    <Legend>
                        Companies
                        <LegendAll>
                            <input
                                type="checkbox"
                                checked={allGridSelected}
                                onChange={() => {
                                    if (!allGridSelected) {
                                        setSelectedCompanies(
                                            gridCompanies.map(
                                                (company) => company.id,
                                            ),
                                        );
                                    }
                                }}
                            />
                            all
                        </LegendAll>
                    </Legend>
                    <CompanyGrid>
                        {gridCompanies.map((company) => {
                            const selected = selectedCompanies.includes(
                                company.id,
                            );

                            return (
                                <CompanyOption
                                    key={company.id}
                                    $selected={selected}
                                >
                                    <CompanyOptionMain>
                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            onChange={() =>
                                                onToggleCompany(company.id)
                                            }
                                        />
                                        <CompanyOptionImage
                                            company={{
                                                id: company.id,
                                                name: company.name,
                                                logo: company.logo,
                                            }}
                                        />
                                        <CompanyOptionTexts>
                                            <CompanyOptionLink
                                                to={createCompanyLink({
                                                    companyId: company.id,
                                                })}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <CompanyOptionName>
                                                    {company.name}
                                                </CompanyOptionName>
                                                <CompanyOptionOpenIcon />
                                            </CompanyOptionLink>
                                            <CompanyOptionMeta>
                                                {company.jobPostsCount
                                                    ? openJobsLabel(
                                                          company.jobPostsCount,
                                                      )
                                                    : 'No open job posts'}
                                            </CompanyOptionMeta>
                                        </CompanyOptionTexts>
                                    </CompanyOptionMain>
                                    <CompanyOptionAction
                                        type="button"
                                        onClick={() =>
                                            addCustomFilters(company.id)
                                        }
                                    >
                                        Customize
                                    </CompanyOptionAction>
                                </CompanyOption>
                            );
                        })}
                    </CompanyGrid>
                </Fieldset>
            </Form>
        </NewsletterContainer>
    );
};
