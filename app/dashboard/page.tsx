
import { DashboardPage } from '../../src/pageComponents/dashboard/DashboardPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | Jobmeerkat',
    description: 'Don\'t miss your next job',
    robots: {
      index: false,
      follow: false,
    }
  };

const Dashboard = () => <DashboardPage />;

export default Dashboard;