import { NextApiRequest, NextApiResponse } from "next";
import dbConnection from '../connections'
import movieSchema from '../schemas/MovieSchema'

export default async function handler(req : NextApiRequest, res: NextApiResponse) {
  await dbConnection();

    if (req.method === 'GET') {
        movieSchema.find({"markedAsMain" : true}, (err, docs) => {
        if (err) {
          res.send(null)
        }
        // console.log(`docs in getMarkedAsMain is: ${docs}`)
        res.send(docs)
      })
    } else {
      //Add other request methods
        res.send(null)
    }
  }