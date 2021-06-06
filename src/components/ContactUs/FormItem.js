import React from "react";
import { Form } from "react-bootstrap";

import styles from "./ContactUs.module.css";

const form = (props) => {
  let inputClasses = [];
  let validationError = null;
  let inputItem = null;

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(styles.Invalid);
  }

  if (props.invalid && props.touched) {
    validationError = (
      <p
        style={{
          color: "red",
          paddingLeft: "10px",
          margin: "5px 0",
          fontWeight: "500",
          fontSize: "14px",
        }}
      >
        {props.validationError}
      </p>
    );
  }

  switch (props.elementType) {
    case "input":
      inputItem = (
        <div>
          <Form.Group controlId={props.controlId}>
            <Form.Label
              style={{
                paddingLeft: "10px",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              {props.label}
              {Object.keys(props.shouldValidate).length > 0 ? (
                <span style={{ color: "red" }}> *</span>
              ) : null}
            </Form.Label>
            <Form.Control
              className={inputClasses.join(" ")}
              type={props.elementConfig.type}
              value={props.value}
              onChange={props.changed}
            />
            {validationError}
          </Form.Group>
        </div>
      );
      break;
    case "textarea":
      inputItem = (
        <div>
          <Form.Group controlId={props.controlId}>
            <Form.Label
              style={{
                paddingLeft: "10px",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              {props.label}
              {Object.keys(props.shouldValidate).length > 0 ? (
                <span style={{ color: "red" }}> *</span>
              ) : null}
            </Form.Label>
            <Form.Control
              className={inputClasses.join(" ")}
              type={props.elementConfig.type}
              value={props.value}
              onChange={props.changed}
              as={props.elementConfig.as}
              rows={props.elementConfig.rows}
            />
          </Form.Group>
          {validationError}
        </div>
      );
      break;
    case "select":
      inputItem = (
        <div>
          <Form.Group controlId={props.controlId}>
            <Form.Label
              style={{
                paddingLeft: "10px",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              {props.label}
            </Form.Label>
            {Object.keys(props.shouldValidate).length > 0 ? (
              <span style={{ color: "red" }}> *</span>
            ) : null}
            <Form.Control
              className={inputClasses.join(" ")}
              type={props.elementConfig.type}
              onChange={props.changed}
              as={props.elementConfig.as}
            >
              {props.elementConfig.options.map((option) => {
                return <option>{option}</option>;
              })}
            </Form.Control>
          </Form.Group>
          {validationError}
        </div>
      );
      break;
    default:
      inputItem = (
        <div>
          <Form.Group controlId={props.controlId}>
            <Form.Label
              style={{
                paddingLeft: "10px",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              {props.label}
              {Object.keys(props.shouldValidate).length > 0 ? (
                <span style={{ color: "red" }}> *</span>
              ) : null}
            </Form.Label>
            <Form.Control
              className={inputClasses.join(" ")}
              type={props.elementConfig.type}
              value={props.value}
              onChange={props.changed}
            />
            {validationError}
          </Form.Group>
        </div>
      );
  }

  return <div>{inputItem}</div>;
};

export default form;
