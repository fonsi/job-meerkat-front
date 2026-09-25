'use client';

import styled from 'styled-components';
import type { JobPost } from '../http/getJobPosts';
import {
    CategoryFilter,
    countJobsMatchingFilters,
    JobListFilters,
    SALARY_FILTER_OPTIONS,
    WORKPLACE_FILTER_OPTIONS,
} from '../jobListFilters';
import { Colors } from '@/shared/styles/constants';

type CategoryOption = {
    value: CategoryFilter;
    label: string;
    count: number;
};

type Props = {
    filters: JobListFilters;
    jobPosts: JobPost[];
    onChange: (filters: JobListFilters) => void;
    categoryOptions?: CategoryOption[];
    className?: string;
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Group = styled.div`
    display: flex;
    flex-direction: column;
`;

const GroupTitle = styled.div`
    color: ${Colors.lightGrey};
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.14em;
    margin: 0 0 12px;
    text-transform: uppercase;
`;

const BadgeRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const FilterBadge = styled.button<{ $selected: boolean }>`
    background: transparent;
    border: 1px solid
        ${(props) => (props.$selected ? Colors.accent : Colors.mediumGrey)};
    border-radius: 999px;
    color: ${(props) => (props.$selected ? Colors.accent : Colors.lightGrey)};
    cursor: pointer;
    font-size: 12px;
    font-weight: ${(props) => (props.$selected ? 700 : 400)};
    padding: 4px 10px;
    transition:
        border-color 0.15s ease,
        color 0.15s ease;

    &:hover {
        border-color: ${Colors.accent};
        color: ${Colors.accent};
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 2px;
    }
`;

export const JobListFiltersControls = ({
    filters,
    jobPosts,
    onChange,
    categoryOptions,
    className,
}: Props) => {
    return (
        <Container className={className}>
            {categoryOptions && categoryOptions.length > 0 ? (
                <Group>
                    <GroupTitle>Filter by category</GroupTitle>
                    <BadgeRow>
                        {categoryOptions.map((option) => {
                            const selected = filters.category === option.value;

                            return (
                                <FilterBadge
                                    key={String(option.value)}
                                    type="button"
                                    $selected={selected}
                                    aria-pressed={selected}
                                    onClick={() =>
                                        onChange({
                                            ...filters,
                                            category: option.value,
                                        })
                                    }
                                >
                                    {option.label} · {option.count}
                                </FilterBadge>
                            );
                        })}
                    </BadgeRow>
                </Group>
            ) : null}
            <Group>
                <GroupTitle>Salary</GroupTitle>
                <BadgeRow>
                    {SALARY_FILTER_OPTIONS.map((option) => {
                        const selected =
                            filters.includeWithoutSalary === option.value;
                        const count = countJobsMatchingFilters(jobPosts, {
                            ...filters,
                            includeWithoutSalary: option.value,
                        });

                        return (
                            <FilterBadge
                                key={String(option.value)}
                                type="button"
                                $selected={selected}
                                aria-pressed={selected}
                                onClick={() =>
                                    onChange({
                                        ...filters,
                                        includeWithoutSalary: option.value,
                                    })
                                }
                            >
                                {option.label} · {count}
                            </FilterBadge>
                        );
                    })}
                </BadgeRow>
            </Group>
            <Group>
                <GroupTitle>Workplace</GroupTitle>
                <BadgeRow>
                    {WORKPLACE_FILTER_OPTIONS.map((option) => {
                        const selected = filters.workplace === option.value;
                        const count = countJobsMatchingFilters(jobPosts, {
                            ...filters,
                            workplace: option.value,
                        });

                        return (
                            <FilterBadge
                                key={option.value}
                                type="button"
                                $selected={selected}
                                aria-pressed={selected}
                                onClick={() =>
                                    onChange({
                                        ...filters,
                                        workplace: option.value,
                                    })
                                }
                            >
                                {option.label} · {count}
                            </FilterBadge>
                        );
                    })}
                </BadgeRow>
            </Group>
        </Container>
    );
};
