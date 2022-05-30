import { Api, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }) {
  const { table } = use(StorageStack); //This new ApiStack references the table resource from the StorageStack that we created previously.
  const api = new Api(stack, "Api", {
    //We are creating an API using SST’s Api construct.
    defaults: {
      function: {
        permissions: [table], //We are giving our API permission to access our DynamoDB table
        environment: {
          TABLE_NAME: table.tableName, //We’ll need this to query our table.
        },
      },
    },
    routes: {
      "POST /notes": "functions/create.main",
      "GET /notes/{id}": "functions/get.main",
      "GET /notes": "functions/list.main",
      "PUT /notes/{id}": "functions/update.main",
      "DELETE /notes/{id}": "functions/delete.main",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}
