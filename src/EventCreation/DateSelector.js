import React from "react";

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { formatDate, parseDate } from "react-day-picker/moment";
import "react-day-picker/lib/style.css";

const DateSelector = (props) => {

    return (
        <DayPickerInput
        value={props.start}
        inputProps={{ style: {
            paddingLeft: 9,
            border: "1px solid lightgrey",
            boxSizing: "borderBox",
            width: 105,
            height: 40,
            fontSize: "16px",
            color: "black",
            textAlign: "left",
            cursor: "pointer"
        } }}
        format="MM/DD/YYYY"
        formatDate={formatDate}
        parseDate={parseDate}
        placeholder="select date"
        onDayChange={props.change}
        dayPickerProps={{
            format: "MM-DD-YYYY",
            disabledDays: {
            before: props.beforeDate
            },
        }}/>
    )
}

export default DateSelector;