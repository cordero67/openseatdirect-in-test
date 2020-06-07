import React from "react";
import dateFormat from "dateformat";
import Aux from "../hoc/Auxiliary/Auxiliary";

export const bogox = (i,u,n,g,d) => {
    let q = Math.floor (i/(n+g));
    let m = i%(n+g);
    let result =  q*(n*u+g*(1-d)*u) + Math.min(n,m)*u + Math.max(m-n,0)*(1-d)*u;
    return (result);
}

export const twoferCapped = (i,u,n,tp ) => {
    let result = (Math.floor(i/n)*tp) + Math.min(tp,((i%n)*u));
    return (Math.min((i*u),result));
}

export const twofer = (i,u,n,tp ) => {
    let result = (Math.floor(i/n)*tp) + (i%n)*u;
    return (Math.min((i*u),result));
}


// NEED TO ADDRESS THE TIMEZONE VALUE
export const DateRange = props => {
    if (dateFormat(props.start, "m d yy", true) === dateFormat(props.end, "m d yy", true)) {
        return (<Aux>{dateFormat(
        props.start,
        "ddd, mmm d, yyyy - h:MM TT",
        true
        )} to {dateFormat(
        props.end,
        "shortTime",
        true
        )}</Aux>)
    } else {
        return (<Aux>{dateFormat(
        props.start,
        "ddd, mmm d, yyyy - h:MM TT",
        true
        )} to {dateFormat(
        props.end,
        "ddd, mmm d, yyyy - h:MM TT",
        true
        )}</Aux>)
    }
}
