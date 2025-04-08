'use client';

import { fetchAuthSession } from 'aws-amplify/auth';

const authFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  try {
    const session = await fetchAuthSession({ forceRefresh: true });
    const token = session.tokens?.idToken?.toString();

    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response;
  } catch (error) {
    console.error('useAuthFetch error:', error);
    throw error;
  }
};

export default authFetch;
