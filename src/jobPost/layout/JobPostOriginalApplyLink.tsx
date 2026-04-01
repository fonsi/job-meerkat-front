'use client';

import type { ReactNode } from 'react';
import { JobPost } from '@/jobPost/http/getJobPosts';
import { trackJobPostVisited } from '@/jobPost/anaytics/trackJobPostVisited';

type Props = {
    jobPost: JobPost;
    className?: string;
    children: ReactNode;
};

export const JobPostOriginalApplyLink = ({
    jobPost,
    className,
    children,
}: Props) => (
    <a
        className={className}
        href={jobPost.url}
        rel="noreferrer"
        target="_blank"
        onClick={() => trackJobPostVisited({ jobPost })}
    >
        {children}
    </a>
);
