import React, { Component } from "react";

import { currentySelectedMovie, allMovies } from "../state/recoil/atom/atoms";
import BarLoader from "react-spinners/SyncLoader";
import { css } from "@emotion/react";

import { useRecoilState } from "recoil";
import axios from "axios";
import WeAreLiveBanner from "./WeAreLiveBanner";
import { useMediaQuery } from "react-responsive";
import hideShowSpecificLanguageVersion from "../utils/translator";

const getMarkedAsMainMoviesURL = "/api/database/movies/getMarkedAsMain";

const naZywoStyle = {
  position: "relative",
  marginTop: "15px",
  marginLeft: "10px",
};

const markAsLive = {
  padding: "10px",
  background: "red",
};

const override = css`
  display: block;
  height: 50vh;
  z-index: 9999;
`;

class MainVideoWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMovieURL: props.currentySelectedMovieValue.movieURL,
      isLive: false,
      isIFrameLoaded: false,
    };
  }

  componentDidUpdate() {
    if (process.browser) {
      var innerWidth = window.innerWidth;
      if (this.state.innerWidth !== innerWidth) {
        this.setState({
          innerWidth,
        });
      }
    }

    hideShowSpecificLanguageVersion();
    if (
      this.state.selectedMovieURL !=
        this.props.currentySelectedMovieValue.movieURL &&
      this.props.allMoviesInfo.moviesInfo.length > 0
    ) {
      // console.log(
      //   `--------this.props.allMoviesInfo is: ${JSON.stringify(
      //     this.props.allMoviesInfo.moviesInfo
      //   )}`
      // );
      this.setState({
        selectedMovieURL: this.props.currentySelectedMovieValue.movieURL,
        innerWidth,
      });
      if (this.state.isIFrameLoaded) {
        this.setState({
          isIFrameLoaded: false,
          innerWidth,
        });
      }
      var currentSelectedMovieInfoArray =
        this.props.allMoviesInfo.moviesInfo.filter((item) => {
          return item.url === this.props.currentySelectedMovieValue.movieURL;
        });
      if (currentSelectedMovieInfoArray.length > 0) {
        var currentSelectedMovieInfo = currentSelectedMovieInfoArray[0];
        var isMarkedAsLive =
          currentSelectedMovieInfo["markedAsLive"] != null
            ? currentSelectedMovieInfo["markedAsLive"]
            : false;
        if (this.state.isLive != isMarkedAsLive) {
          this.updateComponentSateAfterMovieURLChanged(
            currentSelectedMovieInfo
          );
        }
      }

      // console.log(
      //   `--------currentSelectedMovieInfo is: ${JSON.stringify(
      //     currentSelectedMovieInfo
      //   )}`
      // );

      // console.log(
      //   `----------this.props.allMoviesInfo is: ${JSON.stringify(
      //     this.props.allMoviesInfo
      //   )}`
      // );
    }
  }

  updateComponentSateAfterMovieURLChanged(movieInfo) {
    if (process.browser) {
      var innerWidth = window.innerWidth;
    }
    console.log(
      `movieInfo in updateComponentSateAfterMovieURLChanged is: ${JSON.stringify(
        movieInfo
      )}`
    );
    this.setState({
      //TODO udpdate state to reflect movie change
      selectedMovieURL: movieInfo.url != undefined ? movieInfo.url : "",
      isLive: movieInfo["markedAsLive"] == true ? true : false,
      isIFrameLoaded: false,
      innerWidth,
    });
  }

  componentDidMount() {
    if (process.browser) {
      var innerWidth = window.innerWidth;
    }
    if (this.state.selectedMovieURL == "") {
      axios.get(getMarkedAsMainMoviesURL).then((result) => {
        // console.log('befre setSate in componentDidMount')
        console.log(
          `result form componentDidMount result.data[0] is ${JSON.stringify(
            result.data[0]
          )}`
        );
        this.setState({
          selectedMovieURL: result.data[0].url,
          isLive: result.data[0]["markedAsLive"] == true ? true : false,
          innerWidth,
        });
        this.props.setCurrentySelectedMovie({ movieURL: result.data[0].url });
        // console.log(`result in componentDidMount is ${result.data[0].url}`)
      });
    }
  }

  hideYoutubeUnnecesseryButtons() {
    var result = document.getElementsByClassName("ytp-show-cards-title");
    if (result.length > 0) {
      for (var item in result) {
        item["style"]["display"] = "none";
      }
    }
  }

  render() {
    if (process.browser) {
      var renderInnerWidth = window.innerWidth;
    }
    if (this.state.innerWidth !== renderInnerWidth) {
      this.setState({ innerWidth: renderInnerWidth });
    }
    if (this.state.innerWidth < 1224) {
      return (
        <div
          className="container-fluid"
          style={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          {/* {`this.state.currentySelectedMovie is ${this.state.selectedMovieURL}`} */}
          {/* {`\nthis.props.currentySelectedMovieValue.movieURL is ${this.props.currentySelectedMovieValue.movieURL}`} */}
          <div
            style={{
              position: "relative",
            }}
            className="col"
          >
            {this.state.isLive != false ? <WeAreLiveBanner /> : null}
            <div
              className="col"
              style={{ height: "60vh", position: "relative" }}
            >
              <iframe
                key={this.state.selectedMovieURL}
                style={
                  this.state.isLive == true
                    ? {
                        position: "relative",
                        padding: 10,
                        display:
                          this.state.isIFrameLoaded === true ? "block" : "none",
                        ...markAsLive,
                      }
                    : {
                        paddingLeft: 0,
                        paddingRight: 0,
                        position: "absolute",
                        display:
                          this.state.isIFrameLoaded === true ? "block" : "none",
                      }
                }
                height="100%"
                width="100%"
                src={this.props.currentySelectedMovieValue.movieURL}
                title="Video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
                onLoad={(event) => {
                  console.log(event.type);
                  this.setState({
                    isIFrameLoaded: true,
                  });
                  console.log("Iframe loaded");
                }}
              />
              {this.state.isLive && this.state.isIFrameLoaded ? (
                <img
                  src="/na_zywo.png"
                  style={
                    (naZywoStyle,
                    {
                      position: "absolute",
                      maxWidth: "100px",
                      maxHeight: "20px",
                      top: 10,
                      left: 10,
                    })
                  }
                />
              ) : null}
            </div>
            {this.state.isIFrameLoaded === true ? null : (
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  textAlign: "center",
                  paddingTop: "25%",
                }}
              >
                <h2>Wczytywanie</h2>
                <BarLoader
                  css={override}
                  height="8px"
                  width="100%"
                  color={"#faea33"}
                  loading={this.state.loading}
                  speedMultiplier={1.5}
                />
              </div>
            )}
          </div>
        </div>
      );
    } else if (this.state.innerWidth >= 1224) {
      return (
        <div className="twelve wide computer sixteen wide tablet sixteen wide mobile column">
          {/* {`this.state.currentySelectedMovie is ${this.state.selectedMovieURL}`} */}
          {/* {`\nthis.props.currentySelectedMovieValue.movieURL is ${this.props.currentySelectedMovieValue.movieURL}`} */}
          <div
            style={{
              position: "relative",
            }}
            className="ui column iframeContainer"
          >
            {this.state.isLive != false ? <WeAreLiveBanner /> : null}
            <iframe
              key={this.state.selectedMovieURL}
              style={
                this.state.isLive == true
                  ? {
                      position: "absolute",
                      padding: "10px",
                      display:
                        this.state.isIFrameLoaded === true ? "block" : "none",
                      ...markAsLive,
                    }
                  : {
                      position: "absolute",
                      padding: "10px",
                      display:
                        this.state.isIFrameLoaded === true ? "block" : "none",
                    }
              }
              height="100%"
              width="100%"
              src={this.props.currentySelectedMovieValue.movieURL}
              title="Video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
              onLoad={(event) => {
                console.log(event.type);
                this.setState({
                  isIFrameLoaded: true,
                });
                console.log("Iframe loaded");
              }}
            />
            {this.state.isIFrameLoaded === true ? null : (
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  textAlign: "center",
                  paddingTop: "25%",
                }}
              >
                <h2>Wczytywanie</h2>
                <BarLoader
                  css={override}
                  height="8px"
                  width="100%"
                  color={"#faea33"}
                  loading={this.state.loading}
                  speedMultiplier={1.5}
                />
              </div>
            )}
            {this.state.isLive && this.state.isIFrameLoaded ? (
              <img src="/na_zywo.png" style={naZywoStyle} />
            ) : null}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default function MainWindowDisplayWrapper(props) {
  const [currentySelectedMovieValue, setCurrentySelectedMovie] = useRecoilState(
    currentySelectedMovie
  );
  const [allMoviesInfo, setAllMovies] = useRecoilState(allMovies);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <MainVideoWindow
      currentySelectedMovieValue={currentySelectedMovieValue}
      setCurrentySelectedMovie={setCurrentySelectedMovie}
      allMoviesInfo={allMoviesInfo}
      isTabletOrMobile={isTabletOrMobile}
    />
  );
}
