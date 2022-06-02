import { ReactStaticSite, use } from "@serverless-stack/resources";
import { AuthApiStack } from "./AuthApiStack";
import { StorageStack } from "./StorageStack";

export function FrontendStack({ stack, app }) {
  const { auth, api, domain } = use(AuthApiStack);
  const { bucket } = use(StorageStack);

  const site = new ReactStaticSite(stack, "ReactSite", {
    path: "frontend",
    environment: {
      REACT_APP_API_URL: api.customDomainUrl || api.url,
      REACT_APP_REGION: app.region,
      REACT_APP_BUCKET: bucket.bucketName,
      REACT_APP_USER_POOL_ID: auth.userPoolId,
      REACT_APP_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId,
      REACT_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      REACT_APP_API_STAGE: app.stage,
      REACT_APP_COGNITO_DOMAIN: domain.domainName,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
