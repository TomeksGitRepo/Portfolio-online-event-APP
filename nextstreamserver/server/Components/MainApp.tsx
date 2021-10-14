import "./App.module.css";
import MainWindowDisplay from "./MainWindowDisplay";
import VideoThumbnialContainer from "./VideoThumbnailContainer";

import { RecoilRoot, atom } from "recoil";
import "../state/recoil/atom/atoms";
import SponsorBanner from "./SponsorBanner";
import { useMediaQuery } from "react-responsive";
import React, { useEffect, useState } from "react";
import hideShowSpecificLanguageVersion from "../utils/translator";
import { v4 } from "uuid";

function App() {
  const [isMobile, setIsMobile] = useState(true);
  var innerWidth;

  useEffect(() => {
    if (process.browser) {
      innerWidth = window.innerWidth;
    }
    if (innerWidth >= 1244) {
      setIsMobile(false);
    }
  });

  if (isMobile) {
    return generateMobileHTML();
  } else {
    return generateDesktopHTML();
  }
}

export default App;
function generateDesktopHTML() {
  console.log("generateDesktopHTML called");
  return (
    <RecoilRoot key={"1"}>
      <div className="App">
        <div className="ui stackable two column grid ">
          <MainWindowDisplay />
          <VideoThumbnialContainer />
        </div>
        <div className="row">
          <SponsorBanner key={v4()} />
        </div>
      </div>
    </RecoilRoot>
  );
}

function generateMobileHTML() {
  console.log("generateMobileHTML called");
  return (
    <RecoilRoot key={"2"}>
      <div className="App" key={v4()}>
        <div className="ui grid" key={v4()}>
          <MainWindowDisplay key={v4()} />
          <VideoThumbnialContainer key={v4()} />
        </div>
        <div className="row" key={v4()}>
          <SponsorBanner />
        </div>
      </div>
    </RecoilRoot>
  );
}
