import { ObjectId } from "mongodb";
import { connectDatabase } from "../../../lib/db";

import formidable from "formidable";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = async (req, saveLocally) => {
  const options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "public", "images", "logs");
    options.filename = (name, ext, path, form) => {
      const originalName = path.originalFilename.replace(" ", "-");
      return Date.now().toString() + "_" + originalName;
    };
  }
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      resolve({ fields, files });
    });
  });
};

async function handler(req, res) {
  if (req.method !== "POST") return;

  const data = await readFile(req, true);

  const { _id } = data.fields;
  const image = data.files.image[0];

  const fullPath = image.filepath.replaceAll("\\", "/");
  const path = fullPath.split("public")[1];

  const client = await connectDatabase();
  const db = client.db();

  const log = { image: path };

  if (
    image.mimetype === "image/jpeg" ||
    image.mimetype === "image/jpg" ||
    image.mimetype === "image/png"
  ) {
    true;
  } else {
    res.status(422).json({
      message: "Invalid image format - Please choose jpeg, jpg or png",
    });
    client.close();
    return;
  }

  try {
    const result = await db
      .collection("logs")
      .updateOne({ _id: new ObjectId(_id[0]) }, { $set: log });
  } catch (error) {
    client.close();
    res.status(500).json({ message: "Storing log failed" });
  }
  client.close();
  res.status(200).json({ message: "success", log: log });
}

export default handler;
