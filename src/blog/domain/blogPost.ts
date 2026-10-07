export const BlogPostType = {
    MonthlyRecap: 'monthlyRecap',
    CategoryAnalysis: 'categoryAnalysis',
} as const;

export type BlogPostKind = (typeof BlogPostType)[keyof typeof BlogPostType];

export type BlogListing = {
    title: string;
    companyName: string;
    salaryLabel: string;
    category: string;
    jobUrl: string;
};

export type BlogPost = {
    slug: string;
    type: BlogPostKind;
    title: string;
    excerpt: string;
    publishedAt: string;
    asOf: string;
    category?: string;
    paragraphs: string[];
    listings: BlogListing[];
    newsletterUrl: string;
    jobsUrl: string;
    categoryUrl?: string;
    ogImageUrl: string;
};

export type BlogIndexEntry = {
    slug: string;
    type: BlogPostKind;
    title: string;
    excerpt: string;
    publishedAt: string;
    category?: string;
    ogImageUrl: string;
};

export type BlogIndex = {
    posts: BlogIndexEntry[];
};

export const BLOG_INDEX_PAGE_SIZE = 12;
