'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import {
    trackNewsletterConfirmed,
    trackNewsletterConfirmFailed,
} from '@/newsletter/analytics/trackNewsletterPopup';
import {
    confirmNewsletter,
    parseTokenError,
    subscribeNewsletter,
} from '@/newsletter/http/newsletterApi';
import { markNewsletterPopupSubscribed } from '@/newsletter/popup/newsletterPopupStorage';
import { NewsletterSubscribeError } from '@/newsletter/subscribe/NewsletterSubscribeError';
import { Button } from '@/shared/layout/Button';
import {
    Form,
    FormFooter,
    FormGroup,
    Input,
    Label,
} from '@/shared/layout/Form';
import { confirmFailureCopy } from './confirmFailureCopy';
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
    const [resending, setResending] = useState(false);
    const [resendFailed, setResendFailed] = useState(false);
    const [loading, setLoading] = useState(!!token);
    // Stripping the token from the URL after a failure re-runs this effect
    // with no token; keep the real failure instead of overwriting it with
    // "missing" (and tracking a second, wrong Umami event).
    const tokenFailureHandled = useRef(false);

    useEffect(() => {
        if (!token) {
            if (tokenFailureHandled.current) {
                return;
            }
            setError('missing');
            setLoading(false);
            trackNewsletterConfirmFailed('missing');
            return;
        }

        let cancelled = false;

        const run = async () => {
            try {
                const result = await confirmNewsletter(token);
                if (cancelled) {
                    return;
                }

                markNewsletterPopupSubscribed();
                trackNewsletterConfirmed();

                await navigate({
                    to: '/newsletter/settings/',
                    search: { token: result.preferencesToken },
                });
            } catch (err) {
                if (cancelled) {
                    return;
                }

                tokenFailureHandled.current = true;
                const tokenError = parseTokenError(err);
                const reason = tokenError ?? 'unknown';
                trackNewsletterConfirmFailed(reason);
                setError(reason === 'unknown' ? 'invalid' : reason);
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
        setResending(true);
        setResendFailed(false);
        try {
            await subscribeNewsletter(email.trim());
            setResent(true);
        } catch {
            setResendFailed(true);
        } finally {
            setResending(false);
        }
    };

    if (loading) {
        return (
            <NewsletterContainer>
                <NewsletterTitle>Confirming subscription…</NewsletterTitle>
            </NewsletterContainer>
        );
    }

    if (error) {
        const copy = confirmFailureCopy(error);
        return (
            <NewsletterContainer>
                <NewsletterTitle>{copy.title}</NewsletterTitle>
                <NewsletterText>{copy.text}</NewsletterText>

                {resent ? (
                    <NewsletterBanner $variant="success">
                        Check your inbox (and spam/junk folder). If this email
                        can receive our newsletter, we sent a confirmation link.
                    </NewsletterBanner>
                ) : (
                    <Form onSubmit={onResend}>
                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                disabled={resending}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormGroup>
                        <FormFooter>
                            <Button type="submit" disabled={resending}>
                                {resending ? 'Sending…' : 'Resend confirmation'}
                            </Button>
                        </FormFooter>
                        <NewsletterSubscribeError visible={resendFailed} />
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
