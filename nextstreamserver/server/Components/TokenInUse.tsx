import React, { Component } from "react";
import axios from "axios";
import Image from "next/image";
//@ts-ignore
import PircingPic from "../../public/kolczyk800x.png"; //Image is loaded its just error //TODO change this iamge

import { CountdownCircleTimer } from "react-countdown-circle-timer";
import hideShowSpecificLanguageVersion from "../utils/translator";

const redirectTime = 60000;
export default class TokenInUse extends Component<
  { token: string; lastConnectionInfo: string },
  {
    resetLinkProcessed: boolean;
    resetButtonClicked: boolean;
    token: string;
    obfuscadedReciver?: string;
    error?: any;
    lastMailSendAgoTime?: number;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      resetLinkProcessed: false,
      resetButtonClicked: false,
      token: props.token,
    };
  }

  async sendResetLinkRequest() {
    this.setState({
      resetButtonClicked: true,
    });
    console.log("In sendResetLinkRequest");
    var result = await axios.post("/api/mails/resetLinkMail", {
      token: this.state.token,
    });
    const { recipment, error, time } = result.data;
    if (error != undefined) {
      this.setState({
        resetLinkProcessed: true,
        error,
        lastMailSendAgoTime: time,
        resetButtonClicked: false,
      });
    }
    if (recipment != undefined) {
      this.setState({
        resetLinkProcessed: true,
        resetButtonClicked: false,
        obfuscadedReciver: recipment,
      });
    }
  }

  componentDidMount() {
    if (process.browser) {
      setTimeout(() => {
        window.location.reload();
      }, redirectTime);
    }
    hideShowSpecificLanguageVersion();
  }

  componentDidUpdate() {
    hideShowSpecificLanguageVersion();
  }

  render() {
    if (this.state.resetButtonClicked === true) {
      return (
        <div>
          <div className="PL">
            Genereujemy mail z linkiem do resetu dostępu do portalu...
          </div>
          <div className="EN">
            In process of generating e-mail with links to reset access to the
            portal...
          </div>
        </div>
      );
    }
    if (
      this.state.resetLinkProcessed === true &&
      this.state.error != undefined &&
      this.state.lastMailSendAgoTime != undefined
    ) {
      return (
        <div className="grid">
          <div
            className="container-fluid d-flex justify-content-center"
            style={{ marginTop: "15px" }}
          >
            <img style={{ maxHeight: "100px" }} src="/kolczyk800x.png" />
          </div>
          <div className="row PL">
            <div className="container-fluid d-flex justify-content-center">
              Niestaty link do zmiany hasła został wysłany w ciągu ostatnich 15
              minut. Spróbuj ponownie po upływie 15 minut.
            </div>
          </div>
          <div className="row EN">
            <div className="container-fluid d-flex justify-content-center">
              Link to change your password has been sent in last 15 minutes. Try
              again again after 15 minutes.
            </div>
          </div>
          <div className="row PL">
            <div
              className="container-fluid d-flex justify-content-center"
              style={{ fontSize: "25px", color: "red" }}
            >
              Ostatni mail z resetem hasła wysłany{" "}
              {Math.floor(this.state.lastMailSendAgoTime / 1000 / 60) > 0
                ? Math.floor(this.state.lastMailSendAgoTime / 1000 / 60) +
                  " minut temu"
                : null}{" "}
              {Math.floor(this.state.lastMailSendAgoTime / 1000) % 60} sekund
              temu.
            </div>
          </div>
          <div className="row EN">
            <div
              className="container-fluid d-flex justify-content-center"
              style={{ fontSize: "25px", color: "red" }}
            >
              Last e-mail with token reset link sent{" "}
              {Math.floor(this.state.lastMailSendAgoTime / 1000 / 60) > 0
                ? Math.floor(this.state.lastMailSendAgoTime / 1000 / 60) +
                  " minutes and"
                : null}{" "}
              {Math.floor(this.state.lastMailSendAgoTime / 1000) % 60} sekunds
              ago.
            </div>
          </div>
        </div>
      );
    }

    if (this.state.resetLinkProcessed !== true) {
      return (
        <div className="ui centered grid" style={{ fontSize: 20 }}>
          <div className="container" style={{ marginTop: "15px" }}>
            <Image
              src={PircingPic}
              alt="Logo xxxx"
              height="300%"
              width="300%"
            />
          </div>
          <div
            className="ui row PL"
            style={{ marginTop: "10px", padding: "20px" }}
          >
            Serwer zablokował połącznie. Za {redirectTime / 1000} sekund następi
            automatyczne przekierowanie. <br />
          </div>
          <div
            className="ui row EN"
            style={{ marginTop: "10px", padding: "20px" }}
          >
            The server blocked the connection. You will be redirected
            automatically in {redirectTime / 1000} seconds. <br />
          </div>
          <div
            className="ui row"
            style={{ marginTop: "10px", padding: "20px" }}
          >
            <span style={{ color: "red" }}>
              {this.props.lastConnectionInfo}
            </span>
            <br />
          </div>
          <div className="row ">
            <div className="container-fluid d-flex justify-content-center">
              <CountdownCircleTimer
                isPlaying
                duration={redirectTime / 1000}
                colors={[
                  ["#004777", 0.33],
                  ["#F7B801", 0.33],
                  ["#A30000", 0.33],
                ]}
              >
                {({ remainingTime }) => remainingTime}
              </CountdownCircleTimer>
            </div>
          </div>
          <div className="container">
            <div
              className="container PL"
              style={{ marginBottom: "10px", padding: "10px" }}
            >
              Jeżeli ktoś korzysta z twojego linku do portalu, spróbuj połączyć
              się jeszcze raz następnie wygeneruj nowy link dostępowy do
              portalu.
            </div>
            <div
              className="container EN"
              style={{ marginBottom: "10px", padding: "10px" }}
            >
              If someone is using your link to the portal, try connecting again
              later then generate a new access link to portal.
            </div>
            <div
              className="container PL"
              style={{
                marginBottom: "10px",
                padding: "20px",
              }}
            >
              W celu wygenerowania nowego linku kliknij poniższy przycisk oraz
              potwierdź wygenerowanie dostępu w otrzymanym mailu.
            </div>
            <div
              className="container EN"
              style={{
                marginBottom: "10px",
                padding: "20px",
              }}
            >
              To generate a new link, click the button below and confirm the
              reset action by clicing in recived by email link.
            </div>
            <p
              className="PL"
              style={{ color: "red", fontSize: "15px", padding: "10px" }}
            >
              Po wygenerowaniu nowego linku dostępowego aktualny przestanie być
              aktywny.
            </p>
            <p
              className="EN"
              style={{ color: "red", fontSize: "15px", padding: "10px" }}
            >
              After generating a new access link, old one will cease to be
              valid.
            </p>
          </div>
          <div className="ui row PL">
            <button
              className="fluid ui red button"
              style={{
                marginTop: "10px",
                fontSize: "15px",
                margin: "10px 20px",
                textAlign: "center",
              }}
              onClick={() => this.sendResetLinkRequest()}
            >
              Wyślij mail w celu wygenerowania nowego linku dostępowego do
              portalu
            </button>
          </div>
          <div className="ui row EN">
            <button
              className="fluid ui red button"
              style={{
                marginTop: "10px",
                fontSize: "15px",
                margin: "10px 20px",
                textAlign: "center",
              }}
              onClick={() => this.sendResetLinkRequest()}
            >
              Send an e-mail to generate a new access link to portal
            </button>
          </div>

          {/* TODO add sending mail for new link generation */}
        </div>
      );
    } else {
      return (
        <div className="grid">
          <div className="container-fluid d-flex justify-content-center ">
            <img style={{ maxHeight: "100px" }} src="/kolczyk800x.png" />
          </div>

          <div className="container-fluid PL">
            <div className="row d-flex justify-content-center ">
              Link do zmiany dostępu do portalu wysłany na adres mailowy:
            </div>
          </div>
          <div className="container-fluid EN">
            <div className="row justify-content-center ">
              Link to change access link to the portal sent to the e-mail
              address:
            </div>
          </div>
          <div
            className="row justify-content-center"
            style={{ fontSize: "25px", color: "red" }}
          >
            {this.state.obfuscadedReciver}
          </div>
          <div className="container-fluid PL">
            <div className="row justify-content-center">
              Sprawdź pocztę w celu wygenerowania nowego dostępu. Uwaga!!! Po
              wygenorwaniu nowego dostępu aktualny link przestanie być aktywny.
            </div>
          </div>
          <div className="container-fluid EN">
            <div className="row justify-content-center">
              Check your e-mail to generate a new access. Attention!!! After
              this action current link will no longer be valid.
            </div>
          </div>
        </div>
      );
    }
  }
}
