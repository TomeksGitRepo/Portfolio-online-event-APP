import { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../database/connections";
import userSchema from "../database/schemas/UserSchema";
import sendMail from "./sender";
import { MailType } from "./types";
import { siteOrigin } from "../utils/serverAdress";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnection();

  if (req.method === "POST") {
    var { email, subject, type } = req.body;
    // console.log(`email is ${email}`)
    // console.log(`subject is ${subject}`)
    // console.log(`type is ${type}`)

    var { token } = await userSchema.findOne({ email });

    if (type === MailType.AdminAccessSendLink) {
      var plainTextMail = `Admin portalu XXXX przesyła ponownie link dosęptowy do portalu XXXX: 

        ${siteOrigin}/app/pages/token/${token}

        Pozdrawiamy Portfolio event APP
        `;
      var resultSendMailResult = await sendMail(email, subject, plainTextMail);
      console.log(
        `resultSendMailResult is ${JSON.stringify(resultSendMailResult)}`
      );
      res.send("User access link email sended");
      return;
      // console.log('Mail plain body is: --------------------------------')
      // console.log(plainTextMail)
      // console.log('------------------------------------------------')
    } else if (type === MailType.NewUserAddition) {
      var plainTextMail = `
        Serdecznie witamy na portalu XXXX; 
        
        Poniżej link umożliwiający uczestnictwo w wykładach w formie online: 

        ${siteOrigin}/app/pages/token/${token}

        Uwaga! Link jest aktywny tylko na jednym urządzeniu.
        Pozdrawiamy 
          Portfolio event APP
        `;
      var resultSendMailResult = await sendMail(email, subject, plainTextMail);
      res.send("User creation link email sended");
      return;
    } else {
      console.log("its not mail from admin");
      res.send(null);
      return;
    }
  } else {
    //Add other request methods
    res.send("Metoda musi być POST aby dodać film");
    return;
  }
}
