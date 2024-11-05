/* eslint-disable */

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

let tableName = 'interviews';
// if (process.env.ENV && process.env.ENV !== 'NONE') {
//   tableName = tableName + '-' + process.env.ENV;
// }

const userIdPresent = false;
const partitionKeyName = 'Document group';
const partitionKeyType = '';
const sortKeyName = 'Document name';
const sortKeyType = '';
const hasSortKey = sortKeyName !== '';
const path = '/interview';
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS'); // Allow necessary HTTP methods
  next();
});

// Handle preflight CORS requests
app.options('/*', (req, res) => {
  res.status(200).send(); // Send OK for OPTIONS requests
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

app.get(path, async function (req, res) {
  // Log the incoming request data
  console.log('Received GET request:', req.path);

  const params = {
    TableName: tableName,
    Select: 'ALL_ATTRIBUTES',
  };

  try {
    // Retrieve data from DynamoDB
    const data = await ddbDocClient.send(new ScanCommand(params));

    // Log the data retrieved from DynamoDB
    console.log(
      'Data retrieved from DynamoDB:',
      JSON.stringify(data.Items, null, 2)
    );

    // Send response back to client
    res.json(data.Items);

    // Log the response being sent
    console.log('Response sent:', JSON.stringify(data.Items, null, 2));
  } catch (err) {
    // Log the error message
    console.error('Error retrieving items:', err.message);

    // Send error response
    res.status(500).json({ error: 'Could not load items: ' + err.message });
  }
});
/************************************
 * HTTP Get method to query objects *
 ************************************/

app.get('/interview/:docGroup/:code', async function (req, res) {
  // Extracting the parameters from the request
  const docGroup = req.params.docGroup; // Document group
  const code = req.params.code; // Code

  // Constructing the query parameters
  let queryParams = {
    TableName: tableName,
    KeyConditionExpression: '#docGroup = :docGroup',
    ExpressionAttributeNames: {
      '#docGroup': 'Document group', // Use the actual name of your partition key
    },
    ExpressionAttributeValues: {
      ':docGroup': docGroup,
    },
  };

  // If you have a GSI to filter by Code
  if (code) {
    queryParams.IndexName = 'Interview-code-index'; // Use the actual GSI name if querying by Code
    queryParams.FilterExpression = '#code = :code'; // Filter expression for Code
    queryParams.ExpressionAttributeNames['#code'] = 'Code'; // Use the actual attribute name
    queryParams.ExpressionAttributeValues[':code'] = code; // Set the value for Code
  }

  try {
    const data = await ddbDocClient.send(new QueryCommand(queryParams));
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({ error: 'Could not load items: ' + err.message });
  }
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(
  path + '/object' + hashKeyPath + sortKeyPath,
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

app.put(path, async function (req, res) {
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

app.post(path, async function (req, res) {
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
  path + '/object' + hashKeyPath + sortKeyPath,
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
