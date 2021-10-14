import dbConnect from "../../pages/api/database/connections";
import userSchema, {
  IUserInfo,
} from "../../pages/api/database/schemas/UserSchema";

export async function validateIfCookieUIDIsValidInDatabase(
  cookieUID: string
): Promise<IUserInfo | undefined> {
  var databaseConnction;
  databaseConnction = databaseConnction || (await dbConnect());

  var result: IUserInfo = await userSchema
    .findOne({
      "apiAccessKeys.apiAccessKey": cookieUID,
    })
    .exec();

  if (result.apiAccessKeys.length > 0) {
    //This cookie is a valid one if  apiAkcessKey is equal to cookieUID
    return result;
  } else {
    return undefined;
  }
}

export async function stampCookieAsUsed(
  userObjectFromDB: IUserInfo | undefined
): Promise<boolean | undefined> {
  if (userObjectFromDB == undefined) {
    return undefined;
  }
  var apiAccessKey = userObjectFromDB.apiAccessKeys[0]["cookieData"]?.cookieUID;
  //   console.log(`--------- time of last cookie ----------`);
  //   console.log(userObjectFromDB.apiAccessKeys[0]["cookieData"]?.last_use_time);
  //   console.log(`--------- time of last cookie ----------`);

  await userSchema.findOneAndUpdate(
    {
      token: userObjectFromDB.token,
      "apiAccessKeys.apiAccessKey": apiAccessKey,
    },
    {
      $set: {
        "apiAccessKeys.$.cookieData.last_use_time": new Date(),
      },
    },
    { upsert: true }
  );
  //JUst for debugging remove after
  //   var afterUpdate = await userSchema.findOne({ token: userObjectFromDB.token });

  //   console.log(`--------- after update ----------`);
  //   console.log(afterUpdate.apiAccessKeys[0]["cookieData"]?.last_use_time);
  //   console.log(`--------- after update ----------`);
  return true;
}
