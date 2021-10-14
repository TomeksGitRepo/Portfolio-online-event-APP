import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import MailSendInfo, {
  MailSendInfoModel,
} from "../database/schemas/MailSendInfo";

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "xxxx.xxxx.pl",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "xxxx@xxxx.org",
    pass: "xxxx",
  },
});
/**
 *
 * @param emailAdresToSendTo
 * @param subject
 * @param plainText
 * @param htmlBody
 * @returns
 */
export default async function sendMail(
  emailAdresToSendTo: string,
  subject: string,
  plainText?: string,
  htmlBody?: string
) {
  // send mail with defined transport object
  let info = await transporter.sendMail(
    {
      from: "xxxx@xxxx.org", // sender address
      to: emailAdresToSendTo, // list of receivers
      subject: subject,
      text: plainText != null ? plainText : undefined,
      html: htmlBody != null ? htmlBody : undefined,
      // attachments: attachments
    },
    (error: Error, result: any) => {
      //TODO add route to add error and successful mail
      if (error) {
        let newMailInfo = (MailSendInfo as MailSendInfoModel).build({
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack !== undefined ? error.stack : undefined,
          },
          response: "There was error sending email",
          subject,
        });
        newMailInfo.save();
        return console.log(`error sending mail is: ${error}`);
      }
      const { accepted, rejected, response } = result;
      let newMailInfo = (MailSendInfo as MailSendInfoModel).build({
        accepted,
        rejected,
        response,
        subject,
      });
      newMailInfo.save();
      return console.log(`message successfuly send ${JSON.stringify(result)}`);
    }
  );

  return info;
}
