'use client';

import { ProfileProvider } from './context/ProfileContext';
import AffordabilityPage from './page';

const layout = () => (
  <ProfileProvider>
    <AffordabilityPage />
  </ProfileProvider>
);

export default layout;
