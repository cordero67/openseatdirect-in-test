import React, { Component } from "react";
import YouTube from "react-youtube";
//import "bootstrap/dist/css/bootstrap.css";
import { Row, Col, Container } from "react-bootstrap";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import styles from "./Video.module.css";

class Video extends Component {
  _onReady(event) {
    event.target.pauseVideo();
  }

  render() {
    const opts = {
      height: "390",
      width: "640",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

    return (
      <Aux>
        <div className={styles.ContentBoxLarge}>
          <div className={styles.SectionHeader}>
            <h1>
              What is
              <span style={{ style: "bold", color: "#2F5596" }}>
                <strong> OPENSEATDIRECT</strong>
              </span>
            </h1>
          </div>
          <br></br>
          <br></br>
          <br></br>
          <Container>
            <Row>
              <Col>
                <div className={styles.VideoSection}>
                  <YouTube
                    videoId="wDkdnWzPNW0"
                    opts={opts}
                    onReady={this._onReady}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Aux>
    );
  }
}

export default Video;
