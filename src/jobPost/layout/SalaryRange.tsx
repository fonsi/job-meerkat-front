import styled from 'styled-components';
import { SalaryRange as SalaryRangeType } from '../http/getJobPosts'

type Props = {
    salaryRange: SalaryRangeType;
}

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

    return `${salary / 1000}K`;
}

const beautifyCurrency = (currency: string): string => currency.toUpperCase();

export const SalaryRange = ({ salaryRange }: Props) => {
    if (!salaryRange || (!salaryRange.min && !salaryRange.max)) {
        return null;
    }
    
    const currency = beautifyCurrency(salaryRange.currency);

    if (!salaryRange.min) {
        return <><Text>Up to</Text><Amount>{beautifySalary(salaryRange.max)} {currency}</Amount></>;
    }

    if (!salaryRange.max) {
        return <><Text>From</Text><Amount>{beautifySalary(salaryRange.min)} {currency}</Amount></>;
    }

    return <Amount>{beautifySalary(salaryRange.min)} - {beautifySalary(salaryRange.max)} {currency}</Amount>;
}