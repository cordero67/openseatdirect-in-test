import React, { useState } from "react";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import { Button, Popup } from "semantic-ui-react";


import RadioForm from "./RadioForm";

import classes from "./BuyerDashboard.module.css";

const VendorOnboarding = (props) => {
    const [values, setValues] = useState({
      name: "",
      email: "",
      phone: "",
      url: "",
      payment: "",
      paypalClient: "",
      paypalSecret: ""
    });

    const { name, email, phone, url, paypalClient, paypalSecret } = values;

    // "summary", "vendor", "paypal"
    const [pageView, setPageView] = useState("summary")
    
    const handleChange = (event) => {
        setValues({
        ...values,
        [event.target.name]: event.target.value
        });
    }

    

  const changePayment = (event, value, name) => {
    let tempValues = { ...values };
    tempValues[name] = value.payment;
    setValues(tempValues);
  };

  const paymentType = [
    { label: "Free Trial", value: "trial" },
    { label: "Subscription", value: "subscription" }
  ];

    const mainDisplay = () => {
        if (pageView === "summary") {
            return (
                <div className={classes.DisplayPanel}
                    style={{textAlign: "center"}}>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div style={{color: "#2F5596", fontSize: "26px", fontWeight: "600"}}>3 easy steps to start selling tickets and receive your cash now!!!</div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "240px 240px 240px",
                        columnGap: "60px",
                        paddingLeft: "75px",
                        fontSize: "22px",
                        fontWeight: "600",
                        textAlign: "center"}}>
                        <div>Step 1</div>
                        <div>Step 2</div>
                        <div>Step 3</div>
                    </div>
                    <br></br>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "240px 240px 240px",
                        columnGap: "60px",
                        paddingLeft: "75px",
                        fontSize: "18px",
                        fontWeight: "600",
                        textAlign: "center"}}>
                        <div>Provide Basic Information</div>
                        <div>Link your PayPal </div>
                        <div>Setup your first event</div>
                    </div>
                    <br></br>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "240px 240px 240px",
                        columnGap: "60px",
                        paddingLeft: "75px",
                        textAlign: "center"}}>
                        <div>Tell us about your organization and choose between a free trial or a payment plan.</div>
                        <div>Link your Paypal business account to your OSD account so that the money from all ticket sales instantly goes in to your Paypal account.</div>
                        <div>Create your first event and then watch all tickets sales go straight into your Paypal account.</div>
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div style={{color: "#2F5596", fontSize: "26px", fontWeight: "600"}}>If you have 10 minutes to spare, you have time to sign up now.</div>
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
                            padding: "0px",
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
                    <div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <div>Company Information</div>
                        <div>None of this information will be provided to any third party, ever.</div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <div  className={classes.BlankCanvas}>
                            <div className="form-group"
                                style={{
                                    paddingLeft: "30px"
                                }}
                            >
                                <label>Company or Organization Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    onChange={handleChange}
                                    value={name}
                                />
                            </div>
                            <br></br>
                            <div className="form-group"
                                style={{
                                    paddingLeft: "30px"
                                }}
                            >
                                <label>Company Email{" "}
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
                            <div className="form-group"
                                style={{
                                    paddingLeft: "30px"
                                }}
                            >
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
                            <div className="form-group"
                                style={{
                                    paddingLeft: "30px"
                                }}
                            >
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
                        <div>Payment Plan</div>
                        <br></br>
                    <RadioForm
                        details={paymentType}
                        group="eventTypeGroup"
                        current={values.payment}
                        change={(event, value) =>
                            changePayment(event, value, "payment")
                        }
                    />
                    <br></br>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "240px 240px 240px",
                            columnGap: "60px",
                            paddingLeft: "75px",
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
                                    setPageView("summary");
                                    console.log("pageView: ", pageView)
                                }}
                            />
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
                                content="Finish Later"
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
                                content="Continue"
                                onClick={() => {
                                    setPageView("paypal");
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
                        <br></br>
                        <div>Link your Paypal</div>
                        <div>None of this information will be provided to any third party, ever.</div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <div  className={classes.BlankCanvas}>
                            <div className="form-group"
                                style={{
                                    paddingLeft: "30px"
                                }}
                            >
                                <label>Paypal Client ID{" "}
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
                            <div className="form-group"
                                style={{
                                    paddingLeft: "30px"
                                }}
                            >
                                <label>Paypal Secret{" "}
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
                            <br></br>
                        </div>
                    <br></br>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "240px 240px 240px",
                            columnGap: "60px",
                            paddingLeft: "75px",
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
                                    setPageView("vendor");
                                    console.log("pageView: ", pageView)
                                }}
                            />
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
                                content="Finish Later"
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
                                content="Continue"
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
                    <div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <div>Congratulations</div>
                        <div>You have completed the onoarding process.</div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "240px 240px 240px",
                            columnGap: "60px",
                            paddingLeft: "75px",
                            textAlign: "center"}}>
                            <Button
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid blue",
                                    color: "blue",
                                    fontSize: "16px",
                                    height: "30px",
                                    width: "150px",
                                    margin: "auto",
                                    textAlign: "center",
                                    padding: "0px",
                                }}
                                content="Edit Information"
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
                                    width: "150px",
                                    height: "30px",
                                    margin: "auto",
                                    textAlign: "center",
                                    padding: "0px",
                                }}
                                content="Create an Event"
                                onClick={() => {
                                    setPageView("complete");
                                    console.log("pageView: ", pageView)
                                }}
                            />
                            <Button
                                style={{
                                    backgroundColor: 'white',
                                    border: "1px solid red",
                                    color: "red",
                                    fontSize: "16px",
                                    height: "30px",
                                    width: "150px",
                                    margin: "auto",
                                    textAlign: "center",
                                    padding: "0px",
                                }}
                                content="Create Later"
                                onClick={() => {
                                    setPageView("summary");
                                    console.log("pageView: ", pageView)
                                }}
                            />
                        </div>
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

  */