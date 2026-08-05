'use client';

import styled from 'styled-components';
import type { JobPost } from '../http/getJobPosts';
import {
    countJobsMatchingFilters,
    JobListFilters,
    SALARY_FILTER_OPTIONS,
    WORKPLACE_FILTER_OPTIONS,
} from '../jobListFilters';
import { Colors } from '@/shared/styles/constants';

type Props = {
    filters: JobListFilters;
    jobPosts: JobPost[];
    onChange: (filters: JobListFilters) => void;
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
    color: ${Colors.brokenWhite};
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 10px;
`;

const BadgeRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const FilterBadge = styled.button<{ $selected: boolean }>`
    background: transparent;
    border: 1px solid
        ${(props) => (props.$selected ? Colors.brokenWhite : Colors.mediumGrey)};
    border-radius: 999px;
    color: ${(props) =>
        props.$selected ? Colors.brokenWhite : Colors.lightGrey};
    cursor: pointer;
    font-size: 12px;
    font-weight: ${(props) => (props.$selected ? 600 : 400)};
    padding: 4px 10px;

    &:hover {
        border-color: ${Colors.brokenWhite};
        color: ${Colors.brokenWhite};
    }
`;

export const JobListFiltersControls = ({
    filters,
    jobPosts,
    onChange,
    className,
}: Props) => {
    return (
        <Container className={className}>
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
