import React, { useEffect, useState } from "react";

import { API, PAYPAL_USE_SANDBOX } from "../../config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Button, Popup } from "semantic-ui-react";

import { PayPalButton } from "react-paypal-button-v2";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import CashNow from "../../assets/CashNow.jpg";
import NoFees from "../../assets/NoFees.png";
import SingleLocation from "../../assets/SingleLocation.png";

import RadioForm from "./RadioForm";

import classes from "./BuyerDashboard.module.css";

import Spinner from "../../components/UI/Spinner/SpinnerNew";  // experimental..
import { threeDSecure } from "braintree-web";

let passThrough = true;

const Onboarding = (props) => {
    const [values, setValues] = useState({
        accountName: "",
        accountEmail: "",
        accountPhone: "",
        accountUrl: "",
        ticketPlan: "",
        inputError: "",
        paypal_plan_id: "",
        paypalExpress_client_id: "",
        paypalExpress_client_secret: ""
    });

    let sandboxStatus;
    
    if (PAYPAL_USE_SANDBOX === "true") {
        sandboxStatus = true
    } else {
        sandboxStatus = false
    }

    // summary, organization, ticket, payment, receipt, paypal, completed, failedFetch
    const [pageView, setPageView] = useState("summary")
    const [preFetchView, setPreFetchView] = useState("")
    const [loading, setLoading ] = useState("false")

    //const [isDisabled, setIsDisabled] = useState(true)
    const { accountName, accountEmail, accountPhone, accountUrl, ticketPlan, paypal_plan_id, paypalExpress_client_id, paypalExpress_client_secret } = values;

    const getStatus= () =>{ 
        let tempData = JSON.parse(localStorage.getItem("user"));
        console.log("tempData: ", tempData)
        if ('user' in tempData && 'accountId' in tempData.user && 'status' in tempData.user.accountId ) {
            console.log("tempData.data.accountId.status: ", tempData.user.accountId.status)
            return tempData.user.accountId.status}
        else {
            return 0;
        } 
    }

    const updatePageView = () =>{
        if (getStatus() === 0) {
            setPageView("summary")
        } else if (getStatus() === 4) {
            setPageView("ticket")
        } else if (getStatus() === 5) {
            setPageView("ticket")
        } else if (getStatus() === 6) {
            setPageView("paypal")
        } else if (getStatus() === 7 || getStatus() === 8) {
            setPageView("completed")
        };
    }

    const updateValues = () => {
        let tempUser = JSON.parse(localStorage.getItem("user"));
        console.log("tempUser: ", tempUser)
        console.log("tempUser.user: ", tempUser.user)
        console.log("tempUser.user.accountId: ", tempUser.user.accountId)
        if ('user' in tempUser && 'accountId' in tempUser.user) {
            let tempBuyerInfo = {};
            if (tempUser.user.accountId.accountName) tempBuyerInfo.accountName = tempUser.user.accountId.accountName;
            if (tempUser.user.accountId.accountEmail) tempBuyerInfo.accountEmail = tempUser.user.accountId.accountEmail;
            if (tempUser.user.accountId.accountPhone) tempBuyerInfo.accountPhone = tempUser.user.accountId.accountPhone;
            if (tempUser.user.accountId.accountUrl) tempBuyerInfo.accountUrl = tempUser.user.accountId.accountUrl;
            if (tempUser.user.accountId.status) tempBuyerInfo.status = tempUser.user.accountId.status;
            if (tempUser.user.accountId.ticketPlan) tempBuyerInfo.ticketPlan = tempUser.user.accountId.ticketPlan;
            if (tempUser.user.accountId.paypal_plan_id) tempBuyerInfo.paypal_plan_id = tempUser.user.accountId.paypal_plan_id;
            if (tempUser.user.accountId.paypalExpress_client_id) tempBuyerInfo.paypalExpress_client_id = tempUser.user.accountId.paypalExpress_client_id;
            if (tempUser.user.accountId.paypalExpress_client_secret) tempBuyerInfo.paypalExpress_client_secret = tempUser.user.accountId.paypalExpress_client_secret;
            setValues(tempBuyerInfo);
            
            console.log("tempBuyerInfo: ", tempBuyerInfo)
        }
    }

    useEffect(() => {
        setLoading(true);
        if (typeof window !== "undefined" && localStorage.getItem(`user`) !== null) {

            let tempUser2 = JSON.parse(localStorage.getItem("user"));
            console.log("tempUser2: ", tempUser2)
            updateValues();
            updatePageView();
        } else {
            window.location.href = "/signin";
        }
        setLoading(false);
    }, []);

    // api static variables
    let  myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const authstring = `Bearer ${props.token}`;
    console.log("authstring: ", authstring)
    myHeaders.append("Authorization", authstring);

    const handleChange = (event) => {
        setValues({
        ...values,
        [event.target.name]: event.target.value
        });
    }

    const radioChange = (event, value, name) => {
        let tempValues = { ...values };
        tempValues[name] = value.value;
        console.log("tempValues: ", tempValues)
        console.log("tempValues.paypal_plan_id: ", tempValues.paypal_plan_id)
        setValues(tempValues);
        console.log("values: ", values)
    };

    const ticketPlans = [
        { label: "Free Tickets", value: "free" },
        { label: "Paid (and Free) Tickets", value: "basicPaidQuarter" }
    ];

    const paymentPlans = [
        { label: "$25 every 3 months", value: "P-86923698ML350284WL5HSLRQ" },
        { label: "$75 for one full year", value: "P-2T148806V2408743NL5HSFTY" }
    ];

    const discountPlans = [
        { label: "$15 every 3 months: discount applied", value: "P-2DK36627GX695315GL5HSFUA" },
        { label: "$50 for one full year: discount applied", value: "P-3KU60828U33449932L5HSFUA" }
    ];

    const shownPlans = () => {
        if(promoCodeDetails.appliedPromoCode === "CASHNOW") {
            return discountPlans;
        } else {
            return paymentPlans;
        }
    }

    const paidPlan = () => {
        if (paypal_plan_id === "P-3U3085871T847894PL5FRXTI") {
            return <Aux>$15 Quaterly Paid Tickets plan </Aux>
        } else if (paypal_plan_id === "P-6UY26644UT426184FL5FRXTI") {
            return <Aux>$50 Annual Paid Tickets plan</Aux>
        } else if (paypal_plan_id === "P-5DT364104U926810EL5FRXSY") {
            return <Aux>$25 Quaterly Paid Tickets plan</Aux>
        } else if (paypal_plan_id === "P-5YA13382D9271245EL5FRXTA") {
            return <Aux>$75 anual Paid Tickets plan</Aux>
        }
    }

    const subTitleDisplay = () => {
        //if (pageErrors || eventTitleOmission) {
        if (false) {
          return (
            <div className={classes.GridSubTitle}>
              <div style={{ textAlign: "left" }}>
              </div>
              <div style={{ textAlign: "center", color: "red"}}>
                Please correct input errors identified below.
              </div>
            </div>
          )
        } else {
          return (
            <div className={classes.GridSubTitle}>
              <div style={{ textAlign: "left" }}>
                  {values.inputError}
              </div>
            </div>
          )
        }
      }

    const handleErrors = response => {
        console.log ("inside handleErrors ", response);
        if (!response.ok) {
            throw Error(response.status);
        }
        return response;
    };

// change plan_id value to be a variable value depending on $10 or $35 choice, right now its the same
    const showPayPal = (
        <div>
            <br></br>
            <PayPalButton
                onButtonReady = {() => {}}
                createSubscription={(data, actions) => {
                    return actions.subscription.create({
                    plan_id: paypal_plan_id
                    });
                }}
                onCancel = {data => {
                    console.log("onCancel 'data': ", data);
                }}
                onApprove = {(data, actions) => {
                    return actions.subscription.get()
                        .then(function(details) {
                            console.log("details: ", details)
                            const authstring = `Bearer ${props.token}`;
                            console.log("about to send paypal object to server")
                            return fetch(`${API}/paypal/subscription/${props.userid}`, {
                                method: "POST",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                    "Authorization": authstring
                                },
                                body: JSON.stringify({
                                    data: data,
                                    details: details
                                })
                            })
                            .then (handleErrors)
                            .then ((response)=>{
                                return response.json();
                            })
                            .then((response) => {// first show a success model with a continue button to go to paypal clientId model 
                                console.log("response: ", response);

                                console.log ("fetch return got back data on organization:", response);
                                    
                                let tempData = JSON.parse(localStorage.getItem("user"));
                                console.log("tempData: ", tempData)
                                tempData.user.accountId = response.result;
                                localStorage.setItem("user", JSON.stringify(tempData));

                                setPageView("receipt");
                                //return response.json();
                            }) // add .catch block for failed response from server, press "continue" button to go to paypal clientId model
                            .catch((err)=>{
                                window.alert ("Paypal Problem at OSD. Pleaase contact support if you cannot create events")
                            })
                    })
                    .catch((err)=>{
                        window.alert ("Paypal Problem at OSD. Pleaase contact support if you cannot create events")
                    })
                }}
                onError = {(err) => 
                    console.log("error occurs: ", err)
                }
                options = {{
                    clientId: "AYkP3Fg50QurkfBwfk7wL4DK8dHPras1f9IKca3IlUsmCm11I6VO4dXTUjZnPPEAhnVPTbRUZqj7vS3k",
                    currency: "USD",
                    vault: true
                }}
                catchError = {err => {
                    console.log("catchError 'err': ", err);
                }}
            />
        </div>
    );



    const summaryPage =()=>{
        console.log ("in summaryPage");
        return (
            <div className={classes.DisplayPanel}
                style={{textAlign: "center"}}>
                
                <div className={classes.SummaryHeader}>
                    3 easy steps to start selling tickets and receiving your cash now!!!
                </div>
                <br></br>
                <div className={classes.SummaryGridTitle}
                    style={{ fontWeight: "600"}}>
                    <div>STEP 1</div>
                    <div>STEP 2</div>
                    <div>STEP 3</div>
                </div>
                <div className={classes.SummaryGrid}>
                    <div>Provide Minimal</div>
                    <div>Select a</div>
                    <div>Create Your</div>
                </div>
                <div className={classes.SummaryGrid}>
                    <div>Organization Info</div>
                    <div>Ticket Plan</div>
                    <div>First Event</div>
                </div>
                <div className={classes.SummaryHeader}>
                    If you have 10 minutes to spare, you have time to sign up now.
                </div>
                <br></br>
                <Button className={classes.SummaryButton}
                    style={{
                        backgroundColor: "white",
                        border: "1px solid green",
                        color: "green",
                        padding: "0px"
                    }}
                    content="Start"
                    onClick={() => {
                        setPageView("organization");
                    }}
                />
            </div>
        )
    }

    const orgPage =()=>{
        return (
            <div className={classes.DisplayPanel}>
                <div
                    style={{
                        paddingTop: "40px",
                        paddingLeft: "80px",
                        fontSize: "22px",
                        fontWeight: "600"
                    }}
                    >STEP 1: Basic Information about your Organization
                </div>
                <br></br>
                <div style={{paddingLeft: "80px", paddingTop: "20px", paddingBottom: "40px" }}>Please provide us with the following pieces of information:</div>
                <div className={classes.VendorCanvas}>
                {subTitleDisplay()}
                <br></br>
                    <div className="form-group">
                        <label>Company Name{" "}<span style={{color: "red"}}>*</span></label>
                        <input
                            onFocus={() => {
                                setValues({...values, inputError: ""});
                            }}
                            type="text"
                            name="accountName"
                            className="form-control"
                            onChange={handleChange}
                            value={accountName}
                        />
                    </div>
                    <br></br>
                    <div className="form-group">
                        <label>Company Email</label>
                        <input
                            onFocus={() => {
                                setValues({...values, inputError: ""});
                            }}
                            type="text"
                            name="accountEmail"
                            className="form-control"
                            onChange={handleChange}
                            value={accountEmail}
                        />
                    </div>
                    <br></br>
                    <div className="form-group">
                        <label>Company Phone or Cell Number</label>
                        <input
                            onFocus={() => {
                                setValues({...values, inputError: ""});
                            }}
                            type="text"
                            name="accountPhone"
                            className="form-control"
                            onChange={handleChange}
                            value={accountPhone}
                        />
                    </div>
                    <br></br>
                    <div className="form-group">
                        <label>Company Website</label>
                        <input
                            onFocus={() => {
                                setValues({...values, inputError: ""});
                            }}
                            type="text"
                            name="accountUrl"
                            className="form-control"
                            onChange={handleChange}
                            value={accountUrl}
                        />
                    </div>
                </div>
                <div className={classes.OrganizationButtonGrid}>
                    <div style={{paddingLeft: "65px"}}>
                        <Button className={classes.OrganizationButton}
                            style={{
                                backgroundColor: "white",
                                border: "1px solid blue",
                                color: "blue",
                                padding: "0px"
                            }}
                            content="Back"
                            onClick={() => {
                                setPageView("summary");
                            }}
                        />
                    </div>
                    <div style={{paddingLeft: "65px"}}>
                        <Button className={classes.OrganizationButton}
                            style={{
                                backgroundColor: 'white',
                                border: "1px solid green",
                                color: "green",
                                padding: "0px"
                            }}
                            disabled={!accountName}
                            content="Submit"
                            onClick={() => {
                                console.log("hit the button")
                                //setIsDisabled(false);
                                let methodType;
                                if (getStatus() === 0) {
                                    methodType="POST";
                                } else {
                                    methodType="PATCH";
                                }
                                console.log("methodType: ", methodType)
                                let url=  `${API}/account/${props.userid}`;
                                let fetcharg ={
                                    method: methodType,
                                    headers: myHeaders,
                                    body:JSON.stringify ({
                                        accountName: accountName,
                                        accountEmail: accountEmail,
                                        accountPhone: accountPhone,
                                        accountUrl: accountUrl
                                    }),
                                };
                                console.log("fetching with: ", url, fetcharg);
                                fetch(url, fetcharg )
                                .then(handleErrors)
                                .then ((response)=>{
                                    console.log ("then response: ", response);
                                    return response.json()})
                                .then ((data)=>{
                                    console.log ("fetch return got back data on organization:", data);
                                    
                                    let tempData = JSON.parse(localStorage.getItem("user"));
                                    console.log("tempData: ", tempData)
                                    tempData.user.accountId = data.result;
                                    localStorage.setItem("user", JSON.stringify(tempData));

                                    if (data.status){
                                        switch (data.result.status){
                                            case(4): 
                                            case(5):    setPageView("ticket"); break;
                                            case(6):    setPageView("payment");break;
                                            case(7):    setPageView("completed");break;
                                            case(8):    setPageView("completed");break;
                                            case(0):
                                            default:    setPageView("summary");
                                        }
                                    } else {
                                            // this is a frieldly error
                                            let errmsg = "DEFAULT MESSAGE - Please try again";
                                            if (data.message){
                                                errmsg = data.message;
                                            };
                                            window.alert (errmsg);
                                    };
                                })
                                .catch ((err)=>{
                                    setPreFetchView(pageView);
                                    console.log (err);
                                    setPageView("error");
                                })
                                //.finally (() => setIsDisabled(false));
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }

    const ticketPage =()=>{
        return (
            <div className={classes.DisplayPanel}>
                <div>
                    <div
                        style={{
                            paddingTop: "40px",
                            paddingLeft: "80px",
                            fontSize: "22px",
                            fontWeight: "600"
                        }}
                        >STEP 2: Select a Ticket Plan
                    </div>
                    <br></br>
                    <div style={{fontSize: "16px", paddingLeft: "80px", paddingTop: "20px"}}>Choose between our two ticket plans:</div>
                    <div style={{fontSize: "16px", paddingLeft: "100px", paddingTop: "20px"}}>"Free Tickets" plan allows you to issue up to 500 free tickets per month.</div>
                    <div style={{fontSize: "16px", paddingLeft: "100px", paddingTop: "20px", paddingBottom: "40px"}}>"Paid (and Free) Tickets" plan lets you issue an unlimited amount of paid and free tickets.</div>
                    <div  className={classes.PaymentCanvas}>
                        <RadioForm
                            details={ticketPlans}
                            group="eventTypeGroup"
                            current={ticketPlan}
                            change={(event, value) =>
                                radioChange(event, value, "ticketPlan")
                            }
                        />
                        <br></br>
                    </div>
                    <div className={classes.OrganizationButtonGrid}>
                        <div style={{paddingLeft: "65px"}}>
                            <Button className={classes.OrganizationButton}
                                style={{
                                    backgroundColor: "white",
                                    border: "1px solid blue",
                                    color: "blue",
                                    padding: "0px"
                                }}
                                content="Back"
                                onClick={() => {
                                    setPageView("organization");
                                }}
                            />
                        </div>
                        <div style={{paddingLeft: "65px"}}>
                            <Button className={classes.OrganizationButton}
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid green",
                                    color: "green",
                                    padding: "0px"
                                }}
                                content="Submit"
                                disabled={ticketPlan === "tbd"}
                                onClick={() => {
                                    if (ticketPlan === "free") {
                                        let url=  `${API}/account/${props.userid}`;
                                        let fetcharg ={
                                            method: "PATCH",
                                            headers: myHeaders,
                                            body:JSON.stringify({
                                                ticketPlan: ticketPlan
                                            }),
                                        };
                                        console.log("fetching with: ", url, fetcharg);
                                        fetch(url, fetcharg )
                                        .then(handleErrors)
                                        .then ((response)=>{
                                            console.log ("then response: ", response);
                                            return response.json()})
                                        .then ((data)=>{
                                            console.log ("fetch return got back data on Free ticket:", data);
                                    
                                            let tempData = JSON.parse(localStorage.getItem("user"));
                                            console.log("tempData: ", tempData)
                                            tempData.user.accountId = data.result;
                                            localStorage.setItem("user", JSON.stringify(tempData));

                                            if (data.status){
                                                switch (data.result.status){
                                                    case(4): 
                                                    case(5):    setPageView("ticket"); break;
                                                    case(6):    setPageView("payment");break;
                                                    case(7):    setPageView("completed");break;
                                                    case(8):    setPageView("completed");break;
                                                    case(0):
                                                    default:    setPageView("summary");
                                                }
                                            } else {
                                                    // this is a frieldly error
                                                    let errmsg = "There was a error. please retry";
                                                    if (data.message){
                                                            errmsg = data.message;
                                                    };
                                                    //window.alert (errmsg);
                                            };
                                        })
                                        .catch ((err)=>{
                                            setPreFetchView(pageView);
                                            console.log (err);
                                            setPageView("error");
                                        });
                                    } else {
                                        setPageView("payment");
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )

    }


    const amendPromoCodeDetails = (inputtedPromoCode, promoCodeDetails) => {
        let tempPromoCodeDetails = { ...promoCodeDetails };
        tempPromoCodeDetails.applied = true;
        tempPromoCodeDetails.errorMessage = "Valid Promo Code";
        tempPromoCodeDetails.appliedPromoCode = inputtedPromoCode;
        tempPromoCodeDetails.inputtedPromoCode = "";
        tempPromoCodeDetails.lastInvalidPromoCode = "";
        console.log("UPDATED 'promoCodeDetails': ", tempPromoCodeDetails)
        return tempPromoCodeDetails;
      };
    
  // updates "promoCodeDetails", "ticketInfo" and "orderTotals" based on promo code change
  const applyPromoCodeHandler = (event, inputtedPromoCode) => {
    //console.log("inside applyPromoCodeHandler")

    if (promoCodeDetails.eventPromoCodes.includes(inputtedPromoCode)) {
        console.log("valid code");
        setPromoCodeDetails(
        amendPromoCodeDetails(inputtedPromoCode, promoCodeDetails)
      );
      
    } else {
        //console.log("INVALID code");
        let tempobject = { ...promoCodeDetails };
        tempobject.errorMessage = "Sorry, that promo code is invalid";
        tempobject.lastInvalidPromoCode = inputtedPromoCode;
        setPromoCodeDetails(tempobject);
    }
  };

const inputPromoCode = () => {
    if (promoCodeDetails.errorMessage === "Sorry, that promo code is invalid") {
      return (
        <Aux>
            <div className={[classes.PromoGrid, classes.Red].join(" ")}>
              <input
                type="text"
                id="input box"
                className={classes.PromoCodeInputBoxRed}
                value={promoCodeDetails.inputtedPromoValue}
                onChange={(event) => {
                  let tempobject = { ...promoCodeDetails };
                  tempobject.inputtedPromoValue = event.target.value;
                  tempobject.errorMessage = "";
                  setPromoCodeDetails(tempobject);
                }}
              ></input>
              <button
                className={classes.PromoCodeButtonRed}
                onClick={(event) => {
                    applyPromoCodeHandler(
                        event,
                        promoCodeDetails.inputtedPromoValue.toUpperCase()
                    );
                    let temp = { ...promoCodeDetails };
                    temp.inputtedPromoValue = "";
                    temp.errorMessage = "";
                    setPromoCodeDetails(temp);
                }}
              >
                Clear
              </button>
            </div>
            <div style={{ color: "red", fontSize: "12px" }}>
              {promoCodeDetails.errorMessage !== ""
                ? promoCodeDetails.errorMessage
                : null}
            </div>
        </Aux>
      );
    } else {
      return (
        <Aux>
            <div className={[classes.PromoGrid, classes.Blue].join(" ")}>
              <input
                type="text"
                id="input box"
                placeholder="Enter Promo Code"
                className={classes.PromoCodeInputBoxBlack}
                value={promoCodeDetails.inputtedPromoValue}
                onChange={(event) => {
                    let tempDetails = { ...promoCodeDetails };
                    tempDetails.inputtedPromoValue = event.target.value;
                    tempDetails.errorMessage = "";
                    console.log("promoCodeDetails: ", tempDetails)
                    setPromoCodeDetails(tempDetails);
                }}
              ></input>
              <button
              onClick={(event) => {
                applyPromoCodeHandler(
                    event,
                    promoCodeDetails.inputtedPromoValue.toUpperCase()
                );
              }}
                className={classes.PromoCodeButtonBlue}
                disabled={!promoCodeDetails.inputtedPromoValue}
              >
                Apply
              </button>
            </div>
          <div style={{ color: "blue", fontSize: "12px" }}>
            {promoCodeDetails.errorMessage !== ""
              ? promoCodeDetails.errorMessage
              : null}
          </div>
        </Aux>
      );
    }
  };

  const [promoCodeDetails, setPromoCodeDetails] = useState({
    available: false,
    applied: false,
    input: false,
    errorMessage: "",
    appliedPromoCode: "",
    inputtedPromoValue: "",
    lastInvalidPromoCode: "",
    eventPromoCodes: ["CASHNOW"],
  });

 const clearPromoDetails = (promoCodeDetails) => {
    let tempPromoCodeDetails;
    tempPromoCodeDetails = { ...promoCodeDetails };
    tempPromoCodeDetails.applied = false;
    tempPromoCodeDetails.input = true;
    tempPromoCodeDetails.errorMessage = "";
    tempPromoCodeDetails.appliedPromoCode = "";
    tempPromoCodeDetails.inputtedPromoValue = "";
    tempPromoCodeDetails.lastInvalidPromoCode = "";
    console.log("UPDATED 'promoCodeDetails': ", tempPromoCodeDetails)
    return tempPromoCodeDetails;
  }

  // creates contents inside promo code input form
  const promoOption = () => {
    if (promoCodeDetails.applied) {
    //if (false) {
      return (
        <Aux>
          <div className={classes.AppliedPromoCode}>
            <FontAwesomeIcon
              className={classes.faCheckCircle}
              icon={faCheckCircle}
            />{" "}
            Code{" "}
            <span style={{ fontWeight: "600" }}>
              {(" ", promoCodeDetails.appliedPromoCode)}{" "}
            </span>
            applied.{" "}
            <span
              className={classes.RemovePromoCode}
              onClick={() => {
                    console.log("inside remove")
                    setPromoCodeDetails(clearPromoDetails(promoCodeDetails));
              }}
            >
              Remove
            </span>
          </div>
          <br></br>
        </Aux>
      );
    } else if (promoCodeDetails.input) {
    //} else if (false) {
      return (
        <Aux>
          {inputPromoCode()}
          <br></br>
        </Aux>
      );
    } else if (!promoCodeDetails.input) {
    //} else if (true) {
      return (
        <Aux>
          <div
            className={classes.EnterPromoCode}
            onClick={() => {
              let tempPromoCodeDetails;
              tempPromoCodeDetails = { ...promoCodeDetails };
              tempPromoCodeDetails.input = true;
              setPromoCodeDetails(tempPromoCodeDetails);
            }}
          >
            Enter Promo Code
          </div>
          <br></br>
        </Aux>
      );
    }
  };



    const paymentPage =()=>{
                return (
                    <div className={classes.DisplayPanel}>
                        <div>
                            <div
                                style={{
                                    paddingTop: "40px",
                                    paddingLeft: "80px",
                                    fontSize: "22px",
                                    fontWeight: "600"
                                }}
                                >STEP 2: Choose a Subscription Plan
                            </div>
                            <br></br>
                            <div style={{fontSize: "16px", paddingLeft: "80px", paddingTop: "20px"}}>Choose a subscription plan and submit your payment to PayPal:</div>
                            <br></br>
                            <br></br>
                            <div className={classes.PaymentCanvas}>
                                {promoOption()}
                                <br></br>
                                <RadioForm
                                    details={shownPlans()}
                                    group="eventTypeGroup"
                                    current={paypal_plan_id}
                                    change={(event, value) =>
                                        radioChange(event, value, "paypal_plan_id")
                                    }
                                />
                                <br></br>
                                {ticketPlan !== "free" ? showPayPal : null}
                            </div>
                            <div style={{textAlign: "center", paddingTop: "40px"}}>
                                <Button className={classes.OrganizationButton}
                                    style={{
                                        backgroundColor: 'white',
                                        border: "1px solid blue",
                                        color: "blue",
                                        padding: "0px",
                                    }}
                                    content="Back"
                                    onClick={() => {
                                        setPageView("ticket");
                                        console.log("pageView: ", pageView)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )

    }
    const receiptPage =()=>{
                return (
                    <div className={classes.DisplayPanel}>
                        <div>
                            <div
                                style={{
                                    paddingTop: "40px",
                                    paddingLeft: "80px",
                                    fontSize: "22px",
                                    fontWeight: "600"
                                }}
                                >STEP 2: Paypal Receipt
                            </div>
                            <br></br>
                            <div style={{fontSize: "16px", paddingLeft: "80px", paddingTop: "20px" }}>Congratulations you have successfully paid for your subscription.{(paidPlan())}.</div>
                            <div style={{fontSize: "16px", paddingLeft: "80px", paddingTop: "20px", paddingBottom: "40px" }}>Thank you for your payment.</div>
                            <div style={{fontSize: "16px", paddingLeft: "80px", paddingTop: "20px", paddingBottom: "40px" }}>Now let's make sure you get paid instantly whenever you sell a ticket.</div>
                            <div style={{textAlign: "center", paddingTop: "40px"}}>
                                <Button className={classes.OrganizationButton}
                                    style={{
                                        backgroundColor: 'white',
                                        border: "1px solid blue",
                                        color: "blue",
                                        padding: "0px",
                                    }}
                                    content="Continue"
                                    onClick={() => {
                                        // UNDELETE ONCE RETURN FROM SERVER CONTAINS THE RESPONSE FIELD
                                        updatePageView();
                                        // DELETE ONCE RETURN FROM SERVER CONTAINS THE RESPONSE FIELD
                                        setPageView("paypal")
                                        console.log("pageView: ", pageView)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )

    }
    const paypalPage =()=>{
                return (
                    <div className={classes.DisplayPanel}>
                        <div>
                            <div
                                style={{
                                    paddingTop: "40px",
                                    paddingLeft: "80px",
                                    fontSize: "22px",
                                    fontWeight: "600"
                                }}
                                >STEP 2: Link Your Paypal Merchant Account 
                            </div>
                            <br></br>
                            <div style={{fontSize: "16px", paddingLeft: "80px", paddingTop: "20px"}}>Please provide the ClientId and Secret from your PayPal merchant account.</div>
                            <div style={{fontSize: "16px", paddingLeft: "80px", paddingTop: "20px"}}>These two items are located in the "My Apps & Credentials" section of your
                                <button
                                    style={{
                                        fontSize: "16px",
                                        color: "blue",
                                        border: "none",
                                        backgroundColor: "white",
                                        cursor: "pointer",
                                        display: "inlineBlock",
                                        outline: "none",
                                    }}
                                    onClick={() => {
                                        window.location.href = "https://developer.paypal.com/developer/applications/";
                                    }}
                                >
                                    PayPal Dashboard.
                                </button>
                            </div>
                            <div style={{fontSize: "16px", paddingLeft: "80px", paddingTop: "20px", paddingBottom: "40px"}}>
                                <button
                                    style={{
                                        fontSize: "16px",
                                        color: "blue",
                                        border: "none",
                                        backgroundColor: "white",
                                        paddingLeft: "0px",
                                        cursor: "pointer",
                                        display: "inlineBlock",
                                        outline: "none",
                                    }}
                                    onClick={() => {
                                        window.location.href = "https://drive.google.com/file/d/1ozk3BKzLwLEpzQJCqX7FwAIF0897im0H/view?usp=sharing";
                                    }}
                                >
                                Additional instructions.
                                </button>
                            </div>
                            
                            
                            
                            <div  className={classes.PaypalCanvas}>
                                <div className="form-group">
                                    <label>Paypal Client ID{" "}<span style={{color: "red"}}>*{" "}</span>
                                    <Popup
                                        position="right center"
                                        content="Your ID will only be used..."
                                        header="Paypal Client ID"
                                        trigger={
                                            <FontAwesomeIcon
                                                color="blue"
                                                cursor="pointer"
                                                icon={faInfoCircle}
                                            />
                                        }
                                    />
                                    </label>
                                    <input
                                        onFocus={() => {
                                            setValues({...values, inputError: ""});
                                        }}
                                        type="text"
                                        name="paypalExpress_client_id"
                                        className="form-control"
                                        onChange={handleChange}
                                        value={paypalExpress_client_id}
                                    />
                                </div>
                                <br></br>
                                <div className="form-group">
                                    <label>Paypal Secret{" "}<span style={{color: "red"}}>*{" "}</span>
                                    <Popup
                                        position="right center"
                                        content="Your Paypal Secret will only be used..."
                                        header="Paypal Secret"
                                        trigger={
                                            <FontAwesomeIcon
                                                color="blue"
                                                cursor="pointer"
                                                icon={faInfoCircle}
                                            />
                                        }
                                    />
                                    </label>
                                    <input
                                        onFocus={() => {
                                            setValues({...values, inputError: ""});
                                        }}
                                        type="text"
                                        name="paypalExpress_client_secret"
                                        className="form-control"
                                        onChange={handleChange}
                                        value={paypalExpress_client_secret}
                                    />
                                </div>
                            </div>
                            <div style={{textAlign: "center", paddingTop: "40px"}}>
                                <Button className={classes.OrganizationButton}
                                    style={{
                                        backgroundColor: 'white',
                                        border: "1px solid green",
                                        color: "green",
                                        padding: "0px"
                                    }}
                                    disabled={!paypalExpress_client_id || !paypalExpress_client_secret}
                                    content="Submit"
                                    onClick={() => {
                                        let url = `${API}/account/${props.userid}`;
                                        let fetcharg ={
                                            method: "PATCH",
                                            headers: myHeaders,
                                            body:JSON.stringify({
                                                useSandbox: sandboxStatus,
                                                paymentGatewayType: "PayPalExpress",
                                                paypalExpress_client_id: paypalExpress_client_id,
                                                paypalExpress_client_secret: paypalExpress_client_secret
                                            }),
                                        };
                                        console.log("fetching with: ", url, fetcharg);
                                        fetch(url, fetcharg )
                                        .then(handleErrors)
                                        .then ((response)=>{
                                            console.log ("then response: ", response);
                                            return response.json()})
                                        .then ((data)=>{
                                            console.log ("fetch return got back data on PayPal:", data);
                                            
                                            let tempData = JSON.parse(localStorage.getItem("user"));
                                            console.log("tempData: ", tempData)
                                            tempData.user.accountId = data.result;
                                            localStorage.setItem("user", JSON.stringify(tempData));

                                            
                                            if (data.status){
                                                switch (data.result.status){
                                                    case(4): 
                                                    case(5):    setPageView("ticket"); break;
                                                    case(6):    setPageView("payment");break;
                                                    case(7):    setPageView("completed");break;
                                                    case(8):    setPageView("completed");break;
                                                    case(0):
                                                    default:    setPageView("summary");
                                                }
                                            } else {
                                                    // this is a frieldly error
                                                    let errmsg = "unable to validate ClientId and secret at this time";
                                                    if (data.message){
                                                        errmsg = data.message;
                                                    };
                                                    window.alert (errmsg);
                                            };
                                        })
                                        .catch ((err)=>{
                                            setPreFetchView(pageView);
                                            console.log (err);
                                            setPageView("error");
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )

    }
    const completedPage =()=>{
                return (
                    <div className={classes.DisplayPanel}>
                        <div
                            style={{
                                paddingTop: "40px",
                                paddingLeft: "80px",
                                fontSize: "22px",
                                fontWeight: "600"
                            }}
                            >STEP 3: Create an Event
                        </div>
                        <div className={classes.CompleteHeaderLine1}>
                            Congratulations, you are now ready to create your first event and
                        </div>

                        <div className={classes.CompleteHeaderLine2}>
                            enjoy the benefits that OpenSeatDirect provides.
                        </div>
                <br></br>
                        <div style={{textAlign: "center"}}>
                            <Button className={classes.SummaryButton}
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid blue",
                                    color: "blue",
                                    padding: "0px",
                                }}
                                content="Continue"
                                onClick={() => {
                                    window.location.href = "/vendordashboard";
                                }}
                            />
                        </div>
                    </div>
                )

    }
    const errorPage =()=>{
                return (
                    <div className={classes.DisplayPanel}>
                        <div
                            style={{
                                paddingTop: "40px",
                                paddingLeft: "80px",
                                fontSize: "22px",
                                fontWeight: "600"
                            }}
                            >SYSTEM ERROR
                        </div>
                        <div className={classes.SummaryHeader}>
                            System error please go back and resubmit.
                        </div>
                        <div style={{textAlign: "center"}}>
                            <Button className={classes.SummaryButton}
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid blue",
                                    color: "blue",
                                    padding: "0px",
                                }}
                                content="Go Back"
                                onClick={() => {
                                    console.log("preFetchView: ", preFetchView)
                                    setPageView(preFetchView);
                                    setPreFetchView("");
                                }}
                            />
                        </div>
                    </div>
                )

    }

    const mainDisplay = () => {
        if (!loading) {
            console.log("event is NOT loading. pageView =", pageView);

            switch (pageView){
                case ("summary"):   return summaryPage();
                case("organization"):return orgPage();
                case ("ticket"):    return ticketPage();
                case ("payment"):   return paymentPage();
                case ("receipt"):   return receiptPage();
                case("paypal"):     return paypalPage();
                case("completed"):  return completedPage();
                case("error"):      return errorPage();
                default:            return summaryPage();
            }
        } else {
            console.log("event IS loading");
            return <Spinner />;
        }
    }
    return (
        <div>
            <div className={classes.DisplayPanelTitle}>
            VENDOR SIGNUP
            </div>

            {loading ? null : mainDisplay()}
        </div>
    )
}

export default Onboarding;