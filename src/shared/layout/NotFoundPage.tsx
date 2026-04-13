import styled from 'styled-components';
import { Link } from '@tanstack/react-router';
import { Container } from '@/shared/layout/Container';
import { Colors } from '@/shared/styles/constants';

const Wrap = styled.div`
    margin: 48px 8px;
    max-width: 560px;
`;

const Title = styled.h1`
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 12px;
`;

const Body = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 15px;
    line-height: 1.5;
    margin: 0 0 20px;
`;

const HomeLink = styled(Link).attrs({ reloadDocument: true })`
    color: ${Colors.brokenWhite};
    font-size: 15px;
    font-weight: 600;
    text-decoration: underline;

    &:hover {
        color: ${Colors.mediumGrey};
    }
`;

export const NotFoundPage = () => (
    <Container>
        <Wrap>
            <Title>Page not found</Title>
            <Body>
                This page does not exist or may have been removed. Check the URL
                or return to the home page.
            </Body>
            <HomeLink to="/">Back to home</HomeLink>
        </Wrap>
    </Container>
);
