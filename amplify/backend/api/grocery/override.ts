// @ts-nocheck
export function override(resources) {
  const authResourceName = 'thegrid2fafc44b3';
  const userPoolArnParameter = 'AuthCognitoUserPoolArn';

  // 1. Add a parameter for the User Pool ARN
  resources.addCfnParameter(
    {
      type: 'String',
      description: 'The ARN of the Cognito User Pool to authorize requests',
      default: 'NONE',
    },
    userPoolArnParameter,
    {
      'Fn::GetAtt': [`auth${authResourceName}`, 'Outputs.UserPoolArn'],
    }
  );

  // 2. Define the Cognito authorizer in the REST API spec
  resources.restApi.addPropertyOverride('Body.securityDefinitions', {
    Cognito: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      'x-amazon-apigateway-authtype': 'cognito_user_pools',
      'x-amazon-apigateway-authorizer': {
        type: 'cognito_user_pools',
        providerARNs: [
          {
            'Fn::Join': ['', [{ Ref: userPoolArnParameter }]],
          },
        ],
      },
    },
  });

  // 3. Add the authorizer to every route (you can customize this)
  for (const path in resources.restApi.body.paths) {
    const methodKey = 'x-amazon-apigateway-any-method';

    // Add Authorization header
    resources.restApi.addPropertyOverride(
      `Body.paths.${path}.${methodKey}.parameters`,
      [
        ...(resources.restApi.body.paths[path][methodKey]?.parameters ?? []),
        {
          name: 'Authorization',
          in: 'header',
          required: false,
          type: 'string',
        },
      ]
    );

    // Apply Cognito authorizer
    resources.restApi.addPropertyOverride(
      `Body.paths.${path}.${methodKey}.security`,
      [{ Cognito: [] }]
    );
  }
}
