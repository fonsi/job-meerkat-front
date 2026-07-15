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
} from '@/newsletter/newsletter';
import { Button } from '@/shared/layout/Button';
import {
    Form,
    FormFooter,
    FormGroup,
    Input,
    Label,
} from '@/shared/layout/Form';
import {
    CategoryColumn,
    CategoryColumns,
    CategoryGroup,
    CategoryGroupTitle,
    CheckboxRow,
    CompanyGrid,
    CompanyOption,
    CompanyOptionImage,
    CompanyOptionLink,
    CompanyOptionMeta,
    CompanyOptionName,
    CompanyOptionOpenIcon,
    CompanyOptionTexts,
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

const toggleValue = (values: string[], value: string): string[] =>
    values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value];

const toAllowList = (selected: string[]): string[] | null =>
    selected.length ? selected : null;

const openJobsLabel = (count: number) =>
    count === 1 ? '1 open job post' : `${count} open job posts`;

const ENGINEERING_GROUP = 'Engineering';

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
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
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
            setSelectedCompanies(data.preferences.allowedCompanyIds ?? []);
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

        try {
            const result = await putNewsletterPreferences(token, {
                frequency,
                allowedCategorySlugs: toAllowList(selectedCategories),
                allowedCompanyIds: toAllowList(selectedCompanies),
                allowedWorkplaces: null,
                publicSalaryOnly,
            });
            setFrequency(result.frequency);
            setSaved(true);
        } finally {
            setSaving(false);
        }
    };

    const renderCategoryGroup = (group: CategoryTree[number]) => (
        <CategoryGroup key={group.name}>
            <CategoryGroupTitle>{group.name}</CategoryGroupTitle>
            {group.categories.map((category) => (
                <CheckboxRow key={category.slug}>
                    <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.slug)}
                        onChange={() =>
                            setSelectedCategories((current) =>
                                toggleValue(current, category.slug),
                            )
                        }
                    />
                    {category.name}
                </CheckboxRow>
            ))}
        </CategoryGroup>
    );

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
                    <CategoryColumns>
                        <CategoryColumn>
                            {categories
                                .filter(
                                    (group) => group.name === ENGINEERING_GROUP,
                                )
                                .map(renderCategoryGroup)}
                        </CategoryColumn>
                        <CategoryColumn>
                            {categories
                                .filter(
                                    (group) => group.name !== ENGINEERING_GROUP,
                                )
                                .map(renderCategoryGroup)}
                        </CategoryColumn>
                    </CategoryColumns>
                </Fieldset>

                <Fieldset>
                    <Legend>
                        Companies
                        <LegendAll>
                            <input
                                type="checkbox"
                                checked={selectedCompanies.length === 0}
                                onChange={() => {
                                    if (selectedCompanies.length > 0) {
                                        setSelectedCompanies([]);
                                    }
                                }}
                            />
                            all
                        </LegendAll>
                    </Legend>
                    <CompanyGrid>
                        {companies.map((company) => {
                            const selected = selectedCompanies.includes(
                                company.id,
                            );

                            return (
                                <CompanyOption
                                    key={company.id}
                                    $selected={selected}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={() =>
                                            setSelectedCompanies((current) =>
                                                toggleValue(
                                                    current,
                                                    company.id,
                                                ),
                                            )
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
                                            onClick={(e) => e.stopPropagation()}
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
                                </CompanyOption>
                            );
                        })}
                    </CompanyGrid>
                </Fieldset>
            </Form>
        </NewsletterContainer>
    );
};
