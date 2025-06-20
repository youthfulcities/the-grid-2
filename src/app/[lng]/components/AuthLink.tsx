'use client';

// import config from '@/amplifyconfiguration.json';
import useTranslation from '@/app/i18n/client';
import { useAuthenticator } from '@aws-amplify/ui-react';
// import { Amplify } from 'aws-amplify';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React from 'react';
import styled from 'styled-components';

// Amplify.configure(config);

const StyledAuthLink = styled(Link)<{
  $currentPage: boolean;
  $mobile: boolean;
}>`
  font-family: 'Gotham Narrow Medium';
  font-size: 16px;
  font-weight: 450;
  color: inherit;
  text-transform: uppercase;
  line-height: 24px;
  text-align: left;
  display: inline-block;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  width: ${(props) => (props.$mobile ? '100%' : 'auto')};
  overflow: hidden;

  ${(props) =>
    !props.$mobile
      ? `&::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: white;
    transform: ${props.$currentPage ? 'scaleX(1)' : 'scaleX(0)'};
    transform-origin: right;
    transition: transform 0.3s ease-in-out;
    border-radius: 5px;
  }

  &:hover::before {
    transform: scaleX(1);
    transform-origin: left;
}`
      : `&:hover {
    color: var(--amplify-font-primary);
}`}
`;

const AuthLink: React.FC<{ mobile?: boolean }> = ({ mobile = false }) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'translation');
  const { signOut, authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
  ]);
  const router = useRouter();
  const pathname = usePathname();

  const handleAuthAction = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (authStatus === 'authenticated') {
      signOut();
    } else {
      sessionStorage.setItem('postLoginRedirect', pathname);
      router.push('/authentication');
    }
  };

  return (
    <>
      {authStatus === 'configuring' ? (
        <StyledAuthLink $currentPage={false} $mobile={mobile} href='/'>
          {t('loading')}
        </StyledAuthLink>
      ) : (
        <StyledAuthLink
          $mobile={mobile}
          $currentPage={false}
          href='/authentication'
          onClick={handleAuthAction}
        >
          {authStatus === 'authenticated' ? t('logout') : t('login')}
        </StyledAuthLink>
      )}
    </>
  );
};

export default AuthLink;
