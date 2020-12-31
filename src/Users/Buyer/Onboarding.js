import React, { useEffect, useState } from "react";

import { API, PAYPAL_USE_SANDBOX, SUBSCRIPTION_PROMO_CODE } from "../../config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Button, Popup } from "semantic-ui-react";

import { PayPalButton } from "react-paypal-button-v2";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import RadioForm from "./RadioForm";

import classes from "./BuyerAccount.module.css";

import Spinner from "../../components/UI/Spinner/SpinnerNew";  // experimental..

const Onboarding = (props) => {
    console.log("PAYPAL_USE_SANDBOX: ", PAYPAL_USE_SANDBOX);
    console.log("SUBSCRIPTION_PROMO_CODE: ", SUBSCRIPTION_PROMO_CODE);
    console.log("API: ", API);

    const [values, setValues] = useState({
        accountName: "",
        accountEmail: "",
        accountPhone: "",
        accountUrl: "",
        ticketPlan: "",
        inputError: "",
        paypal_plan_id: "P-38K11886GW041664JL5JHRNA",
        paypal_plan_id_full: "",
        paypal_plan_id_discount: "",
        paypalExpress_client_id: "",
        paypalExpress_client_secret: ""
    });

    console.log("values: ", values)

    const [promoCodeDetails, setPromoCodeDetails] = useState({
        available: false,
        applied: false,
        input: false,
        errorMessage: "",
        appliedPromoCode: "",
        inputtedPromoValue: "",
        lastInvalidPromoCode: "",
        eventPromoCodes: [SUBSCRIPTION_PROMO_CODE],
      });

    // summary, organization, ticket, payment, receipt, paypal, completed, failedFetch
    const [pageView, setPageView] = useState("summary")
    const [preFetchView, setPreFetchView] = useState("")
    const [loading, setLoading ] = useState("false")

    //const [isDisabled, setIsDisabled] = useState(true)
    const { accountName, accountEmail, accountPhone, accountUrl, ticketPlan, paypal_plan_id, paypal_plan_id_full, paypal_plan_id_discount, paypalExpress_client_id, paypalExpress_client_secret } = values;

    const getStatus= () =>{ 
        let tempData = JSON.parse(localStorage.getItem("user"));
        console.log("tempData: ", tempData)
        if ('user' in tempData && 'accountId' in tempData.user && 'status' in tempData.user.accountId ) {
            console.log("tempData.data.accountId.status: ", tempData.user.accountId.status)
            return tempData.user.accountId.status
        } else {
            return 0;
        } 
    }
    
    let subscriptions;

    if (PAYPAL_USE_SANDBOX === true) {
        // SANBOX subscription plans
        console.log("sandbox subscription plans");
        subscriptions = {
            quarterly: {
                name: "$20 quarterly (1 quarter free trial)",
                id: "P-5DT364104U926810EL5FRXSY"
            },
            annually: {
                name: "$70 annually",
                id: "P-5YA13382D9271245EL5FRXTA"
            },
            quarterlyDiscounted: {
                name: "$10 quarterly (1 quarter free trial): discounted",
                id: "P-3U3085871T847894PL5FRXTI"
            },
            annuallyDiscounted: {
                name: "$35 annually: discounted",
                id: "P-6UY26644UT426184FL5FRXTI"
            },
            clientId: "AVtX1eZelPSwAZTeLo2-fyj54NweftuO8zhRW1RSHV-H7DpvEAsiLMjM_c14G2fDG2wuJQ1wOr5etzj7"
        }
    } else {
        // PRODUCTION subscription plans
        console.log("production subscription plans");
        subscriptions = {
            quarterly: {
                name: "$25 quarterly (1 quarter free trial)",
                id: "P-38K11886GW041664JL5JHRNA"
            },
            annually: {
                name: "$70 annually",
                id: "P-1TJ77997J0051064ML5JHRNI"
            },
            quarterlyDiscounted: {
                name: "$20 quarterly (1 quarter free trial): discounted",
                id: "P-0J204573U8254533LL5JHRNI"
            },
            annuallyDiscounted: {
                name: "$50 annually: discounted",
                id: "P-0CX6745565737532ML5JHRNQ"
            },
            clientId: "AYkP3Fg50QurkfBwfk7wL4DK8dHPras1f9IKca3IlUsmCm11I6VO4dXTUjZnPPEAhnVPTbRUZqj7vS3k"
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

    // edit so that it is driven by the "status" value
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
            if (tempUser.user.accountId.paypalExpress_client_id) tempBuyerInfo.paypalExpress_client_id = tempUser.user.accountId.paypalExpress_client_id;
            if (tempUser.user.accountId.paypalExpress_client_secret) tempBuyerInfo.paypalExpress_client_secret = tempUser.user.accountId.paypalExpress_client_secret;

            if (PAYPAL_USE_SANDBOX === true) {
                console.log("PAYPAL_USE_SANDBOX is ", PAYPAL_USE_SANDBOX, " Sandbox true");
                tempBuyerInfo.paypal_plan_id_full = "P-5DT364104U926810EL5FRXSY";
                tempBuyerInfo.paypal_plan_id_discount = "P-3U3085871T847894PL5FRXTI";
                if (!tempUser.user.accountId.paypal_plan_id) {
                    tempBuyerInfo.paypal_plan_id = "P-5DT364104U926810EL5FRXSY";
                } else {
                    tempBuyerInfo.paypal_plan_id = tempUser.user.accountId.paypal_plan_id;
                }   
            } else {
                console.log("PAYPAL_USE_SANDBOX is ", PAYPAL_USE_SANDBOX, " Sandbox false");
                tempBuyerInfo.paypal_plan_id_full = "P-38K11886GW041664JL5JHRNA";
                tempBuyerInfo.paypal_plan_id_discount = "P-0J204573U8254533LL5JHRNI";
                if (!tempUser.user.accountId.paypal_plan_id) {
                    tempBuyerInfo.paypal_plan_id = "P-38K11886GW041664JL5JHRNA";
                } else {
                    tempBuyerInfo.paypal_plan_id = tempUser.user.accountId.paypal_plan_id;
                }
            }

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

    const radioChangePayment = (event, value, name) => {
        let tempValues = { ...values };
        tempValues[name] = value.value;
        tempValues.paypal_plan_id = value.value;
        console.log("tempValues: ", tempValues)
        console.log("tempValues.paypal_plan_id: ", tempValues.paypal_plan_id)
        console.log("tempValues.paypal_plan_id_full: ", tempValues.paypal_plan_id_full)
        console.log("tempValues.paypal_plan_id_discount: ", tempValues.paypal_plan_id_discount)
        setValues(tempValues);
        console.log("values: ", values)
    };

    const ticketPlans = [
        { label: "Free Tickets: up to 500 free tickets per month", value: "free" },
        { label: "Paid Tickets: unlimited amount of paid and free tickets", value: "basicPaidQuarter" }
    ];

    const paymentPlans = [
        { label: subscriptions.quarterly.name, value: subscriptions.quarterly.id },
        { label: subscriptions.annually.name, value: subscriptions.annually.id }
    ];

    const discountPlans = [
        { label: subscriptions.quarterlyDiscounted.name, value: subscriptions.quarterlyDiscounted.id },
        { label: subscriptions.annuallyDiscounted.name, value: subscriptions.annuallyDiscounted.id }
    ];

    const shownPlans = () => {
        if(promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE) {
            return discountPlans;
        } else {
            return paymentPlans;
        }
    }

    const paymentPanel = () => {
        console.log("Values info: ", values)
        if(promoCodeDetails.appliedPromoCode === "CASHNOW") {
            console.log("PayPal info")
            return (
                <Aux>
                    <RadioForm
                        details={shownPlans()}
                        group="eventTypeGroup"
                        current={paypal_plan_id_discount}
                        change={(event, value) => {
                            console.log("Inside DISCOUNT Radio");
                            radioChangePayment(event, value, "paypal_plan_id_discount")
                        }}
                    />
                    <br></br>
                    {ticketPlan !== "free" && paypal_plan_id ? showPayPal : null}
                </Aux>
            )
        } else {
            console.log("Values info: ", values)
            return (
                <Aux>
                    <RadioForm
                        details={shownPlans()}
                        group="eventTypeGroup"
                        current={paypal_plan_id_full}
                        change={(event, value) => {
                            console.log("Inside FULL Radio");
                            radioChangePayment(event, value, "paypal_plan_id_full")
                        }}
                    />
                    <br></br>
                    {ticketPlan !== "free" && paypal_plan_id ? showPayPal : null}
                </Aux>
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
                                if(response.status) {
                                    console.log("response: ", response);
                                    console.log("fetch return got back data on organization:", response);
                                    let tempData = JSON.parse(localStorage.getItem("user"));
                                    console.log("tempData: ", tempData)
                                    tempData.user.accountId = response.result;
                                    localStorage.setItem("user", JSON.stringify(tempData));
                                    console.log("if portion of .then if-than-else")
                                    setPageView("receipt");
                                } else {
                                    console.log("else portion of .then if-than-else")
                                    setPageView("receiptErrorPage");
                                }
                            }) // add .catch block for failed response from server, press "continue" button to go to paypal clientId model
                            .catch((err)=>{
                                console.log(".catch portion of .then if-than-else")
                                setPageView("receiptErrorPage");
                            })
                        })
                        .catch((err)=>{
                            window.alert (
                                "Problem with Paypal."
                            )
                        })
                }}
                onError = {(err) => {
                    console.log("error occurs: ", err);
                    window.alert (
                        "Problem connecting with PayPal. Please try again."
                    )
                }}
                options = {{
                    clientId: subscriptions.clientId,
                    currency: "USD",
                    vault: true
                }}
                catchError = {err => {
                    console.log("error occurs: ", err);
                    window.alert (
                        "Problem connecting with PayPal. Please try again."
                    )
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
                    3 easy steps to start selling tickets and receiving your cash now!
                </div>
                <div style={{
                    border: "1px solid #2F5596",
                    backgroundColor: "#EFF3FA",
                    marginLeft: "180px",
                    marginRight: "180px",
                    paddingTop: "10px",
                    paddingBottom: "10px"
                }}>
                    <div className={classes.SummaryGridTitle}
                        style={{ fontWeight: "500"}}>
                        <div>Step 1</div>
                        <div>Step 2</div>
                        <div>Step 3</div>
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
                </div>
                <div className={classes.SummaryFooter}>
                    If you have 10 minutes to spare, you have time to sign up now.
                </div>
                
            <button
                style={{
                    border: "1px solid #000",
                    backgroundColor: "#008F00",
                    color: "#fff",
                    fontSize: "14px",
                    width: "630px",
                    height: "40px",
                    fontWeight: "500"
                }}
                onClick={() => {
                    setPageView("organization");
                }}
            >
                START EVENT CREATOR SIGNUP
            </button>
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
                    >Step 1: Basic Information about your Organization
                </div>
                <div className={classes.VendorCanvas}>
                    <div style={{fontSize: "16px", paddingTop: "20px", paddingBottom: "20px" }}>
                        Please provide us with the following pieces of information:
                    </div>
                    <div style={{paddingBottom: "20px", width: "420px", height: "85px"}}>
                        <label style={{width: "420px", fontSize: "15px"}}>
                            Company Name<span style={{color: "red"}}>*</span>
                        </label>
                        <input
                            onFocus={() => {
                                setValues({...values, inputError: ""});
                            }}
                            style={{
                                border: "1px solid #8DADD4",
                                borderRadius: "0px",
                                backgroundColor: "#EFF3FA",
                                width: "420px",
                                height: "40px",
                                paddingLeft: "10px"
                            }}
                            type="text"
                            name="accountName"
                            onChange={handleChange}
                            value={accountName}
                        />
                    </div>

                    <div style={{paddingBottom: "20px", width: "420px", height: "85px"}}>
                        <label style={{width: "420px", fontSize: "15px"}}>
                            Company E-mail Address
                        </label>
                        <input
                            onFocus={() => {
                                setValues({...values, inputError: ""});
                            }}
                            style={{
                                border: "1px solid #8DADD4",
                                borderRadius: "0px",
                                backgroundColor: "#EFF3FA",
                                width: "420px",
                                height: "40px",
                                paddingLeft: "10px"
                            }}
                            type="text"
                            name="accountEmail"
                            onChange={handleChange}
                            value={accountEmail}
                        />
                    </div>

                    <div style={{paddingBottom: "20px", width: "420px", height: "85px"}}>
                        <label style={{width: "420px", fontSize: "15px"}}>
                            Company Phone or Cell Number
                        </label>
                        <input
                            onFocus={() => {
                                setValues({...values, inputError: ""});
                            }}
                            style={{
                                border: "1px solid #8DADD4",
                                borderRadius: "0px",
                                backgroundColor: "#EFF3FA",
                                width: "420px",
                                height: "40px",
                                paddingLeft: "10px"
                            }}
                            type="text"
                            name="accountPhone"
                            onChange={handleChange}
                            value={accountPhone}
                        />
                    </div>

                    <div style={{paddingBottom: "20px", width: "420px", height: "85px"}}>
                        <label style={{width: "420px", fontSize: "15px"}}>
                            Company Website
                        </label>
                        <input
                            onFocus={() => {
                                setValues({...values, inputError: ""});
                            }}
                            style={{
                                border: "1px solid #8DADD4",
                                borderRadius: "0px",
                                backgroundColor: "#EFF3FA",
                                width: "420px",
                                height: "40px",
                                paddingLeft: "10px"
                            }}
                            type="text"
                            name="accountUrl"
                            onChange={handleChange}
                            value={accountUrl}
                        />
                    </div>
                    <br></br>
                    <div style={{textAlign: "center", width: "420px", height: "85px"}}>
                        <button
                            style={{
                                border: "1px solid #000",
                                backgroundColor: "#008F00",
                                color: "#fff",
                                fontSize: "14px",
                                width: "420px",
                                height: "40px",
                                fontWeight: "500"
                            }}
                            disabled={!accountName}
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
                            }}
                        >
                            SUBMIT YOUR COMPANY INFORMATION
                        </button>
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
                        >Step 2: Select a Ticket Plan
                    </div>
                    <div  className={classes.PaymentCanvas}>
                        <div
                            style={{
                                fontSize: "16px",
                                paddingTop: "20px",
                                paddingBottom: "20px"
                            }}>
                            Choose between our two ticket plans:
                        </div>
                            <RadioForm
                                details={ticketPlans}
                                group="eventTypeGroup"
                                current={ticketPlan}
                                change={(event, value) =>
                                    radioChange(event, value, "ticketPlan")
                                }
                            />
                        <br></br>
                        <br></br>
                        <div style={{textAlign: "center", width: "420px", height: "85px", paddingLeft: "1px"}}>
                            <button
                                style={{
                                    border: "1px solid #000",
                                    backgroundColor: "#008F00",
                                    color: "#fff",
                                    fontSize: "14px",
                                    width: "424px",
                                    height: "40px",
                                    fontWeight: "500"
                                }}

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
                            >
                                SUBMIT YOUR TICKET PLAN SELECTION
                            </button>
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
    if (promoCodeDetails.eventPromoCodes.includes(inputtedPromoCode)) {
        console.log("valid code");
        setPromoCodeDetails(
            amendPromoCodeDetails(inputtedPromoCode, promoCodeDetails)
        );
        let tempValues = {...values};
        tempValues.paypal_plan_id = tempValues.paypal_plan_id_discount
        setValues(tempValues)

    } else {
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
                    let tempValues = {...values};
                    tempValues.paypal_plan_id = tempValues.paypal_plan_id_full
                    setValues(tempValues)
              }}
            >
              Remove
            </span>
          </div>
          <br></br>
        </Aux>
      );
    } else if (promoCodeDetails.input) {
      return (
        <Aux>
          {inputPromoCode()}
          <br></br>
        </Aux>
      );
    } else if (!promoCodeDetails.input) {
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
                                >Step 2: Select a Subscription Plan
                            </div>
                            <div className={classes.PaymentCanvas}>
                            <div style={{fontSize: "16px", paddingTop: "20px", paddingBottom: "20px"}}>Choose a plan and submit your payment to PayPal:</div>
                                {promoOption()}
                                {paymentPanel()}
                            </div>
                            <div style={{textAlign: "center", paddingTop: "10px"}}>
                                <button
                                    style={{
                                        border: "1px solid #000",
                                        backgroundColor: "#2F5596",
                                        color: "#fff",
                                        fontSize: "14px",
                                        width: "424px",
                                        height: "40px",
                                        fontWeight: "500"
                                    }}
                                    onClick={() => {
                                        setPageView("ticket");
                                        console.log("pageView: ", pageView)
                                    }}
                                >
                                    BACK TO SELECT A TICKET PLAN
                                </button>
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
                                >Step 2: Payment Confirmation
                            </div>
                            <br></br>
                            <div style={{fontSize: "16px", paddingLeft: "80px", paddingTop: "20px", paddingBottom: "40px" }}>Thank you, your payment was successfully received by PayPal.</div>
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
                                        updatePageView();
                                        console.log("pageView: ", pageView)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )
            }

            const receiptErrorPage =()=>{
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
                                >Step 2: Payment Confirmation
                            </div>
                            <br></br>
                            <div style={{fontSize: "16px", paddingLeft: "80px", paddingTop: "20px", paddingBottom: "40px" }}>Thank you, your payment was successfully received by PayPal.</div>
                            <div style={{fontSize: "16px", paddingLeft: "80px", paddingTop: "20px", paddingBottom: "40px" }}>OSD is experiences delays in processing your payment.</div>
                            <div style={{fontSize: "16px", paddingLeft: "80px", color: "red", paddingTop: "20px", paddingBottom: "40px" }}>PLEASE DO NOT RESUBMIT A PAYMENT.</div>
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
                                >Step 2: Link Your Paypal Merchant Account 
                            </div>

                            <div  className={classes.PaypalCanvas}>
                                
                            <div style={{fontSize: "16px", paddingTop: "20px"}}>Please provide the ClientId and Secret from your PayPal merchant account.</div>
                            <div style={{fontSize: "16px", paddingTop: "20px"}}>These items are located in the "My Apps & Credentials" section of your
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
                            <div style={{fontSize: "16px", paddingTop: "20px", paddingBottom: "40px"}}>
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






                                <div style={{paddingBottom: "20px", width: "670px", height: "85px"}}>
                                    <label style={{width: "670px", fontSize: "15px"}}>
                                        Paypal Client ID{" "}<span style={{color: "red"}}>*{" "}</span>
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
                                        style={{
                                            border: "1px solid #8DADD4",
                                            borderRadius: "0px",
                                            backgroundColor: "#EFF3FA",
                                            width: "670px",
                                            height: "40px",
                                            paddingLeft: "10px"
                                        }}
                                        type="text"
                                        name="paypalExpress_client_id"
                                        onChange={handleChange}
                                        value={paypalExpress_client_id}
                                    />
                                </div>
                                <div>
                                    <label style={{width: "670px", fontSize: "15px"}}>
                                        Paypal Secret{" "}<span style={{color: "red"}}>*{" "}</span>
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
                                        style={{
                                            border: "1px solid #8DADD4",
                                            borderRadius: "0px",
                                            backgroundColor: "#EFF3FA",
                                            width: "670px",
                                            height: "40px",
                                            paddingLeft: "10px"
                                        }}
                                        type="text"
                                        name="paypalExpress_client_secret"
                                        onChange={handleChange}
                                        value={paypalExpress_client_secret}
                                    />
                                </div>
                            <div style={{textAlign: "center", paddingTop: "40px"}}>
                                <button
                                    style={{
                                        border: "1px solid #000",
                                        backgroundColor: "#008F00",
                                        color: "#fff",
                                        fontSize: "14px",
                                        width: "670px",
                                        height: "40px",
                                        fontWeight: "500"
                                    }}
                                    disabled={!paypalExpress_client_id || !paypalExpress_client_secret}
                                    onClick={() => {
                                        let url = `${API}/account/${props.userid}`;
                                        let fetcharg ={
                                            method: "PATCH",
                                            headers: myHeaders,
                                            body:JSON.stringify({
                                                useSandbox: PAYPAL_USE_SANDBOX,
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
                                >
                                    SUBMIT YOUR PAYPAL MERCHANT INFORMATION
                                </button>
                            </div>
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
                            >Step 3: Create an Event
                        </div>
                        <div className={classes.CompleteCanvas}>
                            <div className={classes.CompleteHeaderLine}>
                                Congratulations, you are now ready to create your first event.
                            </div>
                            <br></br>
                            <div style={{textAlign: "center"}}>
                                <button
                                    style={{
                                        border: "1px solid #000",
                                        backgroundColor: "#008F00",
                                        color: "#fff",
                                        fontSize: "14px",
                                        width: "324px",
                                        height: "40px",
                                        fontWeight: "500"
                                    }}
                                    onClick={() => {
                                        window.location.href = "/vendor";
                                    }}
                                >
                                    GET STARTED
                                </button>
                            </div>
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
                case ("receiptErrorPage"):   return receiptErrorPage();
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
            Event Creator Signup
            </div>

            {loading ? null : mainDisplay()}
        </div>
    )
}

export default Onboarding;