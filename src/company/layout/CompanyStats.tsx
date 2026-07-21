'use client';

import styled from 'styled-components';
import {
    CompanyJobStats,
    formatSalaryCompact,
} from '@/company/getCompanyJobStats';
import { Colors } from '@/shared/styles/constants';

type Props = {
    stats: CompanyJobStats;
};

const Wrap = styled.section`
    display: flex;
    flex-direction: column;
    gap: 36px;
`;

const StatGrid = styled.div`
    background: ${Colors.brokenWhite};
    border-radius: 8px;
    color: ${Colors.brokenBlack};
    display: grid;
    gap: 1px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    overflow: hidden;
`;

const Stat = styled.div`
    background: ${Colors.brokenWhite};
    padding: 16px 14px;
`;

const StatValue = styled.div`
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.15;
`;

const StatLabel = styled.div`
    color: ${Colors.mediumGrey};
    font-size: 12px;
    font-weight: 400;
    margin-top: 6px;
`;

const SectionTitle = styled.h2`
    color: ${Colors.brokenWhite};
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 10px;
`;

const CategoryList = styled.ul`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    list-style: none;
    margin: 0;
    padding: 0;
`;

const CategoryItem = styled.li`
    border: 1px solid ${Colors.mediumGrey};
    border-radius: 999px;
    color: ${Colors.lightGrey};
    font-size: 12px;
    padding: 4px 10px;
`;

const formatCategory = (category: string): string =>
    category
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

export const CompanyStats = ({ stats }: Props) => {
    if (stats.openCount === 0) {
        return null;
    }

    const salaryLabel = stats.salary
        ? `${formatSalaryCompact(stats.salary.min, stats.salary.currency)}–${formatSalaryCompact(stats.salary.max, stats.salary.currency)}`
        : '—';

    return (
        <Wrap aria-label="Company hiring stats">
            <StatGrid>
                <Stat>
                    <StatValue>{stats.openCount}</StatValue>
                    <StatLabel>Open roles</StatLabel>
                </Stat>
                <Stat>
                    <StatValue>{stats.salary?.jobsWithSalary ?? 0}</StatValue>
                    <StatLabel>With public salary</StatLabel>
                </Stat>
                <Stat>
                    <StatValue>{salaryLabel}</StatValue>
                    <StatLabel>
                        {stats.salary
                            ? `Range / year · median ${formatSalaryCompact(stats.salary.median, stats.salary.currency)}`
                            : 'Salary range'}
                    </StatLabel>
                </Stat>
                <Stat>
                    <StatValue>{stats.postedLast30Days}</StatValue>
                    <StatLabel>Posted in last 30 days</StatLabel>
                </Stat>
            </StatGrid>

            {stats.categories.length > 0 ? (
                <div>
                    <SectionTitle>Open by category</SectionTitle>
                    <CategoryList>
                        {stats.categories.map(({ category, count }) => (
                            <CategoryItem key={category}>
                                {formatCategory(category)} · {count}
                            </CategoryItem>
                        ))}
                    </CategoryList>
                </div>
            ) : null}
        </Wrap>
    );
};
