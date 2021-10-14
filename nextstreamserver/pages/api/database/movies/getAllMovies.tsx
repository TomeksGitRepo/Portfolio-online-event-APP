import { NextApiRequest, NextApiResponse } from "next";
import { COOKIE_AUTH_NAME } from "../../../../server/Cookies/cookiesData";
import {
  stampCookieAsUsed,
  validateIfCookieUIDIsValidInDatabase,
} from "../../../../server/Cookies/cookiesUtils";
import dbConnection from "../connections";
import movieSchema from "../schemas/MovieSchema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnection();

  if (req.method === "GET") {
    // console.log(`cookies in getAllMovies is ${JSON.stringify(req.cookies)}`);
    var isCookieUpdated = await stampCookieAsUsed(
      await validateIfCookieUIDIsValidInDatabase(req.cookies[COOKIE_AUTH_NAME])
    );

    if (isCookieUpdated) {
      movieSchema.find({}, (err, docs) => {
        if (err) {
          res.send(null);
        }
        // console.log(`docs in getMarkedAsMain is: ${docs}`)
        res.send(docs);
      });
    } else {
      res.send({ cookieInUse: true });
    }
  } else {
    //Add other request methods
    res.send(null);
  }
}
