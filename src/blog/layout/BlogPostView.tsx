'use client';

import styled from 'styled-components';
import { type BlogPost } from '@/blog/domain/blogPost';
import { NewsletterInlineSubscribe } from '@/newsletter/layout/NewsletterInlineSubscribe';
import { Container } from '@/shared/layout/Container';
import { Colors, Device } from '@/shared/styles/constants';
import { delaGothicVarName } from '@/shared/font/constants';

type Props = {
    post: BlogPost;
};

const Wrap = styled.article`
    margin: 32px 0 48px;
    max-width: 760px;
`;

const MobileCta = styled.a`
    background: ${Colors.accent};
    border-radius: 2px;
    color: ${Colors.brokenBlack};
    display: block;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 24px;
    padding: 12px 16px;
    text-align: center;
    text-decoration: none;

    @media ${Device.tablet} {
        display: none;
    }

    &:hover {
        background: ${Colors.lightGrey};
        text-decoration: none;
    }
`;

const Kicker = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 13px;
    letter-spacing: 0.04em;
    margin: 0 0 8px;
    text-transform: uppercase;
`;

const Title = styled.h1`
    font-family: var(${delaGothicVarName});
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin: 0 0 12px;
`;

const Meta = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 14px;
    margin: 0 0 28px;
`;

const Body = styled.div`
    font-size: 16px;
    font-weight: 300;
    line-height: 1.65;

    p {
        margin: 0 0 16px;
    }
`;

const ListingList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 12px;
    list-style: none;
    margin: 28px 0 0;
    padding: 0;
`;

const Listing = styled.a`
    border: 1px solid ${Colors.mediumGrey};
    border-radius: 8px;
    color: inherit;
    display: block;
    padding: 14px 16px;
    text-decoration: none;

    &:hover {
        border-color: ${Colors.accent};
        text-decoration: none;
    }
`;

const ListingTitle = styled.strong`
    display: block;
    font-size: 16px;
    margin-bottom: 4px;
`;

const ListingMeta = styled.span`
    color: ${Colors.mediumGrey};
    font-size: 13px;
`;

const CtaRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 36px;
`;

const JobsCta = styled.a`
    background: ${Colors.accent};
    border-radius: 2px;
    color: ${Colors.brokenBlack};
    display: inline-block;
    font-size: 15px;
    font-weight: 700;
    padding: 14px 22px;
    text-align: center;
    text-decoration: none;
    width: fit-content;

    &:hover {
        background: ${Colors.lightGrey};
        text-decoration: none;
    }
`;

const typeLabel = (post: BlogPost): string => {
    if (post.type === 'categoryAnalysis' && post.category) {
        return `${post.category} analysis`;
    }

    return 'Monthly recap';
};

const asOfLabel = (iso: string): string => iso.slice(0, 10);

export const BlogPostView = ({ post }: Props) => (
    <Container>
        <Wrap>
            <MobileCta href={post.jobsUrl}>
                Browse remote jobs with salaries
            </MobileCta>
            <Kicker>{typeLabel(post)}</Kicker>
            <Title>{post.title}</Title>
            <Meta>
                Based on Jobmeerkat listings as of {asOfLabel(post.asOf)}
            </Meta>
            <Body>
                {post.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
            </Body>
            {post.listings.length > 0 ? (
                <ListingList>
                    {post.listings.map((listing) => (
                        <li key={listing.jobUrl}>
                            <Listing href={listing.jobUrl}>
                                <ListingTitle>{listing.title}</ListingTitle>
                                <ListingMeta>
                                    {listing.companyName} ·{' '}
                                    {listing.salaryLabel} · {listing.category}
                                </ListingMeta>
                            </Listing>
                        </li>
                    ))}
                </ListingList>
            ) : null}
            <CtaRow>
                {post.categoryUrl ? (
                    <JobsCta href={post.categoryUrl}>
                        See {post.category} jobs
                    </JobsCta>
                ) : (
                    <JobsCta href={post.jobsUrl}>
                        Browse remote jobs with salaries
                    </JobsCta>
                )}
                <NewsletterInlineSubscribe
                    title="Get these roles in your inbox"
                    description="Remote jobs with public salaries — daily or weekly."
                />
            </CtaRow>
        </Wrap>
    </Container>
);
