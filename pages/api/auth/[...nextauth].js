import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import { connectDatabase } from "../../../lib/db";

export default NextAuth({
  session: {
    jwt: true,
  },
  secret: "secret-log",
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await connectDatabase();
        const db = client.db();

        const user = await db.collection("users").findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error("No user found");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) {
          client.close();
          throw new Error("Wrong password");
        }

        client.close();
        return {
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
});
