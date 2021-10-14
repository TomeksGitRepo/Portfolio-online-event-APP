import { Model, Schema, Date as MongoDate } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../connections";
import userSchema, { IUserInfo } from "../schemas/UserSchema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnection();

  if (req.method === "GET") {
    var getAllUsers = await userSchema.find();
    res.send(JSON.stringify(getAllUsers))
  } else {
    //Other http methods
    res.send(null);
  }
}