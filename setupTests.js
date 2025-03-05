/* eslint-disable */
// setupTests.js
import '@testing-library/jest-dom';
import 'isomorphic-fetch';
import 'jest-styled-components';

//this mock doesn't work in the __mocks__ folder
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

//for some reason mocking d3 functions in this file works but not in the __mocks__ folder
//all the d3 functions used need to be explicitly defined here
// jest.mock('d3', () => ({
//   __esModule: true,
//   append: jest.fn(() => ({
//     attr: jest.fn().mockReturnThis(),
//     style: jest.fn().mockReturnThis(),
//     call: jest.fn().mockReturnThis(),
//   })),
//   axisBottom: jest.fn(() => ({
//     ticks: jest.fn().mockReturnThis(),
//     tickFormat: jest.fn().mockReturnThis(),
//   })),
//   axisLeft: jest.fn(() => ({
//     ticks: jest.fn().mockReturnThis(),
//     tickFormat: jest.fn().mockReturnThis(),
//   })),
//   scaleOrdinal: jest.fn(() => ({
//     range: jest.fn().mockReturnThis(),
//   })),
//   max: jest.fn(() => 100),
//   scaleBand: jest.fn(() => {
//     const scaleMock = jest.fn((value) => value);
//     scaleMock.domain = jest.fn().mockReturnThis();
//     scaleMock.range = jest.fn().mockReturnThis();
//     scaleMock.padding = jest.fn().mockReturnThis();
//     scaleMock.bandwidth = jest.fn().mockReturnValue(20);
//     return scaleMock;
//   }),
//   scaleLinear: jest.fn(() => {
//     const scaleMock = jest.fn((value) => value);
//     scaleMock.domain = jest.fn().mockReturnThis();
//     scaleMock.range = jest.fn().mockReturnThis();
//     scaleMock.nice = jest.fn().mockReturnThis();
//     return scaleMock;
//   }),
//   select: jest.fn(() => ({
//     attr: jest.fn().mockReturnThis(),
//     on: jest.fn().mockReturnThis(),
//     selectAll: jest.fn(() => ({
//       data: jest.fn(() => ({
//         join: jest.fn(() => ({
//           attr: jest.fn().mockReturnThis(),
//           style: jest.fn().mockReturnThis(),
//           on: jest.fn().mockReturnThis(),
//           transition: jest.fn(() => ({
//             duration: jest.fn().mockReturnThis(),
//             delay: jest.fn().mockReturnThis(),
//             attr: jest.fn().mockReturnThis(),
//           })),
//         })),
//       })),
//     })),
//     append: jest.fn(() => ({
//       text: jest.fn().mockReturnThis(),
//       attr: jest.fn().mockReturnThis(),
//       style: jest.fn().mockReturnThis(),
//       call: jest.fn(() => ({
//         selectAll: jest.fn(() => ({
//           style: jest.fn().mockReturnThis(),
//           attr: jest.fn().mockReturnThis(),
//           remove: jest.fn().mockReturnThis(),
//           on: jest.fn().mockReturnThis(),
//           data: jest.fn((value) => value),
//           join: jest.fn().mockReturnThis(),
//         })),
//       })),
//     })),
//     selectAll: jest.fn(() => ({
//       on: jest.fn().mockReturnThis(),
//       remove: jest.fn().mockReturnThis(),
//       data: jest.fn(() => {
//         const dataMock = jest.fn((value) => value);

//         dataMock.join = jest.fn(() => ({
//           transition: jest.fn().mockReturnThis(),
//           duration: jest.fn().mockReturnThis(),
//           delay: jest.fn().mockReturnThis(),
//           on: jest.fn().mockReturnThis(),
//           attr: jest.fn().mockReturnThis(),
//           style: jest.fn().mockReturnThis(),
//         }));

//         dataMock.enter = jest.fn(() => ({
//           append: jest.fn(() => ({
//             attr: jest.fn().mockReturnThis(),
//             style: jest.fn().mockReturnThis(),
//             call: jest.fn().mockReturnThis(),
//           })),
//         }));
//         return dataMock;
//       }),
//     })),
//     remove: jest.fn().mockReturnThis(),
//   })),
//   csvParse: jest.fn(() => {}),
// }));

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
