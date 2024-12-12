'use client'

import { useEffect, useState } from 'react';
import { Company } from '@/company/company';
import { getCompany } from '@/company/http/getCompany';
import { JobPost } from '@/jobPost/http/getJobPosts';
import { useParams, useNavigate } from 'react-router-dom';

export const CompanyPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string; }>();
    const [isLoading, setIsLoading] = useState(true);
    const [company, setCompany] = useState<Company | null>(null);
    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);

    useEffect(() => {
        if (!id) {
            return;
        }

        getCompany(id).then((response) => {
            setCompany(response.company);
            setJobPosts(response.openJobPosts);
            setIsLoading(false);
        });
    }, [id]);

    if (!id) {
        navigate('/');
    }

    return <main>
        {
            isLoading ?
                <p>Loading...</p> :
                <>
                    <h1>{company?.name}</h1>
                    <p>{company?.homePage}</p>
                    <ul>
                        {
                            jobPosts?.map((jobPost) => 
                                <li key={jobPost.id}>{jobPost.title}</li>
                            )
                        }
                    </ul>
                </>
        }
    </main>;
}