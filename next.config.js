module.exports = {
  webpack: (config) => {
    // Clean up any MUI-related aliasing if necessary
    delete config.resolve.alias['@mui/styled-engine'];

    return config;
  },
  compiler: {
    styledComponents: true,
  },
};
