import { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../database/connections";
import userSchema from "../database/schemas/UserSchema";
import { v4 as uuidv4 } from "uuid";
import sendMail from "./sender";
import { MailType } from "./types";
import { siteOrigin } from "../utils/serverAdress";

function obfuscateEmail(email: string): string {
  var splitedEmail = email.split("@");
  if (splitedEmail.length === 0) {
    return "Błędny adres email";
  }
  var adress = splitedEmail[0];
  var domain = splitedEmail[1];
  var obfuscateAdress = "";
  var obfuscateDomain = "";
  for (var i = 0; i < adress.length; i++) {
    if (i === 0 || i === adress.length - 1) {
      obfuscateAdress = obfuscateAdress + adress[i];
    } else {
      obfuscateAdress = obfuscateAdress + "*";
    }
  }
  for (var i = 0; i < domain.length; i++) {
    if (i === 0 || i === domain.length - 1) {
      obfuscateDomain = obfuscateDomain + domain[i];
    } else {
      obfuscateDomain = obfuscateDomain + "*";
    }
  }
  return obfuscateAdress + "@" + obfuscateDomain;
}

var usersLastSendMailTime: { [key: string]: Date } = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnection();

  if (req.method === "POST") {
    // console.log(`token in resetLinkMail`)
    var { token } = req.body;
    if (token == null) {
      res.send("user unknown");
      return;
    }
    var generatedLinkResetToken = uuidv4();
    var resultFromUpdate = await userSchema.findOneAndUpdate(
      { token },
      { access_reset_token: generatedLinkResetToken }
    );
    var plainText = `
      Jeśli chcesz wygenerować nowy link dostępu do platformy xxxx, kliknij w poniższy link.
      W następnej wiadomości otrzymasz nowy link dostępu.

      Uwaga! Poprzedni link przestanie być aktywny.
      Nowy link będzie aktywny tylko na jednym urządzeniu.

      ${siteOrigin}/api/mails/resetLinkMail?token=${generatedLinkResetToken}

      Pozdrawiam
        Porfolio event APP
      `;

    var updatedUser = await userSchema.findOne({ token });
    var { email } = updatedUser;

    var timeNow = new Date();
    var timeDiffBeforeAllowingResend = 900000;
    //Check if user didnt send email in last 15 minutes
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
        error:
          "Mail z resetem hasła już wysłany. Możliowość wysłania 1 maila z resetem w ciągu 15 minut. Spróbuj ponownie później",
        time: timeNow.getTime() - usersLastSendMailTime[email].getTime(),
      });
      return;
    }

    if (isUserAllowedToSendMail === false) {
      res.status(400).send("can't send this email");
      return;
    }
    var obscuredMailAdressToDisplayUser = obfuscateEmail(email);

    var sendMeilResult = await sendMail(
      email,
      "XXXX - link restartujący",
      plainText
    );

    usersLastSendMailTime[email] = new Date();

    res.status(201).send({ recipment: obscuredMailAdressToDisplayUser });
    return;
  } else if (req.method === "GET") {
    var userToken = req.query["token"];
    // console.log(`userToken in resetLinkMail is ${userToken}`)
    var newlyGeneratedUserToken = uuidv4();
    await userSchema.findOneAndUpdate(
      { access_reset_token: userToken },
      {
        token: newlyGeneratedUserToken,
        access_reset_token: undefined,
        apiAccessKeys: undefined,
      }
    );
    var newlyGeneratedLinkToPortal = `
        Informujemy, że poprzedni link został zrestartowany.
        Poniżej nowy link dostępu do portalu XXXX:

        ${siteOrigin}/app/pages/token/${newlyGeneratedUserToken}

        Uwaga! Link jest aktywny tylko na jednym urządzeniu.

        Pozdrawiamy 
          Portfolio event APP
        `;

    var updatedUser = await userSchema.findOne({
      token: newlyGeneratedUserToken,
    });
    var { email } = updatedUser;
    var newlyGeneratedTokenSendMailResult = await sendMail(
      email,
      "XXXX - Witamy na portalu XXXX - link dostępu",
      newlyGeneratedLinkToPortal
    );
    res.redirect(`${siteOrigin}/app/pages/token/${newlyGeneratedUserToken}`);
    return;
  } else {
    //Add other request methods
    res.send("Metoda musi być POST aby dodać film");
    return;
  }
}
