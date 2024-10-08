export const Amplify = {
  configure: jest.fn(() => {
    console.log('Amplify.configure called');
  }),
};

export const Auth = {
  signIn: jest
    .fn()
    .mockResolvedValue({})
    .mockImplementation(() => {
      console.log('Auth.signIn called');
    }),
  signOut: jest
    .fn()
    .mockResolvedValue({})
    .mockImplementation(() => {
      console.log('Auth.signOut called');
    }),
};
