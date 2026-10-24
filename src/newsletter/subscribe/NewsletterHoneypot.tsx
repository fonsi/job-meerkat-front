import styled from 'styled-components';
import {
    NEWSLETTER_HONEYPOT_ATTR,
    NEWSLETTER_HONEYPOT_FIELD,
} from './newsletterSubscribe';

// Off-screen rather than display:none: some bots skip display:none fields.
const Wrapper = styled.div`
    height: 1px;
    left: -10000px;
    overflow: hidden;
    position: absolute;
    top: auto;
    width: 1px;
`;

type Props = {
    value: string;
    onChange: (value: string) => void;
};

export const NewsletterHoneypot = ({ value, onChange }: Props) => (
    <Wrapper aria-hidden="true">
        <label>
            Leave this field empty
            <input
                type="text"
                name={NEWSLETTER_HONEYPOT_FIELD}
                tabIndex={-1}
                autoComplete="off"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                {...{ [NEWSLETTER_HONEYPOT_ATTR]: '' }}
            />
        </label>
    </Wrapper>
);
