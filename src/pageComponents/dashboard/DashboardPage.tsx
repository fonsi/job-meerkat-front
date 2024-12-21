'use client';

import { Link } from 'react-router-dom';

export const DashboardPage = () => {
    return (
        <main>
            <h1>Dashboard</h1>
            <Link to={'/companies'}>Companies</Link>
            <Link to={'/company/create'}>Create company</Link>
        </main>
    );
};
