'use client'

import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator, withAuthenticator } from '@aws-amplify/ui-react';
import outputs from '../../../amplify_outputs.json';
import { Container } from '@/shared/layout/Container';

Amplify.configure(outputs);

const Layout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
    const { authStatus } = useAuthenticator(context => [context.authStatus]);
  
    return <Container>
      <>
          {authStatus === 'configuring' && 'Loading...'}
          {authStatus !== 'authenticated' ? <Authenticator /> : children}
      </>
    </Container>
  }
  
  export const DashboardLayout = withAuthenticator(Layout);