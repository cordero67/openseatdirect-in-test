import React, { Component } from "react";
import { Form, Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faTwitter
} from "@fortawesome/free-brands-svg-icons";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import axiosInstance from "../../axios-customers";
import axios from "axios";
import Modal from "../../components/UI/Modal/Modal";
import ContactSummary from "../../components/UI/ContactSummary/ContactSummary";
import MessageSubmitted from "../../components/UI/MessageSubmitted/MessageSubmitted";

import Spinner from "../../components/UI/Spinner/Spinner";
import Customer from "../../components/SubComponents/Customer/Customer";

import classes from "./Contact.css";

class Contact extends Component {
  state = {
    contact: {
      firstName: "",
      lastName: "",
      companyName: "",
      companyTitle: "",
      email: "",
      phoneNumber: "",
      message: ""
    },
    showModal: false,
    showSummary: false,
    showApproved: false,
    // used in "FOR OSD EYES ONLY" section
    messages: null
  };

  // used in "FOR OSD EYES ONLY" section
  componentDidMount() {
    axiosInstance
      .get("https://openseatdirect.firebaseio.com/messages.json")
      .then(responce => {
        this.setState({ messages: responce.data });
        console.log("Message Log");
        console.log(responce.data);
      });
  }

  // used in "FOR OSD EYES ONLY" section
  componentDidUpdate() {
    axiosInstance
      .get("https://openseatdirect.firebaseio.com/messages.json")
      .then(responce => {
        this.setState({ messages: responce.data });
      });
  }

  submitCustomerInfoHandler = event => {
    this.setState({ showApproved: true });
    this.setState({ showSummary: false });

    const data = {
      firstName: this.state.contact.firstName,
      lastName: this.state.contact.lastName,
      companyName: this.state.contact.companyName,
      companyTitle: this.state.contact.companyTitle,
      email: this.state.contact.email,
      phoneNumber: this.state.contact.phoneNumber,
      message: this.state.contact.message
    };

    axios
      .post("https://openseatdirect.firebaseio.com/messages/.json", data)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });

    this.setState({
      contact: {
        firstName: "",
        lastName: "",
        companyName: "",
        companyTitle: "",
        email: "",
        phoneNumber: "",
        message: ""
      }
    });
  };

  showSummaryHandler = event => {
    this.setState({ showModal: true });
    this.setState({ showSummary: true });
  };

  editCustomerInfoHandler = event => {
    this.setState({ showModal: false });
    this.setState({ showSummary: false });
  };

  closeModalHandler = event => {
    this.setState({ showApproved: false });
    this.setState({ showModal: false });
  };

  render() {
    // used in "FOR OSD EYES ONLY" section
    let messageLog = <Spinner />;

    // used in "FOR OSD EYES ONLY" section
    if (this.state.messages) {
      messageLog = Object.keys(this.state.messages).map(igKey => (
        <Customer
          firstName={this.state.messages[igKey].firstName}
          lastName={this.state.messages[igKey].lastName}
          companyName={this.state.messages[igKey].companyName}
          companyTitle={this.state.messages[igKey].companyTitle}
          email={this.state.messages[igKey].email}
          phoneNumber={this.state.messages[igKey].phoneNumber}
          message={this.state.messages[igKey].message}
        ></Customer>
      ));
    }

    return (
      <Aux>
        <Modal show={this.state.showModal}>
          <ContactSummary
            contactInfo={this.state.contact}
            show={this.state.showSummary}
            submit={this.submitCustomerInfoHandler}
            edit={this.editCustomerInfoHandler}
          ></ContactSummary>
          <MessageSubmitted
            show={this.state.showApproved}
            close={this.closeModalHandler}
          ></MessageSubmitted>
        </Modal>

        <div className={classes.ContentBoxLarge}>
          <div>
            <div className={classes.SectionHeader}>
              <h1>Contact Us</h1>
            </div>
          </div>
          <br></br>
          <Container className={classes.Container}>
            <Row>
              <Col className={classes.CompanyInfo} xs={6}>
                <div className={classes.InformationContainer}>
                  <div>
                    <h3>Contact Directly</h3>
                    <br></br>
                    <h4>New York City</h4>
                    <h5>
                      <span>
                        Mike Mazier<br></br>
                        646.825.0296<br></br>
                        mikem@openseatdirect.com
                      </span>
                    </h5>
                    <br></br>
                    <h4>Chicago</h4>
                    <h5>
                      <span>
                        Rafael Cordero<br></br>
                        312.719.7363<br></br>
                        rafaelc@openseatdirect.com
                      </span>
                    </h5>
                    <br></br>
                    <br></br>
                    <hr className={classes.HRTag}></hr>
                    <br></br>
                    <br></br>
                    <h3>
                      Social Media
                      <a href="https://www.instagram.com/openseatdirect/">
                        <FontAwesomeIcon
                          className={classes.faFacebook}
                          icon={faFacebook}
                        />
                      </a>
                      <a href="https://www.youtube.com/channel/UCTC0aLCktp-DoI_FSmp_b4w/videos">
                        <FontAwesomeIcon
                          className={classes.faYoutube}
                          icon={faYoutube}
                        />
                      </a>
                      <a href="https://twitter.com/openseatdirect">
                        <FontAwesomeIcon
                          className={classes.faTwitter}
                          icon={faTwitter}
                        />
                      </a>
                      <a href="https://www.instagram.com/openseatdirect/">
                        <FontAwesomeIcon
                          className={classes.faInstagram}
                          icon={faInstagram}
                        />
                      </a>
                    </h3>
                  </div>
                </div>
              </Col>

              <Col xs={6}>
                <div className={classes.MessageContainer}>
                  <Form
                    onSubmit={this.submitCustomerInfoHandler}
                    className={classes.ContactForm}
                  >
                    <h3>Send a Message</h3>
                    <br></br>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.contact.firstName}
                          onChange={event =>
                            this.setState({
                              contact: {
                                ...this.state.contact,
                                firstName: event.target.value
                              }
                            })
                          }
                        />
                      </Form.Group>

                      <Form.Group as={Col} controlId="formGridLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.contact.lastName}
                          onChange={event =>
                            this.setState({
                              contact: {
                                ...this.state.contact,
                                lastName: event.target.value
                              }
                            })
                          }
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridCompanyName">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.contact.companyName}
                          onChange={event =>
                            this.setState({
                              contact: {
                                ...this.state.contact,
                                companyName: event.target.value
                              }
                            })
                          }
                        />
                      </Form.Group>

                      <Form.Group as={Col} controlId="formGridPosition">
                        <Form.Label>Job Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.contact.companyTitle}
                          onChange={event =>
                            this.setState({
                              contact: {
                                ...this.state.contact,
                                companyTitle: event.target.value
                              }
                            })
                          }
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.contact.email}
                          onChange={event =>
                            this.setState({
                              contact: {
                                ...this.state.contact,
                                email: event.target.value
                              }
                            })
                          }
                        />
                      </Form.Group>

                      <Form.Group as={Col} controlId="formGridPhoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.contact.phoneNumber}
                          onChange={event =>
                            this.setState({
                              contact: {
                                ...this.state.contact,
                                phoneNumber: event.target.value
                              }
                            })
                          }
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Group controlId="formMessage">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        type="text"
                        value={this.state.contact.message}
                        onChange={event =>
                          this.setState({
                            contact: {
                              ...this.state.contact,
                              message: event.target.value
                            }
                          })
                        }
                        as="textarea"
                        rows="3"
                      />
                    </Form.Group>
                  </Form>

                  <div className={classes.Button}>
                    <button type="submit" onClick={this.showSummaryHandler}>
                      Submit Information
                    </button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>

          {/* used in "FOR OSD EYES ONLY" section */}
          <br></br>
          <br></br>
          <Container>
            <div style={{ color: "red" }}>
              <h3>FOR OSD EYES ONLY</h3>
              <h4>Message Log</h4>
              <h3>{messageLog}</h3>
            </div>
          </Container>
        </div>
      </Aux>
    );
  }
}
export default Contact;
