import * as iam from "aws-cdk-lib/aws-iam";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as apigAuthorizers from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { Auth, Api, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function AuthApiStack({ stack, app }) {
  const { bucket } = use(StorageStack);
  const { table } = use(StorageStack); //This new ApiStack references the table resource from the StorageStack that we created previously.

  const auth = new Auth(stack, "Auth", {
    login: ["email"],
    cdk: {
      userPoolClient: {
        supportedIdentityProviders: [
          cognito.UserPoolClientIdentityProvider.GOOGLE,
          cognito.UserPoolClientIdentityProvider.COGNITO,
        ],
        oAuth: {
          callbackUrls: [
            app.stage === "prod"
              ? "prodDomainNameUrl"
              : "http://localhost:3000",
          ],
          logoutUrls: [
            app.stage === "prod"
              ? "prodDomainNameUrl"
              : "http://localhost:3000",
          ],
        },
      },
    },
  });

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
    throw new Error("Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET");

  // Create a Google OAuth provider
  const googleProvider = new cognito.UserPoolIdentityProviderGoogle(
    stack,
    "Google",
    {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      userPool: auth.cdk.userPool,
      scopes: ["profile", "email", "openid"],
      attributeMapping: {
        email: cognito.ProviderAttribute.GOOGLE_EMAIL,
        givenName: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
        familyName: cognito.ProviderAttribute.GOOGLE_FAMILY_NAME,
        profilePicture: cognito.ProviderAttribute.GOOGLE_PICTURE,
      },
    }
  );

  // Create a Facebook OAuth provider

  // attach the created providers to our userpool
  auth.cdk.userPoolClient.node.addDependency(googleProvider);

  const domain = auth.cdk.userPool.addDomain("AuthDomain", {
    cognitoDomain: {
      domainPrefix: `${app.stage}-notes-auth-domain`,
    },
  });

  const api = new Api(stack, "Api", {
    // defaults: {
    //   authorizer: "iam",
    // function: {
    //   permissions: [table], //We are giving our API permission to access our DynamoDB table
    //   environment: {
    //     TABLE_NAME: table.tableName, //We’ll need this to query our table.
    //     STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    //   },
    // },
    // },
    authorizers: {
      userPool: {
        type: "user_pool",
        cdk: {
          authorizer: new apigAuthorizers.HttpUserPoolAuthorizer(
            "Authorizer",
            auth.cdk.userPool,
            {
              userPoolClients: [auth.cdk.userPoolClient],
            }
          ),
        },
      },
    },
    defaults: {
      authorizer: "userPool",
      function: {
        permissions: [table], //We are giving our API permission to access our DynamoDB table
        environment: {
          TABLE_NAME: table.tableName, //We’ll need this to query our table.
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        },
      },
    },
    routes: {
      "POST /notes": "functions/create.main",
      "GET /notes/{id}": "functions/get.main",
      "GET /notes": "functions/list.main",
      "PUT /notes/{id}": "functions/update.main",
      "DELETE /notes/{id}": "functions/delete.main",
      "POST /billing": "functions/billing.main",
    },
  });

  auth.attachPermissionsForAuthUsers([
    api,
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    }),
  ]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    AuthDomain: domain.domainName,
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });

  return { auth, api, domain };
}

// aws cognito-identity get-id --identity-pool-id us-east-1:c007ebc2-2ebf-44d6-9ea5-e40ea36f34df --logins accounts.google.com="eyJhbGciOiJSUzI1NiIsImtpZCI6IjM4ZjM4ODM0NjhmYzY1OWFiYjQ0NzVmMzYzMTNkMjI1ODVjMmQ3Y2EiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDk3NjYzNzY5NzkxLTg0dGlzMnZqM2FrazU4ZTlzNGVwaXJwNmIzOGZjaDA4LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTA5NzY2Mzc2OTc5MS04NHRpczJ2ajNha2s1OGU5czRlcGlycDZiMzhmY2gwOC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMjAzNjc3NDkyNDczNjE5MjQwOSIsImVtYWlsIjoiaG9mdGtlbm55QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiZHluell3SDQ4bElsUGozdEdYMHdXUSIsImlhdCI6MTY1NDExOTc0MiwiZXhwIjoxNjU0MTIzMzQyfQ.HQqqj9YQ8FLyfm0Q3v3OvWk8xuikvTjKvhSM5vxGzsVpYVnx5evoALqscZ4YW3DzK833-yg6OP_mXr8MAYSqvmj0s9ZE3H82nfUo2GRaR23ETJIxn0moKIxoqtjhI6VFJ1hexVs_I9bL9iFC5S2zmBR5Kre_JJCmhHScHFz5wliRxhVZJNwLmTJ_J301-zHAv7ZKu9NSvbwjXAw1RQNTWaHO0wrJUQEZsUXjjaB_163zqTqFW5V9uRc3f5lV3EJ6nFS4CzaYw0Cf0McJu8N4yA5WPqcHfLtN3mgjyZWtB8G1DQI4qN8QuRlyTus07h5i73FZ4W0-CojdbQuk2SqS8w"
