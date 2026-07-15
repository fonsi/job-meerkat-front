'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
    parseTokenError,
    previewUnsubscribe,
    requestUnsubscribeLink,
    unsubscribeNewsletter,
} from '@/newsletter/http/newsletterApi';
import { Button } from '@/shared/layout/Button';
import {
    Form,
    FormFooter,
    FormGroup,
    Input,
    Label,
} from '@/shared/layout/Form';
import {
    NewsletterBanner,
    NewsletterContainer,
    NewsletterText,
    NewsletterTitle,
} from './newsletterLayout';

type Props = {
    token?: string;
};

export const UnsubscribeNewsletterPage = ({ token }: Props) => {
    const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
    const [invalid, setInvalid] = useState(false);
    const [alreadyUnsubscribed, setAlreadyUnsubscribed] = useState(false);
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(!!token);
    const [submitting, setSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [linkSent, setLinkSent] = useState(false);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        const run = async () => {
            try {
                const result = await previewUnsubscribe(token);
                if (!cancelled) {
                    setMaskedEmail(result.maskedEmail);
                }
            } catch (error) {
                if (cancelled) {
                    return;
                }

                const tokenError = parseTokenError(error);
                if (tokenError === 'already_unsubscribed') {
                    setAlreadyUnsubscribed(true);
                } else {
                    setInvalid(true);
                    window.history.replaceState(
                        {},
                        '',
                        '/newsletter/unsubscribe/',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void run();

        return () => {
            cancelled = true;
        };
    }, [token]);

    const onConfirm = async () => {
        if (!token) {
            return;
        }

        setSubmitting(true);

        try {
            await unsubscribeNewsletter(token);
            setDone(true);
        } finally {
            setSubmitting(false);
        }
    };

    const onRequestLink = async (event: FormEvent) => {
        event.preventDefault();
        await requestUnsubscribeLink(email.trim());
        setLinkSent(true);
    };

    if (loading) {
        return (
            <NewsletterContainer>
                <NewsletterTitle>Loading…</NewsletterTitle>
            </NewsletterContainer>
        );
    }

    if (done) {
        return (
            <NewsletterContainer>
                <NewsletterTitle>You&apos;re unsubscribed</NewsletterTitle>
                <NewsletterText>
                    You won&apos;t receive any more job digests from JobMeerkat.
                </NewsletterText>
                <NewsletterText>
                    <Link reloadDocument to="/newsletter/">
                        Subscribe again
                    </Link>
                </NewsletterText>
            </NewsletterContainer>
        );
    }

    if (alreadyUnsubscribed) {
        return (
            <NewsletterContainer>
                <NewsletterTitle>Already unsubscribed</NewsletterTitle>
                <NewsletterText>
                    This address is not receiving job digests.
                </NewsletterText>
                <NewsletterText>
                    <Link reloadDocument to="/newsletter/">
                        Subscribe again
                    </Link>
                </NewsletterText>
            </NewsletterContainer>
        );
    }

    if (maskedEmail && token) {
        return (
            <NewsletterContainer>
                <NewsletterTitle>Unsubscribe</NewsletterTitle>
                <NewsletterText>
                    Stop sending job digests to {maskedEmail}?
                </NewsletterText>
                <FormFooter>
                    <Button
                        type="button"
                        disabled={submitting}
                        onClick={() => void onConfirm()}
                    >
                        {submitting ? 'Unsubscribing…' : 'Confirm unsubscribe'}
                    </Button>
                </FormFooter>
            </NewsletterContainer>
        );
    }

    return (
        <NewsletterContainer>
            <NewsletterTitle>Unsubscribe</NewsletterTitle>
            {invalid ? (
                <NewsletterBanner $variant="error">
                    This unsubscribe link is no longer valid.
                </NewsletterBanner>
            ) : (
                <NewsletterText>
                    Enter your email and we&apos;ll send you an unsubscribe
                    link.
                </NewsletterText>
            )}

            {linkSent ? (
                <NewsletterBanner $variant="success">
                    Check your inbox. If this email is subscribed, we sent an
                    unsubscribe link.
                </NewsletterBanner>
            ) : (
                <Form onSubmit={onRequestLink}>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormGroup>
                    <FormFooter>
                        <Button type="submit">Send unsubscribe link</Button>
                    </FormFooter>
                </Form>
            )}
        </NewsletterContainer>
    );
};
