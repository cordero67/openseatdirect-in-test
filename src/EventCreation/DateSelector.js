import React from "react";

import "react-datepicker/dist/react-datepicker.css";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { formatDate, parseDate } from "react-day-picker/moment";
import "react-day-picker/lib/style.css";

const DateSelector = (props) => {
  let minDate = props.current;

  if (props.type === "endDate" && props.current < props.startDate) {
    minDate = props.current;
  }

  return (
    <DayPickerInput
      value={minDate}
      inputProps={{
        style: {
          paddingLeft: 9,
          border: "1px solid lightgrey",
          boxSizing: "borderBox",
          width: 105,
          height: 40,
          fontSize: "16px",
          color: "black",
          textAlign: "left",
          cursor: "pointer",
        },
      }}
      format="MM/DD/YYYY"
      formatDate={formatDate}
      parseDate={parseDate}
      placeholder="select date"
      disabled
      disabledKeyboardNavigation
      onDayChange={props.change}
      dayPickerProps={{
        format: "MM-DD-YYYY",
        disabledDays: {
          before: props.beforeDate,
        },
      }}
    />
  );
};

export default DateSelector;
