/* eslint-disable */
// setupTests.js
import '@testing-library/jest-dom';
import 'isomorphic-fetch';
import 'jest-styled-components';

//this mock doesn't work in the __mocks__ folder or setupTests and has to be in the individual test files
jest.mock(
  '../../../../amplifyconfiguration.json',
  () => ({
    aws_project_region: 'mock-region',
    aws_cognito_identity_pool_id: 'mock-identity-pool-id',
    aws_cognito_region: 'mock-region',
    aws_user_pools_id: 'mock-user-pools-id',
    aws_user_pools_web_client_id: 'mock-client-id',
    oauth: {},
  }),
  { virtual: true }
);

// Mock AWS Amplify
jest.mock('aws-amplify', () => ({
  __esModule: true,
  Amplify: {
    configure: jest.fn(),
  },
  Auth: {
    signIn: jest.fn().mockResolvedValue({}),
    signOut: jest.fn().mockResolvedValue({}),
    currentCredentials: jest.fn().mockResolvedValue({
      accessKeyId: 'test-key',
      secretAccessKey: 'test-secret',
      sessionToken: 'test-session-token',
      identityId: 'mock-identity',
    }),
  },
}));

// Mock AWS Amplify Storage separately
jest.mock('aws-amplify/storage', () => ({
  __esModule: true,
  downloadData: jest.fn(() =>
    Promise.resolve({
      result: {
        body: {
          text: async () => 'Cluster,Topic,Value\nA,Technology,10\nB,Health,15',
        },
      },
    })
  ),
  get: jest.fn().mockResolvedValue('mock-url'),
  put: jest.fn().mockResolvedValue({ key: 'mock-key' }),
  remove: jest.fn().mockResolvedValue({ key: 'mock-key' }),
  list: jest.fn().mockResolvedValue({ results: [] }),
}));

// Mock hooks and components
jest.mock('@/hooks/useDimensions', () => ({
  __esModule: true,
  useDimensions: jest.fn(() => ({ width: 1000, height: 800 })), // Mock width & height
}));

jest.mock('@/app/i18n/client', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    t: (key) => key, // Mock translation function
    i18n: { changeLanguage: jest.fn() },
  })),
  useTranslation: jest.fn(() => ({
    t: (key) => key, // Mock translation function
    i18n: { changeLanguage: jest.fn() },
  })),
}));

jest.mock('react-i18next/TransWithoutContext', () => ({
  Trans: ({ i18nKey }) => i18nKey,
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({
    lng: 'en',
  }),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    this.callback([{ contentRect: { width: 100, height: 100 } }]);
  }

  unobserve() {}

  disconnect() {}
};

// Mock scrollTo
global.HTMLElement.prototype.scrollTo = jest.fn();

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

// Mock IntersectionObserver for Jest
global.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
    this.observing = [];
  }

  observe(element) {
    this.observing.push(element);
    // Simulate intersection immediately
    this.callback([{ isIntersecting: true }]);
  }

  unobserve(element) {
    this.observing = this.observing.filter((el) => el !== element);
  }

  disconnect() {
    this.observing = [];
  }
};
