'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import {
    confirmNewsletter,
    parseTokenError,
    subscribeNewsletter,
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

export const ConfirmNewsletterPage = ({ token }: Props) => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [resent, setResent] = useState(false);
    const [loading, setLoading] = useState(!!token);

    useEffect(() => {
        if (!token) {
            setError('missing');
            setLoading(false);
            return;
        }

        let cancelled = false;

        const run = async () => {
            try {
                const result = await confirmNewsletter(token);
                if (cancelled) {
                    return;
                }

                await navigate({
                    to: '/newsletter/settings/',
                    search: { token: result.preferencesToken },
                });
            } catch (err) {
                if (cancelled) {
                    return;
                }

                const tokenError = parseTokenError(err);
                setError(tokenError ?? 'invalid');
                window.history.replaceState({}, '', '/newsletter/confirm/');
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
    }, [token, navigate]);

    const onResend = async (event: FormEvent) => {
        event.preventDefault();
        await subscribeNewsletter(email.trim());
        setResent(true);
    };

    if (loading) {
        return (
            <NewsletterContainer>
                <NewsletterTitle>Confirming subscription…</NewsletterTitle>
            </NewsletterContainer>
        );
    }

    if (error) {
        return (
            <NewsletterContainer>
                <NewsletterTitle>Confirmation link expired</NewsletterTitle>
                <NewsletterText>
                    This confirmation link has expired or is invalid. Enter your
                    email to receive a new one.
                </NewsletterText>

                {resent ? (
                    <NewsletterBanner $variant="success">
                        Check your inbox. If this email can receive our
                        newsletter, we sent a new link.
                    </NewsletterBanner>
                ) : (
                    <Form onSubmit={onResend}>
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
                            <Button type="submit">Resend confirmation</Button>
                        </FormFooter>
                    </Form>
                )}

                <NewsletterText>
                    <Link reloadDocument to="/newsletter/">
                        Back to subscribe
                    </Link>
                </NewsletterText>
            </NewsletterContainer>
        );
    }

    return (
        <NewsletterContainer>
            <NewsletterTitle>Redirecting…</NewsletterTitle>
        </NewsletterContainer>
    );
};
