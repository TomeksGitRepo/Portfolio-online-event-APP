import axios from "axios";
import React, { Component } from "react";
import validator from "validator";

const getAllEmailsInfoUrl = "/api/database/emails/allEmails";

interface MailSendInfo {
  accepted?: string[];
  rejected?: string[];
  response: string;
  error?: Error;
  created_at: Date;
  subject: string;
}

enum filterAttr {
  created_at,
  rejected,
  accepted,
}

enum sortOrder {
  ASC,
  DESC,
}

export default class EmailStatusPanel extends Component<
  {},
  {
    emailsInfos: MailSendInfo[];
    emailsInfosToDisplay: MailSendInfo[];
    emailFormError?: string;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      emailsInfos: [],
      emailsInfosToDisplay: [],
    };
  }

  compareDate(a: MailSendInfo, b: MailSendInfo) {
    if (a.created_at > b.created_at) return -1;
    if (a.created_at < b.created_at) return 1;
    return 0;
  }

  filterEmailsToDisplay(filterAttrValue: filterAttr, sortOrder?: sortOrder) {
    var result: MailSendInfo[] = [];
    if (filterAttrValue === filterAttr.created_at) {
      result = this.state.emailsInfos.map((item) => item);
      result.sort(this.compareDate);
      this.setState({ emailsInfosToDisplay: result });
    }
  }

  getAllEmailsInfo = async () => {
    var result = await axios.get(getAllEmailsInfoUrl);
    var resultData: MailSendInfo[] = result.data;
    this.setState({ emailsInfos: resultData });
    // console.log(`emailInofs is: ${JSON.stringify(emailsInfos)}`);
  };

  filterForEmail(email: string) {
    var result: MailSendInfo[] = [];
    result = this.state.emailsInfos.filter((item) => {
      if (item.accepted?.includes(email) || item.rejected?.includes(email)) {
        return true;
      } else {
        return false;
      }
    });
    this.setState({
      emailsInfosToDisplay: result,
    });
  }

  validateFromEmail(event: any) {
    event.preventDefault();
    console.log(event.target.email.value);
    if (event.target.email.value === "") {
      this.setState({
        emailsInfosToDisplay: [...this.state.emailsInfos],
      });
      return;
    }
    if (validator.isEmail(event.target.email.value)) {
      this.filterForEmail(event.target.email.value);
    } else {
      this.setState({
        emailFormError: "Niepoprawny adres email",
      });
    }
  }

  componentDidMount() {
    this.getAllEmailsInfo().then(() =>
      this.filterEmailsToDisplay(filterAttr.created_at)
    );
  }

  render() {
    return (
      <div className="sixteen wide column">
        <form
          className="ui form"
          onSubmit={(event) => this.validateFromEmail(event)}
        >
          <div className="field">
            <label>Wyszukaj adresu email:</label>
            <input placeholder="przyklad@gmail.com" name="email"></input>
            {this.state.emailFormError == undefined ? (
              ""
            ) : (
              <p style={{ color: "red" }}>{this.state.emailFormError}</p>
            )}{" "}
            {/* TODO implement error handling */}
          </div>

          <button className="fluid ui button" type="submit">
            Wyszukaj adresy mailowe
          </button>
        </form>
        <table className="ui celled table">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ textAlign: "center" }}>Wysłano</th>
              <th style={{ textAlign: "center" }}>Typ maila</th>
              <th style={{ textAlign: "center" }}>Zaakceptowane adresy</th>
              <th style={{ textAlign: "center" }}>Odrzucone adresy</th>
              <th style={{ textAlign: "center" }}>Błędy</th>
            </tr>
          </thead>
          <tbody>
            {this.state.emailsInfosToDisplay.map((item) => {
              return (
                <tr>
                  <td
                    style={
                      item.accepted == undefined
                        ? { textAlign: "center", backgroundColor: "red" }
                        : { textAlign: "center", backgroundColor: "green" }
                    }
                  ></td>
                  <td style={{ textAlign: "center" }}>
                    {"Dzień: " +
                      new Date(item.created_at).toLocaleDateString("pl-PL") +
                      " " +
                      "Godzina: " +
                      new Date(item.created_at).toLocaleTimeString("pl-PL")}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {item.subject == undefined ? null : item.subject}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {item.accepted == undefined ? null : item.accepted}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {item.rejected == undefined ? null : item.rejected}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {item.error == undefined
                      ? null
                      : JSON.stringify(item.error, null, 2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        ;
      </div>
    );
  }
}
