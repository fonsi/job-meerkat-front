import styled from 'styled-components';
import { HTMLProps, PropsWithChildren } from 'react';
import { Colors } from '../styles/constants';

type FormGroupProps = {
    error?: string | null;
}

const StyledLabel = styled.span`
    font-size: 12px;
    margin-bottom: 4px;
`;

const StyledInput = styled.input`
    padding: 4px;
`;

const StyledError = styled.span`
    color: ${Colors.red};
    font-size: 12px;
    margin-top: 4px;
`;

const StyledFormGroup = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
`;

const StyledFormRow = styled.div`
    display: flex;
    flex: 1;
    gap: 12px;
`;

const StyledFormFooter = styled.div`
    display: flex;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const Label = StyledLabel;

export const Input = StyledInput;

export const Error = StyledError;

export const FormGroup = ({ children, error }: PropsWithChildren<FormGroupProps>) => {
    return <>
        <StyledFormGroup>
            { children }
            {
                error ?
                    <Error>{error}</Error> :
                    null
            }    
        </StyledFormGroup>
    </>
}

export const FormRow = ({ children }: PropsWithChildren) => <StyledFormRow>{ children }</StyledFormRow>;

export const FormFooter = ({ children }: PropsWithChildren) => <StyledFormFooter>{ children }</StyledFormFooter>;

export const Form = (props: HTMLProps<HTMLFormElement>) =>
    <StyledForm {...props}>
        {props.children}
    </StyledForm>