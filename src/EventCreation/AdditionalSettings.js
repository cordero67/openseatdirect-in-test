import React, { Fragment } from "react";

import RadioForm from "./RadioForm";

import classes from "./EventCreation.module.css";

const AdditionalSettings = (props) => {
  const refundPolicyList = [
    {
      label:
        "1 day: Attendees can receive refunds up to 1 day before your event start date.",
      value: "1day",
    },
    {
      label:
        "7 days: Attendees can receive refunds up to 7 days before your event start date.",
      value: "7days",
    },
    {
      label:
        "30 days: Attendees can receive refunds up to 30 days before your event start date.",
      value: "30days",
    },
    {
      label:
        "Undefined: I will respond to attendee refund requests on a case by case basis.",
      value: "unknown",
    },
    { label: "No refunds: No refunds at any time.", value: "noRefunds" },
  ];

  return (
    <Fragment>
      <div className={classes.CategoryTitle} style={{ width: "195px" }}>
        Additional Settings
      </div>
      <div style={{ border: "1px solid grey" }}>
        <div className={classes.SectionTitle}>
          Refund Policy: please select one
        </div>
        <RadioForm
          details={refundPolicyList}
          group="refundGroup"
          current={props.event.refundPolicy}
          change={(event, value) =>
            props.radioChange(event, value, "refundPolicy")
          }
        />
      </div>
    </Fragment>
  );
};

export default AdditionalSettings;
