'use client'

import Link from 'next/link';

export const DashboardPage = () => {
    return <main>
        <h1>Dashboard</h1>
        <Link href={'/dashboard/company/create'}>Create company</Link>
    </main>;
}