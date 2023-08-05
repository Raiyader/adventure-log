import { hashPassword } from "../../../lib/auth";
import { connectDatabase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const data = req.body;
  const { email, username, password, confirmPass } = data;

  const client = await connectDatabase();
  const db = client.db();

  //Validation
  if (!email || !email.includes("@")) {
    res.status(422).json({ message: "Invalid email" });
    client.close();
    return;
  }

  const existingUser = await db.collection("users").findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: "User already exist" });
    client.close();
    return;
  }

  if (!username || username.trim().length < 3 || username.trim().length > 24) {
    res.status(422).json({
      message: "Username can be between 3-24 characters",
    });
    client.close();
    return;
  }

  if (username.includes(" ")) {
    res.status(422).json({
      message: "No spaces in username",
    });
    client.close();
    return;
  }

  const existingUsername = await db
    .collection("users")
    .findOne({ username: username });

  if (existingUsername) {
    res.status(422).json({ message: "This username is already taken" });
    client.close();
    return;
  }

  if (!password || password.trim().length < 8) {
    res.status(422).json({
      message: "Password length must be atleast 8 characters",
    });
    client.close();
    return;
  }

  if (password !== confirmPass) {
    res.status(422).json({ message: "Passwords did not match" });
    client.close();
    return;
  }

  const hashedPw = await hashPassword(password);

  const result = await db
    .collection("users")
    .insertOne({ email: email, username: username, password: hashedPw });

  res.status(201).json({ message: "Successful" });
  client.close();
}

export default handler;
