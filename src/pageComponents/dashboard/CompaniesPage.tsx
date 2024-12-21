'use client';

import { useEffect, useState } from 'react';
import { Company } from '@/company/company';
import { getCompanies } from '@/company/http/getCompanies';
import { Link } from 'react-router-dom';

export const CompaniesPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [companies, setCompanies] = useState<Company[]>([]);

    useEffect(() => {
        getCompanies().then((companies) => {
            setCompanies(companies);
            setIsLoading(false);
        });
    }, []);

    return (
        <main>
            <h1>Companies</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {companies.map((company) => (
                        <li key={company.id}>
                            <Link to={`/company/${company.id}`}>
                                {company.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};
