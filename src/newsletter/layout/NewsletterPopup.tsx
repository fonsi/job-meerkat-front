'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { Link, useRouterState } from '@tanstack/react-router';
import {
    trackNewsletterDismissed,
    trackNewsletterSent,
    trackNewsletterShown,
} from '@/newsletter/analytics/trackNewsletterPopup';
import { subscribeNewsletter } from '@/newsletter/http/newsletterApi';
import {
    isNewsletterPopupExcludedPath,
    markNewsletterPopupDismissed,
    markNewsletterPopupSubscribed,
    shouldShowNewsletterPopup,
} from '@/newsletter/popup/newsletterPopupStorage';
import { delaGothicVarName } from '@/shared/font/constants';
import { Close } from '@/shared/image/icons/Close';
import { Colors } from '@/shared/styles/constants';

const SHOW_DELAY_MS = 2000;

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const riseIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(12px) scale(0.98);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
`;

const Overlay = styled.div`
    align-items: center;
    animation: ${fadeIn} 0.2s ease-out;
    background: rgba(0, 0, 0, 0.78);
    display: flex;
    inset: 0;
    justify-content: center;
    padding: 20px;
    position: fixed;
    z-index: 1000;
`;

const Dialog = styled.div`
    animation: ${riseIn} 0.28s ease-out;
    background:
        linear-gradient(165deg, rgba(255, 255, 255, 0.06) 0%, transparent 42%),
        ${Colors.darkGrey};
    border: 1px solid ${Colors.mediumGrey};
    border-radius: 12px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.55);
    color: ${Colors.brokenWhite};
    max-width: 440px;
    padding: 36px 32px 28px;
    position: relative;
    width: 100%;
`;

const CloseButton = styled.button`
    align-items: center;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: ${Colors.mediumGrey};
    cursor: pointer;
    display: flex;
    padding: 6px;
    position: absolute;
    right: 14px;
    top: 14px;
    transition:
        color 0.15s ease,
        background-color 0.15s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.06);
        color: ${Colors.white};
    }

    svg {
        height: 18px;
        width: 18px;
    }
`;

const Title = styled.h2`
    color: ${Colors.white};
    font-family: var(${delaGothicVarName});
    font-size: 1.65rem;
    font-weight: 400;
    line-height: 1.25;
    margin: 0 28px 16px 0;
    text-wrap: pretty;
`;

const Text = styled.p`
    color: ${Colors.lightGrey};
    font-size: 15px;
    line-height: 1.65;
    margin: 0 0 28px;
    text-wrap: pretty;
`;

const Highlight = styled.strong`
    color: ${Colors.white};
    font-weight: 600;
`;

const PopupForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 18px;
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const FieldLabel = styled.label`
    color: ${Colors.lightGrey};
    font-size: 13px;
    font-weight: 500;
`;

const EmailInput = styled.input`
    background: ${Colors.brokenBlack};
    border: 1px solid ${Colors.mediumGrey};
    border-radius: 8px;
    color: ${Colors.white};
    font-size: 15px;
    padding: 12px 14px;
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
    width: 100%;

    &::placeholder {
        color: ${Colors.mediumGrey};
    }

    &:hover {
        border-color: ${Colors.lightGrey};
    }

    &:focus {
        border-color: ${Colors.white};
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.12);
        outline: none;
    }
`;

const SubmitButton = styled.button`
    background: ${Colors.white};
    border: none;
    border-radius: 8px;
    color: ${Colors.brokenBlack};
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    padding: 13px 16px;
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

const SuccessBanner = styled.div`
    background: rgba(46, 125, 80, 0.18);
    border: 1px solid rgba(110, 190, 140, 0.35);
    border-radius: 8px;
    color: ${Colors.lightGrey};
    line-height: 1.6;
    margin-top: 4px;
    padding: 18px 16px;

    strong {
        color: ${Colors.white};
        display: block;
        font-size: 1.05rem;
        font-weight: 600;
        margin-bottom: 6px;
    }
`;

const PrivacyNote = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 12px;
    line-height: 1.5;
    margin: 18px 0 0;
    text-align: center;

    a {
        color: ${Colors.lightGrey};
        text-decoration: underline;
        text-underline-offset: 2px;

        &:hover {
            color: ${Colors.white};
        }
    }
`;

export const NewsletterPopup = () => {
    const pathname = useRouterState({
        select: (state) => state.location.pathname,
    });
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [mounted, setMounted] = useState(false);
    const shownThisSessionRef = useRef(false);
    const shownAtRef = useRef<number | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isNewsletterPopupExcludedPath(pathname)) {
            setOpen(false);
            return;
        }

        if (shownThisSessionRef.current) return;
        if (!shouldShowNewsletterPopup(pathname)) return;

        const timeoutId = window.setTimeout(() => {
            if (shownThisSessionRef.current) return;
            if (!shouldShowNewsletterPopup(pathname)) return;

            shownThisSessionRef.current = true;
            shownAtRef.current = Date.now();
            trackNewsletterShown();
            setOpen(true);
        }, SHOW_DELAY_MS);

        return () => window.clearTimeout(timeoutId);
    }, [pathname]);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') event.preventDefault();
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open]);

    const onDismiss = () => {
        if (!submitted) {
            markNewsletterPopupDismissed(shownAtRef.current ?? Date.now());
            trackNewsletterDismissed();
        }
        setOpen(false);
    };

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            await subscribeNewsletter(email.trim());
            markNewsletterPopupSubscribed(shownAtRef.current ?? Date.now());
            trackNewsletterSent();
            setSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    if (!mounted || !open) return null;

    return createPortal(
        <Overlay role="presentation">
            <Dialog
                role="dialog"
                aria-modal="true"
                aria-labelledby="newsletter-popup-title"
            >
                <CloseButton
                    type="button"
                    aria-label="Close newsletter popup"
                    onClick={onDismiss}
                >
                    <Close />
                </CloseButton>

                <Title id="newsletter-popup-title">
                    Don&apos;t miss the next great remote job
                </Title>

                {submitted ? (
                    <SuccessBanner>
                        <strong>You&apos;re almost in!</strong>
                        Check your inbox (and spam/junk folder) for the
                        confirmation email — then we&apos;ll start sending
                        curated remote roles your way.
                    </SuccessBanner>
                ) : (
                    <>
                        <Text>
                            Get a <Highlight>handpicked digest</Highlight> of
                            remote jobs with{' '}
                            <Highlight>public salaries</Highlight>. One click to
                            confirm, then the good stuff lands in your inbox.
                        </Text>
                        <PopupForm onSubmit={onSubmit}>
                            <Field>
                                <FieldLabel htmlFor="newsletter-popup-email">
                                    Email
                                </FieldLabel>
                                <EmailInput
                                    id="newsletter-popup-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    disabled={loading}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Field>
                            <SubmitButton type="submit" disabled={loading}>
                                {loading ? 'Sending…' : 'Send me jobs'}
                            </SubmitButton>
                        </PopupForm>
                        <PrivacyNote>
                            By subscribing you agree to our{' '}
                            <Link reloadDocument to="/privacy/">
                                Privacy Policy
                            </Link>
                            .
                        </PrivacyNote>
                    </>
                )}
            </Dialog>
        </Overlay>,
        document.body,
    );
};
