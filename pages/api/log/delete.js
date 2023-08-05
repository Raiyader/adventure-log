import fs from "fs";
import { ObjectId } from "mongodb";
import { connectDatabase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "DELETE") return;
  const _id = req.body._id;
  const client = await connectDatabase();
  const db = client.db();

  try {
    const result = await db
      .collection("logs")
      .deleteOne({ _id: new ObjectId(_id) });
  } catch (error) {
    client.close();
    res.status(500).json({ message: "Deleting log failed" });
  }
  client.close();
  res.status(200).json({ message: "deleted" });
}

export default handler;
