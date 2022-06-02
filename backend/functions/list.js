import handler from "../util/handler";
import dynamoDB from "../util/dynamodb";

export const main = handler(async (event) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.authorizer.jwt.claims.sub,
    },
  };
  const result = await dynamoDB.query(params);

  return result.Items;
});
