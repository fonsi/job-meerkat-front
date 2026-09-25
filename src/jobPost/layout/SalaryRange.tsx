import styled from 'styled-components';
import { Colors } from '@/shared/styles/constants';
import { SalaryRange as SalaryRangeType } from '../http/getJobPosts';

type Props = {
    salaryRange: SalaryRangeType;
    $size?: 'md' | 'lg';
};

const Container = styled.div<{ $size: 'md' | 'lg' }>`
    align-items: baseline;
    color: ${Colors.accent};
    display: flex;
    flex-wrap: wrap;
    font-size: ${({ $size }) => ($size === 'lg' ? '28px' : '20px')};
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
`;

const Text = styled.span`
    font-size: 0.55em;
    font-weight: 500;
    letter-spacing: 0.02em;
    text-transform: uppercase;
`;

const Amount = styled.span`
    font-weight: 700;
`;

const beautifySalary = (salary: number): string | number => {
    if (salary / 1000 < 1) {
        return salary;
    }

    return `${(salary / 1000).toFixed()}K`;
};

const beautifyCurrency = (currency: string): string => currency.toUpperCase();

export const SalaryRangeAmount = ({ salaryRange }: Props) => {
    const currency = beautifyCurrency(salaryRange.currency);

    if (!salaryRange.min) {
        return (
            <>
                <Text>Up to&nbsp;</Text>
                <Amount>
                    {beautifySalary(salaryRange.max)} {currency}
                </Amount>
            </>
        );
    }

    if (!salaryRange.max) {
        return (
            <>
                <Text>From&nbsp;</Text>
                <Amount>
                    {beautifySalary(salaryRange.min)} {currency}
                </Amount>
            </>
        );
    }

    return (
        <Amount>
            {beautifySalary(salaryRange.min)}–{beautifySalary(salaryRange.max)}{' '}
            {currency}
        </Amount>
    );
};

export const SalaryRange = ({ salaryRange, $size = 'md' }: Props) => {
    if (!salaryRange || (!salaryRange.min && !salaryRange.max)) {
        return null;
    }

    return (
        <Container $size={$size}>
            <SalaryRangeAmount salaryRange={salaryRange} />
            <Text>&nbsp;/&nbsp;{salaryRange.period}</Text>
        </Container>
    );
};
