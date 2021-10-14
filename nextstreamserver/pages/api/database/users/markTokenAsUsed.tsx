import { Model, Schema, Date as MongoDate } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../connections";
import userSchema, { IUserInfo } from "../schemas/UserSchema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnection();

  if (req.method === "POST") {
    var { token, apiAccessKey } = req.body;
    // console.log(`token in  markTokenAsUsed is ${token}`);
    // console.log(`apiAccessKey in  markTokenAsUsed is ${apiAccessKey}`);
    var now = Date.now();
    var checkIfExists = await userSchema.findOne({
      token,
      "apiAccessKeys.apiAccessKey": apiAccessKey,
    });
    if (checkIfExists && apiAccessKey != null) {
      var result = await userSchema.findOneAndUpdate(
        { token, "apiAccessKeys.apiAccessKey": apiAccessKey },
        { $set: { "apiAccessKeys.$.cookieData.last_use_time": now } },
        { upsert: true }
      );
    }

    res.send(null);
    return;
  } else {
    //Other http methods
    res.send(null);
    return;
  }
}
