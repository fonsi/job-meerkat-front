import { DashboardLayout } from '@/pageComponents/dashboard/DashboardLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Jobmeerkat',
  description: 'Don\'t miss your next job',
  robots: {
    index: false,
    follow: false,
  }
};

export default DashboardLayout;
