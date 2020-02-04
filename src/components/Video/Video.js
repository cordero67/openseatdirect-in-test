import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import styles from "./Video.module.css";

const Video = () => {
  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);
  const [youTubeDimensions, setYouTubeDimensions] = useState({
    width: "640",
    height: "360"
  });

  const _onReady = event => {
    event.target.pauseVideo();
  };

  let opts = {
    width: youTubeDimensions.width,
    height: youTubeDimensions.height,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      start: 0,
      playsinline: 1,
      modestbranding: 1,
      rel: 0
    }
  };

  const resetOpts = (newWidth, newHeight) => {
    setIsRestyling(true);
    setYouTubeDimensions({
      width: newWidth,
      height: newHeight
    });
    opts = {
      width: youTubeDimensions.width,
      height: youTubeDimensions.height,
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
        start: 0,
        playsinline: 1,
        modestbranding: 1,
        rel: 0
      }
    };
    setIsRestyling(false);
  };

  const stylingUpdate = (inWidth, inHeight) => {
    // based on window width, displays one or two panes
    let width;
    let height;
    if (inWidth < 330) {
      height = "174.375";
      width = "310";
    } else if (inWidth < 380) {
      height = "185.625";
      width = "330";
    } else if (inWidth < 420) {
      height = "213.75";
      width = "380";
    } else if (inWidth < 770) {
      height = "236.25";
      width = "420";
    } else {
      height = "360";
      width = "640";
    }
    resetOpts(width, height);
  };

  useEffect(() => {
    setYouTubeDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
    stylingUpdate(window.innerWidth, window.innerHeight);
  }, []);

  window.onresize = function(event) {
    let width;
    let height;
    if (window.innerWidth < 330) {
      height = "174.375";
      width = "310";
    } else if (window.innerWidth < 380) {
      height = "185.625";
      width = "330";
    } else if (window.innerWidth < 420) {
      height = "213.75";
      width = "380";
    } else if (window.innerWidth < 770) {
      height = "236.25";
      width = "420";
    } else {
      height = "360";
      width = "640";
    }
    resetOpts(width, height);
  };

  return (
    <Aux>
      <div className={styles.MainContainer}>
        <div className={styles.MainGrid}>
          <div className={styles.SectionHeader}>
            Please enjoy this short video about
            <span style={{ style: "bold", color: "#2F5596" }}>
              <strong> OPENSEATDIRECT</strong>
            </span>
          </div>

          <div className={styles.VideoSection}>
            <YouTube videoId="wDkdnWzPNW0" opts={opts} onReady={_onReady} />
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default Video;
