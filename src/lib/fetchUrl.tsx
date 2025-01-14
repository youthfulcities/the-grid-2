import { getUrl } from 'aws-amplify/storage';

const fetchUrl = async (filename: string) => {
  try {
    const getUrlResult = await getUrl({
      key: filename,
      options: {
        accessLevel: 'guest',
        validateObjectExistence: true,
        expiresIn: 20,
        useAccelerateEndpoint: false,
      },
    });
    return getUrlResult;
  } catch (error) {
    console.error('Error fetching URL:', error);
    return null;
  }
};

export default fetchUrl;
