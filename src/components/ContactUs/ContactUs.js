import React, { useState } from "react";
import { Form } from "react-bootstrap";
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
import FormItem from "./FormItem";

const ContactUs = () => {
  const [contactData, setContactData] = useState({
    emailAddress: {
      label: "EMAIL:",
      elementType: "input",
      controlId: "formGridEmail",
      elementConfig: {
        type: "email",
        placeHolder: "Email"
      },
      value: "",
      validation: {
        required: true,
        validEmail: true
      },
      valid: false,
      touched: false,
      message: "Please provide a valid email."
    },
    firstName: {
      label: "FIRST NAME:",
      elementType: "input",
      controlId: "formGridFirstName",
      elementConfig: {
        type: "text",
        placeHolder: "First Name"
      },
      value: "",
      validation: {},
      valid: true,
      touched: false,
      message: "Please provide your first name."
    },
    lastName: {
      label: "LAST NAME:",
      elementType: "input",
      controlId: "formGridLastName",
      elementConfig: {
        type: "text",
        placeHolder: "Last Name"
      },
      value: "",
      validation: {},
      valid: true,
      touched: false,
      message: "Please provide your last name."
    },
    company: {
      label: "COMPANY NAME:",
      elementType: "input",
      controlId: "formGridCompanyName",
      elementConfig: {
        type: "text",
        placeHolder: "Company "
      },
      value: "",
      validation: {},
      valid: true,
      touched: false,
      message: "Please provide your company name."
    },
    phoneNumber: {
      label: "PHONE NUMBER:",
      elementType: "input",
      controlId: "formGridPhoneNumber",
      elementConfig: {
        type: "text",
        placeHolder: "Phone Number"
      },
      value: "",
      validation: {},
      valid: true,
      touched: false,
      message: "Please provide your phone number."
    },
    /*
    number: {
      label: "OPTION:",
      elementType: "select",
      controlId: "formNumber",
      elementConfig: {
        type: "text",
        placeHolder: "1",
        as: "select",
        options: ["a", "b", "c", "d"]
      },
      value: "a",
      validation: {},
      valid: true
    },
    */
    message: {
      label: "MESSAGE:",
      elementType: "textarea",
      controlId: "formMessage",
      elementConfig: {
        type: "text",
        placeHolder: "Message",
        as: "textarea",
        rows: "3"
      },
      value: "",
      validation: {},
      valid: true,
      touched: false,
      errorMessage: "Please provide a message."
    }
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const [showDoublePane, setShowDoublePane] = useState(true);

  window.onresize = function(event) {
    if (window.innerWidth < 990) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }
  };

  const sendMessageHandler = event => {
    //event.preventDefault();
    let contactInfo = {};
    for (let key in contactData) {
      contactInfo[key] = contactData[key].value;
    }
    console.log("contactInfo: ", contactInfo);
    axios
      .post("https://openseatdirect-contacts.firebaseio.com/.json", contactInfo)
      .then(response => {
        alert("Data received by Firebase.");
        console.log("Response from Firebase: ", response);
        console.log("contactInfo: ", contactInfo);
        console.log("contactData: ", contactData);
      })
      .catch(err => {
        alert("Data WAS NOT received by Firebase.");
        console.log("Error from Firebase: ", err);
      });
  };

  // returns "true" or "false" depending on validity test
  const checkValidity = (value, rules) => {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }
    if (rules.validEmail) {
      const regsuper = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      isValid = regsuper.test(value) && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    return isValid;
  };

  const inputChangedHandler = (event, inputIdentifier) => {
    const newContactData = { ...contactData };
    const updatedFormElement = { ...newContactData[inputIdentifier] };
    updatedFormElement.value = event.target.value;
    updatedFormElement.touched = true;
    updatedFormElement.valid = checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    newContactData[inputIdentifier] = updatedFormElement;
    setContactData(newContactData);
    let validForm = true;
    for (let key in newContactData) {
      validForm = newContactData[key].valid && validForm;
    }
    setFormIsValid(validForm);
  };

  let mainDisplay;
  let rightPane = (
    <Aux>
      <div className={styles.Header}>Or contact us directly:</div>
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
      <div className={styles.Header}>
        Follows us on:
        <a href="https://www.instagram.com/openseatdirect/">
          <FontAwesomeIcon className={styles.faFacebook} icon={faFacebook} />
        </a>
        <a href="https://www.youtube.com/channel/UCTC0aLCktp-DoI_FSmp_b4w/videos">
          <FontAwesomeIcon className={styles.faYoutube} icon={faYoutube} />
        </a>
        <a href="https://twitter.com/openseatdirect">
          <FontAwesomeIcon className={styles.faTwitter} icon={faTwitter} />
        </a>
        <a href="https://www.instagram.com/openseatdirect/">
          <FontAwesomeIcon className={styles.faInstagram} icon={faInstagram} />
        </a>
      </div>
    </Aux>
  );

  const formDataArray = [];
  for (let key in contactData) {
    formDataArray.push({
      id: key,
      config: contactData[key]
    });
  }

  let formData;

  formData = (
    <Form onSubmit={sendMessageHandler}>
      <div style={{ paddingLeft: "15px", paddingRight: "15px" }}>
        {formDataArray.map(item => {
          return (
            <FormItem
              key={item.id}
              elementType={item.config.elementType}
              label={item.config.label}
              controlId={item.config.controlId}
              elementConfig={item.config.elementConfig}
              value={item.config.value}
              touched={item.config.touched}
              invalid={!item.config.valid}
              shouldValidate={item.config.validation}
              validationError={item.config.message}
              changed={event => inputChangedHandler(event, item.id)}
            />
          );
        })}
        <button className={styles.Button} disabled={!formIsValid}>
          SUBMIT
        </button>
      </div>
    </Form>
  );

  let leftPane = (
    <Aux>
      <div className={styles.Header}>
        To learn more about{" "}
        <span style={{ color: "#2F5596" }}>OpenSeatDirect</span>, please provide
        your contact details below and we will respond to you shortly.
      </div>
      <br></br>
      {formData}
    </Aux>
  );

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
