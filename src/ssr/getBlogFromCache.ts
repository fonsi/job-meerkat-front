import { GetObjectCommand, NoSuchKey, S3Client } from '@aws-sdk/client-s3';
import { type BlogIndex, type BlogPost } from '@/blog/domain/blogPost';

const client = new S3Client({});

const isMissingObject = (error: unknown): boolean => {
    if (error instanceof NoSuchKey) return true;
    if (typeof error !== 'object' || error == null) return false;
    const named = error as {
        name?: string;
        $metadata?: { httpStatusCode?: number };
    };
    return (
        named.name === 'NoSuchKey' || named.$metadata?.httpStatusCode === 404
    );
};

const blogCacheBucket = (): string => {
    const bucket = process.env.BLOG_CACHE_BUCKET;
    if (!bucket) throw new Error('BLOG_CACHE_BUCKET is not set');

    return bucket;
};

const getJson = async <T>(key: string): Promise<T | null> => {
    try {
        const result = await client.send(
            new GetObjectCommand({ Bucket: blogCacheBucket(), Key: key }),
        );
        const body = await result.Body?.transformToString();
        if (!body) return null;

        return JSON.parse(body) as T;
    } catch (error) {
        if (isMissingObject(error)) return null;
        throw error;
    }
};

export const getBlogPostFromCache = (slug: string): Promise<BlogPost | null> =>
    getJson<BlogPost>(`${slug}.json`);

export const getBlogIndexFromCache = async (): Promise<BlogIndex> => {
    const index = await getJson<BlogIndex>('index.json');
    if (!index || !Array.isArray(index.posts)) return { posts: [] };

    return index;
};
