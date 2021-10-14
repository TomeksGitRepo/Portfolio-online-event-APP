import { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../connections";
import userSchema, { IUserInfo } from "../schemas/UserSchema";
import {v4 as uuidv4} from 'uuid';
import UserSchema from "../schemas/UserSchema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnection();

  if (req.method === "POST") {
    var { email } = req.body;
    var uuid = uuidv4()
    var newUser = new UserSchema({"email" : email, "token" : uuid})
    newUser.save((error) => {
        if (error) {
            res.send(`Error saving user to database: ${error}`)
            return
        }
        res.send('Użytkownik dodany')
        return 
    })
  } else {
    //Other http methods
    res.send(null);
  }
}