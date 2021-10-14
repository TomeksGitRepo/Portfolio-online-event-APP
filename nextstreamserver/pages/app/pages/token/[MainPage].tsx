import Image from "next/image";

import dbConnect from "../../../api/database/connections";
import UserSchema, {
  IUserInfo,
} from "../../../api/database/schemas/UserSchema";
import MainApp from "../../../../server/Components/MainApp";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import TokenInUse from "../../../../server/Components/TokenInUse";
import Cookies from "cookies";
import cookieCutter from "cookie-cutter";
import hideShowSpecificLanguageVersion from "../../../../server/utils/translator";

import {
  COOKIE_AUTH_NAME,
  COOKIE_DOMAIN_VALUE,
} from "../../../../server/Cookies/cookiesData";
import { useEffect } from "react";

const URL_ALREADY_USED_BY_OTHER_USER =
  "Podany link jest aktualnie wykorzystywany na innym urządzeniu. Spróbuj odświeżyć stronę jeszcze raz lub wygeneruj nowy link dostępowy";

var databaseConnction = null;

interface ICookie {
  cookieUID?: string;
  last_use_time?: Date;
}

async function stampTokenInDatabase(token: string, apiAccessKey: string) {
  if (window.closed) {
    //Check if window is closed if its then dont set token as used
    return;
  }
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    var cookieResult = cookieCutter.get(COOKIE_AUTH_NAME);

    const updateUserConnectionTimeUrl = `${origin}/api/database/users/markTokenAsUsed`;
    // //console.log(`url to send post to ${updateUserConnectionTimeUrl}`);
    // //console.log(`apiAccessKey in stampTokenInDatabase  is : ${apiAccessKey}`);

    //Working geting and seting cookie
    // var cookieValue = cookieCutter.get("myCookieName");
    // cookieCutter.set("myCookieName", cookieValue + "a");

    try {
      var result = await axios.post(updateUserConnectionTimeUrl, {
        token,
        apiAccessKey: cookieResult,
      });
      // //console.log(
      //   `resultfulfiled in stampTokenInDatabase is ${JSON.stringify(result)}`
      // );
    } catch (error) {
      //console.log(`catched in rejection ${error}`);
    }

    // axios
    //   .post(updateUserConnectionTimeUrl, { token, apiAccessKey })
    //   .then(
    //     (result) =>
    //       //console.log(`resultfulfiled in then is ${JSON.parse(result)}`),
    //     (rejectionReason) => //console.log(`rejected because ${rejectionReason}`)
    //   )
    // .catch((error) => //console.log(`catched in rejection ${error}`));
  }
}
var intervalHandele;

function MainPage({
  token,
  userId,
  apiAccessKey,
  timeDiff,
  reason,
  timeNowGetTime,
  lastConnectedGetTime,
}) {
  useEffect(() => {
    hideShowSpecificLanguageVersion();
  });
  var resetLinkSend;
  console.log(`reasone why not connected: ${reason}`);
  if (typeof window !== "undefined" && userId != null) {
    console.log(`timeDiff is ${timeDiff}`);
    console.log(`timeNowGetTime is ${timeNowGetTime}`);
    console.log(`lastConnectedGetTime is ${lastConnectedGetTime}`);
    if (token != null && intervalHandele == null) {
      stampTokenInDatabase(token, apiAccessKey);
      intervalHandele = setInterval(
        () => stampTokenInDatabase(token, apiAccessKey),
        58000 //Time update interval
      );
    }
  }
  if (userId == null && reason === URL_ALREADY_USED_BY_OTHER_USER) {
    var lastConnectionInfo: string = `Ktoś korzysta z tego linku. Ostatnie zarejestrowane połącznenie ${Math.ceil(
      timeDiff / 1000
    )} sekund temu.`;
    return <TokenInUse token={token} lastConnectionInfo={lastConnectionInfo} />;
  }

  if (userId == null) {
    return (
      <div className="ui centered grid" style={{ height: "100vh" }}>
        <div className="ui middle aligned column">
          <div className="container" style={{ marginTop: "5px" }}>
            <Image
              src="/kolczyk800x.png"
              alt="Logo kolczyk"
              height="300%"
              width="300%"
            />
          </div>
          <div
            className="ui center aligned row"
            style={{
              marginBottom: "10px",
              fontSize: "15px",
              fontWeight: "bold",
            }}
          >
            <strong className="PL" style={{ color: "red", fontSize: "25px" }}>
              Niepoprawny token!
            </strong>
            <strong className="EN" style={{ color: "red", fontSize: "25px" }}>
              Wrong token!
            </strong>
            <br />
            <br />
            <div className="container PL">
              Musisz posiadać token aby korzystać z portalu.
            </div>
            <div className="container EN">
              You must have a token to use the portal.
            </div>
          </div>
          <div
            className="container-fluid PL"
            style={{
              marginBottom: "10px",
              fontSize: "15px",
              fontWeight: "bold",
            }}
          >
            Skontaktuj się z oragnizatorem w celu rejestracji:
          </div>
          <div
            className="container-fluid EN"
            style={{
              marginBottom: "10px",
              fontSize: "15px",
              fontWeight: "bold",
            }}
          >
            To register contact the organizer by email:
          </div>
          <a
            className="ui fluid button PL"
            href="mailto:xxxx@xxxx.org"
          >
            Wyślij email do xxxx@xxxx.org
          </a>
          <a
            className="ui fluid button EN"
            href="mailto:xxxx@xxxx.org"
          >
            Send email to xxxx@xxxx.org
          </a>
        </div>
      </div>
    );
  }

  if (apiAccessKey == null) {
    var lastConnectionInfo: string = `Ostatnie zarejestrowane połącznenie ${Math.ceil(
      timeDiff / 1000
    )} sekund temu.`;
    return <TokenInUse token={token} lastConnectionInfo={lastConnectionInfo} />;
  }

  return <MainApp />;
}

function isCookieValid(
  cookieFromDB: ICookie | undefined,
  cookieFromBrowser?: string
): boolean {
  if (
    cookieFromDB == null ||
    cookieFromDB.last_use_time == undefined ||
    cookieFromDB.cookieUID === cookieFromBrowser
  ) {
    return true;
  }
  var dateNow = new Date();
  var timeDiff = dateNow.getTime() - cookieFromDB.last_use_time.getTime();

  if (timeDiff > 59000) {
    //TODO update cookie to new UID in database
    return true;
  }
  return false;
}

export const getServerSideProps = async (context) => {
  var token = context.params!["MainPage"];

  const cookies = new Cookies(context.req, context.res);
  var cookieFromBrowserValue: string | undefined =
    cookies.get(COOKIE_AUTH_NAME);

  databaseConnction = databaseConnction || (await dbConnect());
  const resultOfTokenSearch: IUserInfo | undefined = await UserSchema.findOne({
    token,
  }).exec();

  const cookieFromDB: ICookie | undefined =
    resultOfTokenSearch != undefined &&
    resultOfTokenSearch.apiAccessKeys != null &&
    resultOfTokenSearch.apiAccessKeys.length > 0
      ? {
          ...resultOfTokenSearch.apiAccessKeys[0].cookieData,
        }
      : undefined;
  //TODO check if cookie present if it is add logic to check in database if its valid
  var randomUUID: string | undefined;
  var isCookieValidResult = isCookieValid(cookieFromDB, cookieFromBrowserValue);
  if (cookieFromBrowserValue != undefined && !isCookieValidResult) {
    cookies.set(COOKIE_AUTH_NAME, "", {
      httpOnly: false, // true by default
      // path: "/app/pages/token", //current path
      domain: COOKIE_DOMAIN_VALUE,
      sameSite: "lax",
    });
  } else if (cookieFromBrowserValue != undefined && isCookieValidResult) {
    if (
      cookieFromDB != null &&
      cookieFromBrowserValue != cookieFromDB.cookieUID
    ) {
      randomUUID = uuidv4();

      cookies.set(COOKIE_AUTH_NAME, randomUUID, {
        httpOnly: false, // true by default
        // path: "/app/pages/token", //current path
        domain: COOKIE_DOMAIN_VALUE,
        sameSite: "lax",
      });
    }
  } else if (cookieFromBrowserValue == undefined) {
    randomUUID = uuidv4();

    cookies.set(COOKIE_AUTH_NAME, randomUUID, {
      httpOnly: false, // true by default
      // path: "/app/pages/token", //current path
      domain: COOKIE_DOMAIN_VALUE,
      sameSite: "lax",
    });
  }

  if (!isCookieValidResult) {
    var dateNow = new Date();
    var timeDiff = dateNow.getTime() - cookieFromDB!.last_use_time!.getTime();
    return {
      props: {
        token,
        userId: null,
        apiAccessKey: null,
        reason: URL_ALREADY_USED_BY_OTHER_USER,
        timeDiff,
      },
    };
  }
  if (
    resultOfTokenSearch == null ||
    (cookieFromDB != undefined && !isCookieValidResult)
  ) {
    //There was no typed token in database
    // //console.log(`resultOfTokenSearch._id is ${resultOfTokenSearch}`);
    return {
      props: {
        token,
        userId: null,
        apiAccessKey: null,
        reason:
          "Brak użytkownika w bazie danych lub token dostępowy nieaktualny.",
      },
    };
  }
  const apiAccessKeys: any[] = resultOfTokenSearch["apiAccessKeys"];

  var updatedApiAccessKeys =
    apiAccessKeys != null ? apiAccessKeys.map((item) => item) : [];
  const timeNow = new Date();

  let userId: string = resultOfTokenSearch["_id"];
  if (updatedApiAccessKeys == undefined || updatedApiAccessKeys.length === 0) {
    const dateNow = Date.now();
    var randomCookieUUID = randomUUID || uuidv4();
    const cookieFromServer: ICookie = {
      cookieUID: randomCookieUUID,
      last_use_time: new Date(),
    };
    updatedApiAccessKeys.push({
      apiAccessKey: randomCookieUUID,
      cookieData: cookieFromServer,
    });

    var resultOfUpdatingUserApiKeys = await UserSchema.findOneAndUpdate(
      { token },
      { apiAccessKeys: updatedApiAccessKeys }
    ).exec();

    // //console.log(`userId in getServerSideProps is: ${userId}`);
    return {
      props: {
        token,
        userId: userId.toString(),
        apiAccessKey: randomCookieUUID,
      },
    };
  } else if (updatedApiAccessKeys.length === 1 && isCookieValidResult) {
    const lastCookie: ICookie | undefined = {
      ...updatedApiAccessKeys[0]["cookieData"],
    };
    const cookieToServer: ICookie = {
      cookieUID: randomUUID != undefined ? randomUUID : lastCookie?.cookieUID,
      last_use_time: new Date(),
    };
    updatedApiAccessKeys = [
      {
        apiAccessKey:
          cookieToServer.cookieUID != undefined
            ? cookieToServer.cookieUID
            : randomCookieUUID,
        cookieData: cookieToServer,
      },
    ];

    var iscookieFromDBValid = isCookieValid(
      cookieFromDB,
      cookieFromBrowserValue
    );

    if (iscookieFromDBValid) {
      // UserSchema.findOneAndUpdate(
      //   { token },
      //   { apiAccessKeys: updatedApiAccessKeys }
      // ).exec();
      var resultOfUpdatingUserApiKeys = await UserSchema.findOneAndUpdate(
        { token },
        { apiAccessKeys: updatedApiAccessKeys }
      ).exec();
      return {
        props: {
          token,
          userId: userId.toString(),
          apiAccessKey: updatedApiAccessKeys[0]["apiAccessKey"],
        },
      };
    } else {
      return {
        props: {
          token,
          userId: userId.toString(),
          apiAccessKey: null,
          reason: "Ostatnie połączenie z serwerem",
        },
      };
    }
  }
  return {
    props: {
      token,
      userId: userId.toString(),
      apiAccessKey: null,
      reason: "In last path in getServerSideProps",
    },
  };
};

export default MainPage;
