// setupTests.js
import '@testing-library/jest-dom';
import 'jest-styled-components';

jest.mock('aws-amplify', () => ({
  Amplify: {
    configure: jest.fn(),
  },
}));
