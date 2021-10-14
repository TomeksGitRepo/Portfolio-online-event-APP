import React, { Component } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { Animated } from "react-animated-css";
import Image from "next/image";
import BarLoader from "react-spinners/SyncLoader";
import { css } from "@emotion/react";
import { useMediaQuery } from "react-responsive";

import { currentySelectedMovie } from "../state/recoil/atom/atoms";
import moment from "moment";
import "moment/locale/pl";

const playButtonStyle = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  width: "5vw",
  height: "5vw",
};

const playButtonMobileStyle = {
  position: "absolute",
  top: "35%",
  left: "49%",
  transform: "translate(-50%,-50%)",
  width: "20vw",
  height: "20vw",
};
const naZywoStyle = {
  position: "absolute",
  top: "4%",
  left: "3%",
};

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  height: 50vh;
  padding-top: 45%;
  padding-left: 45%;
`;

class VideoThumbnail extends Component {
  constructor(props) {
    super(props);
    // console.log(`this.props in VideoThumbnail is ${this.props}`);
    this.state = {
      title: this.props.title,
      movieURL: this.props.movieURL,
      movieID: null,
      movieThumbnailImageURL: null,
      isHovered: false,
      setCurrentySelectedMovie: this.props.setCurrentySelectedMovie,
      movieSource: null,
      isMovieCurrentlySelected: false,
      isImageLoaded: false,
      created_at: this.props.created_at,
    };
  }

  componentDidMount() {
    this.getMovieSource(this.state.movieURL).then(() => this.processVideo());
  }

  componentDidUpdate() {
    if (this.state.movieURL != this.props.movieURL) {
      this.setState(
        {
          movieURL: this.props.movieURL,
        },
        () => {
          this.processVideo();
          this.getYoutubeImageFromUrl();
          console.log(this.props.movieURL);
          console.log(this.state);
        }
      );

      return;
    }
    if (
      this.props.currentySelectedMovieValue.movieURL == this.state.movieURL &&
      this.state.isMovieCurrentlySelected == false
    ) {
      this.setState({
        isMovieCurrentlySelected: true,
      });
    } else if (
      this.props.currentySelectedMovieValue.movieURL != this.state.movieURL &&
      this.state.isMovieCurrentlySelected == true
    ) {
      this.setState({
        isMovieCurrentlySelected: false,
      });
    }
  }

  processVideo() {
    var movieID;
    var videoToProcess = this.state.movieURL;
    if (this.state.movieSource === "youtube") {
      movieID = this.getYoutubeMovieIDFromVideoURL(videoToProcess);
    } else if (this.state.movieSource === "vimeo") {
      movieID = this.getVimeoMovieIDFromVideoURL(videoToProcess);
    }
    this.setState(
      {
        movieID,
      },
      () => {
        if (this.state.movieSource === "youtube") {
          this.getYoutubeImageFromUrl(movieID);
        } else if (this.state.movieSource === "vimeo") {
          this.getVimeoImageFromUrl(movieID);
        }
      }
    );
  }

  getVimeoMovieIDFromVideoURL() {
    let movieIDRegExp = new RegExp("(?<=video\\/).*(?=\\?)", "gmi");
    var resultForIDSearch = this.state.movieURL.match(movieIDRegExp);
    if (resultForIDSearch != null && resultForIDSearch[0] != null) {
      this.setState({
        movieID: resultForIDSearch[0],
      });
      return resultForIDSearch[0];
    }
  }

  async getMovieSource() {
    let movieSourceYoutube = new RegExp("youtube.com", "i");
    let movieSourceVimeo = new RegExp("vimeo.com", "i");
    let youtubeResult = this.state.movieURL.match(movieSourceYoutube);
    let vimeoResult = this.state.movieURL.match(movieSourceVimeo);
    if (youtubeResult != null && youtubeResult[0] != null) {
      this.setState({ movieSource: "youtube" });
      this.getYoutubeMovieIDFromVideoURL(this.state.movieURL);
    } else if (vimeoResult != null && vimeoResult[0] != null) {
      this.setState({ movieSource: "vimeo" });
      this.getVimeoMovieIDFromVideoURL();
    }
  }

  getYoutubeMovieIDFromVideoURL() {
    let movieID = new RegExp("/embed/(.*)", "i");
    var resultWithApresand = this.state.movieURL.match(movieID);
    if (resultWithApresand != null && resultWithApresand[1] != null) {
      this.setState({
        movieID: resultWithApresand[1],
      });
      return resultWithApresand[1];
    }
  }

  toggleHover() {
    this.setState((prevState) => ({ isHovered: !prevState.isHovered }));
  }

  handleUserClick() {
    console.log("handleUserClick called");
    this.state.setCurrentySelectedMovie({ movieURL: this.state.movieURL });
  }

  getYoutubeImageFromUrl() {
    if (this.state.movieID == null) {
      return;
    }
    this.setState({
      movieThumbnailImageURL: `https://i.ytimg.com/vi/${this.state.movieID}/hqdefault.jpg`,
    });
    return `https://i.ytimg.com/vi/${this.state.movieID}/hqdefault.jpg`;
  }

  async getVimeoImageFromUrl() {
    if (this.state.movieID == null) {
      return;
    }
    await this.requestVimeoVideoData();
  }

  async requestVimeoVideoData() {
    var vimeoDataURL = `https://vimeo.com/api/v2/video/${this.state.movieID}.json`;
    const { videoData = null, error = null } = await axios
      .get(vimeoDataURL)
      .then((response) => {
        // console.log(videoData)
        this.setState({ movieThumbnailImageURL: response.data[0] });
        return {
          videoData: response.data[0],
        };
      })
      .catch((error) => {
        console.warn(`Error fetching video ${error}`);

        return { error };
      });
    if (error) {
      console.log(`error get image from vimeo ${error}`);
    }

    if (videoData != null) {
      var thumbnail_image_url = videoData["thumbnail_large"];
      this.setState({
        movieThumbnailImageURL: thumbnail_image_url,
      });
    }
  }

  howLongAfaterCreationDateToText() {
    if (window.navigator.language === "pl") {
      moment().locale("pl");
    }
    var creationDate = moment(this.state.created_at);
    console.log(`creationDate.locale is ${creationDate.locale()}`);

    return creationDate.locale("pl").fromNow();
  }

  render() {
    return (
      <div style={{ marginBottom: "5px" }}>
        {this.state.isMovieCurrentlySelected != true ? (
          <Animated
            animationIn="flipInX"
            animationOut="flipOutX"
            isVisible={!this.state.isMovieCurrentlySelected}
            animateOnMount={false}
          >
            <div
              className="container"
              style={{
                padding: "10px",
                cursor: "pointer",
                backgroundColor: this.props.isLive === true ? "red" : null,
                borderRadius: "25px",
              }}
              onMouseEnter={this.toggleHover.bind(this)}
              onMouseLeave={this.toggleHover.bind(this)}
              onClick={this.handleUserClick.bind(this)}
            >
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    backgroundColor: "white",
                    height: "15px",
                    borderTopLeftRadius: "25px",
                    borderTopRightRadius: "25px",
                  }}
                ></div>
                <img
                  className="ui fluid image"
                  src={this.state.movieThumbnailImageURL}
                  style={
                    this.state.isImageLoaded == true
                      ? { maxHeight: "50vh" }
                      : { display: "none" }
                  }
                  onLoad={() =>
                    this.setState({
                      isImageLoaded: true,
                    })
                  }
                />
                {this.state.isImageLoaded === true ? null : (
                  <BarLoader
                    css={override}
                    height="8px"
                    width="100%"
                    color={"#faea33"}
                    loading={this.state.loading}
                    speedMultiplier={1.5}
                  />
                )}
                <p
                  style={{
                    backgroundColor: "white",
                    textAlign: "center",
                    padding: "3px",
                    fontSize: "20px",
                    borderBottomLeftRadius: "25px",
                    borderBottomRightRadius: "25px",
                  }}
                >
                  {this.state.title != null ? this.state.title : "Brak tytułu"}
                  <div
                    style={{
                      fontSize: "12px",
                      textAlign: "right",
                      paddingRight: "6px",
                    }}
                  >
                    Dodano:
                    {this.state.created_at != undefined
                      ? "  " + this.howLongAfaterCreationDateToText()
                      : null}
                  </div>
                </p>
                {this.state.isImageLoaded === true ? (
                  <img
                    src={
                      this.state.isHovered === false
                        ? "/play.png"
                        : "/play_onhover.png"
                    }
                    style={
                      this.props.isTabletOrMobile === true
                        ? playButtonMobileStyle
                        : playButtonStyle
                    }
                  />
                ) : null}
                {this.props.isLive == true ? (
                  <img src="/na_zywo.png" style={naZywoStyle} />
                ) : null}
                <div className="spacer"></div>
              </div>
            </div>
          </Animated>
        ) : null}
      </div>
    );
  }
}

export default function VideoThumbnailWrapper(props) {
  const [currentySelectedMovieValue, setCurrentySelectedMovie] = useRecoilState(
    currentySelectedMovie
  );

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <VideoThumbnail
      movieURL={props.movieURL}
      setCurrentySelectedMovie={setCurrentySelectedMovie}
      currentySelectedMovieValue={currentySelectedMovieValue}
      isLive={props.isLive}
      title={props.title}
      created_at={props.created_at}
      isTabletOrMobile={isTabletOrMobile}
    />
  );
}
