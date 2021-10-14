import React, { Component } from "react";
import VideoThumbnail from "./VideoThumbnail";

import { useRecoilState } from "recoil";
import { currentySelectedMovie } from "../state/recoil/atom/atoms";
import hideShowSpecificLanguageVersion from "../utils/translator";

class NewestMoviesContainer extends Component<
  { movies: any[]; currentySelectedMovie: any },
  { movies: any[]; moviesWithoutCurrentlySelected: any[] }
> {
  constructor(props) {
    super(props);
    this.state = {
      movies: this.props.movies != null ? this.props.movies : [],
      moviesWithoutCurrentlySelected: [],
    };
  }

  componentDidUpdate() {
    hideShowSpecificLanguageVersion();
    if (this.props.movies.length != this.state.movies.length) {
      this.setState({ movies: this.props.movies });
    }

    var resultsWithoutCurrentlySelected = this.props.movies.filter((item) => {
      return item.url != this.props.currentySelectedMovie.movieURL;
    });
    if (
      this.state.moviesWithoutCurrentlySelected.length !=
      resultsWithoutCurrentlySelected.length
    ) {
      this.setState({
        moviesWithoutCurrentlySelected: resultsWithoutCurrentlySelected,
      });
    }
  }

  componentDidMount() {
    hideShowSpecificLanguageVersion();
  }

  render() {
    if (this.state.moviesWithoutCurrentlySelected.length === 0) {
      return null;
    }
    return (
      <div
        className="ui row"
        style={{
          paddingTop: "5px",
          background: "green",
          borderRadius: "25px",
          marginTop: "5px",
          marginRight: "5px",
          marginLeft: "5px",
        }}
      >
        <h3 className="PL" style={{ textAlign: "center", color: "white" }}>
          Filmy niedawno dodane:
        </h3>
        <h3 className="EN" style={{ textAlign: "center", color: "white" }}>
          Recently added videos:
        </h3>
        {this.state.moviesWithoutCurrentlySelected.map((item) => {
          return (
            <VideoThumbnail
              key={item.url}
              movieURL={item.url}
              title={item.title}
              created_at={item.created_at}
            />
          );
        })}
      </div>
    );
  }
}

export default function NewestMoviesContainerWrapper(props) {
  const [currentySelectedMovieValue, setCurrentySelectedMovie] = useRecoilState(
    currentySelectedMovie
  );

  return (
    <NewestMoviesContainer
      movies={props.movies}
      currentySelectedMovie={currentySelectedMovieValue}
    />
  );
}
