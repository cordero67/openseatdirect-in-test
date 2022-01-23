import React, { useState, useEffect, Fragment } from "react";

import { API } from "../../config";

const StripeConnection = () => {
  const [stripeValues, setStripeValues] = useState({
    setUpBegan: false,
    isLoadingFieldsNeeded: true,
    error: null,
  });

  const [user, setUser] = useState({
    sessionToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWU3M2EwNGU2NGFkYzA2MmM3MTEwYTkiLCJpYXQiOjE2NDI5NDY3MTV9.nVCEdobM3_CoFI6GRyxbCDTjb2ZDJZvi5xdRwkkShXI",
    accountNum: "63469277608",
  });

  const { sessionToken, accountNum } = user;

  useEffect(() => {
    let tempUser = JSON.parse(localStorage.getItem("user"));
    fetchFieldsNeeded();
  });

  const fetchFieldsNeeded = () => {
    console.log("inside fetchFieldsNeeded");

    //const { sessionToken, accountNum } = user;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${sessionToken}`);
    myHeaders.append("Access-Control-Allow-Origin", "*");
    console.log("myHeaders: ", myHeaders);

    //let url = `${API}/stripe/account/get`;
    let url = `${API}/accounts/${accountNum}/subscription/stripe/onboard1-genlink`;

    let fetchBody = {
      method: "POST",
      headers: myHeaders,
    };
    console.log("fetching with: ", url, fetchBody);

    fetch(url, fetchBody)
      .then((res) => res.json())
      .then((json) => {
        console.log("json: ", json);
        const { success, message, setUpBegan } = json;
        if (success) {
          console.log("success");
          setStripeValues({
            setUpBegan: setUpBegan,
            isLoadingFieldsNeeded: false,
            error: null,
          });
        } else {
          console.log("failure");
          setStripeValues({
            setUpBegan: false,
            isLoadingFieldsNeeded: false,
            error: message,
          });
        }
      })
      .catch((error) => {
        console.log("fetchFieldsNeeded() error.message: ", error.message);
        //setModalSetting("error");
      });
  };

  const display = () => {
    if (stripeValues.isLoadingFieldsNeeded) {
      return <div>Loading values...</div>;
    }
    if (!stripeValues.setUpBegan) {
      return (
        <div>
          {stripeValues.error ? <div>{stripeValues.error}</div> : null}
          <button /*onClick={fetchFieldsNeeded}*/>Begin setup</button>
          <div>By clicking setup you agree to the terms TOS for Stripe</div>
        </div>
      );
    }
  };

  return <div style={{ paddingTop: "60px" }}>{display()}</div>;
};

export default StripeConnection;
