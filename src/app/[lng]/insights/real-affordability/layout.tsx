'use client';

import { ReactNode } from 'react';
import { ProfileProvider } from './context/ProfileContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <ProfileProvider>{children}</ProfileProvider>
);

export default Layout;
