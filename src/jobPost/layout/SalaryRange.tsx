import styled from 'styled-components';
import { SalaryRange as SalaryRangeType } from '../jobPost';

type Props = {
    className?: string;
    salaryRange: SalaryRangeType;
    $size?: 'medium' | 'large';
};

const Container = styled.div`
    align-items: baseline;
    display: flex;
`;

const Text = styled.span<{ $size: 'medium' | 'large' }>`
    font-weight: 300;
    font-size: ${(props) => (props.$size === 'medium' ? '12px' : '16px')};
`;

const Amount = styled.span<{ $size: 'medium' | 'large' }>`
    font-size: ${(props) => (props.$size === 'medium' ? '16px' : '24px')};
    font-weight: 600;
`;

const beautifySalary = (salary: number): string | number => {
    if (salary / 1000 < 1) {
        return salary;
    }

    return `${(salary / 1000).toFixed()}K`;
};

const beautifyCurrency = (currency: string): string => currency.toUpperCase();

export const SalaryRangeAmount = ({ salaryRange, $size = 'medium' }: Props) => {
    const currency = beautifyCurrency(salaryRange.currency);

    if (!salaryRange.min) {
        return (
            <>
                <Text $size={$size}>Up to&nbsp;</Text>
                <Amount $size={$size}>
                    {beautifySalary(salaryRange.max)} {currency}
                </Amount>
            </>
        );
    }

    if (!salaryRange.max) {
        return (
            <>
                <Text $size={$size}>From&nbsp;</Text>
                <Amount $size={$size}>
                    {beautifySalary(salaryRange.min)} {currency}
                </Amount>
            </>
        );
    }

    return (
        <Amount $size={$size}>
            {beautifySalary(salaryRange.min)} -{' '}
            {beautifySalary(salaryRange.max)} {currency}
        </Amount>
    );
};

export const SalaryRange = ({
    salaryRange,
    className,
    $size = 'medium',
}: Props) => {
    if (!salaryRange || (!salaryRange.min && !salaryRange.max)) {
        return null;
    }

    return (
        <Container className={className}>
            <SalaryRangeAmount salaryRange={salaryRange} $size={$size} />
            <Text $size={$size}>&nbsp;/&nbsp;{salaryRange.period}</Text>
        </Container>
    );
};
