import React, { Component } from "react";
import axios from "axios";

const movieEditUrl = "/api/database/admin/movies/editMovie";

const centeredTableCell = {
  textAlign: "center",
};

class formValidationError {
  type = "Form validation error";
  message = "Error message...";

  constructor(errorType, errorMessage) {
    this.type = errorType;
    this.message = errorMessage;
  }
}
export default class MovieEditor extends Component {
  async getMoviesURLs() {
    var { data } = await axios.get(movieEditUrl);

    if (data != null) {
      var itemMovies = [];
      data.map((item) => {
        itemMovies.push(item);
      });
      console.log(`pureMovieURL in getMoviesUrl ${JSON.stringify(itemMovies)}`);
      this.setState({
        movies: itemMovies,
      });
    }
  }

  async deleteMovie(url) {
    console.log(`Delete movie ${JSON.stringify(url)}`);
    await axios.delete(movieEditUrl, { data: { movieUrl: url } });
    this.getMoviesURLs();
  }

  /**
   *
   * @param {*} url - movieUrl
   * @returns string | null - if its youtube movie it returns embeded string if its not youtube return null
   */
  generateEmbededYoutubeLink(url) {
    let movieYoutubeRegExp = new RegExp("youtube.com", "i");
    var result = url.match(movieYoutubeRegExp);
    console.log(`url.match(movieYoutubeRegExp) is ${result}`);
    var isYoutube = url.match(movieYoutubeRegExp) != null ? true : false;
    if (isYoutube) {
      let movieYoutubeRegExp = new RegExp("/embed/", "i");
      var isEmbed = url.match(movieYoutubeRegExp) != null ? true : false;
      if (!isEmbed) {
        var movieIdRegEx = new RegExp("v=(.*)", "i");
        var movieId = url.match(movieIdRegEx)[1];
        console.log(`movieId in generateEmbededYoutubeLink is: ${movieId}`);
        var embededLink = `https://www.youtube.com/embed/${movieId}`;
        return embededLink;
      } else {
        return url;
      }
    } else {
      return null;
    }
  }

  isValidURL(string) {
    var res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    return res !== null;
  }

  validateForm(movieURL, movieTitle) {
    var validationErrors = [];
    if (!this.isValidURL(movieURL)) {
      var urlError = new formValidationError(
        "movieURLError",
        "Podany adres nie jest poprawny"
      );
      validationErrors.push(urlError);
    }
    if (movieTitle === "" || movieTitle == null) {
      var titleError = new formValidationError(
        "titleURLError",
        "Podany tytuł filmu jest niepoprawny"
      );
      validationErrors.push(titleError);
    }

    this.setState({
      errors: validationErrors,
    });
  }

  async addNewMovie(event) {
    event.preventDefault();
    var movieUrlValue = event.target.movieUrl.value;
    var movieTitleValue = event.target.movieTitle.value;

    this.validateForm(movieUrlValue, movieTitleValue);
    if (this.state.errors.length > 0) {
      return;
    }

    var youtbueEmbedLink = this.generateEmbededYoutubeLink(
      event.target.movieUrl.value
    );
    var result;
    if (youtbueEmbedLink) {
      console.log(`youtbueEmbedLink in addNewMovie: ${youtbueEmbedLink}`);
      result = await axios.post("/api/database/admin/movies/editMovie", {
        movieUrl: youtbueEmbedLink,
        title: movieTitleValue,
      });
    } else {
      console.log(
        `value event.target.movieUrl.value in addNewMovie: ${youtbueEmbedLink}`
      );
      result = await axios.post("/api/database/admin/movies/editMovie", {
        movieUrl: event.target.movieUrl.value,
        title: movieTitleValue,
      });
    }
    console.log(`result in addNewMovie is: ${JSON.stringify(result)}`);
    if (result.data != null) {
      alert(result.data);
    }
    event.target.movieUrl.value = "";
    event.target.movieTitle.value = "";
    this.getMoviesURLs();
    //Add movie to database
  }

  async toggleMarkedAsMain(url, markedAsMain) {
    console.log(`in toggleMarkedAsMain url is: ${url} `);
    if (markedAsMain == undefined) {
      await axios.patch(movieEditUrl, {
        data: { movieUrl: url, markedAsMain: true },
      });
    } else {
      await axios.patch(movieEditUrl, {
        data: { movieUrl: url, markedAsMain: !markedAsMain },
      });
    }

    this.getMoviesURLs();
  }

  async toggleMarkedAsLive(url, markedAsLive) {
    console.log(
      `in toggleMarkedAsLive url is: ${url}, markedAsLive is: ${markedAsLive} `
    );
    if (markedAsLive == undefined) {
      await axios.patch(movieEditUrl, {
        data: { movieUrl: url, markedAsLive: true },
      });
    } else {
      await axios.patch(movieEditUrl, {
        data: { movieUrl: url, markedAsLive: !markedAsLive },
      });
    }

    this.getMoviesURLs();
  }

  async toggleMarkedAsNew(url, markedAsNew) {
    console.log(
      `in toggleMarkedAsNew url is: ${url}, markedAsNew is: ${markedAsNew} `
    );
    if (markedAsNew == undefined) {
      await axios.patch(movieEditUrl, {
        data: { movieUrl: url, markedAsNew: true },
      });
    } else {
      await axios.patch(movieEditUrl, {
        data: { movieUrl: url, markedAsNew: !markedAsNew },
      });
    }

    this.getMoviesURLs();
  }

  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      errors: [],
    };
  }

  componentDidMount() {
    this.getMoviesURLs();
  }

  render() {
    return (
      <div className="ui centered grid">
        <div className="ui ten wide column" style={{ textAlign: "center" }}>
          <h1>Edytuj filmy</h1>
          <div className="ui centered ten wide column">
            <div className="ui row">
              <p>Dodaj nowy film</p>
            </div>
            <div className="ui ten wide column">
              <form
                className="ui form"
                onSubmit={(event) => this.addNewMovie(event)}
              >
                <div className="field">
                  <label>Adres filmu:</label>
                  <input
                    placeholder="https://youtbe<--->vimeo/embeded/1f05a34c908b618c5"
                    type="text"
                    name="movieUrl"
                  ></input>
                  {this.state.errors.map((item) => {
                    if (item.type === "movieURLError") {
                      return <p style={{ color: "red" }}>{item.message}</p>;
                    }
                  })}
                </div>
                <div className="field">
                  <label>Tytuł filmu:</label>
                  <input
                    placeholder="To jest naprawdę fajny film"
                    type="text"
                    name="movieTitle"
                  ></input>
                  {this.state.errors.map((item) => {
                    if (item.type === "titleURLError") {
                      return <p style={{ color: "red" }}>{item.message}</p>;
                    }
                  })}
                </div>

                <button className="fluid ui button" type="submit">
                  Dodaj
                </button>
              </form>
            </div>
          </div>
        </div>
        <table className="ui celled table">
          <thead>
            <tr>
              <th style={centeredTableCell}>Adres filmu</th>
              <th style={centeredTableCell}>Tytuł</th>
              <th style={centeredTableCell}>Oznaczony jako główny</th>
              <th style={centeredTableCell}>Live</th>
              <th style={centeredTableCell}>Oznaczony jako nowość</th>
              <th style={centeredTableCell}>Usuń film</th>
            </tr>
          </thead>
          <tbody>
            {this.state.movies.map((item) => {
              return (
                <tr>
                  <td style={centeredTableCell}>{item.url}</td>
                  <td style={centeredTableCell}>
                    {item.title != null ? item.title : "Brak tytułu"}
                  </td>
                  <td style={centeredTableCell}>
                    {item.markedAsMain === true ? (
                      <button
                        className="ui green button"
                        onClick={() =>
                          this.toggleMarkedAsMain(item.url, item.markedAsMain)
                        }
                      >
                        Odznacz jako główny
                      </button>
                    ) : (
                      <button
                        className="ui button"
                        onClick={() =>
                          this.toggleMarkedAsMain(item.url, item.markedAsMain)
                        }
                      >
                        Zaznacz jako główny
                      </button>
                    )}
                  </td>
                  <td style={centeredTableCell}>
                    {item.markedAsLive === true ? (
                      <button
                        className="ui green button"
                        onClick={() =>
                          this.toggleMarkedAsLive(item.url, item.markedAsLive)
                        }
                      >
                        Live OFF
                      </button>
                    ) : (
                      <button
                        className="ui button"
                        onClick={() =>
                          this.toggleMarkedAsLive(item.url, item.markedAsLive)
                        }
                      >
                        Live ON
                      </button>
                    )}
                  </td>
                  <td style={centeredTableCell}>
                    {item.markedAsNew === true ? (
                      <button
                        className="ui green button"
                        onClick={() =>
                          this.toggleMarkedAsNew(item.url, item.markedAsNew)
                        }
                      >
                        Usuń z nowych filmów
                      </button>
                    ) : (
                      <button
                        className="ui button"
                        onClick={() =>
                          this.toggleMarkedAsNew(item.url, item.markedAsNew)
                        }
                      >
                        Zmień na nowość
                      </button>
                    )}
                  </td>

                  <td style={centeredTableCell}>
                    <button
                      className="ui red button"
                      onClick={() => this.deleteMovie(item.url)}
                    >
                      Usuń film
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
