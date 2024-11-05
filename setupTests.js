// setupTests.js
import '@testing-library/jest-dom';
import 'jest-styled-components';

// Mock AWS Amplify
jest.mock('aws-amplify');

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
