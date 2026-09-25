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
`;

const StatGrid = styled.div`
    background: ${Colors.darkGrey};
    border: 1px solid ${Colors.darkGrey};
    border-radius: 4px;
    display: grid;
    gap: 1px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    overflow: hidden;
`;

const Stat = styled.div`
    background: ${Colors.brokenBlack};
    padding: 16px 14px;
`;

const StatValue = styled.div<{ $accent?: boolean }>`
    color: ${({ $accent }) => ($accent ? Colors.accent : Colors.brokenWhite)};
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
                    <StatValue $accent={Boolean(stats.salary)}>
                        {salaryLabel}
                    </StatValue>
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
        </Wrap>
    );
};
