import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { Form, FormGroup, FormRow, Input, Label, Error, FormFooter } from '@/shared/layout/Form';
import { Button } from '@/shared/layout/Button';
import { createCompany } from '../createCompany';
import { Company } from '../company';

type CompanyFormProps = {
    onSuccess: (response: Company) => void,
}

export const CompanyForm = ({ onSuccess }: CompanyFormProps) => {
    const [error, setError] = useState<string | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);
    const [homePageError, setHomePageError] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [homePage, setHomePage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const handleOnNameChanged: ChangeEventHandler<HTMLInputElement> = (event) => {
        setName(event.currentTarget.value);
    }

    const handleOnHomePageChanged: ChangeEventHandler<HTMLInputElement> = (event) => {
        setHomePage(event.currentTarget.value);
    }

    const resetErrors = () => {
        setError(null);
        setNameError(null);
        setHomePageError(null);
    }

    const validate = () => {
        let isValid = true;

        if (!name) {
            setNameError('Name field could not be empty');
            isValid = false;
        }

        if (!homePage) {
            setHomePageError('Url fiel could not be empty');
            isValid = false;
        }

        return isValid;
    }

    const handleOnSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        try {
            event.preventDefault();

            setIsProcessing(true);

            resetErrors();

            const isValid = validate();

            if (!isValid) {
                return;
            }

            const response = await createCompany({ name, homePage });

            onSuccess(response);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setIsProcessing(false);
        }
    }

    return <Form onSubmit={handleOnSubmit}>
        <FormRow>
            <FormGroup error={nameError}>
                <Label htmlFor='company-name'>Name</Label>
                <Input name='company-name' onChange={handleOnNameChanged} value={name} disabled={isProcessing} />
            </FormGroup>

            <FormGroup error={homePageError}>
                <Label htmlFor='company-home-page'>Home page</Label>
                <Input name='company-home-page' onChange={handleOnHomePageChanged} value={homePage} disabled={isProcessing} />
            </FormGroup>
        </FormRow>

        {
        error ? 
            <Error>{error}</Error> :
            null
        }

        <FormFooter>
            <Button type='submit' disabled={isProcessing}>Create</Button>
        </FormFooter>
    </Form>
}