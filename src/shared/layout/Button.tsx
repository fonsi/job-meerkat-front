import { HTMLProps } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    border-radius: 4px;
    padding: 8px 12px;
`;

export const Button = (props: HTMLProps<HTMLButtonElement>) =>
    <StyledButton {...props}>{props.children}</StyledButton>