'use client';

import styled from 'styled-components';
import { Container } from '@/shared/layout/Container';
import { PageHeader } from '@/shared/layout/PageHeader';
import { Colors } from '@/shared/styles/constants';
import { useEffect, useState } from 'react';

const PageWrapper = styled.div`
    margin: 0 auto;
    max-width: 64rem;
    padding-bottom: 3rem;
`;

const ContentWrapper = styled.div`
    max-width: 100%;
`;

const Section = styled.section`
    margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
    color: ${Colors.brokenWhite};
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
`;

const SectionText = styled.p`
    color: ${Colors.lightGrey};
    font-size: 1rem;
    line-height: 1.7;
`;

const List = styled.ul`
    color: ${Colors.lightGrey};
    font-size: 1rem;
    line-height: 1.7;
    list-style-type: disc;
    margin-top: 0.5rem;
    padding-left: 1.5rem;
`;

const EmailLink = styled.a`
    color: ${Colors.lightGrey};
    text-decoration: underline;

    &:hover {
        color: ${Colors.accent};
    }
`;

export const PrivacyPage = () => {
    const [email, setEmail] = useState<string>('');

    useEffect(() => {
        const emailAddressChunks =
            process.env.NEXT_PUBLIC_CONTACT_EMAIL_ADDRESS?.split('|');

        if (emailAddressChunks) {
            setEmail(emailAddressChunks.join(''));
        }
    }, []);

    return (
        <Container>
            <PageWrapper>
                <PageHeader align="center" title="Privacy Policy" />

                <ContentWrapper>
                    <Section>
                        <SectionTitle>1. Cookies and Analytics</SectionTitle>
                        <SectionText>
                            We use cookies and similar tracking technologies to
                            improve your browsing experience and analyze website
                            traffic. These tools help us understand how visitors
                            interact with our website and improve our services.
                        </SectionText>
                        <List>
                            <li>
                                Google Analytics: We use Google Analytics to
                                understand how visitors use our website. This
                                service may collect information such as your IP
                                address, browser type, pages visited, and time
                                spent on the site.
                            </li>
                            <li>
                                Google Ads: We use Google Ads to display
                                relevant advertisements. This service may use
                                cookies to show ads based on your browsing
                                behavior and interests.
                            </li>
                        </List>
                    </Section>

                    <Section>
                        <SectionTitle>2. How We Use Analytics</SectionTitle>
                        <SectionText>
                            The information collected through analytics helps
                            us:
                        </SectionText>
                        <List>
                            <li>Understand how visitors use our website</li>
                            <li>
                                Improve our website&apos;s performance and user
                                experience
                            </li>
                            <li>
                                Measure the effectiveness of our content and
                                features
                            </li>
                            <li>Optimize our advertising campaigns</li>
                        </List>
                    </Section>

                    <Section>
                        <SectionTitle>3. Managing Cookies</SectionTitle>
                        <SectionText>
                            You can control and manage cookies in your browser
                            settings. Most web browsers allow you to:
                        </SectionText>
                        <List>
                            <li>Delete all cookies</li>
                            <li>Block all cookies</li>
                            <li>Allow cookies from specific websites</li>
                            <li>
                                Set preferences for different types of cookies
                            </li>
                        </List>
                        <SectionText>
                            Please note that blocking cookies may affect your
                            experience on our website and some features may not
                            function properly.
                        </SectionText>
                    </Section>

                    <Section>
                        <SectionTitle>4. Newsletter</SectionTitle>
                        <SectionText>
                            If you subscribe to our job digest newsletter, we
                            store your email address and your filter preferences
                            (frequency, categories, companies, and salary
                            visibility). We use this data only to send the
                            digest you requested. You can update your settings
                            or unsubscribe at any time using the links in our
                            emails or on the newsletter pages on this site.
                        </SectionText>
                    </Section>

                    <Section>
                        <SectionTitle>5. Changes to This Policy</SectionTitle>
                        <SectionText>
                            We may update this privacy policy from time to time.
                            We will notify you of any changes by posting the new
                            policy on this page.
                        </SectionText>
                    </Section>

                    <Section>
                        <SectionTitle>6. Contact Us</SectionTitle>
                        <SectionText>
                            If you have any questions about this Privacy Policy,
                            please contact us at{' '}
                            {email && (
                                <EmailLink href={`mailto:${email}`}>
                                    {email}
                                </EmailLink>
                            )}
                        </SectionText>
                    </Section>
                </ContentWrapper>
            </PageWrapper>
        </Container>
    );
};
