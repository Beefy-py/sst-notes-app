import * as iam from "aws-cdk-lib/aws-iam";
import { Auth, use } from "@serverless-stack/resources";
import { ApiStack } from "./ApiStack";
import { StorageStack } from "./StorageStack";

export function AuthStack({ stack, app }) {
  const { bucket } = use(StorageStack);
  const { api } = use(ApiStack);

  const auth = new Auth(stack, "Auth", {
    login: ["email"],
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

  //   Stack kenny-notes-ApiStack
  //   Status: deployed
  //   Outputs:
  //     ApiEndpoint: https://d8cdv8pdh4.execute-api.us-east-1.amazonaws.com

  // Stack kenny-notes-AuthStack
  //   Status: deployed
  //   Outputs:
  //     IdentityPoolId: us-east-1:966cd055-29d0-4f48-ba65-3326cf9dea63
  //     Region: us-east-1
  //     UserPoolClientId: 44hqn436m45aa92j9vkh7pjdfn
  //     UserPoolId: us-east-1_I8XLnM67Q

  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });

  return { auth };
}
