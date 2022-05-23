import React, { useState, Fragment } from "react";
import YouTube from "react-youtube";

import classes from "./EventCreation.module.css";

const Video = () => {
  const [youTubeDimensions, setYouTubeDimensions] = useState({
    height: "225",
    width: "400",
  });

  const _onReady = (event) => {
    event.target.pauseVideo();
  };

  let opts = {
    width: youTubeDimensions.width,
    height: youTubeDimensions.height,
    playerVars: {
      autoplay: 0,
      start: 0,
      playsinline: 1,
      modestbranding: 1,
      rel: 0,
    },
  };
  return (
    <Fragment>
      <span style={{ fontWeight: "600" }}>Instructional video</span>
      <div className={classes.VideoSection}>
        <YouTube videoId="Kw5cY1WgytE" opts={opts} onReady={_onReady} />
      </div>
    </Fragment>
  );
};

export default Video;
