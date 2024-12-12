'use client'

import styled from 'styled-components';
import { Container } from '@/shared/layout/Container';
import { CompanyForm } from '@/company/layout/CompanyForm';
import { useState } from 'react';
import { Company } from '@/company/company';
import { Button } from '@/shared/layout/Button';

const StyledCreateCompanyFormContainer = styled.div`
    margin-top: 48px;
`;

export const CreateCompanyPage = () => {
    const [result, setResult] = useState<Company | null>(null);

    const handleCreateAnotherClick = () => {
        setResult(null);
    }

    const handleOnSuccess = (result: Company) => {
        setResult(result);
    }

    return <Container $maxWidth='800px' $margin='24px 0 0'>
        <h1>Create company</h1>
        <StyledCreateCompanyFormContainer>
            {
                result ?
                    <>
                        <p>Succesfully created company</p>
                        <ul>
                            <li>Id: { result.id }</li>
                            <li>Name: { result.name }</li>
                            <li>Home Page: { result.homePage }</li>
                        </ul>
                        <Button onClick={handleCreateAnotherClick}>Create another company</Button>
                    </> :
                    <CompanyForm onSuccess={handleOnSuccess} />
            }
        </StyledCreateCompanyFormContainer>
    </Container>
}