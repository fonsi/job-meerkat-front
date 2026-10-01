import { GetObjectCommand, NoSuchKey, S3Client } from '@aws-sdk/client-s3';
import { type JobPost } from '@/jobPost/http/getJobPosts';

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

export const getJobPostPageFromCache = async (
    slug: string,
): Promise<JobPost | null> => {
    const bucket = process.env.JOB_POST_CACHE_BUCKET;
    if (!bucket) throw new Error('JOB_POST_CACHE_BUCKET is not set');

    try {
        const result = await client.send(
            new GetObjectCommand({
                Bucket: bucket,
                Key: `jobpost/${slug}.json`,
            }),
        );
        const body = await result.Body?.transformToString();
        if (!body) return null;

        return JSON.parse(body) as JobPost;
    } catch (error) {
        if (isMissingObject(error)) return null;
        throw error;
    }
};
