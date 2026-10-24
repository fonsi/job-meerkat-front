import styled from 'styled-components';
import { Colors } from '@/shared/styles/constants';
import {
    NEWSLETTER_SUBSCRIBE_ERROR_ATTR,
    NEWSLETTER_SUBSCRIBE_ERROR_MESSAGE,
} from './newsletterSubscribe';

// No `display` rule on purpose, so the `hidden` attribute keeps working for
// the vanilla SSR script on /jobpost pages.
const ErrorText = styled.p`
    color: ${Colors.red};
    font-size: 13px;
    line-height: 1.5;
    margin: 0;
`;

export const NewsletterSubscribeError = ({ visible }: { visible: boolean }) => (
    <ErrorText
        role="alert"
        hidden={!visible}
        {...{ [NEWSLETTER_SUBSCRIBE_ERROR_ATTR]: '' }}
    >
        {NEWSLETTER_SUBSCRIBE_ERROR_MESSAGE}
    </ErrorText>
);
