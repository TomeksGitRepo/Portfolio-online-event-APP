import axios from "axios";
import React, { Component } from "react";
import { SetterOrUpdater, useRecoilState } from "recoil";

import VideoThumbnail from "./VideoThumbnail";
import WeAreLiveBanner from "./WeAreLiveBanner";

import {
  currentySelectedMovie,
  allMovies,
  isAllMoviesDownloading,
} from "../state/recoil/atom/atoms";

import NewestMoviesContainer from "./NewestMoviesContainer";
import InfoAboutAllMoviesDownloadedStatus from "./InfoAboutAllMoviesDownloadedStatus";
import cookieCutter from "cookie-cutter";
import { COOKIE_AUTH_NAME } from "../Cookies/cookiesData";
import { useEffect } from "react";
import hideShowSpecificLanguageVersion from "../utils/translator";

interface IMovieInfo {
  _id: string;
  markedAsMain?: boolean;
  markedAsNew?: boolean;
  markedAsLive?: boolean;
  title: string;
  url: string;
  created_at: Date;
}

interface ICurrentlySelectedMovie {
  movieURL: string;
}

interface IIsAllMovieDownloading {
  isAllMoviesDownloading: boolean;
}

const TIME_TO_START_UPDATING = 600000; // Remove info about new movie after 10 minutes

class VideoThumbnailContainer extends Component<
  {
    isAllMovieDownloading: IIsAllMovieDownloading;

    currentySelectedMovieValue: ICurrentlySelectedMovie;
    allMoviesInfo: {
      moviesInfo: never[];
    };
    setAllMoviesInfo: SetterOrUpdater<{
      moviesInfo: never[];
    }>;
    setIsAllMoviesInfoDownloading: SetterOrUpdater<{
      isAllMoviesDownloading: boolean;
    }>;
  },
  {
    isAllMovieDownloading: boolean;
    lastSelectedMovie: string;
    moviesURLs: IMovieInfo[];
    liveMoviesURLs: IMovieInfo[];
    notLiveMoviesURLs: IMovieInfo[];
    allMovies: IMovieInfo[];
    isLive?: boolean;
    selectedMovieURL?: string;
    isSecendDownloadingAllMoviesCall?: boolean;
    moviesInfoUpdate?: {
      numberOfNewMovies: number;
      updated_at: Date;
    };
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      lastSelectedMovie: "",
      moviesURLs: [],
      liveMoviesURLs: [],
      notLiveMoviesURLs: [],
      allMovies: [],
      isAllMovieDownloading:
        this.props.isAllMovieDownloading.isAllMoviesDownloading,
    };
  }

  componentDidUpdate() {
    if (
      this.props.currentySelectedMovieValue.movieURL !=
      this.state.lastSelectedMovie
    ) {
      this.setState({
        lastSelectedMovie: this.props.currentySelectedMovieValue.movieURL,
      });
      console.log(this.state);

      this.filterForLiveMovies();
    }
  }

  componentDidMount() {
    //Check movies status once every 2 min
    this.downloadMoviesInfo().then(() => this.filterForLiveMovies());
    setInterval(() => {
      console.clear();
      console.log("Component did mount setInterval fired");
      this.downloadMoviesInfo().then(() => this.filterForLiveMovies());
    }, 57000);
    hideShowSpecificLanguageVersion();
  }

  async downloadMoviesInfo() {
    console.log("------------In downloadMoviesInfo-------------");
    if (cookieCutter.get(COOKIE_AUTH_NAME) == undefined) {
      location.reload();
    }
    var result = await axios.get("/api/database/movies/getAllMovies");
    this.props.setAllMoviesInfo({ moviesInfo: result.data });
    // debugger;
    if (this.state.isSecendDownloadingAllMoviesCall === true) {
      this.props.setIsAllMoviesInfoDownloading({
        isAllMoviesDownloading: true,
      });
      // debugger;
      this.processDownloadedAllMoviesInfo(this.state.allMovies, result.data);
      this.setState({
        allMovies: result.data,
      });

      return;
    }

    if (this.state.isSecendDownloadingAllMoviesCall === undefined) {
      // debugger;
      this.setState({
        allMovies: result.data,
        isSecendDownloadingAllMoviesCall: false,
      });
    } else {
      // debugger;
      this.setState({
        allMovies: result.data,
        isSecendDownloadingAllMoviesCall: true,
      });
    }

    // console.log("------------- recoil allMoviesInfo -----------  ");
    // console.log(JSON.stringify(this.props.allMoviesInfo.moviesInfo));
    // console.log("-----------------------------------  ");
  }

  async processDownloadedAllMoviesInfo(
    oldMoviesData: Array<any>,
    newMoviesData: Array<any>
  ) {
    // debugger;
    if (oldMoviesData.length === newMoviesData.length) {
      setTimeout(() => {
        if (
          this.state.moviesInfoUpdate === undefined ||
          new Date().getTime() -
            this.state.moviesInfoUpdate.updated_at!.getTime() >
            TIME_TO_START_UPDATING
        ) {
          this.setState({
            moviesInfoUpdate: {
              numberOfNewMovies: 0,
              updated_at: new Date(),
            },
          });
        }
        this.props.setIsAllMoviesInfoDownloading({
          isAllMoviesDownloading: false,
        });
      }, 2500);
    } else if (oldMoviesData.length !== newMoviesData.length) {
      setTimeout(() => {
        // debugger;
        if (
          this.state.moviesInfoUpdate != undefined &&
          new Date().getTime() -
            this.state.moviesInfoUpdate.updated_at!.getTime() >
            TIME_TO_START_UPDATING
        ) {
          this.setState({
            moviesInfoUpdate: {
              numberOfNewMovies: newMoviesData.length - oldMoviesData.length,
              updated_at: new Date(),
            },
          });
        } else if (
          this.state.moviesInfoUpdate != undefined &&
          new Date().getTime() -
            this.state.moviesInfoUpdate.updated_at!.getTime() <=
            TIME_TO_START_UPDATING
        ) {
          this.setState({
            moviesInfoUpdate: {
              numberOfNewMovies:
                this.state.moviesInfoUpdate.numberOfNewMovies +
                newMoviesData.length -
                oldMoviesData.length,
              updated_at: new Date(),
            },
          });
        } else if (this.state.moviesInfoUpdate == undefined) {
          this.setState({
            moviesInfoUpdate: {
              numberOfNewMovies: newMoviesData.length - oldMoviesData.length,
              updated_at: new Date(),
            },
          });
        }
        this.props.setIsAllMoviesInfoDownloading({
          isAllMoviesDownloading: false,
        });
      }, 2500);
    }
  }

  filterForNewMovies() {
    var result = [];
  }

  filterForLiveMovies() {
    var allMoviesWithCurrentlySelected: IMovieInfo[] =
      this.props.allMoviesInfo.moviesInfo != undefined
        ? [...this.props.allMoviesInfo.moviesInfo]
        : [];
    var allMoviesWithoutCurrentlySelected: IMovieInfo[] =
      allMoviesWithCurrentlySelected.filter((item) => {
        return item.url != this.props.currentySelectedMovieValue.movieURL;
      });
    // console.log(
    //   `recoil state in currentySelectedMovieValue is: ${JSON.stringify(
    //     this.props.currentySelectedMovieValue
    //   )}`
    // );
    var liveMovies: IMovieInfo[] = [];
    var nonLiveMovies: IMovieInfo[] = [];
    allMoviesWithoutCurrentlySelected.map((item) => {
      if (item.markedAsLive) {
        //check if no movie was previusly seleced and guard agains movies in markedAsMain
        liveMovies.push(item);
      } else {
        nonLiveMovies.push(item);
      }
    });
    allMoviesWithCurrentlySelected.sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
    liveMovies.sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
    nonLiveMovies.sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    this.setState({
      liveMoviesURLs: liveMovies,
      notLiveMoviesURLs: nonLiveMovies,
    });
  }

  processMovieUpdate() {
    var currentlySelectedMovieInfo = this.state.allMovies.filter((item) => {
      return item.url === this.props.currentySelectedMovieValue.movieURL;
    });
    this.setState({
      isLive: currentlySelectedMovieInfo["markedAsLive"] == true ? true : false,
      selectedMovieURL: this.props.currentySelectedMovieValue.movieURL,
    });
  }

  render() {
    return (
      <div className="four wide computer sixteen wide table sixteen wide mobile column">
        {this.state.isSecendDownloadingAllMoviesCall === true ? (
          <InfoAboutAllMoviesDownloadedStatus
            isMovieDownloading={
              this.props.isAllMovieDownloading.isAllMoviesDownloading
            }
            newlyAddedMovies={
              this.state.moviesInfoUpdate?.numberOfNewMovies != undefined &&
              this.state.moviesInfoUpdate?.numberOfNewMovies > 0
                ? this.state.moviesInfoUpdate?.numberOfNewMovies
                : undefined
            }
          />
        ) : null}
        {this.state.liveMoviesURLs.length > 0 ? <WeAreLiveBanner /> : null}
        {this.state.liveMoviesURLs.map((item) => {
          return (
            <VideoThumbnail
              key={item.url}
              movieURL={item.url}
              isLive={true}
              title={item.title}
              created_at={item.created_at}
            />
          );
        })}

        <NewestMoviesContainer
          movies={this.state.notLiveMoviesURLs.filter(
            (item) => item.markedAsNew === true
          )}
        />
        {this.state.notLiveMoviesURLs.map((item) => {
          if (item.markedAsNew !== true) {
            return (
              <VideoThumbnail
                key={item.url}
                movieURL={item.url}
                title={item.title}
                created_at={item.created_at}
              />
            );
          }
        })}
      </div>
    );
  }
}

export default function VideoThumbnailContainerWrapper(props) {
  const [currentySelectedMovieValue, setCurrentySelectedMovie] = useRecoilState(
    currentySelectedMovie
  );

  const [isAllMovieDownloading, setIsAllMoviesInfoDownloading] = useRecoilState(
    isAllMoviesDownloading
  );

  const [allMoviesInfo, setAllMoviesInfo] = useRecoilState(allMovies);

  return (
    <VideoThumbnailContainer
      currentySelectedMovieValue={currentySelectedMovieValue}
      allMoviesInfo={allMoviesInfo}
      setAllMoviesInfo={setAllMoviesInfo}
      isAllMovieDownloading={isAllMovieDownloading}
      setIsAllMoviesInfoDownloading={setIsAllMoviesInfoDownloading}
    />
  );
}
