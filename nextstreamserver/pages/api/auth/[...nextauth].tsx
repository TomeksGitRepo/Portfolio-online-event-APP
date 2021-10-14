import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import dbConnection from "../database/connections";
import adminSchema from "../database/schemas/AdminSchema";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const options = {
  // https://next-auth.js.org/configuration/providers
  providers: [
    Providers.Credentials({
      credentials: {
        username: {
          label: "Użytkownik",
          type: "text",
          placeholder: "Nazwa użytkownika",
        },
        password: { label: "Hasło", type: "password" },
      },
      async authorize(credentials, req) {
        await dbConnection();
        const username = credentials["username"];
        const password = credentials["password"];
        var result = await adminSchema.find(
          { username, password },
          (err, docs) => {
            if (err) {
              console.log(`error with databse ${err}`);
              return null;
            }
            if (docs.length == 0) {
              console.log("found 0 result for admin in database");
              return false;
            }

            var _id = docs[0]["_id"];
            console.log(`userFound in database is: ${docs[0]}`);
            const user = { _id, username };
            return user;
          }
        );

        if (result.length != 0) {
          return { ...result };
        }
        return null;
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
};

export default (req, res) => NextAuth(req, res, options);
