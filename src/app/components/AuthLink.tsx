'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import styled from 'styled-components';

const StyledAuthLink = styled(Link)<{ $currentPage: boolean }>`
  font-family: 'Gotham Narrow Medium';
  font-size: 16px;
  font-weight: 450;
  color: var(--amplify-colors-font-inverse);
  text-transform: uppercase;
  line-height: 24px;
  text-align: left;
  display: inline-block;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: white;
    transform: ${(props) => (props.$currentPage ? 'scaleX(1)' : 'scaleX(0)')};
    transform-origin: right;
    transition: transform 0.3s ease-in-out;
    border-radius: 5px;
  }

  &:hover::before {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const AuthLink: React.FC = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  const handleAuthAction = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (user) {
      signOut();
    } else {
      sessionStorage.setItem('postLoginRedirect', '/');
      router.push('/authentication');
    }
  };

  return (
    <StyledAuthLink
      $currentPage={false}
      href='/authentication'
      onClick={handleAuthAction}
    >
      {user ? 'Logout' : 'Login'}
    </StyledAuthLink>
  );
};

export default AuthLink;
