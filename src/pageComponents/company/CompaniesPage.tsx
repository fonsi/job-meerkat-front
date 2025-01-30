'use client';

import styled from 'styled-components';
import { Company } from '@/company/company';
import { Device } from '@/shared/styles/constants';
import { CompanyList } from '@/company/layout/CompanyList';

type Props = {
    companies: Company[];
};

const Container = styled.div`
    margin: 48px 12px;

    @media ${Device.laptopL} {
        margin: 48px 0;
    }
`;

export const CompaniesPage = ({ companies }: Props) => (
    <Container>
        <CompanyList companies={companies}></CompanyList>
    </Container>
);
