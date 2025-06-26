/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_THEGRID24C63F4AC_BUCKETNAME
Amplify Params - DO NOT EDIT */ /**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.BUCKET_NAME + '-' + process.env.ENV;
const OUTPUT_KEY = `internal/RAI/cache/cache.json`;

const fetchFromS3 = async (path) => {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: path });
  const response = await s3.send(command);
  const text = await response.Body.transformToString();
  return JSON.parse(text);
};

const objectExists = async (bucket, key) => {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
};

const getLatestJSONFromS3 = async (prefix) => {
  const listCommand = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
  });

  const listResponse = await s3.send(listCommand);
  const files = listResponse.Contents || [];

  if (files.length === 0) {
    throw new Error(`No files found under prefix: ${prefix}`);
  }

  const mostRecentFile = files.reduce((a, b) =>
    new Date(a.LastModified) > new Date(b.LastModified) ? a : b
  );

  const getCommand = new GetObjectCommand({
    Bucket: BUCKET,
    Key: mostRecentFile.Key,
  });

  const getResponse = await s3.send(getCommand);
  const body = await getResponse.Body.transformToString();

  return JSON.parse(body);
};

export const handler = async () => {
  try {
    // if (await objectExists(BUCKET, OUTPUT_KEY)) {
    //   const cached = await fetchFromS3(OUTPUT_KEY);
    //   return {
    //     statusCode: 200,
    //     body: JSON.stringify({ cached: true, ...cached }),
    //     headers: { 'Content-Type': 'application/json' },
    //   };
    // }

    // Fetch raw files
    const [groceryItems, income, rent, move, play, work, live] =
      await Promise.all([
        getLatestJSONFromS3('internal/RAI/grocery/cache/aggregated-categories'),
        getLatestJSONFromS3('internal/RAI/income/'),
        getLatestJSONFromS3('internal/RAI/rent/'),
        fetchFromS3('internal/RAI/move/move_category.json'),
        fetchFromS3('internal/RAI/play/play_category.json'),
        fetchFromS3('internal/RAI/work/work_category.json'),
        fetchFromS3('internal/RAI/live/live_category.json'),
      ]);

    const payload = {
      timestamp: new Date(),
      groceryItems,
      income,
      rent,
      move,
      play,
      work,
      live,
    };

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: OUTPUT_KEY,
        Body: JSON.stringify(payload),
        ContentType: 'application/json',
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ cached: false, ...payload }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (err) {
    console.error('Error caching affordability data:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch or cache affordability data',
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};
