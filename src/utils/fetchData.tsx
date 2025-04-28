import { downloadData } from 'aws-amplify/storage';

const fetchData = async (path: string, file: string) => {
  try {
    const downloadResult = await downloadData({
      path: `${path}/${file}`,
    }).result;
    const text = await downloadResult.body.text();
    return text;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export default fetchData;
