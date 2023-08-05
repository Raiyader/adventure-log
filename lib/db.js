import { MongoClient } from "mongodb";

export async function connectDatabase() {
  const client = await MongoClient.connect("enter_api_key");
  return client;
}
