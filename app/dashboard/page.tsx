'use client';

import { CompaniesPage } from '@/pageComponents/dashboard/CompaniesPage';
import { CompanyPage } from '@/pageComponents/dashboard/CompanyPage';
import { CreateCompanyPage } from '@/pageComponents/dashboard/CreateCompanyPage';
import { DashboardPage } from '@/pageComponents/dashboard/DashboardPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
    return (
        <Router basename="/dashboard">
            <Routes>
                <Route path="/company/create" element={<CreateCompanyPage />} />
                <Route path="/company/:id" element={<CompanyPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/" element={<DashboardPage />} />
            </Routes>
        </Router>
    );
}
