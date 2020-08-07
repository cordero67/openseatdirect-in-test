import React, { useState } from "react";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import { Button, Popup } from "semantic-ui-react";

import { PayPalButton } from "react-paypal-button-v2";

import RadioForm from "./RadioForm";

import classes from "./BuyerDashboard.module.css";

const VendorOnboarding = (props) => {
    const [values, setValues] = useState({
      name: "",
      email: "",
      phone: "",
      url: "",
      ticketPlan: "",
      paymentPlan: "",
      paypalClient: "",
      paypalSecret: ""
    });

    const { name, email, phone, url, ticketPlan, paymentPlan, paypalClient, paypalSecret } = values;

    const [pageView, setPageView] = useState("summary")
    
    const handleChange = (event) => {
        setValues({
        ...values,
        [event.target.name]: event.target.value
        });
    }

    const radioChange = (event, value, name) => {
        console.log("name", name)
        console.log("value", value.value)
        let tempValues = { ...values };
        tempValues[name] = value.value;
        console.log("tempValues.payment: ", tempValues.payment)
        setValues(tempValues);
    };

    const ticketPlans = [
        { label: "Free tickets only", value: "free" },
        { label: "Free and paid tickets", value: "paid" }
    ];

    const paymentPlans = [
        { label: "$10 every 3 months", value: "quarter" },
        { label: "$35 for one full year", value: "annual" }
    ];

  const showPayPal = (
    // loads PayPal Smart buttons if order exists
    <div>
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
        onSuccess = {(details, data) => {
            console.log("successful transaction");
            //payPalExpressBuy(details);
        }}
        onError = {(err) => 
            console.log("error occurs: ", err)
        }
        options = {{
            clientId: "AVtX1eZelPSwAZTeLo2-fyj54NweftuO8zhRW1RSHV-H7DpvEAsiLMjM_c14G2fDG2wuJQ1wOr5etzj7",
            currency: "USD",
            vault: true
            //currency: orderTotals.currencyAbv
        }}
        catchError = {err => {
            console.log("catchError 'err': ", err);
            //setTransactionStatus({
            //  ...transactionStatus,
            //  paypalSuccess: false,
            //  error: err
            //});
            //onlyShowPurchaseConfirmation();
        }}
        />
    </div>
  );

    const mainDisplay = () => {
        if (pageView === "summary") {
            return (
                <div className={classes.DisplayPanel}
                    style={{textAlign: "center"}}>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div style={{color: "#2F5596", fontSize: "26px", fontWeight: "600"}}>
                        3 easy steps to start selling tickets and receiving your cash now!!!
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "240px 240px 240px",
                        columnGap: "60px",
                        paddingLeft: "75px",
                        paddingBottom: "30px",
                        fontSize: "24px",
                        fontWeight: "600",
                        textAlign: "center"
                    }}>
                        <div>STEP 1</div>
                        <div>STEP 2</div>
                        <div>STEP 3</div>
                    </div>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "240px 240px 240px",
                        columnGap: "60px",
                        paddingLeft: "75px",
                        paddingBottom: "10px",
                        fontSize: "22px",
                        fontWeight: "400",
                        textAlign: "center"}}>
                        <div>Provide Minimal</div>
                        <div>Select a</div>
                        <div>Create Your</div>
                    </div>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "240px 240px 240px",
                        columnGap: "60px",
                        paddingLeft: "75px",
                        fontSize: "22px",
                        fontWeight: "400",
                        textAlign: "center"}}>
                        <div>Organization Info</div>
                        <div>Ticket Plan</div>
                        <div>First Event</div>
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div style={{
                        color: "#2F5596",
                        fontSize: "26px",
                        fontWeight: "600"
                    }}>
                        If you have 10 minutes to spare, you have time to sign up now.
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Button
                        style={{
                            backgroundColor: 'white',
                            border: "1px solid green",
                            color: "green",
                            fontSize: "16px",
                            width: "90px",
                            height: "30px",
                            margin: "auto",
                            textAlign: "center",
                            padding: "0px"
                        }}
                        content="Start"
                        onClick={() => {
                            setPageView("vendor");
                            console.log("pageView: ", pageView)
                        }}
                    />
                </div>
            )
        } else if (pageView === "vendor") {
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
                        <br></br>
                        <div style={{paddingLeft: "80px", color: "red" }}>Explanation text.</div>
                        <br></br>
                        <br></br>
                        <div  className={classes.VendorCanvas}>
                            <div className="form-group">
                                <label>Name{" "}<span style={{color: "red"}}>*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    onChange={handleChange}
                                    value={name}
                                />
                            </div>
                            <br></br>
                            <div className="form-group">
                                <label>Company Email{" "}<span style={{color: "red"}}>*{" "}</span>
                                <Popup
                                    position="right center"
                                    content="This email will only be used..."
                                    header="Company Email"
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
                                    name="email"
                                    className="form-control"
                                    onChange={handleChange}
                                    value={email}
                                />
                            </div>
                            <br></br>
                            <div className="form-group">
                                <label>Company Phone or Cell Number{" "}
                                <Popup
                                    position="right center"
                                    content="This number will only be used..."
                                    header="Phone/Cell Number"
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
                                    name="phone"
                                    className="form-control"
                                    onChange={handleChange}
                                    value={phone}
                                />
                            </div>
                            <br></br>
                            <div className="form-group">
                                <label>Company Website</label>
                                <input
                                    type="text"
                                    name="url"
                                    className="form-control"
                                    onChange={handleChange}
                                    value={url}
                                />
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "255px 255px",
                            paddingLeft: "245px",
                            textAlign: "center"}}>
                            <Button
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid blue",
                                    color: "blue",
                                    fontSize: "16px",
                                    height: "30px",
                                    width: "120px",
                                    margin: "auto",
                                    textAlign: "center",
                                    padding: "0px",
                                }}
                                content="Back"
                                onClick={() => {
                                    setPageView("summary");
                                    console.log("pageView: ", pageView)
                                }}
                            />
                            <Button
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid green",
                                    color: "green",
                                    fontSize: "16px",
                                    width: "120px",
                                    height: "30px",
                                    margin: "auto",
                                    textAlign: "center",
                                    padding: "0px",
                                }}
                                content="Next"

                                disabled={!name || !email || !phone || !url}
                                onClick={() => {
                                    if (ticketPlan) {
                                        setPageView("review")
                                    } else if (!ticketPlan) {
                                        setPageView("ticket")
                                    }
                                }}
                            />
                        </div>
                </div>
            )
        } else if (pageView === "ticket") {
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
                            >STEP 2: Select a Ticket Plan
                        </div>
                        <br></br>
                        <div style={{paddingLeft: "80px", color: "red" }}>Explanation text.</div>
                        <br></br>
                        <div style={{paddingLeft: "80px", color: "red" }}>What you can do with free tickets only plan. Up to X number of free tickets per month/year.</div>
                        <br></br>
                        <div style={{paddingLeft: "80px", color: "red" }}>What you can do with free and paid tickets plan.</div>
                        <br></br>
                        <br></br>
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
                            <Button
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid blue",
                                    color: "blue",
                                    fontSize: "16px",
                                    height: "30px",
                                    width: "120px",
                                    margin: "auto",
                                    textAlign: "center",
                                    padding: "0px",
                                }}
                                content="Back"
                                onClick={() => {
                                    setPageView("vendor");
                                    console.log("pageView: ", pageView)
                                }}
                            />
                            <Button
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid green",
                                    color: "green",
                                    fontSize: "16px",
                                    width: "120px",
                                    height: "30px",
                                    margin: "auto",
                                    textAlign: "center",
                                    padding: "0px",
                                }}
                                content="Next"
                                
                                disabled={!ticketPlan}
                                onClick={() => {
                                    if (ticketPlan === "free") {
                                        setPageView("review");
                                    } else if (ticketPlan === "paid") {
                                        setPageView("paypal");
                                    }
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
                        <br></br>
                        <br></br>
                        <div
                            style={{
                                paddingLeft: "80px",
                                fontSize: "22px",
                                fontWeight: "600"
                            }}
                            >STEP 2: Link Your Paypal Account 
                        </div>
                        <br></br>
                        <div style={{paddingLeft: "80px", color: "red" }}>Explanation text. This is how you can get paid immediately upon each ticket sale, etc...</div>
                        <br></br>
                        <div style={{paddingLeft: "80px", color: "red" }}>Link to video.</div>
                        <br></br>
                        <div style={{paddingLeft: "80px", color: "red" }}>Link to word document.</div>
                        <br></br>
                        <br></br>
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
                            gridTemplateColumns: "255px 255px",
                            paddingLeft: "245px",
                            textAlign: "center"}}>
                            <Button
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid blue",
                                    color: "blue",
                                    fontSize: "16px",
                                    height: "30px",
                                    width: "120px",
                                    margin: "auto",
                                    textAlign: "center",
                                    padding: "0px",
                                }}
                                content="Back"
                                onClick={() => {
                                    setPageView("ticket");
                                    console.log("pageView: ", pageView)
                                }}
                            />
                            <Button
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid green",
                                    color: "green",
                                    fontSize: "16px",
                                    width: "120px",
                                    height: "30px",
                                    margin: "auto",
                                    textAlign: "center",
                                    padding: "0px",
                                }}
                                content="Next"
                                disabled={!paypalClient || !paypalSecret}
                                onClick={() => {
                                    setPageView("payment");
                                    console.log("pageView: ", pageView)
                                }}
                            />
                        </div>
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
                        <br></br>
                        <div style={{paddingLeft: "80px", color: "red" }}>Explanation text.</div>
                        <br></br>
                        <br></br>
                        <div  className={classes.PaymentCanvas}>
                            <RadioForm
                                details={paymentPlans}
                                group="eventTypeGroup"
                                current={paymentPlan}
                                change={(event, value) =>
                                    radioChange(event, value, "paymentPlan")
                                }
                            />
                        <br></br>
                        {paymentPlan === "quarter" || paymentPlan === "annual" ? showPayPal : null}
                        </div>
                        <br></br>
                        <br></br>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "255px 255px",
                            paddingLeft: "245px",
                            textAlign: "center"}}>
                            <Button
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid blue",
                                    color: "blue",
                                    fontSize: "16px",
                                    height: "30px",
                                    width: "120px",
                                    margin: "auto",
                                    textAlign: "center",
                                    padding: "0px",
                                }}
                                content="Previous Page"
                                onClick={() => {
                                    setPageView("paypal");
                                    console.log("pageView: ", pageView)
                                }}
                            />
                            <Button
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid green",
                                    color: "green",
                                    fontSize: "16px",
                                    width: "120px",
                                    height: "30px",
                                    margin: "auto",
                                    textAlign: "center",
                                    padding: "0px",
                                }}
                                content="Next"
                                onClick={() => {
                                    setPageView("review");
                                    console.log("pageView: ", pageView)
                                }}
                            />
                        </div>
                    </div>
                </div>
            )
        } else if (pageView === "review") {
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
                            >Final Review
                        </div>
                        <div style={{paddingLeft: "80px"}}>Please review your input before submitting.</div>
                        <br></br>
                        <br></br>
                        <div  className={classes.CompleteCanvas}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "200px 350px",
                                paddingBottom: "10px",
                                columnGap: "20px"}}>
                                <div>Company Name:</div>
                                <div>{name}</div>
                            </div>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "200px 350px",
                                paddingBottom: "10px",
                                columnGap: "20px"}}>
                                <div>Company Email:</div>
                                <div>{email}</div>
                            </div>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "200px 350px",
                                paddingBottom: "10px",
                                columnGap: "20px"}}>
                                <div>Company Phone Number:</div>
                                <div>{phone}</div>
                            </div>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "200px 350px",
                                paddingBottom: "10px",
                                columnGap: "20px"}}>
                                <div>Company Website:</div>
                                <div>{url}</div>
                            </div>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "200px 350px",
                                paddingBottom: "10px",
                                columnGap: "20px"}}>
                                <div>Ticket Plan:</div>
                                <div>{ticketPlan}</div>
                            </div>
                            {ticketPlan === "paid" ? (
                                <Aux>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "200px 350px",
                                        paddingBottom: "10px",
                                        columnGap: "20px"}}>
                                        <div>Payment Plan:</div>
                                        <div>{paymentPlan}</div>
                                    </div>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "200px 350px",
                                        paddingBottom: "10px",
                                        columnGap: "20px"}}>
                                        <div>Paypal Client ID:</div>
                                        <div>{paypalClient}</div>
                                    </div>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "200px 350px",
                                        paddingBottom: "10px",
                                        columnGap: "20px"}}>
                                        <div>Paypal Secret:</div>
                                        <div>{paypalSecret}</div>
                                    </div>
                                </Aux>
                            ) : null}
                        </div>
                        <br></br>
                        <br></br>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "170px 170px",
                            paddingLeft: "325px",
                            textAlign: "center"}}>
                            <Button
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid red",
                                    color: "red",
                                    fontSize: "16px",
                                    height: "30px",
                                    width: "120px",
                                    margin: "auto",
                                    textAlign: "center",
                                    padding: "0px",
                                }}
                                content="Edit"
                                onClick={() => {
                                    setPageView("vendor");
                                    console.log("pageView: ", pageView)
                                }}
                            />
                            <Button
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid green",
                                    color: "green",
                                    fontSize: "16px",
                                    width: "120px",
                                    height: "30px",
                                    margin: "auto",
                                    textAlign: "center",
                                    padding: "0px",
                                }}
                                content="Submit"
                                onClick={() => {
                                    setPageView("complete");
                                    console.log("pageView: ", pageView)
                                }}
                            />
                        </div>
                    </div>
                </div>
            )
        } else if (pageView === "complete") {
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
                        >STEP 3: Create an Event
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div style={{color: "#2F5596", fontSize: "26px", fontWeight: "600", textAlign: "center"}}>
                        Congratulations, you are now ready to create your first event!!!
                    </div>
                    <br></br>
                    <div style={{textAlign: "center"}}>Summary of OSD benefits: cash now, control information, single dashboard.</div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "200px 200px 200px",
                        columnGap: "100px",
                        paddingLeft: "95px",
                        fontSize: "22px",
                        fontWeight: "600",
                        textAlign: "center"}}>
                        <div>Cash Now!!!</div>
                        <div>Own Your Data</div>
                        <div>Single Dashboard</div>
                    </div>
                    <br></br>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "200px 200px 200px",
                        columnGap: "100px",
                        paddingLeft: "95px",
                        fontSize: "16px",
                        textAlign: "center"}}
                    >
                        <div style={{ color: "red" }}>Cash Now summary.</div>
                        <div style={{ color: "red" }}>Own Your Data summary.</div>
                        <div style={{ color: "red" }}>Single Dashboard summary.</div>
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div style={{
                        color: "#2F5596",
                        fontSize: "26px",
                        fontWeight: "600",
                        textAlign: "center"
                    }}>
                        So are you ready to create your first event?
                    </div>
                    <br></br>
                    <br></br>
                        <br></br>
                        <br></br>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "170px 170px",
                            paddingLeft: "325px",
                            textAlign: "center"}}>
                            <Button
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid red",
                                    color: "red",
                                    fontSize: "16px",
                                    height: "30px",
                                    width: "120px",
                                    margin: "auto",
                                    textAlign: "center",
                                    padding: "0px",
                                }}
                                content="Yes"
                                onClick={() => {
                                    //setPageView("vendor");
                                    //console.log("pageView: ", pageView)
                                }}
                            />
                            <Button
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid green",
                                    color: "green",
                                    fontSize: "16px",
                                    width: "120px",
                                    height: "30px",
                                    margin: "auto",
                                    textAlign: "center",
                                    padding: "0px",
                                }}
                                content="Later"
                                onClick={() => {
                                    //setPageView("complete");
                                    //console.log("pageView: ", pageView)
                                }}
                            />
                        </div>
                </div>
            )
        }
    }

    return (
        <div>
            <div className={classes.DisplayPanelTitle}>
            VENDOR SIGNUP
            </div>
            {mainDisplay()}
        </div>
    )
}

export default VendorOnboarding;

/*

                    <br></br>
                    <br></br>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "200px 200px 200px",
                        columnGap: "100px",
                        paddingLeft: "95px",
                        textAlign: "center"}}
                    >
                        <div>Select between offering free or paid tickets.</div>
                        <div>Provide minimal information about your organization.</div>
                        <div>Create your first event and offer tickets.</div>
                    </div>
                    */