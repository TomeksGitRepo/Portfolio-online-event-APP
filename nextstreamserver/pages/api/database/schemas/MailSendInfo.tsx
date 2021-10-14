import mongoose from "mongoose";

export interface MailSendInfoAttrs {
  accepted?: string[];
  rejected?: string[];
  response: string;
  error?: Error;
  subject: string;
}

interface MailSendInfoDoc extends mongoose.Document {
  accepted?: string[];
  rejected?: string[];
  response: string;
  error?: Error;
  subject: string;
}

export interface MailSendInfoModel extends mongoose.Model<MailSendInfoDoc> {
  build(attrs: MailSendInfoAttrs): MailSendInfoDoc;
}

const mailSendInfoSchema = new mongoose.Schema<
  MailSendInfoDoc,
  MailSendInfoModel
>(
  {
    accepted: { type: [String], default: undefined },
    rejected: { type: [String], default: undefined },
    response: {
      type: String,
      required: true,
    },
    error: {
      name: String,
      message: String,
      stack: String,
    },
    subject: { type: String },
  },
  { timestamps: { createdAt: "created_at" } }
);

mailSendInfoSchema.statics.build = (attrs: MailSendInfoAttrs) => {
  return new MailSendInfo(attrs);
};

var MailSendInfo =
  mongoose.models.MailSendInfo ||
  mongoose.model<MailSendInfoDoc, MailSendInfoModel>(
    "MailSendInfo",
    mailSendInfoSchema
  );

export default MailSendInfo; //TODO duno if its right
