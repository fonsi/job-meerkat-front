'use client';

import { FormEvent, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { trackNewsletterSent } from '@/newsletter/analytics/trackNewsletterPopup';
import { subscribeNewsletter } from '@/newsletter/http/newsletterApi';
import { markNewsletterPopupSubscribed } from '@/newsletter/popup/newsletterPopupStorage';
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

export const JoinNewsletterPage = () => {
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
        <NewsletterContainer>
            <NewsletterTitle>Join the newsletter</NewsletterTitle>
            <NewsletterText>
                Get a curated digest of new remote jobs. We&apos;ll email you a
                confirmation link before sending anything.
            </NewsletterText>

            {submitted ? (
                <NewsletterBanner $variant="success">
                    Check your inbox. If this email can receive our newsletter,
                    we sent a confirmation link.
                </NewsletterBanner>
            ) : (
                <Form onSubmit={onSubmit}>
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
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Sending…' : 'Subscribe'}
                        </Button>
                    </FormFooter>
                </Form>
            )}

            <NewsletterText>
                By subscribing you agree to our{' '}
                <Link reloadDocument to="/privacy/">
                    Privacy Policy
                </Link>
                .
            </NewsletterText>
        </NewsletterContainer>
    );
};
