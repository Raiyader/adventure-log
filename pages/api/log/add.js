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

  const { title, date, location, content, adventurer } = data.fields;

  const image = data.files.image;

  //Image validation
  if (image === undefined) {
    res.status(422).json({
      message: "Please add an image of your adventure",
    });
    client.close();
    return;
  }
  if (
    image[0].mimetype === "image/jpeg" ||
    image[0].mimetype === "image/jpg" ||
    image[0].mimetype === "image/png"
  ) {
    true;
  } else {
    res.status(422).json({
      message: "Please choose your image in jpeg, jpg or png format",
    });
    client.close();
    return;
  }

  const fullPath = image[0].filepath.replaceAll("\\", "/");
  const path = fullPath.split("public")[1];

  const client = await connectDatabase();
  const db = client.db();

  //Validation
  if (title[0].length === 0) {
    res.status(422).json({ message: "Please enter a title" });
    client.close();
    return;
  }
  if (title[0].length > 48) {
    res.status(422).json({ message: "Title is too long" });
    client.close();
    return;
  }
  if (!date[0]) {
    res.status(422).json({ message: "Please enter a date" });
    client.close();
    return;
  }
  if (location[0].length === 0) {
    res.status(422).json({ message: "Please enter a location" });
    client.close();
    return;
  }
  if (content[0].length === 0) {
    res
      .status(422)
      .json({ message: "Please enter a content about your adventure" });
    client.close();
    return;
  }
  if (content[0].length > 1000) {
    res.status(422).json({ message: "Content is too long" });
    client.close();
    return;
  }

  const log = {
    title: title[0],
    image: path,
    date: new Date(date[0]).toISOString(),
    location: location[0],
    content: content[0],
    adventurer: adventurer[0],
  };

  try {
    const result = await db.collection("logs").insertOne(log);
    log._id = result.insertedId;
  } catch (error) {
    res.status(500).json({ message: "Storing log failed" });
    client.close();
  }
  res.status(201).json({ message: "success", log: log });
  client.close();
}

export default handler;
