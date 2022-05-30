import { DynamoDB } from "aws-sdk";

const client = new DynamoDB.DocumentClient();

export default {
  get: (params) => client.get(params).promise(),
  put: (params) => client.put(params).promise(),
  update: (params) => client.update(params).promise(),
  query: (params) => client.query(params).promise(),
  delete: (params) => client.delete(params).promise(),
};
