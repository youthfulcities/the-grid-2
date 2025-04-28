'use client';

import { fetchAuthSession } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import AuthenticatorProvider from '../components/AuthenticatorProvider';

const RedirectPage = () => {
  const router = useRouter();
  const redirectTriggered = useRef(false);
  const [attempts, setAttempts] = useState(0);
  const maxRetries = 10;

  useEffect(() => {
    const tryRedirect = async () => {
      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken;

        if (idToken && !redirectTriggered.current) {
          redirectTriggered.current = true;
          const redirectUrl =
            sessionStorage.getItem('postLoginRedirect') || '/';
          sessionStorage.removeItem('postLoginRedirect');
          router.push(redirectUrl);
        } else if (attempts < maxRetries) {
          setTimeout(() => setAttempts((prev) => prev + 1), 300);
        } else if (!redirectTriggered.current) {
          redirectTriggered.current = true;
          router.push('/authentication');
        }
      } catch {
        if (!redirectTriggered.current) {
          redirectTriggered.current = true;
          router.push('/authentication');
        }
      }
    };

    tryRedirect();

    const backup = setTimeout(() => {
      if (!redirectTriggered.current) {
        redirectTriggered.current = true;
        router.push('/');
      }
    }, 6000);

    return () => clearTimeout(backup);
  }, [attempts, router]);

  return (
    <AuthenticatorProvider>
      <div
        style={{
          height: '100vh',
          width: '100vw',
          backgroundColor: '#121212',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '4px solid #fff',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px',
          }}
        />
        <p style={{ fontSize: '18px', fontWeight: 500 }}>Logging you in…</p>

        {/* Global style tag to ensure animation works */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </AuthenticatorProvider>
  );
};

export default RedirectPage;
