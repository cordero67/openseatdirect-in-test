import React, { Fragment } from "react";

import { Form, Radio } from "semantic-ui-react";

const RadioForm = (props) => {
  console.log("props.current: ", props.current);
  const formField = () => {
    return (
      <Fragment>
        {props.details.map((item, index) => {
          return (
            <Form.Field
              key={index}
              style={{
                height: "30px",
                lineHeight: "30px",
                width: "100%",
                margin: "0px",
              }}
            >
              <Radio
                style={{ fontSize: "15px" }}
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

  return (
    <Form
      style={{
        border: "1px solid #8DADD4",
        backgroundColor: "#EFF3FA",
        margin: "0%",
        padding: "10px 10px 10px 10px",
        fontSize: "16px",
        boxSizing: "border-box",
      }}
    >
      {formField()}
    </Form>
  );
};

export default RadioForm;
