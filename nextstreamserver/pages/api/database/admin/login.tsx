import { NextApiRequest, NextApiResponse } from "next";
import dbConnection from '../connections'
import mongoose from 'mongoose'
import adminModelSchema from '../schemas/AdminSchema'

export default async function handler(req : NextApiRequest, res: NextApiResponse) {
  await dbConnection();

    if (req.method === 'POST') {
      var {username, password} = req.body;
      //if either of them is null return null
      if (username == null || password== null) {
        res.send(null)
      }
      adminModelSchema.find({username, password}, (err, docs) => {
        if (err) {
          res.send(null)
        }
        if (docs.length == 0 ) {
          res.send(null);
          return
        }
        var _id = docs[0]["_id"];
        res.send({_id, username})
      })
    } else {
      //Add other request methods
        res.send(null)
    }
  }