'use client';

import RedirectAfterAuth from '../[lng]/authentication/components/RedirectAfterAuth';
import AuthenticatorProvider from '../components/AuthenticatorProvider';

const RedirectPage = () => (
  <AuthenticatorProvider>
    <RedirectAfterAuth />
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

      <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
    </div>
  </AuthenticatorProvider>
);
export default RedirectPage;
