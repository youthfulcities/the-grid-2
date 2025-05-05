/* Amplify Params - DO NOT EDIT
	ENV
	FUNCTION_PROCESSGROCERY_NAME
	REGION
	STORAGE_GROCERYAGGREGATED_ARN
	STORAGE_GROCERYAGGREGATED_NAME
	STORAGE_GROCERYPRICES_ARN
	STORAGE_GROCERYPRICES_NAME
Amplify Params - DO NOT EDIT */ /*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
} = require('@aws-sdk/lib-dynamodb');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const express = require('express');
const {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
} = require('@aws-sdk/client-s3');

const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

let tableName = 'grocery_prices';
// if (process.env.ENV && process.env.ENV !== 'NONE') {
//   tableName = tableName + '-' + process.env.ENV;
// }
const AGGREGATED_TABLE = process.env.STORAGE_GROCERYAGGREGATED_NAME;

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.BUCKET_NAME + '-' + process.env.ENV;
const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = 'pk';
const partitionKeyType = 'S';
const sortKeyName = 'sk';
const sortKeyType = 'S';
const hasSortKey = sortKeyName !== '';
const path = '/';
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';

const normalizeQuantity = (quantity, unit) => {
  if (!unit || isNaN(quantity)) {
    return { value: null, unit: null };
  }

  const lower = unit.toLowerCase();

  // Normalize weights to g
  const weightMap = {
    kg: 1000,
    g: 1,
  };

  // Normalize volumes to mL
  const volumeMap = {
    l: 1000,
    ml: 1,
  };

  if (weightMap[lower] !== undefined) {
    const normalizedValue = quantity * weightMap[lower]; // convert to grams
    const normalizedUnit = 'g';
    return {
      value: normalizedValue,
      unit: normalizedUnit,
    };
  }

  if (volumeMap[lower] !== undefined) {
    const normalizedValue = quantity * volumeMap[lower]; // convert to ml
    const normalizedUnit = 'ml';
    return {
      value: normalizedValue,
      unit: normalizedUnit,
    };
  }

  // If unknown unit, return original
  return { value: quantity, unit: lower };
};

const normalizePricePer = (base_amount, base_unit, price_per_base_amount) => {
  const { value: quantity, unit } = normalizeQuantity(base_amount, base_unit);
  if (!quantity || quantity === 0) return null;
  else if (base_unit === 'kg' || base_unit === 'l') {
    return {
      value: quantity / quantity,
      unit: unit,
      price_per_base_amount: price_per_base_amount / 1000 / quantity,
    };
  }
  return {
    value: quantity / quantity,
    unit: unit,
    price_per_base_amount: price_per_base_amount / quantity,
  };
};

const averageMostCommonUnit = (values) => {
  if (!values.length) return { unit: null, average: null };

  // Count frequency of each unit
  const unitCounts = {};
  for (const { unit } of values) {
    unitCounts[unit] = (unitCounts[unit] || 0) + 1;
  }

  // Find the most common unit
  let mostCommonUnit = null;
  let maxCount = 0;
  for (const unit in unitCounts) {
    if (unitCounts[unit] > maxCount) {
      mostCommonUnit = unit;
      maxCount = unitCounts[unit];
    }
  }

  // Filter values by most common unit
  const matchingValues = values
    .filter((v) => v.unit === mostCommonUnit)
    .map((v) => v.value);

  const average =
    matchingValues.reduce((sum, val) => sum + val, 0) / matchingValues.length;

  return {
    unit: mostCommonUnit,
    average: parseFloat(average.toFixed(5)),
  };
};

// Middleware to check authentication and authorization
const authenticateAndAuthorize = (req, res, next) => {
  try {
    const claims = req.apiGateway?.event?.requestContext?.authorizer?.claims;

    if (!claims) {
      console.warn('Unauthorized: No token claims present');
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const userGroups = claims['cognito:groups']?.split(',') || [];
    const username = claims['cognito:username'];

    if (!username) {
      console.warn('Unauthorized: Missing username from token');
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    if (!userGroups.includes('admin')) {
      console.warn(`Forbidden: User ${username} not in admin group`);
      return res
        .status(403)
        .json({ error: 'Forbidden: Admin access required' });
    }

    // Optionally attach username to request for logging/auditing
    req.user = { username, groups: userGroups };

    next();
  } catch (err) {
    console.error('Authentication middleware failed:', err);
    return res.status(500).json({ error: 'Internal auth error' });
  }
};

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(express.json());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case 'N':
      return Number.parseInt(param);
    default:
      return param;
  }
};

/************************************
 * HTTP Get method to list objects *
 ************************************/

app.get(path + 'items', authenticateAndAuthorize, async function (req, res) {
  var params = {
    TableName: tableName,
    Select: 'ALL_ATTRIBUTES',
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    res.json(data.Items);
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: 'Could not load items: ' + err.message });
  }
});

/************************************
 * HTTP Get method to list unique objects *
 ************************************/

app.get(
  path + 'items/unique',
  authenticateAndAuthorize,
  async function (req, res) {
    const city = req.query.city?.toString().trim();
    const category = req.query.category?.toString().trim();
    const prepared_in_canada = req.query.prepared_in_canada?.toString().trim();

    let params;
    let command;

    // Prefer GSI_City if both city and category are provided
    if (city && category) {
      params = {
        TableName: tableName,
        IndexName: 'GSI_City',
        KeyConditionExpression: '#city = :city AND #category = :category',
        ExpressionAttributeNames: {
          '#city': 'city',
          '#category': 'category',
        },
        ExpressionAttributeValues: {
          ':city': city,
          ':category': category,
        },
      };
      command = new QueryCommand(params);
    }
    // Use category as partition key if provided
    else if (category) {
      params = {
        TableName: tableName,
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeNames: {
          '#pk': 'pk',
        },
        ExpressionAttributeValues: {
          ':pk': `category#${category.toLowerCase().replace(/\s+/g, '_')}`,
        },
      };
      command = new QueryCommand(params);
    } else if (city) {
      params = {
        TableName: tableName,
        IndexName: 'GSI_City',
        KeyConditionExpression: '#city = :city',
        ExpressionAttributeNames: {
          '#city': 'city',
        },
        ExpressionAttributeValues: {
          ':city': city,
        },
      };
      command = new QueryCommand(params);
    }

    // Use GSI_PreparedInCanada if prepared_in_canada and category are provided
    else if (prepared_in_canada && category) {
      params = {
        TableName: tableName,
        IndexName: 'GSI_PreparedInCanada',
        KeyConditionExpression: '#pic = :pic AND #category = :category',
        ExpressionAttributeNames: {
          '#pic': 'prepared_in_canada',
          '#category': 'category',
        },
        ExpressionAttributeValues: {
          ':pic': prepared_in_canada,
          ':category': category,
        },
      };
      command = new QueryCommand(params);
    }

    // Use GSI_PreparedInCanada if only prepared_in_canada is provided
    else if (prepared_in_canada) {
      params = {
        TableName: tableName,
        IndexName: 'GSI_PreparedInCanada',
        KeyConditionExpression: '#pic = :pic',
        ExpressionAttributeNames: {
          '#pic': 'prepared_in_canada',
        },
        ExpressionAttributeValues: {
          ':pic': prepared_in_canada,
        },
      };
      command = new QueryCommand(params);
    }

    // Fallback to Scan with dynamic filters
    else {
      const filters = [];
      const names = {};
      const values = {};

      if (category) {
        filters.push('#category = :category');
        names['#category'] = 'category';
        values[':category'] = category;
      }

      if (city) {
        filters.push('#city = :city');
        names['#city'] = 'city';
        values[':city'] = city;
      }

      if (prepared_in_canada) {
        filters.push('#pic = :pic');
        names['#pic'] = 'prepared_in_canada';
        values[':pic'] = prepared_in_canada;
      }

      params = {
        TableName: tableName,
        ...(filters.length && {
          FilterExpression: filters.join(' AND '),
          ExpressionAttributeNames: names,
          ExpressionAttributeValues: values,
        }),
      };
      command = new ScanCommand(params);
    }

    try {
      let items = [];
      let lastEvaluatedKey;
      let commandInstance;

      do {
        if (lastEvaluatedKey) {
          params.ExclusiveStartKey = lastEvaluatedKey;
        }

        commandInstance =
          command instanceof QueryCommand
            ? new QueryCommand(params)
            : new ScanCommand(params);

        const result = await ddbDocClient.send(commandInstance);

        if (result.Items) {
          items = items.concat(result.Items);
        }

        lastEvaluatedKey = result.LastEvaluatedKey;
      } while (lastEvaluatedKey);

      const uniqueItems = {};
      items.forEach((item) => {
        const key = `${item.city?.toLowerCase()}|${item.product_name?.toLowerCase()}`;
        const timestamp = new Date(item.timestamp);

        if (
          !uniqueItems[key] ||
          new Date(uniqueItems[key].timestamp) < timestamp
        ) {
          uniqueItems[key] = item;
        }
      });

      res.json(Object.values(uniqueItems));
    } catch (err) {
      console.error('DynamoDB error:', err);
      res.status(500).json({ error: 'Could not load items: ' + err.message });
    }
  }
);

/************************************
 * HTTP Public get method to get cached all unique objects *
 ************************************/

app.get(path + 'public/all', async function (req, res) {
  const PREFIX = `internal/RAI/grocery/cache/aggregated-categories/`;
  try {
    // Step 1: List all objects in the aggregation folder
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: PREFIX,
    });

    const listResponse = await s3.send(listCommand);
    const files = listResponse.Contents || [];

    if (files.length === 0) {
      return res.status(404).json({ error: 'No files found.' });
    }

    // Step 2: Find the most recent file by LastModified
    const mostRecentFile = files.reduce((a, b) =>
      new Date(a.LastModified) > new Date(b.LastModified) ? a : b
    );

    // Step 3: Get the file content
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: mostRecentFile.Key,
    });

    const getResponse = await s3.send(getCommand);
    const body = await getResponse.Body.transformToString();

    // Step 4: Return as JSON
    res.setHeader('Content-Type', 'application/json');
    res.send(body);
  } catch (err) {
    res.statusCode = 500;
    console.log(err);
    res.json({ error: 'Could not load items: ' + err.message });
  }
});

app.get(path + 'public/rent', async function (req, res) {
  const PREFIX = `internal/RAI/rent/`;
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: PREFIX,
    });

    const listResponse = await s3.send(listCommand);
    const files = listResponse.Contents || [];

    if (files.length === 0) {
      return res.status(404).json({ error: 'No files found.' });
    }

    // Step 2: Find the most recent file by LastModified
    const mostRecentFile = files.reduce((a, b) =>
      new Date(a.LastModified) > new Date(b.LastModified) ? a : b
    );

    // Step 3: Get the file content
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: mostRecentFile.Key,
    });

    const getResponse = await s3.send(getCommand);
    const body = await getResponse.Body.transformToString();

    // Step 4: Return as JSON
    res.setHeader('Content-Type', 'application/json');
    res.send(body);
  } catch (err) {
    res.statusCode = 500;
    console.log(err);
    res.json({ error: 'Could not load items: ' + err.message });
  }
});

app.get(path + 'public/income', async function (req, res) {
  const PREFIX = `internal/RAI/income/`;
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: PREFIX,
    });

    const listResponse = await s3.send(listCommand);
    const files = listResponse.Contents || [];

    if (files.length === 0) {
      return res.status(404).json({ error: 'No files found.' });
    }

    // Step 2: Find the most recent file by LastModified
    const mostRecentFile = files.reduce((a, b) =>
      new Date(a.LastModified) > new Date(b.LastModified) ? a : b
    );

    // Step 3: Get the file content
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: mostRecentFile.Key,
    });

    const getResponse = await s3.send(getCommand);
    const body = await getResponse.Body.transformToString();

    // Step 4: Return as JSON
    res.setHeader('Content-Type', 'application/json');
    res.send(body);
  } catch (err) {
    res.statusCode = 500;
    console.log(err);
    res.json({ error: 'Could not load items: ' + err.message });
  }
});

/************************************
 * HTTP Public get method to get all unique objects *
 ************************************/
app.get(path + 'public/unique', async function (req, res) {
  const params = {
    TableName: tableName,
    Select: 'ALL_ATTRIBUTES',
  };

  params.FilterExpression =
    'NOT begins_with(#pk, :excluded) AND #department = :department' +
    ' AND (attribute_not_exists(#outlier) OR #outlier <> :outlier)';

  params.ExpressionAttributeNames = {
    '#pk': 'pk',
    '#department': 'department',
    '#outlier': 'outlier',
  };

  params.ExpressionAttributeValues = {
    ':excluded': 'category#easter',
    ':department': 'grocery',
    ':outlier': 'true',
  };

  try {
    let items = [];
    let lastEvaluatedKey;

    do {
      if (lastEvaluatedKey) {
        params.ExclusiveStartKey = lastEvaluatedKey;
      }

      const result = await ddbDocClient.send(new ScanCommand(params));

      if (result.Items) {
        items = items.concat(result.Items);
      }

      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    // Step 1: Deduplicate by city + product_name
    const deduped = new Map();

    items.forEach((item) => {
      const city = item.city?.toLowerCase();
      const product = item.product_name?.toLowerCase();
      const timestamp = new Date(item.timestamp);

      if (!city || !product || isNaN(timestamp)) return;

      const key = `${city}|${product}`;
      const existing = deduped.get(key);

      if (!existing || existing.timestamp < timestamp) {
        deduped.set(key, item);
      }
    });

    // Step 2: Group separately for Canadian and non-Canadian items
    const grouped = {
      prepared: {},
      not_prepared: {},
    };

    for (const item of deduped.values()) {
      const {
        city,
        category,
        price,
        quantity,
        quantity_unit,
        base_amount,
        base_unit,
        price_per_base_amount,
        prepared_in_canada,
        statscan_quantity,
        statscan_unit,
        timestamp,
      } = item;

      const baseAmount = parseFloat(base_amount);
      const baseUnit = base_unit?.toLowerCase();
      const quantityUnit = quantity_unit?.toLowerCase();
      const isPrepared = prepared_in_canada === 'true';
      const time = new Date(timestamp);

      if (!city || !category || isNaN(price)) continue;

      const { value: normalizedQty, unit: normalizedUnit } = normalizeQuantity(
        quantity,
        quantityUnit
      );

      const { value: normalizedStatscanQty, unit: normalizedStatscanUnit } =
        normalizeQuantity(statscan_quantity, statscan_unit);

      const result = normalizePricePer(
        baseAmount,
        baseUnit,
        parseFloat(price_per_base_amount)
      );

      if (!result) continue;

      const {
        value: normalizedBaseAmount,
        unit: normalizedBaseUnit,
        price_per_base_amount: pricePerBase,
      } = result;

      if (pricePerBase == null) continue;

      const key = `${city}|${category}`;
      const targetGroup = isPrepared ? grouped.prepared : grouped.not_prepared;

      if (!targetGroup[key]) {
        targetGroup[key] = {
          city,
          category: category.toLowerCase().trim(),
          latest_timestamp: time,
          total_price: price,
          statscan_quantity: normalizedStatscanQty ?? null,
          statscan_unit: normalizedStatscanUnit ?? null,
          total_price_per_base: pricePerBase,
          total_quantity: normalizedQty ?? 0,
          quantity_count: normalizedQty ? 1 : 0,
          quantity_unit: normalizedUnit ?? null,
          quantity_units: new Set(normalizedUnit ? [normalizedUnit] : []),
          base_amount_total: normalizedBaseAmount ?? 0,
          base_count: normalizedBaseAmount ? 1 : 0,
          base_unit: normalizedBaseUnit ?? null,
          base_units: new Set(normalizedBaseUnit ? [normalizedBaseUnit] : []),
          price_per_base_values: normalizedBaseUnit
            ? [{ unit: normalizedBaseUnit, value: pricePerBase }]
            : [],
          quantity_values:
            normalizedUnit && normalizedQty
              ? [{ unit: normalizedUnit, value: normalizedQty }]
              : [],
          base_amount_values:
            normalizedBaseUnit && !isNaN(normalizedBaseAmount)
              ? [{ unit: normalizedBaseUnit, value: normalizedBaseAmount }]
              : [],
          count: 1,
        };
      } else {
        const group = targetGroup[key];
        group.total_price += price;
        group.total_price_per_base += pricePerBase;
        group.count += 1;

        if (normalizedQty != null && normalizedQty !== 0) {
          group.total_quantity += normalizedQty;
          group.quantity_count += 1;
        }

        if (!isNaN(normalizedBaseAmount) && normalizedBaseAmount !== 0) {
          group.base_amount_total += normalizedBaseAmount;
          group.base_count += 1;
        }

        if (!group.base_unit && normalizedBaseUnit) {
          group.base_unit = normalizedBaseUnit;
        }

        if (!group.quantity_unit && normalizedUnit) {
          group.quantity_unit = normalizedUnit;
        }

        if (normalizedBaseUnit) {
          group.base_units.add(normalizedBaseUnit);
          group.price_per_base_values.push({
            unit: normalizedBaseUnit,
            value: pricePerBase,
          });

          if (!isNaN(normalizedBaseAmount)) {
            group.base_amount_values.push({
              unit: normalizedBaseUnit,
              value: normalizedBaseAmount,
            });
          }
        }

        if (normalizedUnit && normalizedQty != null && normalizedQty !== 0) {
          group.quantity_values.push({
            unit: normalizedUnit,
            value: normalizedQty,
          });
        }

        if (normalizedUnit) {
          group.quantity_units.add(normalizedUnit);
        }

        if (time > group.latest_timestamp) {
          group.latest_timestamp = time;
        }
      }
    }

    const formatGroups = (groupMap) =>
      Object.values(groupMap).map((group) => {
        const pricePerBase = averageMostCommonUnit(group.price_per_base_values);
        const baseAmount = averageMostCommonUnit(group.base_amount_values);

        // ✨ Use base_unit as authoritative for quantity
        const baseUnit = pricePerBase.unit; // use this as the unit filter for quantity
        const matchingQuantities = group.quantity_values
          .filter((q) => (q.unit || '').trim().toLowerCase() === baseUnit)
          .map((q) => q.value)
          .filter((v) => typeof v === 'number' && !isNaN(v));

        const averageQuantity =
          matchingQuantities.length > 0
            ? parseFloat(
                (
                  matchingQuantities.reduce((sum, v) => sum + v, 0) /
                  matchingQuantities.length
                ).toFixed(5)
              )
            : null;

        const quantityFrequencyMap = {};
        for (const qty of matchingQuantities) {
          quantityFrequencyMap[qty] = (quantityFrequencyMap[qty] || 0) + 1;
        }

        let mostFrequentQuantity;
        let maxCount = 0;

        for (const [valueStr, count] of Object.entries(quantityFrequencyMap)) {
          const value = parseFloat(valueStr);
          if (count > maxCount) {
            maxCount = count;
            mostFrequentQuantity = value;
          }
        }

        return {
          city: group.city,
          category: group.category.toLowerCase().trim(),
          average_price:
            group.count > 0
              ? parseFloat((group.total_price / group.count).toFixed(2))
              : null,
          average_price_per_base: pricePerBase.average,
          statscan_quantity: group.statscan_quantity,
          statscan_unit: group.statscan_unit,
          base_unit: baseUnit,
          average_base_amount: baseAmount.average,
          most_frequent_quantity: mostFrequentQuantity,
          average_quantity: averageQuantity,
          quantity_unit: baseUnit, // 🚨 always use the same unit as base_unit
          latest_timestamp: group.latest_timestamp.toISOString(),
        };
      });

    const result = {
      prepared_in_canada: formatGroups(grouped.prepared),
      not_prepared_in_canada: formatGroups(grouped.not_prepared),
    };
    res.json(result);
  } catch (err) {
    console.error('Error in /public/unique:', err);
    res
      .status(500)
      .json({ error: 'Could not calculate averages: ' + err.message });
  }
});

/************************************
 * HTTP Get method to query objects *
 ************************************/

app.get(
  path + 'items' + hashKeyPath,
  authenticateAndAuthorize,
  async function (req, res) {
    const condition = {};
    condition[partitionKeyName] = {
      ComparisonOperator: 'EQ',
    };

    if (userIdPresent && req.apiGateway) {
      condition[partitionKeyName]['AttributeValueList'] = [
        req.apiGateway.event.requestContext.identity.cognitoIdentityId ||
          UNAUTH,
      ];
    } else {
      try {
        condition[partitionKeyName]['AttributeValueList'] = [
          convertUrlType(req.params[partitionKeyName], partitionKeyType),
        ];
      } catch (err) {
        res.statusCode = 500;
        res.json({ error: 'Wrong column type ' + err });
      }
    }

    let queryParams = {
      TableName: tableName,
      KeyConditions: condition,
    };

    try {
      const data = await ddbDocClient.send(new QueryCommand(queryParams));
      res.json(data.Items);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err.message });
    }
  }
);

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(
  path + 'items/object' + hashKeyPath + sortKeyPath,
  authenticateAndAuthorize,
  async function (req, res) {
    const params = {};
    if (userIdPresent && req.apiGateway) {
      params[partitionKeyName] =
        req.apiGateway.event.requestContext.identity.cognitoIdentityId ||
        UNAUTH;
    } else {
      params[partitionKeyName] = req.params[partitionKeyName];
      try {
        params[partitionKeyName] = convertUrlType(
          req.params[partitionKeyName],
          partitionKeyType
        );
      } catch (err) {
        res.statusCode = 500;
        res.json({ error: 'Wrong column type ' + err });
      }
    }
    if (hasSortKey) {
      try {
        params[sortKeyName] = convertUrlType(
          req.params[sortKeyName],
          sortKeyType
        );
      } catch (err) {
        res.statusCode = 500;
        res.json({ error: 'Wrong column type ' + err });
      }
    }

    let getItemParams = {
      TableName: tableName,
      Key: params,
    };

    try {
      const data = await ddbDocClient.send(new GetCommand(getItemParams));
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data);
      }
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err.message });
    }
  }
);

/************************************
 * HTTP put method for insert object *
 *************************************/

app.put(path + 'items', authenticateAndAuthorize, async function (req, res) {
  if (userIdPresent) {
    req.body['userId'] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body,
  };
  try {
    let data = await ddbDocClient.send(new PutCommand(putItemParams));
    res.json({ success: 'put call succeed!', url: req.url, data: data });
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err, url: req.url, body: req.body });
  }
});

/************************************
 * HTTP post method for insert object *
 *************************************/

app.post(path + 'items', authenticateAndAuthorize, async function (req, res) {
  if (userIdPresent) {
    req.body['userId'] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body,
  };
  try {
    let data = await ddbDocClient.send(new PutCommand(putItemParams));
    res.json({ success: 'post call succeed!', url: req.url, data: data });
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err, url: req.url, body: req.body });
  }
});

/**************************************
 * HTTP remove method to delete object *
 ***************************************/

app.delete(
  path + 'items/object' + hashKeyPath + sortKeyPath,
  authenticateAndAuthorize,
  async function (req, res) {
    const params = {};
    if (userIdPresent && req.apiGateway) {
      params[partitionKeyName] =
        req.apiGateway.event.requestContext.identity.cognitoIdentityId ||
        UNAUTH;
    } else {
      params[partitionKeyName] = req.params[partitionKeyName];
      try {
        params[partitionKeyName] = convertUrlType(
          req.params[partitionKeyName],
          partitionKeyType
        );
      } catch (err) {
        res.statusCode = 500;
        res.json({ error: 'Wrong column type ' + err });
      }
    }
    if (hasSortKey) {
      try {
        params[sortKeyName] = convertUrlType(
          req.params[sortKeyName],
          sortKeyType
        );
      } catch (err) {
        res.statusCode = 500;
        res.json({ error: 'Wrong column type ' + err });
      }
    }

    let removeItemParams = {
      TableName: tableName,
      Key: params,
    };

    try {
      let data = await ddbDocClient.send(new DeleteCommand(removeItemParams));
      res.json({ url: req.url, data: data });
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url });
    }
  }
);

app.listen(4000, function () {
  console.log('App started');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
