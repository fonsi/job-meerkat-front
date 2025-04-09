'use client';

import { JobPost } from '@/jobPost/jobPost';
import { useEffect, useState } from 'react';
import { getJobPostById } from '@/jobPost/http/getJobPostById';

const NotFoundContent = () => {
    return (
        <>
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-8">404!!!</p>
                </div>
            </div>
        </>
    );
};

const NotFound = () => {
    const url = new URL(location.href);
    const path = url.pathname;
    const [_, jobTag, compoundId] = path.split('/');
    let companyId: string | null = null;
    let jobId: string | null = null;

    if (jobTag === 'job' || compoundId.includes('_')) {
        [companyId, jobId] = compoundId.split('_');
    }

    const [job, setJob] = useState<JobPost | null>(null);
    const [loadingError, setLoadingError] = useState<boolean>(false);

    useEffect(() => {
        if (companyId && jobId) {
            getJobPostById(companyId, jobId)
                .then((job) => {
                    setJob(job);
                })
                .catch(() => {
                    setLoadingError(true);
                });
        }
    });

    if (!companyId || !jobId || loadingError) {
        return <NotFoundContent />;
    }

    return (
        <>
            {!job ? (
                <>Loading...</>
            ) : (
                <>
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-xl text-gray-600 mb-8">
                                {job.title}
                            </p>
                            <p>Company: {job.company.name}</p>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default NotFound;
