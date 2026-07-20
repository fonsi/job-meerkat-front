'use client';

import { FormEvent, useState } from 'react';
import { Link } from '@tanstack/react-router';
import styled, { css } from 'styled-components';
import { trackNewsletterSent } from '@/newsletter/analytics/trackNewsletterPopup';
import { subscribeNewsletter } from '@/newsletter/http/newsletterApi';
import { markNewsletterPopupSubscribed } from '@/newsletter/popup/newsletterPopupStorage';
import { Colors } from '@/shared/styles/constants';

type Props = {
    title: string;
    description: string;
    submitLabel?: string;
    /** Denser card for sidebars / secondary placement */
    compact?: boolean;
};

const Card = styled.section<{ $compact?: boolean }>`
    border: 1px solid ${Colors.mediumGrey};
    border-radius: 12px;
    width: 100%;

    ${({ $compact }) =>
        $compact
            ? css`
                  padding: 18px 16px;
              `
            : css`
                  margin-top: 32px;
                  padding: 24px 20px;
              `}
`;

const Title = styled.h2<{ $compact?: boolean }>`
    color: ${Colors.brokenWhite};
    font-size: ${({ $compact }) => ($compact ? '16px' : '18px')};
    font-weight: 600;
    line-height: 1.3;
    margin: 0 0 ${({ $compact }) => ($compact ? '6px' : '8px')};
`;

const Description = styled.p<{ $compact?: boolean }>`
    color: ${Colors.mediumGrey};
    font-size: ${({ $compact }) => ($compact ? '13px' : '14px')};
    font-weight: 300;
    line-height: 1.5;
    margin: 0 0 ${({ $compact }) => ($compact ? '14px' : '20px')};
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const EmailInput = styled.input`
    background: transparent;
    border: none;
    border-bottom: 1px solid ${Colors.mediumGrey};
    border-radius: 0;
    color: ${Colors.white};
    font-size: 16px;
    min-width: 0;
    padding: 10px 2px;
    transition: border-color 0.15s ease;
    width: 100%;

    &::placeholder {
        color: ${Colors.mediumGrey};
    }

    &:hover {
        border-color: ${Colors.lightGrey};
    }

    &:focus {
        border-color: ${Colors.white};
        outline: none;
    }
`;

const SubmitButton = styled.button`
    background: ${Colors.white};
    border: none;
    border-radius: 8px;
    color: ${Colors.brokenBlack};
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    padding: 11px 16px;
    transition:
        background-color 0.15s ease,
        transform 0.15s ease,
        opacity 0.15s ease;
    width: 100%;

    &:hover:not(:disabled) {
        background: ${Colors.lightGrey};
    }

    &:active:not(:disabled) {
        transform: translateY(1px);
    }

    &:disabled {
        cursor: wait;
        opacity: 0.7;
    }
`;

const Success = styled.p`
    color: ${Colors.lightGrey};
    font-size: 13px;
    line-height: 1.5;
    margin: 0;

    strong {
        color: ${Colors.white};
        display: block;
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 4px;
    }
`;

const PrivacyNote = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 11px;
    line-height: 1.45;
    margin: 10px 0 0;

    a {
        color: ${Colors.lightGrey};
        text-decoration: underline;
        text-underline-offset: 2px;

        &:hover {
            color: ${Colors.white};
        }
    }
`;

export const NewsletterInlineSubscribe = ({
    title,
    description,
    submitLabel = 'Send me jobs',
    compact = false,
}: Props) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            await subscribeNewsletter(email.trim());
            markNewsletterPopupSubscribed();
            trackNewsletterSent();
            setSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card $compact={compact}>
            <Title $compact={compact}>{title}</Title>
            <Description $compact={compact}>{description}</Description>
            {submitted ? (
                <Success>
                    <strong>Check your inbox</strong>
                    Confirm your email and we&apos;ll start sending curated
                    remote roles your way.
                </Success>
            ) : (
                <>
                    <Form onSubmit={onSubmit}>
                        <EmailInput
                            type="email"
                            required
                            autoComplete="email"
                            aria-label="Email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <SubmitButton type="submit" disabled={loading}>
                            {loading ? 'Sending…' : submitLabel}
                        </SubmitButton>
                    </Form>
                    <PrivacyNote>
                        By subscribing you agree to our{' '}
                        <Link reloadDocument to="/privacy/">
                            Privacy Policy
                        </Link>
                        . Confirmation required.
                    </PrivacyNote>
                </>
            )}
        </Card>
    );
};
