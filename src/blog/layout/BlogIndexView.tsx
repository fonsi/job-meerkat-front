'use client';

import styled from 'styled-components';
import { type PaginatedBlogIndex } from '@/blog/domain/paginateBlogIndex';
import { blogIndexPath } from '@/blog/domain/paginateBlogIndex';
import { Container } from '@/shared/layout/Container';
import { Colors } from '@/shared/styles/constants';
import { delaGothicVarName } from '@/shared/font/constants';

type Props = {
    page: PaginatedBlogIndex;
};

const Wrap = styled.div`
    margin: 40px 0 48px;
    max-width: 760px;
    width: 100%;
`;

const Title = styled.h1`
    font-family: var(${delaGothicVarName});
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 400;
    margin: 0 0 8px;
`;

const Intro = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 16px;
    line-height: 1.5;
    margin: 0 0 32px;
`;

const List = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 20px;
    list-style: none;
    margin: 0;
    padding: 0;
`;

const PostLink = styled.a`
    color: inherit;
    display: block;
    text-decoration: none;

    &:hover h2 {
        color: ${Colors.accent};
    }
`;

const PostTitle = styled.h2`
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 6px;
`;

const Excerpt = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 15px;
    line-height: 1.5;
    margin: 0;
`;

const DateLine = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 13px;
    margin: 0 0 6px;
`;

const Pager = styled.nav`
    display: flex;
    gap: 16px;
    margin-top: 32px;
`;

const PagerLink = styled.a`
    color: ${Colors.accent};
    font-size: 14px;
`;

const Empty = styled.p`
    color: ${Colors.mediumGrey};
`;

export const BlogIndexView = ({ page }: Props) => (
    <Container>
        <Wrap>
            <Title>Blog</Title>
            <Intro>
                Data-backed recaps of remote jobs with public salaries, from
                live Jobmeerkat listings.
            </Intro>
            {page.posts.length === 0 ? (
                <Empty>No posts yet. Check back after the next recap.</Empty>
            ) : (
                <List>
                    {page.posts.map((post) => (
                        <li key={post.slug}>
                            <PostLink href={`/blog/${post.slug}`}>
                                <DateLine>
                                    {post.publishedAt.slice(0, 10)}
                                </DateLine>
                                <PostTitle>{post.title}</PostTitle>
                                <Excerpt>{post.excerpt}</Excerpt>
                            </PostLink>
                        </li>
                    ))}
                </List>
            )}
            {page.totalPages > 1 ? (
                <Pager aria-label="Pagination">
                    {page.page > 1 ? (
                        <PagerLink href={blogIndexPath(page.page - 1)}>
                            Previous
                        </PagerLink>
                    ) : null}
                    {page.page < page.totalPages ? (
                        <PagerLink href={blogIndexPath(page.page + 1)}>
                            Next
                        </PagerLink>
                    ) : null}
                </Pager>
            ) : null}
        </Wrap>
    </Container>
);
