'use client';

import styled from 'styled-components';
import { Container } from '@/shared/layout/Container';
import { useEffect, useState } from 'react';

const PageWrapper = styled.div`
    max-width: 64rem;
    margin: 0 auto;
    padding: 3rem 1rem;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 3rem;
    text-align: center;
    color: white;
`;

const ContentWrapper = styled.div`
    max-width: 100%;
`;

const Section = styled.section`
    margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: white;
`;

const SectionText = styled.p`
    color: #e5e7eb;
    line-height: 1.8;
    font-size: 1.1rem;
`;

const EmailLink = styled.a`
    color: #e5e7eb;
    text-decoration: underline;
    &:hover {
        color: white;
    }
`;

export const TermsPage = () => {
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
                <Title>Terms and Conditions</Title>

                <ContentWrapper>
                    <Section>
                        <SectionTitle>1. Company Information</SectionTitle>
                        <SectionText>
                            All company information displayed on Jobmeerkat,
                            including but not limited to company names, logos,
                            and website URLs, is the property of their
                            respective owners. Jobmeerkat does not claim
                            ownership of any company&apos;s intellectual
                            property or branding materials.
                        </SectionText>
                    </Section>

                    <Section>
                        <SectionTitle>2. Job Post Information</SectionTitle>
                        <SectionText>
                            Jobmeerkat aggregates job postings from various
                            sources. While we strive to provide accurate and
                            up-to-date information, we cannot guarantee the
                            accuracy, completeness, or timeliness of job
                            postings. Users should verify all information
                            directly with the respective companies before making
                            any decisions.
                        </SectionText>
                    </Section>

                    <Section>
                        <SectionTitle>3. Use of Information</SectionTitle>
                        <SectionText>
                            The information provided on Jobmeerkat is for
                            informational purposes only. Users are responsible
                            for verifying the accuracy of any information before
                            relying on it. Jobmeerkat is not responsible for any
                            decisions made based on the information provided on
                            the website.
                        </SectionText>
                    </Section>

                    <Section>
                        <SectionTitle>4. External Links</SectionTitle>
                        <SectionText>
                            Jobmeerkat may contain links to external websites.
                            We are not responsible for the content, privacy
                            policies, or practices of any third-party websites.
                            Users should review the terms and conditions of any
                            external websites they visit.
                        </SectionText>
                    </Section>

                    <Section>
                        <SectionTitle>5. Changes to Terms</SectionTitle>
                        <SectionText>
                            Jobmeerkat reserves the right to modify these terms
                            at any time. We will notify users of any material
                            changes by posting the new terms on this page.
                            Continued use of the website after such changes
                            constitutes acceptance of the new terms.
                        </SectionText>
                    </Section>

                    <Section>
                        <SectionTitle>6. Contact Information</SectionTitle>
                        <SectionText>
                            If you have any questions about these Terms and
                            Conditions, please contact us at{' '}
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
