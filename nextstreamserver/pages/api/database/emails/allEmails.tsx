import { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../connections";
import MailSendInfo from "../schemas/MailSendInfo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnection();

  if (req.method === "GET") {
    var allEmailsInfo = await MailSendInfo.find().exec();
    res.status(200).send(allEmailsInfo);
  }
}
