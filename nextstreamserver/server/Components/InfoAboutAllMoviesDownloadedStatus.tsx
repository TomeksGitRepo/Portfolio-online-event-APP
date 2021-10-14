import React, { Component } from "react";
import { css } from "@emotion/react";
import BarLoader from "react-spinners/BarLoader";
import hideShowSpecificLanguageVersion from "../utils/translator";

const override = css`
  display: inline-block;
  margin-left: 15px;
  height: 6px;
  z-index: 9999;
`;

export default class InfoAboutAllMoviesDownloadedStatus extends Component<
  { isMovieDownloading: boolean; newlyAddedMovies?: number },
  {}
> {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    hideShowSpecificLanguageVersion();
  }

  render() {
    if (this.props.isMovieDownloading === true) {
      return (
        <div style={{ textAlign: "center" }}>
          <div className="container-fluid PL">
            Sprawdzamy nowo dodane filmy:
            <BarLoader
              color="#43810b"
              css={override}
              loading={true}
              speedMultiplier={1.5}
            />
          </div>
          <div className="container-fluid EN">
            Checking for newly added videos:
            <BarLoader
              color="#43810b"
              css={override}
              loading={true}
              speedMultiplier={1.5}
            />
          </div>
        </div>
      ); //Here we sould display spinner
    }
    if (
      this.props.isMovieDownloading === false &&
      this.props.newlyAddedMovies != undefined
    ) {
      return (
        <div
          style={{
            backgroundColor: "red",
            color: "white",
            fontSize: "18px",
            minHeight: "30px",
            textAlign: "center",
            padding: "10px 10px",
            marginTop: "4px",
            marginRight: "5px",
            fontFamily: "monospace",
            fontWeight: "bold",
          }}
        >
          <div className="PL">
            Nowo dodane filmy: {this.props.newlyAddedMovies}
          </div>
          <div className="EN">
            Newly added videos: {this.props.newlyAddedMovies}
          </div>
        </div>
      ); //Here we sould display spinner
    }
    return (
      <div style={{ textAlign: "center" }}>
        <div className="PL">
          Przez ostatnie 10 minut nie dodano nowych filmów
        </div>
        <div className="EN">
          No new videos have been added in the last 10 minutes
        </div>
      </div>
    );
  }
}
