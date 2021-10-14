import { NextApiRequest, NextApiResponse } from "next";
import { validate } from "email-validator";
import dbConnection from "../database/connections";
import userSchema from "../database/schemas/UserSchema";
import { v4 as uuidv4 } from "uuid";
import sendMail from "./sender";
import { siteOrigin } from "../utils/serverAdress";

var usersLastSendMailTime: { [key: string]: Date } = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnection();
  if (req.method === "POST") {
    var { email } = req.body;
    if (email == null || !validate(email)) {
      res.send("user unknown");
      return;
    }
    var timeNow = new Date();
    var timeDiffBeforeAllowingResend = 300000;
    //Check if user didnt send email in last 5 minutes
    var isUserAllowedToSendMail: boolean = false;
    if (usersLastSendMailTime[email] == undefined) {
      isUserAllowedToSendMail = true;
    } else if (
      timeNow.getTime() - usersLastSendMailTime[email].getTime() >
      timeDiffBeforeAllowingResend
    ) {
      isUserAllowedToSendMail = true;
    } else if (
      timeNow.getTime() - usersLastSendMailTime[email].getTime() <
      timeDiffBeforeAllowingResend
    ) {
      res.status(200).send({
        error: "Email already sent",
        timeAgo: timeNow.getTime() - usersLastSendMailTime[email].getTime(),
      });
      return;
    }
    var checkIfUserEmailIsInDatabase = await userSchema.findOne({ email });
    if (checkIfUserEmailIsInDatabase == null) {
      res.send("user not find in database");
      return;
    }
    var generatedLinkResetToken = uuidv4();
    var resultFromUpdate = await userSchema.findOneAndUpdate(
      { email },
      { access_reset_token: generatedLinkResetToken }
    );
    var plainText = `
      Jeżeli chcesz wygenerować nowy link dostępowy do platformy XXXX kliknij poniższy link.
      Uwaga!!! Stary link przestanie być aktywny.

      ${siteOrigin}/api/mails/resetLinkMail?token=${generatedLinkResetToken}

      Pozdrawiamy Zespół XXXX
      `;
    var sendMailResult = await sendMail(
      email,
      "XXXX - link restartujący",
      plainText
    );
    usersLastSendMailTime[email] = new Date();
    res.send(sendMailResult);
    return;
  } else {
    //Add other request methods
    res.send("Metoda musi być POST wysłać link z resetem");
    return;
  }
}
