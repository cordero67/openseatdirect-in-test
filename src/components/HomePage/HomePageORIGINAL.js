import React, { Component } from "react";
import { Route, NavLink } from "react-router-dom";

import { Button } from "react-bootstrap";

import Video from "../Video/Video";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import styles from "./HomePageORIGINAL.module.css";

class Home extends Component {
  render() {
    return (
      <Aux>
        <div className={styles.container}>
          <div className={styles.container_image}>
            <div className={styles.content}>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <h1
                style={{
                  verticalAlign: "middle",
                  fontSize: "52px",
                  fontStyle: "bold"
                }}
              >
                A Single Market Solution for
                <br></br>
                <br></br>Controlling the Entire Ticket Journey
              </h1>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <h1 style={{ fontSize: "36px", fontStyle: "italic" }}>
                Ensuring you a direct ticket to your fans!!!
              </h1>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <h1>
                <NavLink to="/video" exact>
                  <Button variant="outline-light">LEARN MORE</Button>
                </NavLink>
                <Route path="/video" exact component={Video} />
              </h1>
              <br></br>
              <br></br>
              <br></br>
            </div>
          </div>
        </div>
      </Aux>
    );
  }
}

export default Home;