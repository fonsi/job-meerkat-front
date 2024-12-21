import { HTMLProps } from 'react';
import styled from 'styled-components';

interface Props extends HTMLProps<HTMLButtonElement> {
    type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled.button`
    border-radius: 4px;
    padding: 8px 12px;
`;

export const Button = (props: Props) => (
    <StyledButton {...props}>{props.children}</StyledButton>
);
