
//import React, { useState, useEffect, Fragment } from "react";

import queryString from "query-string";

const CheckoutStripeResult =(props)=>{

    let result = queryString.parse(window.location.search).result;
    console.log ("CheckoutStripeResult=", result);

    alert (result);

}


export default CheckoutStripeResult;

