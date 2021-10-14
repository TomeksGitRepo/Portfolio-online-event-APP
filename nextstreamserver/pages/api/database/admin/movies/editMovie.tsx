import { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../../connections";
import movieModel from "../../schemas/MovieSchema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnection();

  if (req.method === "POST") {
    var { movieUrl, title } = req.body;
    //if either of them is null return null
    if (movieUrl == null) {
      res.send("Adres Url nie może być pusty");
      return;
    }
    movieModel.create({ url: movieUrl, title }, (err, docs) => {
      if (err) {
        res.send("Problem z dodaniem filmu do bazy danych");
        return;
      }
      res.send("Film dodany do bazy danych");
      return;
    });
  } else if (req.method === "GET") {
    movieModel.find({}, (err, docs) => {
      if (err) {
        res.send("Problem z pobraniem filmów z bazy danych");
        return;
      }
      res.send(docs);
      return;
    });
  } else if (req.method === "DELETE") {
    var movieToRemove = req.body.movieUrl;
    // console.log(`before remove movie ${JSON.stringify(movieToRemove)}`)
    movieModel.deleteOne({ url: movieToRemove }, (err, docs) => {
      if (err) {
        res.send("Problem z usunięciem filmu");
        return;
      }
      res.send(docs);
      return;
    });
  } else if (req.method === "PATCH") {
    var { movieUrl, markedAsMain, markedAsLive, markedAsNew } = req.body.data;
    // console.log(`req.body.data is ${JSON.stringify(req.body.data)}`)
    // console.log(`before patch movie ${JSON.stringify(movieUrl)}`)
    // console.log(`before patch markedAsMain ${JSON.stringify(markedAsMain)}`)
    if (markedAsMain != undefined) {
      movieModel.findOneAndUpdate(
        { url: movieUrl },
        { markedAsMain },
        (err, docs) => {
          if (err) {
            res.send("Problem z edycią filmu");
            return;
          }
          res.send(docs);
          return;
        }
      );
    }
    if (markedAsLive != undefined) {
      movieModel.findOneAndUpdate(
        { url: movieUrl },
        { markedAsLive },
        (err, docs) => {
          if (err) {
            res.send("Problem z edycią filmu");
            return;
          }
          res.send(docs);
          return;
        }
      );
    }
    if (markedAsNew != undefined) {
      movieModel.findOneAndUpdate(
        { url: movieUrl },
        { markedAsNew },
        (err, docs) => {
          if (err) {
            res.send("Problem z edycią filmu");
            return;
          }
          res.send(docs);
          return;
        }
      );
    }
  } else {
    //Add other request methods
    res.send("Metoda musi być POST or GET aby dodać film");
    return;
  }
}
