import mongoose, { Document } from "mongoose";

export interface IUserInfo extends Document {
  email: string;
  token: string;
  devices_connected: number;
  apiAccessKeys: [
    {
      apiAccessKey: string;
      cookieData?: {
        cookieUID: string;
        last_use_time: Date;
      };
    }
  ];
}

const userInfoSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    validate: {
      validator: function (v) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        );
      },
      message: (props) => `${props.value} to niepoprawny adres mailowy`,
    },
    required: true,
  },
  access_reset_token: String,
  token: { type: String, required: true },
  apiAccessKeys: [
    {
      apiAccessKey: {
        type: String,
        required: true,
      },
      cookieData: {
        cookieUID: String,
        last_use_time: Date,
      },
    },
  ],
});

export default mongoose.models.UserInfo ||
  mongoose.model<IUserInfo>("UserInfo", userInfoSchema);
