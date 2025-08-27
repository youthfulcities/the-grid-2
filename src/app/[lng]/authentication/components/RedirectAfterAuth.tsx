'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import 'aws-amplify/auth/enable-oauth-listener';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

//THIS COMPONENT IS ONLY FOR LOCAL LOGINS
const RedirectAfterAuth = () => {
  const router = useRouter();
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  // Retrieve the redirect URL from session storage or set a default

  // Guard so we don't redirect multiple times
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (authStatus === 'authenticated' && !hasRedirected.current) {
      hasRedirected.current = true; // lock it
      const redirectUrl = localStorage.getItem('postLoginRedirect');
      router.replace(redirectUrl ?? '/'); // Redirect to the intended URL or home
      localStorage.removeItem('postLoginRedirect');
    }
  }, [authStatus, router]);
  return null; // This component does not render anything
};

export default RedirectAfterAuth;
