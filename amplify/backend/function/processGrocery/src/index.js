/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_GROCERYAGGREGATED_ARN
	STORAGE_GROCERYAGGREGATED_NAME
	STORAGE_GROCERYPRICES_ARN
	STORAGE_GROCERYPRICES_NAME
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import aggregateCategories from './utils/aggregateCategories.js';
import deduplicateItems from './utils/deduplicateItems.js';
import groupAndNormalize from './utils/groupAndNormalize.js';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.BUCKET_NAME + '-' + process.env.ENV;
const PREFIX_AGGREGATED = `internal/RAI/grocery/cache/aggregated/`;
const PREFIX_CATEGORIES = `internal/RAI/grocery/cache/aggregated-categories/`;

const SOURCE_TABLE = process.env.STORAGE_GROCERYPRICES_NAME;
const TARGET_TABLE = process.env.STORAGE_GROCERYAGGREGATED_NAME;

const handler = async (event) => {
  try {
    let items = [];
    let lastKey;

    do {
      const result = await ddbDocClient.send(
        new ScanCommand({
          ExclusiveStartKey: lastKey,
          TableName: SOURCE_TABLE,
          FilterExpression:
            'NOT begins_with(#pk, :excluded) AND #department = :department AND (attribute_not_exists(#outlier) OR #outlier <> :outlier)',
          ExpressionAttributeNames: {
            '#pk': 'pk',
            '#department': 'department',
            '#outlier': 'outlier',
          },
          ExpressionAttributeValues: {
            ':excluded': 'category#easter',
            ':department': 'grocery',
            ':outlier': 'true',
          },
        })
      );

      items.push(...(result.Items || []));
      lastKey = result.LastEvaluatedKey;
    } while (lastKey);

    // 1. Deduplicate
    const deduped = deduplicateItems(items);
    // 2. Group and normalize
    const grouped = groupAndNormalize(deduped);

    // 3. Store in output table
    // const batches = prepareWriteBatches(grouped);
    // for (const batch of batches) {
    //   await Promise.all(
    //     batch.map((Item) =>
    //       ddbDocClient.send(
    //         new PutCommand({
    //           TableName: TARGET_TABLE,
    //           Item,
    //         })
    //       )
    //     )
    //   );
    // }

    const s3Client = new S3Client({});

    const timestamp = new Date().toISOString();
    const key = `grouped-data-${timestamp}.json`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${PREFIX_AGGREGATED}${key}`,
        Body: JSON.stringify(grouped),
        ContentType: 'application/json',
      })
    );

    const aggregatedCategories = aggregateCategories(grouped);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${PREFIX_CATEGORIES}${key}`,
        Body: JSON.stringify(aggregatedCategories),
        ContentType: 'application/json',
      })
    );

    return {
      statusCode: 200,
      //  Uncomment below to enable CORS requests
      //  headers: {
      //      "Access-Control-Allow-Origin": "*",
      //      "Access-Control-Allow-Headers": "*"
      //  },
      body: JSON.stringify('Successfully updated cache'),
    };
  } catch (err) {
    console.error('Aggregation failed:', err);
    throw err;
  }
};

export { handler };
