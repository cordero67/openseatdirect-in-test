import React, { Component } from "react";
import YouTube from "react-youtube";
import { Row, Col, Container } from "react-bootstrap";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import styles from "./Video.module.css";

let youTubeHeight = "240";
let youTubeWidth = "426";

let opts = {
  height: youTubeHeight,
  width: youTubeWidth,
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
    start: 0,
    playsinline: 1,
    modestbranding: 1,
    rel: 0
  }
};

const video = () => {
  const _onReady = event => {
    event.target.pauseVideo();
  };

  window.onresize = function(event) {
    if (window.innerWidth > 760) {
      youTubeHeight = "360";
      youTubeWidth = "640";
      console.log("youTubeWidth: ", youTubeWidth);
      console.log("youTubeHeight: ", youTubeHeight);
      resetOpts(youTubeWidth, youTubeHeight);
    } else {
      youTubeHeight = "240";
      youTubeWidth = "426";
      console.log("youTubeWidth: ", youTubeWidth);
      console.log("youTubeHeight: ", youTubeHeight);
      console.log("Calling 'resetOpts()'");
      resetOpts(youTubeWidth, youTubeHeight);
    }
  };

  const resetOpts = (youTubeWidth, youTubeHeight) => {
    opts = {
      height: youTubeHeight,
      width: youTubeWidth,
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
        start: 0,
        playsinline: 1,
        modestbranding: 1,
        rel: 0
      }
    };
    console.log("'opts.width: ", opts.width);
    console.log("'opts.height: ", opts.height);
  };

  return (
    <Aux>
      <div className={styles.MainContainer}>
        <div className={styles.MainGrid}>
          <Container>
            <div style={{ fontWeight: "500", fontSize: "20px" }}>
              Please enjoy this short video about
              <span style={{ style: "bold", color: "#2F5596" }}>
                <strong> OPENSEATDIRECT</strong>
              </span>
            </div>
            <Row>
              <Col>
                <div className={styles.VideoSection}>
                  <YouTube
                    videoId="wDkdnWzPNW0"
                    opts={opts}
                    onReady={_onReady}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </Aux>
  );
};

export default video;
