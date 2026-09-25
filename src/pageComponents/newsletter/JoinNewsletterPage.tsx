'use client';

import { FormEvent, useState } from 'react';
import { Link } from '@tanstack/react-router';
import styled, { keyframes } from 'styled-components';
import { trackNewsletterSent } from '@/newsletter/analytics/trackNewsletterPopup';
import { subscribeNewsletter } from '@/newsletter/http/newsletterApi';
import { markNewsletterPopupSubscribed } from '@/newsletter/popup/newsletterPopupStorage';
import { delaGothicVarName } from '@/shared/font/constants';
import { Colors, Device } from '@/shared/styles/constants';

const fadeUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(14px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const Page = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Hero = styled.section`
    align-items: center;
    background:
        radial-gradient(
            ellipse 80% 55% at 50% -10%,
            rgba(255, 255, 255, 0.07) 0%,
            transparent 70%
        ),
        ${Colors.brokenBlack};
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 64px 20px 72px;
    text-align: center;
    width: 100%;

    @media ${Device.tablet} {
        min-height: min(72vh, 640px);
        padding: 80px 24px 96px;
    }
`;

const HeroInner = styled.div`
    animation: ${fadeUp} 0.45s ease-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    max-width: 40rem;
    width: 100%;
`;

const Title = styled.h1`
    color: ${Colors.white};
    font-family: var(${delaGothicVarName});
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 400;
    line-height: 1.15;
    margin: 0;
    text-wrap: pretty;
`;

const Lead = styled.p`
    color: ${Colors.lightGrey};
    font-size: clamp(1rem, 2vw, 1.125rem);
    font-weight: 300;
    line-height: 1.65;
    margin: 0;
    max-width: 32rem;
    text-wrap: pretty;
`;

const Highlight = styled.strong`
    color: ${Colors.white};
    font-weight: 600;
`;

const SubscribeForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 12px;
    width: 100%;
    max-width: 28rem;

    @media ${Device.tablet} {
        flex-direction: row;
        max-width: 32rem;
    }
`;

const EmailInput = styled.input`
    background: transparent;
    border: none;
    border-bottom: 1px solid ${Colors.mediumGrey};
    border-radius: 0;
    color: ${Colors.white};
    flex: 1;
    font-size: 16px;
    min-width: 0;
    padding: 14px 2px;
    transition: border-color 0.15s ease;

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
    background: ${Colors.accent};
    border: none;
    border-radius: 2px;
    color: ${Colors.brokenBlack};
    cursor: pointer;
    flex-shrink: 0;
    font-size: 15px;
    font-weight: 600;
    padding: 14px 22px;
    transition:
        background-color 0.15s ease,
        transform 0.15s ease,
        opacity 0.15s ease;
    white-space: nowrap;

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
    animation: ${fadeUp} 0.35s ease-out;
    color: ${Colors.lightGrey};
    line-height: 1.65;
    margin-top: 12px;
    max-width: 28rem;

    strong {
        color: ${Colors.white};
        display: block;
        font-family: var(${delaGothicVarName});
        font-size: 1.35rem;
        font-weight: 400;
        margin-bottom: 8px;
    }
`;

const PrivacyNote = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 12px;
    line-height: 1.5;
    margin: 4px 0 0;
    max-width: 28rem;

    a {
        color: ${Colors.lightGrey};
        text-decoration: underline;
        text-underline-offset: 2px;

        &:hover {
            color: ${Colors.white};
        }
    }
`;

const Benefits = styled.section`
    animation: ${fadeUp} 0.5s ease-out 0.08s both;
    border-top: 1px solid ${Colors.darkGrey};
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 36rem;
    padding: 56px 20px 72px;
    text-align: center;
    width: 100%;

    @media ${Device.tablet} {
        padding: 72px 24px 96px;
    }
`;

const BenefitsTitle = styled.h2`
    color: ${Colors.accent};
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.14em;
    margin: 0 0 10px;
    text-transform: uppercase;
`;

const BenefitsLead = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 15px;
    line-height: 1.55;
    margin: 0 0 36px;
`;

const BenefitList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 0;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
`;

const BenefitItem = styled.li`
    align-items: center;
    border-top: 1px solid ${Colors.darkGrey};
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 22px 0;

    &:last-child {
        border-bottom: 1px solid ${Colors.darkGrey};
    }
`;

const BenefitLabel = styled.span`
    color: ${Colors.accent};
    font-size: 15px;
    font-weight: 700;
`;

const BenefitCopy = styled.span`
    color: ${Colors.lightGrey};
    font-size: 15px;
    line-height: 1.55;
`;

const BENEFITS = [
    {
        label: 'Handpicked roles',
        copy: 'A curated digest of remote jobs — not an endless flood of listings.',
    },
    {
        label: 'Public salaries',
        copy: 'See pay upfront. Filter for salary-transparent roles after you confirm.',
    },
    {
        label: 'Your cadence',
        copy: 'Choose daily or weekly once you confirm — change it anytime in settings.',
    },
    {
        label: 'Make it yours',
        copy: 'Narrow by category or company so every email matches what you want.',
    },
] as const;

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
        <Page>
            <Hero>
                <HeroInner>
                    <Title>Don&apos;t miss the next great remote job</Title>
                    <Lead>
                        Get a <Highlight>handpicked digest</Highlight> of remote
                        jobs with <Highlight>public salaries</Highlight>. One
                        click to confirm, then the good stuff lands in your
                        inbox.
                    </Lead>

                    {submitted ? (
                        <SuccessBanner>
                            <strong>You&apos;re almost in!</strong>
                            Check your inbox (and spam/junk folder) for the
                            confirmation email — then we&apos;ll start sending
                            curated remote roles your way.
                        </SuccessBanner>
                    ) : (
                        <>
                            <SubscribeForm onSubmit={onSubmit}>
                                <EmailInput
                                    id="newsletter-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    aria-label="Email"
                                    placeholder="you@company.com"
                                    value={email}
                                    disabled={loading}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <SubmitButton type="submit" disabled={loading}>
                                    {loading ? 'Sending…' : 'Send me jobs'}
                                </SubmitButton>
                            </SubscribeForm>
                            <PrivacyNote>
                                By subscribing you agree to our{' '}
                                <Link reloadDocument to="/privacy/">
                                    Privacy Policy
                                </Link>
                                . We&apos;ll email a confirmation link before
                                sending anything.
                            </PrivacyNote>
                        </>
                    )}
                </HeroInner>
            </Hero>

            <Benefits>
                <BenefitsTitle>What you get</BenefitsTitle>
                <BenefitsLead>
                    After you confirm, you can tune frequency, categories, and
                    companies anytime.
                </BenefitsLead>
                <BenefitList>
                    {BENEFITS.map(({ label, copy }) => (
                        <BenefitItem key={label}>
                            <BenefitLabel>{label}</BenefitLabel>
                            <BenefitCopy>{copy}</BenefitCopy>
                        </BenefitItem>
                    ))}
                </BenefitList>
            </Benefits>
        </Page>
    );
};
