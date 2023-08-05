import { ObjectId } from "mongodb";
import { connectDatabase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "POST") return;
  const { _id, title, date, location, content } = req.body;
  const client = await connectDatabase();
  const db = client.db();

  let log;

  if (title) {
    log = { title: title };
  }
  if (date) {
    log = { date: date };
  }
  if (location) {
    log = { location: location };
  }
  if (content) {
    log = { content: content };
  }

  try {
    const result = await db
      .collection("logs")
      .updateOne({ _id: new ObjectId(_id) }, { $set: log });
  } catch (error) {
    client.close();
    res.status(500).json({ message: "Storing log failed" });
  }
  client.close();
  res.status(200).json({ message: "success", log: log });
}

export default handler;
