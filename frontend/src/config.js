export const config = {
  s3: {
    REGION: process.env.REACT_APP_REGION,
    BUCKET: process.env.REACT_APP_BUCKET,
  },
  apiGateway: {
    REGION: process.env.REACT_APP_REGION,
    URL: process.env.REACT_APP_API_URL,
  },
  cognito: {
    REGION: process.env.REACT_APP_REGION,
    USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_IDENTITY_POOL_ID,
    oauth: {
      DOMAIN: `${
        process.env.REACT_APP_COGNITO_DOMAIN +
        ".auth." +
        process.env.REACT_APP_REGION +
        ".amazoncognito.com"
      }`,
      SCOPE: ["email", "profile", "openid", "aws.cognito.signin.user.admin"],
      REDIRECT_SIGNIN:
        process.env.REACT_APP_API_STAGE === "prod"
          ? "production-url"
          : "http://localhost:3000",
      REDIRECT_SIGNOUT:
        process.env.REACT_APP_API_STAGE === "prod"
          ? "production-url"
          : "http://localhost:3000",
    },
  },
  MAX_ATTACHMENT_SIZE: 5000000,
  STRIPE_KEY:
    "pk_test_51HQasTLO0yrPKshL9H1EDh1Z2NpzSamAHAUBsyY13WnyeYLbkxf10OlNCATFovZ8MhyjXb3jF0hJvbfNYHlHep8w00zixoZl1I",
};
