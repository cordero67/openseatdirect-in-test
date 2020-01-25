import React, { useState, useEffect } from "react";
import { Form, Row, Col, Container } from "react-bootstrap";
import { Route, NavLink } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFacebook,
  faInstagram,
  faYoutube,
  faTwitter
} from "@fortawesome/free-brands-svg-icons";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import styles from "./ContactUs.module.css";

const ContactUs = () => {
  // contact information declaration
  const [contactInformation, setContactInformation] = useState({
    emailAddress: "",
    firstName: "",
    lastName: "",
    company: "",
    phoneNumber: "",
    message: ""
  });

  const [showDoublePane, setShowDoublePane] = useState(true);

  const instance = axios.create({
    baseURL: "https://openseatdirect-contacts.firebaseio.com/"
  });

  window.onresize = function(event) {
    if (window.innerWidth < 990) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }
  };

  const sendMessageHandler = () => {
    axios
      .post(
        "https://openseatdirect-contacts.firebaseio.com/.json",
        contactInformation
      )
      .then(response => {
        console.log("Response from Firebase: ", response);
      })
      .catch(err => {
        console.log("Error from Firebase: ", err);
      })
      .finally(() => {
        setContactInformation({
          emailAddress: "",
          firstName: "",
          lastName: "",
          company: "",
          phoneNumber: ""
        });
      });
  };

  let mainDisplay;
  let rightPane = (
    <Aux>
      <div style={{ fontWeight: "500", fontSize: "20px" }}>
        Or contact us directly:
      </div>
      <br></br>
      <div style={{ paddingLeft: "20px", fontWeight: "400", fontSize: "16px" }}>
        mikem@openseatdirect.com
      </div>
      <br></br>
      <div style={{ paddingLeft: "20px", fontWeight: "400", fontSize: "16px" }}>
        rafaelc@openseatdirect.com
      </div>
      <br></br>
      <br></br>
      <div style={{ fontWeight: "500", fontSize: "20px" }}>
        Follows us on:
        <a href="https://www.instagram.com/openseatdirect/">
          <FontAwesomeIcon className={styles.faFacebook} icon={faFacebook} />
        </a>
        <a href="https://www.youtube.com/channel/UCTC0aLCktp-DoI_FSmp_b4w/videos">
          <FontAwesomeIcon className={styles.faYoutube} icon={faYoutube} />
        </a>
        <FontAwesomeIcon icon="check-square" />
        <a href="https://twitter.com/openseatdirect">
          <FontAwesomeIcon className={styles.faTwitter} icon={faTwitter} />
        </a>
        <a href="https://www.instagram.com/openseatdirect/">
          <FontAwesomeIcon className={styles.faInstagram} icon={faInstagram} />
        </a>
      </div>
    </Aux>
  );

  let leftPane = (
    <Aux>
      <div style={{ fontWeight: "500", fontSize: "20px" }}>
        To learn more about{" "}
        <span style={{ color: "#2F5596" }}>OpenSeatDirect</span>, please provide
        your contact details below and we will respond to you shortly.
      </div>
      <br></br>
      <Form onSubmit={sendMessageHandler}>
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label
            style={{ paddingLeft: "10px", fontWeight: "500", fontSize: "14px" }}
          >
            EMAIL: <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            value={contactInformation.emailAddress}
            onChange={event =>
              setContactInformation({
                ...contactInformation,
                emailAddress: event.target.value
              })
            }
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridFirstName">
          <Form.Label
            style={{ paddingLeft: "10px", fontWeight: "500", fontSize: "14px" }}
          >
            FIRST NAME:
          </Form.Label>
          <Form.Control
            type="text"
            value={contactInformation.firstName}
            onChange={event =>
              setContactInformation({
                ...contactInformation,
                firstName: event.target.value
              })
            }
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridLastName">
          <Form.Label
            style={{ paddingLeft: "10px", fontWeight: "500", fontSize: "14px" }}
          >
            LAST NAME:
          </Form.Label>
          <Form.Control
            type="text"
            value={contactInformation.lastName}
            onChange={event =>
              setContactInformation({
                ...contactInformation,
                lastName: event.target.value
              })
            }
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridCompanyName">
          <Form.Label
            style={{ paddingLeft: "10px", fontWeight: "500", fontSize: "14px" }}
          >
            COMPANY NAME:
          </Form.Label>
          <Form.Control
            type="text"
            value={contactInformation.company}
            onChange={event =>
              setContactInformation({
                ...contactInformation,
                company: event.target.value
              })
            }
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridPhoneNumber">
          <Form.Label
            style={{ paddingLeft: "10px", fontWeight: "500", fontSize: "14px" }}
          >
            PHONE NUMBER:
          </Form.Label>
          <Form.Control
            type="text"
            value={contactInformation.phoneNumber}
            onChange={event =>
              setContactInformation({
                ...contactInformation,
                phoneNumber: event.target.value
              })
            }
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formMessage">
          <Form.Label
            style={{ paddingLeft: "10px", fontWeight: "500", fontSize: "14px" }}
          >
            MESSAGE:
          </Form.Label>
          <Form.Control
            type="text"
            value={contactInformation.message}
            onChange={event =>
              setContactInformation({
                ...contactInformation,
                message: event.target.value
              })
            }
            as="textarea"
            rows="3"
          />
        </Form.Group>
        <div style={{ paddingLeft: "15px" }}>
          <button>SUBMIT</button>
        </div>
      </Form>
    </Aux>
  );

  let singlePane;

  if (showDoublePane) {
    mainDisplay = (
      <div className={styles.MainGrid}>
        <div className={styles.LeftPane}>{leftPane}</div>
        <div className={styles.RightPane}>{rightPane}</div>
      </div>
    );
  } else {
    mainDisplay = (
      <div className={styles.MainGrid}>
        <div className={styles.SinglePane}>
          {leftPane}
          <br></br>
          <br></br>
          {rightPane}
        </div>
      </div>
    );
  }

  return (
    <Aux>
      <div className={styles.MainContainer}>{mainDisplay}</div>
    </Aux>
  );
};

export default ContactUs;
