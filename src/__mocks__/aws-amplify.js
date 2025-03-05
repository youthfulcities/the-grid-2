export const Amplify = {
  configure: jest.fn(),
};

export const Auth = {
  signIn: jest.fn().mockResolvedValue({}),
  signOut: jest.fn().mockResolvedValue({}),
  currentCredentials: jest.fn().mockResolvedValue({
    accessKeyId: 'test-key',
    secretAccessKey: 'test-secret',
  }),
};

export const Storage = {
  downloadData: jest.fn().mockImplementation(() =>
    Promise.resolve({
      result: {
        body: {
          text: () => Promise.resolve('mock,data,csv\n1,2,3\n4,5,6'),
        },
      },
      credentials: {
        accessKeyId: 'test-key',
        secretAccessKey: 'test-secret',
      },
    })
  ),
  get: jest.fn().mockResolvedValue('mock-url'),
  put: jest.fn().mockResolvedValue({ key: 'mock-key' }),
  remove: jest.fn().mockResolvedValue({ key: 'mock-key' }),
  list: jest.fn().mockResolvedValue({ results: [] }),
  vault: {
    get: jest.fn().mockResolvedValue('mock-vault-url'),
  },
};

export default {
  Amplify,
  Auth,
  Storage,
};
