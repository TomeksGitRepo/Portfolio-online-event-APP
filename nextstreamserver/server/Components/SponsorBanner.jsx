import { height } from "@material-ui/system";
import React, { Component } from "react";
import AwesomeSlider from "react-awesome-slider";
import "./styles/SponsorBanner.module.css";
import withAutoplay from "react-awesome-slider/dist/autoplay";
const AutoplaySlider = withAutoplay(AwesomeSlider);

export default () => {
  return (
    <AutoplaySlider
      play={true}
      cancelOnInteraction={true}
      interval={3000}
      style={{ maxHeight: "400px" }}
      mobileTouch={true}
    >
      <div>
        <a
          href="#"
          target="_blank"
        >
          <img
            style={{ width: "100%", height: "auto" }}
            src="/slider/building3.jpg" />
        </a>
      </div>
      <div>
        <a href="#" target="_blank">
          <img
            style={{ width: "100%", height: "auto" }}
            src="/slider/building1.jpg" 
          ></img>
        </a>
      </div>
      <div>
        <a href="#" target="_blank">
          <img
            style={{ width: "100%", height: "auto" }}
            src="/slider/building2.jpg" 
          ></img>
        </a>
      </div>
    </AutoplaySlider>
  );
};
