import config from '@/amplifyconfiguration.json';
import { Text } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import axios from 'axios'; // Import Axios
import { useEffect, useState } from 'react';
import Quote from './Quote';

Amplify.configure(config);

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Call the Lambda function through API Gateway
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docGroup = 'Youth Interviews > Calgary'; // Replace with the actual value
        const code = 'Calgary Youth > Skills & Education > Digital skills'; // Replace with the actual value

        const response = await axios.get(
          `https://clnf6is8p5.execute-api.ca-central-1.amazonaws.com/staging/interview/${encodeURIComponent(docGroup)}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
              code: encodeURIComponent(code),
            },
          }
        );
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <></>;
};

export default MyComponent;
