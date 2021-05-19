import React, { Fragment } from "react";

import { Form, Radio } from "semantic-ui-react";

import classes from "./RadioForm.module.css";

const RadioForm = (props) => {
  const formField = () => {
    return (
      <Fragment>
        {props.details.map((item, index) => {
          return (
            <Form.Field
              key={index}
              style={{
                height: "auto",
                padding: "5px 5px 5px 0px",
                margin: "0px",
              }}
            >
              <Radio
                style={{
                  fontSize: "16px",
                  paddingLeft: "0px",
                }}
                label={item.label}
                name={props.group}
                value={item.value}
                checked={props.current === item.value}
                onChange={(event, { value }) => props.change(event, { value })}
              />
            </Form.Field>
          );
        })}
      </Fragment>
    );
  };

  return <Form className={classes.RadioForm}>{formField()}</Form>;
};

export default RadioForm;
