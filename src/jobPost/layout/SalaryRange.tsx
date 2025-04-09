import styled from 'styled-components';
import { SalaryRange as SalaryRangeType } from '../jobPost';

type Props = {
    salaryRange: SalaryRangeType;
};

const Container = styled.div`
    align-items: baseline;
    display: flex;
`;

const Text = styled.span`
    font-weight: 300;
    font-size: 12px;
`;

const Amount = styled.span`
    font-size: 16px;
    font-weight: 600;
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
            {beautifySalary(salaryRange.min)} -{' '}
            {beautifySalary(salaryRange.max)} {currency}
        </Amount>
    );
};

export const SalaryRange = ({ salaryRange }: Props) => {
    if (!salaryRange || (!salaryRange.min && !salaryRange.max)) {
        return null;
    }

    return (
        <Container>
            <SalaryRangeAmount salaryRange={salaryRange} />
            <Text>&nbsp;/&nbsp;{salaryRange.period}</Text>
        </Container>
    );
};
