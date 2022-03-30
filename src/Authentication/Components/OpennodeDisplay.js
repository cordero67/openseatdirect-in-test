import React, { Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";

import RadioForm from "../../components/Forms/RadioForm";
import { API } from "../../config";

import classes from "../AuthenticationModal.module.css";

const OpennodeDisplay = (props) => {
  console.log("props: ", props);

  // OSDFREE promo code plans
  const settleOptions = [
    {
      label: "Fiat (e.g. US Dollar)",
      value: true,
    },
    {
      label: "Bitcoin",
      value: false,
    },
  ];

  // OSDFREE promo code plans
  const blockchainOptions = [
    {
      label: "Dev / Testnet",
      value: true,
    },
    {
      label: "Live / Mainnet",
      value: false,
    },
  ];

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const handleOpennode = (data) => {
    console.log("data: ", data);
    if (data.status) {
      console.log("INSIDE data.status");
      let tempData = JSON.parse(localStorage.getItem("user"));
      tempData.user.accountId = data.result;
      localStorage.setItem("user", JSON.stringify(tempData));
      props.submit();
      props.spinnerChange(false);
    } else {
      let errmsg =
        "unable to validate Opennode API Key and secret at this time";
      if (data.message) {
        console.log("data.message exist");
        console.log("data.message ", data.message);
        errmsg = data.message;
      }
      console.log("errmsg: ", errmsg);
      props.submission({ message: errmsg, error: true, redirect: "" });
      props.spinnerChange(false);
    }
  };

  const submitOpennode = () => {
    props.spinnerChange(true);
    props.submission({ message: "", error: false, redirect: "" });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const authstring = `Bearer ${props.sessionToken}`;
    myHeaders.append("Authorization", authstring);
    let url = `${API}/accounts/${props.accountNum}`;
    let fetcharg = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        paymentGatewayType2: "Opennode",
        opennode_invoice_API_KEY: props.apiKey,
        opennode_auto_settle: props.settle,
        opennode_dev: props.dev,
      }),
    };
    console.log("fetching with: ", url, fetcharg);
    fetch(url, fetcharg)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data on Opennode:", data);
        handleOpennode(data);
      })
      .catch((err) => {
        console.log(err);
        props.submission({
          message: "Server down please try again",
          error: true,
          redirect: "opennode",
        });
        props.displayChange("error");
        props.spinnerChange(false);
      });
  };

  const displayButtons = () => {
    if (props.authOrigin) {
      return (
        <Fragment>
          <div style={{ textAlign: "center", paddingTop: "20px" }}>
            <button
              className={classes.ButtonGrey}
              onClick={() => {
                props.displayChange("gateway");
                props.submission({ message: "", error: false, redirect: "" });
              }}
            >
              BACK TO GATEWAY SELECTION
            </button>
          </div>
          <div style={{ textAlign: "center", paddingTop: "20px" }}>
            <button
              className={classes.ButtonGrey}
              onClick={() => {
                if (props.initial === "upgrade") {
                  window.close();
                } else {
                  props.redirect();
                }
              }}
            >
              STAY WITH FREE FOREVER PLAN
            </button>
          </div>
        </Fragment>
      );
    } else return null;
  };

  const opennodeForm = () => {
    let buttonClass;
    if (!props.apiKey) {
      buttonClass = classes.ButtonBlueOpac;
    } else {
      buttonClass = classes.SubmitButton;
    }
    return (
      <Fragment>
        <div
          style={{ fontSize: "15px", paddingBottom: "20px", width: "340px" }}
        >
          <div>
            Setup a new Opennode account{" "}
            <a
              href="https://dev.opennode.com/signup"
              target="_blank"
              rel="noreferrer"
              style={{ fontWeight: "600", color: "blue" }}
            >
              {" "}
              here
            </a>
          </div>
          <label style={{ width: "340px", fontSize: "15px" }}>
            <br></br>
            Opennode API key
            <span style={{ color: "red" }}>* </span>
          </label>
          <input
            onFocus={() => {
              props.submission({ message: "", error: false, redirect: "" });
            }}
            className={classes.InputBox}
            type="text"
            name="opennode_invoice_API_KEY"
            onChange={props.inputChange}
            value={props.apiKey}
          />
        </div>
        <div style={{ paddingBottom: "20px", width: "340px" }}>
          <div style={{ fontSize: "15px" }}>
            Settlement Currency: (see auto_settle field{" "}
            <a
              href="https://developers.opennode.com/reference/create-charge"
              target="_blank"
              rel="noreferrer"
              style={{ fontWeight: "600", color: "blue" }}
            >
              here
            </a>
            )
          </div>

          <RadioForm
            details={settleOptions}
            group="settleOptioneGroup"
            current={props.settle}
            change={(event, value) => {
              props.radioChange(event, value, "opennode_auto_settle");
            }}
          />
        </div>
        <div style={{ width: "340px" }}>
          <div style={{ fontSize: "15px" }}>
            Bitcoin Blockchain: (try dev setup{" "}
            <a
              href="https://dev.opennode.com/"
              target="_blank"
              rel="noreferrer"
              style={{ fontWeight: "600", color: "blue" }}
            >
              here
            </a>
            )
          </div>
          <RadioForm
            details={blockchainOptions}
            group="blockchainOptionGroup"
            current={props.dev}
            change={(event, value) => {
              props.radioChange(event, value, "opennode_dev");
            }}
          />
        </div>
        <div style={{ textAlign: "center", paddingTop: "20px" }}>
          <button
            className={buttonClass}
            disabled={!props.apiKey}
            onClick={() => {
              submitOpennode();
            }}
          >
            SUBMIT YOUR OPENNODE DETAILS
          </button>
        </div>
        {displayButtons()}
      </Fragment>
    );
  };

  const showError = () => {
    if (props.error) {
      return (
        <div
          style={{
            color: "red",
            fontSize: "14px",
            lineHeight: "25px",
            paddingBottom: "20px",
          }}
        >
          {props.message}
        </div>
      );
    } else {
      return null;
    }
  };

  const header = () => {
    if (props.authOrigin !== true) {
      return (
        <div className={classes.Header}>
          <div>Enter Opennode Information</div>
          <div style={{ textAlign: "right" }}>
            <ion-icon
              style={{
                fontWeight: "600",
                fontSize: "28px",
                color: "black",
                paddingBottom: "5px",
              }}
              name="close-outline"
              cursor="pointer"
              onClick={() => {
                props.close();
              }}
            />
          </div>
        </div>
      );
    } else {
      return <div className={classes.Header}>Enter Opennode Information</div>;
    }
  };

  if (props.spinner) {
    return (
      <div className={classes.BlankCanvas} style={{ height: "595px" }}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div className={classes.BlankCanvas}>
        {header()}
        <div>
          {showError()}
          {opennodeForm()}
        </div>
      </div>
    );
  }
};

export default OpennodeDisplay;
