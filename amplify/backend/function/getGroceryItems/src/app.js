/*
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

const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

let tableName = 'grocery_prices';
// if (process.env.ENV && process.env.ENV !== 'NONE') {
//   tableName = tableName + '-' + process.env.ENV;
// }

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

    // Use GSI_City if only city is provided
    else if (city) {
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
      const data = await ddbDocClient.send(command);

      const uniqueItems = {};

      data.Items.forEach((item) => {
        const key = `${item.city?.toLowerCase()}|${item.product_name?.toLowerCase()}`;
        const timestamp = new Date(item.timestamp);

        if (
          !uniqueItems[key] ||
          new Date(uniqueItems[key].timestamp) < timestamp
        ) {
          uniqueItems[key] = item;
        }
      });

      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.json(Object.values(uniqueItems));
    } catch (err) {
      console.error('DynamoDB error:', err);
      res.status(500).json({ error: 'Could not load items: ' + err.message });
    }
  }
);

/************************************
 * HTTP Public get method to get all unique objects *
 ************************************/
app.get(path + 'public/unique', async function (req, res) {
  const params = {
    TableName: tableName,
    Select: 'ALL_ATTRIBUTES',
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));

    // Step 1: Deduplicate by city + product_name
    const deduped = new Map();

    const parseTimestamp = (ts) =>
      ts ? new Date(ts.replace(/\.(\d{3})\d+/, '.$1')) : null;

    data.Items.forEach((item) => {
      const city = item.city?.toLowerCase();
      const product = item.product_name?.toLowerCase();
      const timestamp = parseTimestamp(item.timestamp);

      if (!city || !product || isNaN(timestamp)) return;

      const key = `${city}|${product}`;
      const existing = deduped.get(key);

      if (!existing || parseTimestamp(existing.timestamp) < timestamp) {
        deduped.set(key, item);
      }
    });

    // Step 2: Group separately for Canadian and non-Canadian items
    const grouped = {
      prepared: {},
      not_prepared: {},
    };

    for (const item of deduped.values()) {
      const city = item.city;
      const category = item.category;
      const price = parseFloat(item.price_per_base_amount);
      const isPrepared = item.prepared_in_canada === 'true';

      if (!city || !category || isNaN(price)) continue;

      const key = `${city}|${category}`;
      const targetGroup = isPrepared ? grouped.prepared : grouped.not_prepared;

      if (!targetGroup[key]) {
        targetGroup[key] = {
          city,
          category,
          total: price,
          count: 1,
        };
      } else {
        targetGroup[key].total += price;
        targetGroup[key].count += 1;
      }
    }

    // Step 3: Format results
    const formatGroups = (groupMap) =>
      Object.values(groupMap).map((group) => ({
        city: group.city,
        category: group.category,
        average_price: parseFloat((group.total / group.count).toFixed(2)),
      }));

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

app.listen(3000, function () {
  console.log('App started');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
