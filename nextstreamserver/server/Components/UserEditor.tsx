import React, { Component } from "react";
import axios from "axios";
import { MailType } from "../../pages/api/mails/types";

const usersGetAllUrl = "/api/database/users/allUsers";
const addNewUser = "/api/database/users/User";

const mailSendingUrl = "/api/mails/mails";

class UserEditorUserStatus extends React.Component<
  {
    item: any;
    siteOrgin: string;
    parseDateToPrintToUser: any;
    loadingSendingMail: boolean;
    sentMailWithAccessLinkToUser: any;
  },
  { loadingSendingMail: boolean; isLastEmailSuccessfulySend?: boolean }
> {
  constructor(props) {
    super(props);
    this.state = {
      loadingSendingMail: false,
    };
  }

  async sentMailWithAccessLinkToUser(userEmail) {
    this.setState({
      loadingSendingMail: true,
    });
    if (userEmail != null) {
      var result = await axios.post(`${mailSendingUrl}`, {
        email: userEmail,
        subject: "Link dostępowy do portalu XXXX",
        type: MailType.AdminAccessSendLink,
      });
      console.log(
        `result.data in sentMailWithAccessLinkToUser is: ${result.data}`
      );
      if (result.data === "User access link email sended") {
        this.setState({
          loadingSendingMail: false,
          isLastEmailSuccessfulySend: true,
        });
      } else {
        this.setState({
          loadingSendingMail: false,
          isLastEmailSuccessfulySend: false,
        });
      }
    }
  }

  render() {
    return (
      <div>
        Użytkownik:
        <div>Email: {this.props.item.email}</div>
        <div>
          Link dostępowy:{" "}
          {`${this.props.siteOrgin}/app/pages/token/${this.props.item.token}`}
        </div>
        {console.log(`item in allUser.map is ${this.props.item.apiAccessKeys}`)}
        {this.props.item.apiAccessKeys != null &&
        this.props.item.apiAccessKeys[0] != null ? (
          <div>
            Ostatnie połączenie z portalem:{" "}
            {this.props.parseDateToPrintToUser(
              this.props.item.apiAccessKeys[0].cookieData.last_use_time
            )}
          </div>
        ) : (
          <div>Brak ostatniego połączenia</div>
        )}{" "}
        {/* If make more then one access key this needs to be maped*/}
        <div>
          {this.state.isLastEmailSuccessfulySend != undefined ? (
            this.state.isLastEmailSuccessfulySend === true ? (
              <h2 style={{ color: "green" }}>
                Status ostatniego maila: WYSŁANY POPRAWNIE
              </h2>
            ) : (
              <h2 style={{ color: "red" }}>
                Status ostatniego maila: WYSTĄPIŁ PROBLEM Z WYSŁANIEM MAILA
              </h2>
            )
          ) : null}
          {this.props.loadingSendingMail === true ? (
            "Wysyłanie maila do użytkownika..."
          ) : (
            <button
              onClick={() =>
                this.sentMailWithAccessLinkToUser(this.props.item.email)
              }
            >
              Wyślij link z dostępem użytkownikowi
            </button>
          )}

          <span> </span>
        </div>
        <br />
      </div>
    );
  }
}

export default class UserEditor extends Component<
  {},
  {
    validationErrors: string;
    savingUserResult: any;
    allUsers: any;
    userSendMailSendSuccessfully?: boolean;
    loadingAddingUser: boolean;
    loadingSendingMail: boolean;
    isLastEmailSuccessfulySend?: boolean;
  }
> {
  siteOrgin;
  validateEmail(mail) {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        mail
      )
    ) {
      this.setState({
        validationErrors: "",
      });
      return true;
    }
    this.setState({
      validationErrors: "Podany adres nie jest poprawny",
    });
    return false;
  }

  async sentMailWithAccessLinkToUser(userEmail) {
    this.setState({
      loadingSendingMail: true,
    });
    if (userEmail != null) {
      var result = await axios.post(`${mailSendingUrl}`, {
        email: userEmail,
        subject: "Link dostępowy do portalu XXXX",
        type: MailType.AdminAccessSendLink,
      });
      console.log(
        `result.data in sentMailWithAccessLinkToUser is: ${result.data}`
      );
      if (result.data === "User access link email sended") {
        this.setState({
          loadingSendingMail: false,
          isLastEmailSuccessfulySend: true,
        });
      } else {
        this.setState({
          loadingSendingMail: false,
          isLastEmailSuccessfulySend: false,
        });
      }
    }
  }

  async getAllUsers() {
    var allUsers = await axios.get(usersGetAllUrl);
    console.log(`allUsers in getAllUsers: ${JSON.stringify(allUsers)}`);
    return allUsers.data;
  }

  async addNewUser(event) {
    event.preventDefault();
    var userEmail = event.target.userEmail.value;
    var isEmailValid = this.validateEmail(userEmail);
    if (isEmailValid) {
      var result = await axios.post(addNewUser, { email: userEmail });
      var allUsers = await this.getAllUsers();
      var mailSendResult;
      var isMailSendSucceffuly;
      if (result.data === "Użytkownik dodany") {
        mailSendResult = await axios.post(mailSendingUrl, {
          email: userEmail,
          subject: `Witamy na portalu xxxx - link dostępowy`,
          type: MailType.NewUserAddition,
        });
        isMailSendSucceffuly =
          mailSendResult.data == "User creation link email sended";
        console.log(`mailSendResult after user creation ${mailSendResult}`);
      }

      this.setState({
        savingUserResult: result.data,
        allUsers: allUsers,
        userSendMailSendSuccessfully:
          isMailSendSucceffuly === true ? true : false,
      });
    }
    (document.getElementById("userEmailInput")! as any).value = "";
    this.setState({
      loadingAddingUser: false,
    });
  }

  parseDateToPrintToUser(sourceDate: string): string {
    var sourceAsDate: Date = new Date(sourceDate);

    return `Dzień: ${sourceAsDate.toLocaleDateString(
      "pl-PL"
    )}. Godzina: ${sourceAsDate.toLocaleTimeString("pl-PL")}`;
  }

  constructor(props) {
    super(props);
    this.state = {
      allUsers: [],
      validationErrors: "",
      loadingAddingUser: false,
      savingUserResult: "",
      loadingSendingMail: false,
    };
    if (typeof window !== "undefined") {
      this.siteOrgin = window.location.origin;
    }
  }

  componentDidMount() {
    this.getAllUsers().then((result) => {
      if (result != null) {
        this.setState({
          allUsers: result,
        });
      }
      //  console.log(`result in componentDidMount in UserEditor is ${result}`)
    });
  }

  render() {
    return (
      <div>
        <h1>Edytuj użytkowników</h1>
        <div>
          <div>
            <p>Dodaj nowego użytkownika:</p>
          </div>
          <form
            className="ui form"
            onSubmit={(event) => {
              this.setState({
                loadingAddingUser: true,
                savingUserResult: "",
              });
              this.addNewUser(event);
            }}
          >
            <label>Email:</label>
            <input type="text" name="userEmail" id="userEmailInput"></input>
            {<p style={{ color: "red" }}>{this.state.validationErrors}</p>}
            {this.state.loadingAddingUser == false ? (
              <button className="ui fluid button" type="submit">
                Dodaj
              </button>
            ) : (
              "Dodaję użytkownika"
            )}
          </form>
          {this.state.savingUserResult != "" ? (
            <div>
              Status dodawania użytkownika: {this.state.savingUserResult} <br />
              {this.state.userSendMailSendSuccessfully === true ? (
                <p style={{ color: "green" }}>
                  Mail wysłany do użytkownika poprawnie
                </p>
              ) : (
                <p style={{ color: "red" }}>
                  Problem z wysłanie maila użtykownikowi, spróbuj wysłać ręcznie
                  w późniejszym terminie
                </p>
              )}
            </div>
          ) : null}
        </div>
        <br />

        {this.state.allUsers.map((item) => {
          return (
            <UserEditorUserStatus
              siteOrgin={this.siteOrgin}
              parseDateToPrintToUser={this.parseDateToPrintToUser}
              loadingSendingMail={this.state.loadingSendingMail}
              sentMailWithAccessLinkToUser={this.sentMailWithAccessLinkToUser}
              item={item}
            ></UserEditorUserStatus>
          );
        })}
      </div>
    );
  }
}
