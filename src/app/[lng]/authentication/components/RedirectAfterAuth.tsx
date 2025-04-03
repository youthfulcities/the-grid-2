'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const RedirectAfterAuth = () => {
  const router = useRouter();
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  console.log('authStatus', authStatus);
  // Retrieve the redirect URL from session storage or set a default

  useEffect(() => {
    const redirectUrl = sessionStorage.getItem('postLoginRedirect') || '/';
    // Check if there is a user object, which indicates a successful login
    if (authStatus === 'authenticated') {
      sessionStorage.removeItem('postLoginRedirect');
      router.push(redirectUrl); // Redirect to the intended URL or home
    }
  }, [authStatus, router]);

  return null;
};

export default RedirectAfterAuth;
