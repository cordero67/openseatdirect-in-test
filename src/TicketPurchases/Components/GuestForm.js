import React from "react";

import classes from "./GuestForm.module.css";

const GuestForm = props => {
  const regsuper = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return (
    <div>
      <div style={{display: "grid", gridGap: "4%", gridTemplateColumns: "48% 48%"}}>
        <div style={{paddingBottom: "20px", height: "85px"}}>
          <label style={{fontSize: "15px"}}>
            First Name<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="guestFirstname"
            value={props.guestInformation.guestFirstname}
            onChange={props.changeField}
            className={classes.InputBox}
          />
        </div>

        <div style={{paddingBottom: "20px", height: "85px"}}>
          <label style={{fontSize: "15px"}}>
            Last Name<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="guestLastname"
            value={props.guestInformation.guestLastname}
            onChange={props.changeField}
            className={classes.InputBox}
          />
        </div>
      </div>

      <div style={{paddingBottom: "20px", height: "85px"}}>
        <label style={{fontSize: "15px"}}>
          Email Address<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="guestEmail"
          value={props.guestInformation.guestEmail}
          onChange={props.changeField}
          className={classes.InputBoxLarge}
        />
      </div>

      <div>{(props.guestInformation.guestEmail && !regsuper.test(props.guestInformation.guestEmail))
        ? <span style={{ color: "red", padding: "5px"}}>A valid email address is required</span>
        : null
      }</div>
    </div>
  );
};

export default GuestForm;