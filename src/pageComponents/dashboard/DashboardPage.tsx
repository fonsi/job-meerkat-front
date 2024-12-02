'use client'

import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator, withAuthenticator } from '@aws-amplify/ui-react';
import outputs from '../../../amplify_outputs.json';
import { Container } from '@/shared/layout/Container';

Amplify.configure(outputs);

const Home = () => {
    return <main>
        <h1>Dashboard</h1>
    </main>;
}

const Dashboard = () => {
    const { authStatus } = useAuthenticator(context => [context.authStatus]);

    return <Container>
        <>
            {authStatus === 'configuring' && 'Loading...'}
            {authStatus !== 'authenticated' ? <Authenticator /> : <Home />}
        </>
    </Container>
}

export const DashboardPage = withAuthenticator(Dashboard);