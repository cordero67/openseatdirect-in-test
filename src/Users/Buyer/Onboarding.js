import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import { useOurApi } from "./apiUsers";
import { API } from "../../config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import { Button, Popup } from "semantic-ui-react";

import { PayPalButton } from "react-paypal-button-v2";

import RadioForm from "./RadioForm";

import classes from "./BuyerDashboard.module.css";

let passThrough = true;

const Onboarding = (props) => {
    const [values, setValues] = useState({
      accountName: "",
      accountEmail: "",
      accountPhone: "",
      accountUrl: "",
      ticketPlan: "",
      paypalClient: "",
      paypalSecret: ""
    });

    const { accountName, accountEmail, accountPhone, accountUrl, ticketPlan, paypalClient, paypalSecret } = values;

    // summary, organization, ticket, payment, receipt, paypal, completed
    const [pageView, setPageView] = useState("summary")
    const [loading, setLoading ] = useState("false")

    // api static variables
    let  myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const authstring = `Bearer ${props.token}`;
    myHeaders.append("Authorization", authstring);
    const url = `${API}/account/${props.userid}`;

    const method = "POST";
    const body  = null;
    let initialData ={status: true, message:"hi first time"};

    const { isLoading, hasError, setUrl, setBody, setMethod, data, networkError} = useOurApi(method, url, myHeaders, body, initialData);
  
    const sysmessage = networkError ? "NetworkError...please check your connectivity": "SYSTEM ERROR - please try again";

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

    useEffect(() => {
        setLoading(true);
        if (typeof window !== "undefined" && localStorage.getItem(`user`) !== null) {
            if (getStatus() >= 4) {
                updateValues();
            }
            updatePageView();
        } else {
          window.location.href = "/signin";
        }
        setLoading(false);
      }, []);

    // need to work on this code to handle fetch responses
    if (data.status && data.message === "vendor Account updated!") {
        console.log("in side response code, responce data: ", data);
        console.log("in side response code, initialData: ", initialData);

        if(passThrough) {
            console.log("passsed")
            if (pageView === "organization") {
                setPageView("ticket");
            } else if (pageView === "ticket") {
                setPageView("completed");
            } else if (pageView === "paypal") {
                setPageView("completed");
            }
        } else {
            console.log("stopped")
        }
        passThrough=false;
        
    } else if (!data.status) {
        console.log("server determined error")
        passThrough=false;
    }
    //

    const updateValues = () => {
        let tempUser = JSON.parse(localStorage.getItem("user"));
        if ('user' in tempUser ) {
            let tempBuyerInfo = {};
            if (tempUser.user.name) tempBuyerInfo.accountName = tempUser.user.name;
            if (tempUser.user.email) tempBuyerInfo.accountEmail = tempUser.user.email;
            if ('accountId' in tempUser.user) {
                if (tempUser.user.accountId.accountPhone) tempBuyerInfo.accountPhone = tempUser.user.accountId.accountPhone;
                if (tempUser.user.accountId.accountUrl) tempBuyerInfo.accountUrl = tempUser.user.accountId.accountUrl;
                if (tempUser.user.accountId.status) tempBuyerInfo.status = tempUser.user.accountId.status;
                if (tempUser.user.accountId.ticketPlan) tempBuyerInfo.ticketPlan = tempUser.user.accountId.ticketPlan;
                if (tempUser.user.accountId.paypalExpress_client_id) tempBuyerInfo.paypalClient = tempUser.user.accountId.paypalExpress_client_id;
                if (tempUser.user.accountId.paypalExpress_client_secret) tempBuyerInfo.paypalSecret = tempUser.user.accountId.paypalExpress_client_secret;
            }
            setValues(tempBuyerInfo);
        }
    }

    const updatePageView = () =>{
        if (getStatus() === 0) {
            setPageView("summary")
        } else if (getStatus() === 4) {
            setPageView("ticket")
        } else if (getStatus() === 5) {
            setPageView("paypal")
        } else if (getStatus() === 6) {
            setPageView("paypal")
        } else if (getStatus() === 7) {
            return <Redirect to="/vendordashboard" />;
        };
    }

    const handleChange = (event) => {
        setValues({
        ...values,
        [event.target.name]: event.target.value
        });
    }

    const radioChange = (event, value, name) => {
        let tempValues = { ...values };
        tempValues[name] = value.value;
        setValues(tempValues);
    };

    const ticketPlans = [
        { label: "Free tickets only", value: "free" },
        { label: "Paid (and free) tickets", value: "basicPaidQuarter" }
    ];

    const paymentPlans = [
        { label: "$10 every 3 months", value: "basicPaidQuarter" },
        { label: "$35 for one full year", value: "basicPaidAnnual" }
    ];

// change plan_id value to be a variable value depending on $10 or $35 choice, right now its the same
  const showPayPal = (
    <div>
        <br></br>
        <PayPalButton
            onButtonReady = {() => {}}
            createSubscription={(data, actions) => {
                return actions.subscription.create({
                plan_id: 'P-9HN388280G366532JL4RGF5A'
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
                            .then(response => {// first show a success model with a continue button to go to paypal clientId model 
                                setPageView("paypal")
                                //return response.json();
                        }) // add .catch block for failed response from server, press "continue" button to go to paypal clientId model
                })

            }}
            onError = {(err) => 
                console.log("error occurs: ", err)
            }
            options = {{
                clientId: "AVtX1eZelPSwAZTeLo2-fyj54NweftuO8zhRW1RSHV-H7DpvEAsiLMjM_c14G2fDG2wuJQ1wOr5etzj7",
                currency: "USD",
                vault: true
            }}
            catchError = {err => {
                console.log("catchError 'err': ", err);
            }}
        />
    </div>
  );

    const mainDisplay = () => {
        if (!loading) {
            console.log("event is NOT loading")
            if (pageView === "summary") {
                return (
                    <div className={classes.DisplayPanel}
                        style={{textAlign: "center"}}>
                        <div className={classes.SummaryHeader}>
                            3 easy steps to start selling tickets and receiving your cash now!!!
                        </div>
                        <div className={classes.SummaryGrid}
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
            } else if (pageView === "organization") {
                return (
                    <div className={classes.DisplayPanel}>
                        <br></br>
                        <br></br>
                        <div
                            style={{
                                paddingLeft: "80px",
                                fontSize: "22px",
                                fontWeight: "600"
                            }}
                            >STEP 1: Basic Information about your Organization
                        </div>
                        <div style={{paddingLeft: "80px", paddingTop: "20px", paddingBottom: "40px", color: "red" }}>Explanation text.</div>
                        <div className={classes.VendorCanvas}>
                            <div className="form-group">
                                <label>Company Name{" "}<span style={{color: "red"}}>*</span></label>
                                <input
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
                                    type="text"
                                    name="accountUrl"
                                    className="form-control"
                                    onChange={handleChange}
                                    value={accountUrl}
                                />
                            </div>
                        </div>
                        <br></br>
                        <br></br>
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
                                    content="Submit"
                                    onClick={() => {
                                        passThrough=true;
                                        setBody({
                                            accountName: accountName,
                                            accountEmail: accountEmail,
                                            accountPhone: accountPhone,
                                            accountUrl: accountUrl
                                        })
                                        if (getStatus() === 0) {
                                            setMethod("POST")
                                        } else {
                                            setMethod("PATCH")
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )
            } else if (pageView === "ticket") {
                return (
                    <div className={classes.DisplayPanel}>
                        <div>
                            <div
                                style={{
                                    paddingLeft: "80px",
                                    paddingTop: "40px",
                                    fontSize: "22px",
                                    fontWeight: "600"
                                }}
                                >STEP 2: Select a Ticket Plan
                            </div>
                            <div style={{paddingLeft: "80px", paddingTop: "20px", color: "red" }}>Explanation text.</div>
                            <div style={{paddingLeft: "80px", paddingTop: "20px", color: "red" }}>What you can do with free tickets only plan. Up to X number of free tickets per month/year.</div>
                            <div style={{paddingLeft: "80px", paddingTop: "20px", paddingBottom: "40px", color: "red" }}>What you can do with free and paid tickets plan.</div>
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
                            <br></br>
                            <br></br>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "255px 255px",
                                paddingLeft: "245px",
                                textAlign: "center"}}>
                                <Button className={classes.OrganizationButton}
                                    style={{
                                        backgroundColor: 'white',
                                        border: "1px solid blue",
                                        color: "blue",
                                        padding: "0px",
                                    }}
                                    content="Back"
                                    onClick={() => {
                                        setPageView("organization");
                                        console.log("pageView: ", pageView)
                                    }}
                                />
                                <Button className={classes.OrganizationButton}
                                    style={{
                                        backgroundColor: 'white',
                                        border: "1px solid green",
                                        color: "green",
                                        padding: "0px"
                                    }}
                                    content="Submit"
                                    disabled={!ticketPlan}
                                    onClick={() => {
                                        if (ticketPlan === "free") {
                                            passThrough=true;
                                            setBody({
                                                ticketPlan: ticketPlan
                                            })
                                            setMethod("PATCH")
                                        } else {
                                            setPageView("payment");
                                        }
                                    }}
                                />
                            </div>
                            <br></br>
                            <br></br>
                        </div>
                    </div>
                )
            } else if (pageView === "payment") {
                return (
                    <div className={classes.DisplayPanel}>
                        <div>
                            <br></br>
                            <br></br>
                            <div
                                style={{
                                    paddingLeft: "80px",
                                    fontSize: "22px",
                                    fontWeight: "600"
                                }}
                                >STEP 2: Choose a Payment Plan
                            </div>
                            <div style={{paddingLeft: "80px", paddingTop: "20px", paddingBottom: "40px", color: "red" }}>Explanation text.</div>
                            <div  className={classes.PaymentCanvas}>
                                <RadioForm
                                    details={paymentPlans}
                                    group="eventTypeGroup"
                                    current={ticketPlan}
                                    change={(event, value) =>
                                        radioChange(event, value, "ticketPlan")
                                    }
                                />
                            <br></br>
                            {ticketPlan === "basicPaidQuarter" || ticketPlan === "basicPaidAnnual" ? showPayPal : null}
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
            } else if (pageView === "paypal") {
                return (
                    <div className={classes.DisplayPanel}>
                        <div>
                            <div
                                style={{
                                    paddingLeft: "80px",
                                    paddingTop: "40px",
                                    fontSize: "22px",
                                    fontWeight: "600"
                                }}
                                >STEP 2: Link Your Paypal Account 
                            </div>
                            <div style={{paddingLeft: "80px", paddingTop: "20px", color: "red" }}>Explanation text. This is how you can get paid immediately upon each ticket sale, etc...</div>
                            <div style={{paddingLeft: "80px", paddingTop: "20px", color: "red" }}>Link to video.</div>
                            <div style={{paddingLeft: "80px", paddingTop: "20px", paddingBottom: "40px", color: "red" }}>Link to word document.</div>
                            <div  className={classes.VendorCanvas}>
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
                                        type="text"
                                        name="paypalClient"
                                        className="form-control"
                                        onChange={handleChange}
                                        value={paypalClient}
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
                                        type="text"
                                        name="paypalSecret"
                                        className="form-control"
                                        onChange={handleChange}
                                        value={paypalSecret}
                                    />
                                </div>
                            </div>
                            <br></br>
                            <br></br>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "170px 170px",
                                paddingLeft: "325px",
                                textAlign: "center"}}>
                                <Button className={classes.OrganizationButton}
                                    style={{
                                        backgroundColor: 'white',
                                        border: "1px solid blue",
                                        color: "blue",
                                        padding: "0px",
                                    }}
                                    content="Back"
                                    onClick={() => {
                                        setPageView("payment");
                                        console.log("pageView: ", pageView)
                                    }}
                                />
                                <Button className={classes.OrganizationButton}
                                    style={{
                                        backgroundColor: 'white',
                                        border: "1px solid green",
                                        color: "green",
                                        padding: "0px"
                                    }}
                                    content="Submit"
                                    onClick={() => {
                                        passThrough=true;
                                        setBody({
                                            useSandbox: true,
                                            paymentGatewayType: "PayPalExpress",
                                            paypalExpress_client_id: paypalClient,
                                            paypalExpress_client_secret: paypalSecret
                                        })
                                        setMethod("PATCH")
                                    }}
                                />
                            </div>
                            <br></br>
                            <br></br>
                        </div>
                    </div>
                )
            } else if (pageView === "completed") {
                return (
                    <div className={classes.DisplayPanel}>
                        <div
                            style={{
                                paddingLeft: "80px",
                                paddingTop: "40px",
                                fontSize: "22px",
                                fontWeight: "600"
                            }}
                            >STEP 3: Create an Event
                        </div>
                        <div className={classes.SummaryHeader}>
                            Congratulations, you are now ready to create your first event!!!
                        </div>
                        <div style={{textAlign: "center", color: "red"}}>Summary of OSD benefits: cash now, control information, single dashboard.</div>
                        <div className={classes.CompleteGrid}>
                            <div>Cash Now!!!</div>
                            <div>Own Your Data</div>
                            <div>Single Dashboard</div>
                        </div>
                        <div className={classes.CompleteLowerGrid}>
                            <div style={{ color: "red" }}>Cash Now summary.</div>
                            <div style={{ color: "red" }}>Own Your Data summary.</div>
                            <div style={{ color: "red" }}>Single Dashboard summary.</div>
                        </div>

                        <div className={classes.SummaryHeader}>
                        So are you ready to create your first event?
                        </div>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "170px 170px",
                            paddingLeft: "325px",
                            textAlign: "center"}}>
                            <Button className={classes.OrganizationButton}
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid red",
                                    color: "red",
                                    padding: "0px",
                                }}
                                content="Yes"
                                onClick={() => {
                                    //setPageView("organization");
                                }}
                            />
                            <Button className={classes.OrganizationButton}
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid green",
                                    color: "green",
                                    padding: "0px",
                                }}
                                content="Later"
                                onClick={() => {
                                }}
                            />
                        </div>
                    </div>
                )
            }
        } else {
            console.log("event IS loading");
            return <div>Nothing to</div>
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




/*
    const paypalSubscriptionPurchase = data => {
        //details.purchase_units[0].items = paypalArray;
        console.log("Inside paypalSubscriptionPurchase")
        const paymentData = {
        subscriptionOrderData: data
        //data
        };

        //setPaypalStatus(true);
        //console.log("paypalStatus inside 'paypalSubscriptionPurchase': ", paypalStatus);
        //console.log("On Success 'details' object: ", details);
        // sends PayPal order object to the server
        paypalSubscriptionDetails(paymentData, props.userid, props.token)
        .then(response => {
            console.log("order received");
            console.log("response: ", response);
            //setOrderStatus(true);
            //console.log("Order status: ", orderStatus);
            //onlyShowPurchaseConfirmation();
            //purchaseConfirmHandler();
        })
        .catch(error => {
            console.log("processExpressPayment() error.message: ", error.message);
            //onlyShowPurchaseConfirmation();
            //purchaseConfirmHandler();
        });
    };
*/