import React, { useState, useRef } from "react";

import classes from "./EventCreation.module.css";
import Aux from "../hoc/Auxiliary/Auxiliary";
import { Popup } from "semantic-ui-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";

const priceFeatureSettings = (props) => {
    if (props.ticket.priceFeature === "none") {
      return (
        <Aux>
          <div
            style={{
              height: "35px",
              fontSize: "15px",
              backgroundColor: "#E7E7E7",
              borderTop: "1px solid lightgrey",
              boxSizing: "borderBox",
            }}
          >
            <div
              style={{
                padding: "10px 10px 0px 25px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Promotional Pricing (
              <span style={{ fontStyle: "italic" }}>optional </span>): please
              select one
            </div>
          </div>
          <div
            style={{
              padding: "5px 10px 0px 30px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "30px",
            }}
          >
            <button
              className={classes.PriceFeatureButton}
              onClick={(event) =>
                props.changeFeature(event, "promo", props.ticket.key)
              }
            >
              Promo Code(s)
            </button>
          </div>
          <div
            style={{
              padding: "5px 10px 0px 30px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "30px",
            }}
          >
            <button
              className={classes.PriceFeatureButton}
              onClick={(event) =>
                props.changeFeature(event, "bogof", props.ticket.key)
              }
            >
              Buy One Get One Free
            </button>
          </div>
          <div
            style={{
              padding: "5px 10px 0px 30px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "30px",
            }}
          >
            <button
              className={classes.PriceFeatureButton}
              onClick={(event) =>
                props.changeFeature(event, "bogod", props.ticket.key)
              }
            >
              Buy One Get One at a Discount
            </button>
          </div>
          <div
            style={{
              padding: "5px 10px 0px 30px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "30px",
            }}
          >
            <button
              className={classes.PriceFeatureButton}
              onClick={(event) =>
                props.changeFeature(event, "twofer", props.ticket.key)
              }
            >
              Two for One
            </button>
          </div>
        </Aux>
      );
    }

    //

    
    else if (props.ticket.priceFeature === "promo") {
        return (
          <Aux>
            <div
              style={{
                height: "30px",
                fontSize: "15px",
                backgroundColor: "#E7E7E7",
                borderTop: "1px solid lightgrey",
                boxSizing: "borderBox",
              }}
            >
              <div
                style={{
                  padding: "10px 10px 0px 25px",
                  boxSizing: "borderBox",
                  fontWeight: 600,
                }}
              >
                Promo Codes Price Feature{" "}
                <Popup
                  position="right center"
                  content="Additional information"
                  header="Promo Codes"
                  trigger={
                    <FontAwesomeIcon
                      color="blue"
                      cursor="pointer"
                      icon={faInfoCircle}
                    />
                  }
                />
              </div>
            </div>
  
            <div
              style={{
                display: `grid`,
                gridTemplateColumns: "180px 310px 180px",
                padding: "5px 10px 5px 35px",
                height: "30px",
                fontSize: "16px",
                backgroundColor: "#E7E7E7",
                boxSizing: "borderBox",
              }}
            >
              <div
                style={{
                  boxSizing: "borderBox",
                  fontWeight: 400,
                }}
              >
                Promo Code
              </div>
              <div
                style={{
                  boxSizing: "borderBox",
                  fontWeight: 400,
                }}
              >
                Discount Amount
              </div>
              <div
                style={{
                  boxSizing: "borderBox",
                  fontWeight: 400,
                }}
              >
                Current Discounted Price
              </div>
            </div>
  
            <div
              style={{
                display: `grid`,
                gridTemplateColumns: "250px 250px",
                padding: "5px 10px 5px 35px",
                height: "30px",
                fontSize: "15px",
                backgroundColor: "#E7E7E7",
                boxSizing: "borderBox",
              }}
            >
              <button
                style={{
                  padding: "0px",
                  fontSize: "15px",
                  color: "blue",
                  border: "none",
                  backgroundColor: "#E7E7E7",
                  cursor: "pointer",
                  display: "inlineBlock",
                  outline: "none",
                  textAlign: "left",
                }}
                onClick={(event) => props.addPromoCode(event, props.ticket.key)}
              >
                Add additional promo code
              </button>
              <button
                className={classes.FeatureButton}
                style={{ padding: "0px", textAlign: "left" }}
                onClick={(event) => props.switchPriceFeature(event, props.ticket.key)}
              >
                Select different promotion
              </button>
            </div>
          </Aux>
        );
      } else if (props.ticket.priceFeature === "bogof") {
        // defines warnings for Buy-One-Get-One-Free price feature
        let bogofRegex = /^(0|[1-9]|[1-9][0-9]+)$/;
  
        // determines if a required field warning is required
        if ((props.ticket.functionArgs.buy === "" && props.ticket.functionArgs.get === "") ||
          (props.ticket.functionArgs.buy !== "" && props.ticket.functionArgs.get !== "")) {
              props.ticket.functionArgs.reqWarning = false;
          console.log("props.ticket.functionArgs.reqWarning: ", props.ticket.functionArgs.reqWarning)
        } else {
          props.ticket.functionArgs.reqWarning = true;
          console.log("props.ticket.functionArgs.reqWarning: ", props.ticket.functionArgs.reqWarning)
        }
  
        // determines if a buy or get field warning is required
        if(!props.ticket.functionArgs.buy) {
          props.ticket.functionArgs.buyWarning = false;
          console.log("ticket.functionArgs.buyWarning: ", props.ticket.functionArgs.buyWarning)
        } else {
          props.ticket.functionArgs.buyWarning = !bogofRegex.test(props.ticket.functionArgs.buy);
          console.log("props.ticket.functionArgs.buyWarning: ", props.ticket.functionArgs.buyWarning)
        }
  
        if(!props.ticket.functionArgs.get) {
          props.ticket.functionArgs.getWarning = false;
          console.log("props.ticket.functionArgs.getWarning: ", props.ticket.functionArgs.getWarning)
        } else {
          props.ticket.functionArgs.getWarning = !bogofRegex.test(props.ticket.functionArgs.get);
          console.log("ticket.functionArgs.getWarning: ", props.ticket.functionArgs.getWarning)
        }
  
        // defines styling for the buy and get boxes
        let tempBuyWarning;
        let tempGetWarning;
        let buyWarningText;
        let getWarningText;
  
        if (props.ticket.functionArgs.buyWarning) {
          tempBuyWarning = classes.SpecialFeaturesBoxWarning;
          buyWarningText = "Not a whole number";
        } else if (props.ticket.functionArgs.buy) {
          tempBuyWarning = classes.SpecialFeaturesBox;
          buyWarningText = "";
        } else if (props.ticket.functionArgs.reqWarning) {
          tempBuyWarning = classes.SpecialFeaturesBoxWarning;
          buyWarningText = "Required field";
        } else {
          tempBuyWarning = classes.SpecialFeaturesBox;
          buyWarningText = "";
        }
  
        if (props.ticket.functionArgs.getWarning) {
          tempGetWarning = classes.SpecialFeaturesBoxWarning;
          getWarningText = "Not a whole number";
        } else if (props.ticket.functionArgs.get) {
          tempGetWarning = classes.SpecialFeaturesBox;
          getWarningText = "";
        } else if (props.ticket.functionArgs.reqWarning) {
          tempGetWarning = classes.SpecialFeaturesBoxWarning;
          getWarningText = "Required field";
        } else {
          tempGetWarning = classes.SpecialFeaturesBox;
          getWarningText = "";
        }
  
        return (
          <Aux>
            <div
              style={{
                height: "30px",
                fontSize: "15px",
                backgroundColor: "#E7E7E7",
                borderTop: "1px solid lightgrey",
                boxSizing: "borderBox",
              }}
            >
              <div
                style={{
                  padding: "10px 10px 0px 25px",
                  boxSizing: "borderBox",
                  fontWeight: 600,
                }}
              >
                Buy-One-Get-One-Free Price Feature
              </div>
            </div>
  
            <div
              style={{
                padding: "5px 10px 10px 35px",
                boxSizing: "borderBox",
                backgroundColor: "#E7E7E7",
                height: "55px",
                fontSize: "16px",
              }}
            >
              <div>
                Buy{" "}
                <input
                  className={tempBuyWarning}
                  type="text"
                  id="functionArgBuyBogof"
                  placeholder="# of tickets"
                  name="buy"
                  value={props.ticket.functionArgs.buy}
                  onChange={(event) => {
                    props.changeArgument(event, props.ticket.key);
                  }}
                ></input>{" "}
                ticket(s) and get{" "}
                <input
                  className={tempGetWarning}
                  type="text"
                  id="functionArgGetBogof"
                  placeholder="# of tickets"
                  name="get"
                  value={props.ticket.functionArgs.get}
                  onChange={(event) => {
                    props.changeArgument(event, props.ticket.key);
                  }}
                ></input>{" "}
                ticket(s) for free.
              </div>
            </div>
            
            {props.ticket.functionArgs.reqWarning || props.ticket.functionArgs.buyWarning || props.ticket.functionArgs.getWarning
              ? <div className={classes.BogofLineWarning}
              >
                <div style={{ paddingLeft: "5px"}}> {buyWarningText}</div>
                <div style={{ paddingRight: "5px", textAlign: "left"}}> {getWarningText}</div>
              </div>
              : null
            }
            
            <div
              style={{
                padding: "0px 10px 0px 30px",
                boxSizing: "borderBox",
                backgroundColor: "#E7E7E7",
                height: "30px",
              }}
            >
              <button
                className={classes.FeatureButton}
                onClick={(event) => props.switchPriceFeature(event, props.ticket.key)}
              >
                Select different promotion
              </button>
            </div>
          </Aux>
        );
      } else if (props.ticket.priceFeature === "bogod") {
        // defines warnings for Buy-One-Get-One-at-a-Discount price feature
        let bogodRegexNum = /^(0|[1-9]|[1-9][0-9]+)$/;
        let bogodRegexPercent = /^(0\.[1-9]|0\.[0-9][1-9]|[1-9]|[1-9]\.|[1-9]\.[0-9]|[1-9]\.[0-9][0-9]|[1-9][0-9]|[1-9][0-9]\.|[1-9][0-9]\.[0-9]|[1-9][0-9]\.[0-9][0-9]|100|100\.|100\.0|100\.00)$/;
  
        // determines if a required field warning is required
        if ((props.ticket.functionArgs.buy === "" && props.ticket.functionArgs.get === "" && props.ticket.functionArgs.discount === "") ||
          (props.ticket.functionArgs.buy !== "" && props.ticket.functionArgs.get !== "" && props.ticket.functionArgs.discount !== "")) {
              props.ticket.functionArgs.reqWarning = false;
          console.log("props.ticket.functionArgs.reqWarning: ", props.ticket.functionArgs.reqWarning)
        } else {
          props.ticket.functionArgs.reqWarning = true;
          console.log("props.ticket.functionArgs.reqWarning: ", props.ticket.functionArgs.reqWarning)
        }
  
        // determines if a buy or get field warning is required
        if(!props.ticket.functionArgs.buy) {
          props.ticket.functionArgs.buyWarning = false;
          console.log("props.ticket.functionArgs.buyWarning: ", props.ticket.functionArgs.buyWarning)
        } else {
          props.ticket.functionArgs.buyWarning = !bogodRegexNum.test(props.ticket.functionArgs.buy);
          console.log("props.ticket.functionArgs.buyWarning: ", props.ticket.functionArgs.buyWarning)
        }
  
        if(!props.ticket.functionArgs.get) {
          props.ticket.functionArgs.getWarning = false;
          console.log("props.ticket.functionArgs.getWarning: ", props.ticket.functionArgs.getWarning)
        } else {
          props.ticket.functionArgs.getWarning = !bogodRegexNum.test(props.ticket.functionArgs.get);
          console.log("props.ticket.functionArgs.getWarning: ", props.ticket.functionArgs.getWarning)
        }
  
        if(!props.ticket.functionArgs.discount) {
          props.ticket.functionArgs.discountWarning = false;
          console.log("props.ticket.functionArgs.discountWarning: ", props.ticket.functionArgs.discountWarning)
        } else {
          props.ticket.functionArgs.discountWarning = !bogodRegexPercent.test(props.ticket.functionArgs.discount);
          console.log("props.ticket.functionArgs.discountWarning: ", props.ticket.functionArgs.discountWarning)
        }
  
        // defines styling for the buy and get boxes
        let tempBuyWarning;
        let tempGetWarning;
        let tempDiscountWarning;
        let buyWarningText;
        let getWarningText;
        let discountWarningText;
  
        if (props.ticket.functionArgs.buyWarning) {
          tempBuyWarning = classes.SpecialFeaturesBoxWarning;
          buyWarningText = "Not a whole number";
        } else if (props.ticket.functionArgs.buy) {
          tempBuyWarning = classes.SpecialFeaturesBox;
          buyWarningText = "";
        } else if (props.ticket.functionArgs.reqWarning) {
          tempBuyWarning = classes.SpecialFeaturesBoxWarning;
          buyWarningText = "Required field";
        } else {
          tempBuyWarning = classes.SpecialFeaturesBox;
          buyWarningText = "";
        }
  
        if (props.ticket.functionArgs.getWarning) {
          tempGetWarning = classes.SpecialFeaturesBoxWarning;
          getWarningText = "Not a whole number";
        } else if (props.ticket.functionArgs.get) {
          tempGetWarning = classes.SpecialFeaturesBox;
          getWarningText = "";
        } else if (props.ticket.functionArgs.reqWarning) {
          tempGetWarning = classes.SpecialFeaturesBoxWarning;
          getWarningText = "Required field";
        } else {
          tempGetWarning = classes.SpecialFeaturesBox;
          getWarningText = "";
        }
  
        if (props.ticket.functionArgs.discountWarning) {
          tempDiscountWarning = classes.SpecialFeaturesBoxWarning;
          discountWarningText = "Not a correct percentage";
        } else if (props.ticket.functionArgs.discount) {
          tempDiscountWarning = classes.SpecialFeaturesBox;
          discountWarningText = "";
        } else if (props.ticket.functionArgs.reqWarning) {
          tempDiscountWarning = classes.SpecialFeaturesBoxWarning;
          discountWarningText = "Required field";
        } else {
          tempDiscountWarning = classes.SpecialFeaturesBox;
          discountWarningText = "";
        }
  
        return (
          <Aux>
            <div
              style={{
                height: "30px",
                fontSize: "15px",
                backgroundColor: "#E7E7E7",
                borderTop: "1px solid lightgrey",
                boxSizing: "borderBox",
              }}
            >
              <div
                style={{
                  padding: "10px 10px 0px 25px",
                  boxSizing: "borderBox",
                  fontWeight: 600,
                }}
              >
                Buy-One-Get-One-for-Discount Price Feature
              </div>
            </div>
  
            <div
              style={{
                padding: "5px 10px 10px 35px",
                border: "0px solid green",
                boxSizing: "borderBox",
                backgroundColor: "#E7E7E7",
                height: "55px",
                fontSize: "16px",
              }}
            >
              <div>
                Buy{" "}
                <input
                  className={tempBuyWarning}
                  type="text"
                  id="functionArgBuyBogod"
                  placeholder="# of tickets"
                  name="buy"
                  value={props.ticket.functionArgs.buy}
                  onChange={(event) => {
                    props.changeArgument(event, props.ticket.key);
                  }}
                ></input>{" "}
                ticket(s) and buy an additional{" "}
                <input
                  className={tempGetWarning}
                  type="text"
                  id="functionArgGetBogod"
                  placeholder="# of tickets"
                  name="get"
                  value={props.ticket.functionArgs.get}
                  onChange={(event) => {
                    props.changeArgument(event, props.ticket.key);
                  }}
                ></input>{" "}
                ticket(s) for a{" "}
                <input
                  className={tempDiscountWarning}
                  type="text"
                  id="functionArgDiscountBogod"
                  placeholder="percent"
                  name="discount"
                  value={props.ticket.functionArgs.discount}
                  onChange={(event) => {
                    props.changeArgument(event, props.ticket.key);
                  }}
                ></input>{" "}
                % discount.
              </div>
            </div>
  
            {props.ticket.functionArgs.reqWarning || props.ticket.functionArgs.buyWarning || props.ticket.functionArgs.getWarning || props.ticket.functionArgs.discountWarning
              ? <div  className={classes.BogodLineWarning}
              >
                <div style={{ paddingLeft: "5px"}}> {buyWarningText}</div>
                <div style={{ paddingRight: "5px", textAlign: "left"}}> {getWarningText}</div>
                <div style={{ paddingRight: "5px", textAlign: "left"}}> {discountWarningText}</div>
              </div>
              : null
            }
  
            <div
              style={{
                padding: "0px 10px 0px 30px",
                boxSizing: "borderBox",
                backgroundColor: "#E7E7E7",
                height: "30px",
              }}
            >
              <button
                className={classes.FeatureButton}
                onClick={(event) => props.switchPriceFeature(event, props.ticket.key)}
              >
                Select different promotion
              </button>
            </div>
          </Aux>
        );
      } else if (props.ticket.priceFeature === "twofer") {
        // defines warnings for Two-for-One price feature
        let twoferRegexNum = /^(0|[1-9]|[1-9][0-9]+)$/;
        let twoferRegexPrice = /^(0|0\.|0\.[0-9]|0\.[0-9][0-9]|\.|\.[0-9]|\.[0-9][0-9]|[1-9][0-9]+|[1-9][0-9]+\.|[1-9][0-9]+\.[0-9]|[1-9][0-9]+\.[0-9][0-9]|[0-9]| [0-9]\.|[0-9]\.[0-9]|[0-9]\.[0-9][0-9]|)$/;
  
        // determines if a required field warning is required
        if ((props.ticket.functionArgs.buy === "" && props.ticket.functionArgs.for === "") ||
          (props.ticket.functionArgs.buy !== "" && props.ticket.functionArgs.for !== "")) {
          props.ticket.functionArgs.reqWarning = false;
          console.log("props.ticket.functionArgs.reqWarning: ", props.ticket.functionArgs.reqWarning)
        } else {
          props.ticket.functionArgs.reqWarning = true;
          console.log("props.ticket.functionArgs.reqWarning: ", props.ticket.functionArgs.reqWarning)
        }
  
        // determines if a "buy" or "for" field warning is required
        if(!props.ticket.functionArgs.buy) {
          props.ticket.functionArgs.buyWarning = false;
          console.log("ticket.functionArgs.buyWarning: ", props.ticket.functionArgs.buyWarning)
        } else {
          props.ticket.functionArgs.buyWarning = !twoferRegexNum.test(props.ticket.functionArgs.buy);
          console.log("props.ticket.functionArgs.buyWarning: ", props.ticket.functionArgs.buyWarning)
        }
  
        if(!props.ticket.functionArgs.for) {
          props.ticket.functionArgs.forWarning = false;
          console.log("props.ticket.functionArgs.forWarning: ", props.ticket.functionArgs.forWarning)
        } else {
          props.ticket.functionArgs.forWarning = !twoferRegexPrice.test(props.ticket.functionArgs.for);
          console.log("props.ticket.functionArgs.forWarning: ", props.ticket.functionArgs.forWarning)
        }
  
        //NEED TO COPY THIS SECTION TO EVENTEDIT
        // determines if a "maxFor" warning is required for "for" field
        if (props.ticket.functionArgs.for && props.ticket.functionArgs.buy && props.ticket.currentTicketPrice) {
          console.log("all three fields exist");
          if (props.ticket.functionArgs.for > (props.ticket.functionArgs.buy * props.ticket.currentTicketPrice)) {
              props.ticket.functionArgs.maxForWarning = true;
            console.log("Invalid 'for' price");
          } else {
              props.ticket.functionArgs.maxForWarning = false;
            console.log("Valid 'for' price");
          }
        } else {
          props.ticket.functionArgs.maxForWarning = false;
          console.log("at least one field doesn't exist");
        }
  
        // defines styling for the buy and for boxes
        let tempBuyWarning;
        let tempForWarning;
        let buyWarningText;
        let forWarningText;
  
        if (props.ticket.functionArgs.buyWarning) {
          tempBuyWarning = classes.SpecialFeaturesBoxWarning;
          buyWarningText = "Not a whole number";
        } else if (props.ticket.functionArgs.buy) {
          tempBuyWarning = classes.SpecialFeaturesBox;
          buyWarningText = "";
        } else if (props.ticket.functionArgs.reqWarning) {
          tempBuyWarning = classes.SpecialFeaturesBoxWarning;
          buyWarningText = "Required field";
        } else {
          tempBuyWarning = classes.SpecialFeaturesBox;
          buyWarningText = "";
        }
  
        if (props.ticket.functionArgs.forWarning) {
          tempForWarning = classes.ForPriceBoxWarning;
          forWarningText = "Not a valid price";
        } else if (props.ticket.functionArgs.maxForWarning) {
          tempForWarning = classes.ForPriceBoxWarning;
          forWarningText = "Price greater than buying individually";
        } else if (props.ticket.functionArgs.for) {
          tempForWarning = classes.ForPriceBox;
          forWarningText = "";
        } else if (props.ticket.functionArgs.reqWarning) {
          tempForWarning = classes.ForPriceBoxWarning;
          forWarningText = "Required field";
        } else {
          tempForWarning = classes.ForPriceBox;
          forWarningText = "";
        }
  
        /*
        if (ticket.functionArgs.forWarning) {
          tempForWarning = classes.SpecialFeaturesBoxWarning;
          forWarningText = "Not a valid price";
        } else if (ticket.functionArgs.for) {
          tempForWarning = classes.SpecialFeaturesBox;
          forWarningText = "";
        } else if (ticket.functionArgs.reqWarning) {
          tempForWarning = classes.SpecialFeaturesBoxWarning;
          forWarningText = "Required field";
        } else {
          tempForWarning = classes.SpecialFeaturesBox;
          forWarningText = "";
        }
        */
  
        return (
          <Aux>
            <div
              style={{
                height: "30px",
                fontSize: "15px",
                backgroundColor: "#E7E7E7",
                borderTop: "1px solid lightgrey",
                boxSizing: "borderBox",
              }}
            >
              <div
                style={{
                  padding: "10px 10px 0px 25px",
                  boxSizing: "borderBox",
                  fontWeight: 600,
                }}
              >
                Two-for-One Price Feature
              </div>
            </div>
  
            <div
              style={{
                padding: "5px 10px 10px 35px",
                boxSizing: "borderBox",
                backgroundColor: "#E7E7E7",
                height: "55px",
                fontSize: "16px",
              }}
            >
              <div>
                Buy{" "}
                <input
                  className={tempBuyWarning}
                  type="text"
                  id="functionArgBuy2fer"
                  placeholder="# of tickets"
                  name="buy"
                  value={props.ticket.functionArgs.buy}
                  onChange={(event) => {
                    props.changeArgument(event, props.ticket.key);
                  }}
                ></input>
                {" "}ticket(s) for {" "}
                <span className={tempForWarning}>
                    <span
                        style={{
                          backgroundColor: "white",
                          padding: "9px 10px 9px 10px",
                          textAlign: "center",
                          width: "70px",
                          boxSizing: "borderBox",
                        }}>
                      {props.ticket.currency === "" ? "USD $" : props.ticket.currency}
                    </span>
                      <input
                        style={{
                          backgroundColor: "fff",
                          padding: "9px 5px 9px 0px",
                          textAlign: "right",
                          width: "85px",
                          border: "none",
                          outline: "none",
                          boxSizing: "borderBox",
                        }}
                        type="text"
                        id="currentTicketPrice"
                        placeholder="10.00"
                        name="for"
                        value={props.ticket.functionArgs.for}
                        onChange={(event) => {
                          props.changeArgument(event, props.ticket.key);
                            }}
                      ></input>
                    </span>
              </div>
            </div>
            
            {props.ticket.functionArgs.reqWarning || props.ticket.functionArgs.buyWarning || props.ticket.functionArgs.forWarning || props.ticket.functionArgs.maxForWarning
              ? <div className={classes.TwoferLineWarning}
              >
                <div style={{ paddingLeft: "5px"}}> {buyWarningText}</div>
                <div style={{ paddingRight: "5px", textAlign: "left"}}> {forWarningText}</div>
              </div>
              : null
            }
  
            <div
              style={{
                padding: "0px 10px 0px 30px",
                boxSizing: "borderBox",
                backgroundColor: "#E7E7E7",
                height: "30px",
              }}
            >
              <button
                className={classes.FeatureButton}
                onClick={(event) => props.switchPriceFeature(event, props.ticket.key)}
              >
                Select different promotion
              </button>
            </div>
          </Aux>
        );
      }
  };

  export default priceFeatureSettings;




























  /*
  
    else if (props.ticket.priceFeature === "promo") {
      return (
        <Aux>
          <div
            style={{
              height: "30px",
              fontSize: "15px",
              backgroundColor: "#E7E7E7",
              borderTop: "1px solid lightgrey",
              boxSizing: "borderBox",
            }}
          >
            <div
              style={{
                padding: "10px 10px 0px 25px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Promo Codes Price Feature{" "}
              <Popup
                position="right center"
                content="Additional information"
                header="Promo Codes"
                trigger={
                  <FontAwesomeIcon
                    color="blue"
                    cursor="pointer"
                    icon={faInfoCircle}
                  />
                }
              />
            </div>
          </div>

          <div
            style={{
              display: `grid`,
              gridTemplateColumns: "180px 310px 180px",
              padding: "5px 10px 5px 35px",
              height: "30px",
              fontSize: "16px",
              backgroundColor: "#E7E7E7",
              boxSizing: "borderBox",
            }}
          >
            <div
              style={{
                boxSizing: "borderBox",
                fontWeight: 400,
              }}
            >
              Promo Code
            </div>
            <div
              style={{
                boxSizing: "borderBox",
                fontWeight: 400,
              }}
            >
              Discount Amount
            </div>
            <div
              style={{
                boxSizing: "borderBox",
                fontWeight: 400,
              }}
            >
              Current Discounted Price
            </div>
          </div>

          {promoCodesDisplay(props.ticket)}

          <div
            style={{
              display: `grid`,
              gridTemplateColumns: "250px 250px",
              padding: "5px 10px 5px 35px",
              height: "30px",
              fontSize: "15px",
              backgroundColor: "#E7E7E7",
              boxSizing: "borderBox",
            }}
          >
            <button
              style={{
                padding: "0px",
                fontSize: "15px",
                color: "blue",
                border: "none",
                backgroundColor: "#E7E7E7",
                cursor: "pointer",
                display: "inlineBlock",
                outline: "none",
                textAlign: "left",
              }}
              onClick={(event) => addPromoCode(event, props.ticket.key)}
            >
              Add additional promo code
            </button>
            <button
              className={classes.FeatureButton}
              style={{ padding: "0px", textAlign: "left" }}
              onClick={(event) => switchPriceFeature(event, props.ticket.key)}
            >
              Select different promotion
            </button>
          </div>
        </Aux>
      );
    } else if (props.ticket.priceFeature === "bogof") {
      // defines warnings for Buy-One-Get-One-Free price feature
      let bogofRegex = /^(0|[1-9]|[1-9][0-9]+)$/;

      // determines if a required field warning is required
      if ((props.ticket.functionArgs.buy === "" && props.ticket.functionArgs.get === "") ||
        (props.ticket.functionArgs.buy !== "" && props.ticket.functionArgs.get !== "")) {
            props.ticket.functionArgs.reqWarning = false;
        console.log("props.ticket.functionArgs.reqWarning: ", props.ticket.functionArgs.reqWarning)
      } else {
        props.ticket.functionArgs.reqWarning = true;
        console.log("props.ticket.functionArgs.reqWarning: ", props.ticket.functionArgs.reqWarning)
      }

      // determines if a buy or get field warning is required
      if(!props.ticket.functionArgs.buy) {
        props.ticket.functionArgs.buyWarning = false;
        console.log("ticket.functionArgs.buyWarning: ", props.ticket.functionArgs.buyWarning)
      } else {
        props.ticket.functionArgs.buyWarning = !bogofRegex.test(props.ticket.functionArgs.buy);
        console.log("props.ticket.functionArgs.buyWarning: ", props.ticket.functionArgs.buyWarning)
      }

      if(!props.ticket.functionArgs.get) {
        props.ticket.functionArgs.getWarning = false;
        console.log("props.ticket.functionArgs.getWarning: ", props.ticket.functionArgs.getWarning)
      } else {
        props.ticket.functionArgs.getWarning = !bogofRegex.test(props.ticket.functionArgs.get);
        console.log("ticket.functionArgs.getWarning: ", props.ticket.functionArgs.getWarning)
      }

      // defines styling for the buy and get boxes
      let tempBuyWarning;
      let tempGetWarning;
      let buyWarningText;
      let getWarningText;

      if (props.ticket.functionArgs.buyWarning) {
        tempBuyWarning = classes.SpecialFeaturesBoxWarning;
        buyWarningText = "Not a whole number";
      } else if (props.ticket.functionArgs.buy) {
        tempBuyWarning = classes.SpecialFeaturesBox;
        buyWarningText = "";
      } else if (props.ticket.functionArgs.reqWarning) {
        tempBuyWarning = classes.SpecialFeaturesBoxWarning;
        buyWarningText = "Required field";
      } else {
        tempBuyWarning = classes.SpecialFeaturesBox;
        buyWarningText = "";
      }

      if (props.ticket.functionArgs.getWarning) {
        tempGetWarning = classes.SpecialFeaturesBoxWarning;
        getWarningText = "Not a whole number";
      } else if (props.ticket.functionArgs.get) {
        tempGetWarning = classes.SpecialFeaturesBox;
        getWarningText = "";
      } else if (props.ticket.functionArgs.reqWarning) {
        tempGetWarning = classes.SpecialFeaturesBoxWarning;
        getWarningText = "Required field";
      } else {
        tempGetWarning = classes.SpecialFeaturesBox;
        getWarningText = "";
      }

      return (
        <Aux>
          <div
            style={{
              height: "30px",
              fontSize: "15px",
              backgroundColor: "#E7E7E7",
              borderTop: "1px solid lightgrey",
              boxSizing: "borderBox",
            }}
          >
            <div
              style={{
                padding: "10px 10px 0px 25px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Buy-One-Get-One-Free Price Feature
            </div>
          </div>

          <div
            style={{
              padding: "5px 10px 10px 35px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "55px",
              fontSize: "16px",
            }}
          >
            <div>
              Buy{" "}
              <input
                className={tempBuyWarning}
                type="text"
                id="functionArgBuyBogof"
                placeholder="# of tickets"
                name="buy"
                value={props.ticket.functionArgs.buy}
                onChange={(event) => {
                  changeArgument(event, props.ticket.key);
                }}
              ></input>{" "}
              ticket(s) and get{" "}
              <input
                className={tempGetWarning}
                type="text"
                id="functionArgGetBogof"
                placeholder="# of tickets"
                name="get"
                value={props.ticket.functionArgs.get}
                onChange={(event) => {
                  changeArgument(event, props.ticket.key);
                }}
              ></input>{" "}
              ticket(s) for free.
            </div>
          </div>
          
          {props.ticket.functionArgs.reqWarning || props.ticket.functionArgs.buyWarning || props.ticket.functionArgs.getWarning
            ? <div className={classes.BogofLineWarning}
            >
              <div style={{ paddingLeft: "5px"}}> {buyWarningText}</div>
              <div style={{ paddingRight: "5px", textAlign: "left"}}> {getWarningText}</div>
            </div>
            : null
          }
          
          <div
            style={{
              padding: "0px 10px 0px 30px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "30px",
            }}
          >
            <button
              className={classes.FeatureButton}
              onClick={(event) => switchPriceFeature(event, props.ticket.key)}
            >
              Select different promotion
            </button>
          </div>
        </Aux>
      );
    } else if (props.ticket.priceFeature === "bogod") {
      // defines warnings for Buy-One-Get-One-at-a-Discount price feature
      let bogodRegexNum = /^(0|[1-9]|[1-9][0-9]+)$/;
      let bogodRegexPercent = /^(0\.[1-9]|0\.[0-9][1-9]|[1-9]|[1-9]\.|[1-9]\.[0-9]|[1-9]\.[0-9][0-9]|[1-9][0-9]|[1-9][0-9]\.|[1-9][0-9]\.[0-9]|[1-9][0-9]\.[0-9][0-9]|100|100\.|100\.0|100\.00)$/;

      // determines if a required field warning is required
      if ((props.ticket.functionArgs.buy === "" && props.ticket.functionArgs.get === "" && props.ticket.functionArgs.discount === "") ||
        (props.ticket.functionArgs.buy !== "" && props.ticket.functionArgs.get !== "" && props.ticket.functionArgs.discount !== "")) {
            props.ticket.functionArgs.reqWarning = false;
        console.log("props.ticket.functionArgs.reqWarning: ", props.ticket.functionArgs.reqWarning)
      } else {
        props.ticket.functionArgs.reqWarning = true;
        console.log("props.ticket.functionArgs.reqWarning: ", props.ticket.functionArgs.reqWarning)
      }

      // determines if a buy or get field warning is required
      if(!props.ticket.functionArgs.buy) {
        props.ticket.functionArgs.buyWarning = false;
        console.log("props.ticket.functionArgs.buyWarning: ", props.ticket.functionArgs.buyWarning)
      } else {
        props.ticket.functionArgs.buyWarning = !bogodRegexNum.test(props.ticket.functionArgs.buy);
        console.log("props.ticket.functionArgs.buyWarning: ", props.ticket.functionArgs.buyWarning)
      }

      if(!props.ticket.functionArgs.get) {
        props.ticket.functionArgs.getWarning = false;
        console.log("props.ticket.functionArgs.getWarning: ", props.ticket.functionArgs.getWarning)
      } else {
        props.ticket.functionArgs.getWarning = !bogodRegexNum.test(props.ticket.functionArgs.get);
        console.log("props.ticket.functionArgs.getWarning: ", props.ticket.functionArgs.getWarning)
      }

      if(!props.ticket.functionArgs.discount) {
        props.ticket.functionArgs.discountWarning = false;
        console.log("props.ticket.functionArgs.discountWarning: ", props.ticket.functionArgs.discountWarning)
      } else {
        props.ticket.functionArgs.discountWarning = !bogodRegexPercent.test(props.ticket.functionArgs.discount);
        console.log("props.ticket.functionArgs.discountWarning: ", props.ticket.functionArgs.discountWarning)
      }

      // defines styling for the buy and get boxes
      let tempBuyWarning;
      let tempGetWarning;
      let tempDiscountWarning;
      let buyWarningText;
      let getWarningText;
      let discountWarningText;

      if (props.ticket.functionArgs.buyWarning) {
        tempBuyWarning = classes.SpecialFeaturesBoxWarning;
        buyWarningText = "Not a whole number";
      } else if (props.ticket.functionArgs.buy) {
        tempBuyWarning = classes.SpecialFeaturesBox;
        buyWarningText = "";
      } else if (props.ticket.functionArgs.reqWarning) {
        tempBuyWarning = classes.SpecialFeaturesBoxWarning;
        buyWarningText = "Required field";
      } else {
        tempBuyWarning = classes.SpecialFeaturesBox;
        buyWarningText = "";
      }

      if (props.ticket.functionArgs.getWarning) {
        tempGetWarning = classes.SpecialFeaturesBoxWarning;
        getWarningText = "Not a whole number";
      } else if (props.ticket.functionArgs.get) {
        tempGetWarning = classes.SpecialFeaturesBox;
        getWarningText = "";
      } else if (props.ticket.functionArgs.reqWarning) {
        tempGetWarning = classes.SpecialFeaturesBoxWarning;
        getWarningText = "Required field";
      } else {
        tempGetWarning = classes.SpecialFeaturesBox;
        getWarningText = "";
      }

      if (props.ticket.functionArgs.discountWarning) {
        tempDiscountWarning = classes.SpecialFeaturesBoxWarning;
        discountWarningText = "Not a correct percentage";
      } else if (props.ticket.functionArgs.discount) {
        tempDiscountWarning = classes.SpecialFeaturesBox;
        discountWarningText = "";
      } else if (props.ticket.functionArgs.reqWarning) {
        tempDiscountWarning = classes.SpecialFeaturesBoxWarning;
        discountWarningText = "Required field";
      } else {
        tempDiscountWarning = classes.SpecialFeaturesBox;
        discountWarningText = "";
      }

      return (
        <Aux>
          <div
            style={{
              height: "30px",
              fontSize: "15px",
              backgroundColor: "#E7E7E7",
              borderTop: "1px solid lightgrey",
              boxSizing: "borderBox",
            }}
          >
            <div
              style={{
                padding: "10px 10px 0px 25px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Buy-One-Get-One-for-Discount Price Feature
            </div>
          </div>

          <div
            style={{
              padding: "5px 10px 10px 35px",
              border: "0px solid green",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "55px",
              fontSize: "16px",
            }}
          >
            <div>
              Buy{" "}
              <input
                className={tempBuyWarning}
                type="text"
                id="functionArgBuyBogod"
                placeholder="# of tickets"
                name="buy"
                value={props.ticket.functionArgs.buy}
                onChange={(event) => {
                  changeArgument(event, props.ticket.key);
                }}
              ></input>{" "}
              ticket(s) and buy an additional{" "}
              <input
                className={tempGetWarning}
                type="text"
                id="functionArgGetBogod"
                placeholder="# of tickets"
                name="get"
                value={props.ticket.functionArgs.get}
                onChange={(event) => {
                  changeArgument(event, props.ticket.key);
                }}
              ></input>{" "}
              ticket(s) for a{" "}
              <input
                className={tempDiscountWarning}
                type="text"
                id="functionArgDiscountBogod"
                placeholder="percent"
                name="discount"
                value={props.ticket.functionArgs.discount}
                onChange={(event) => {
                  changeArgument(event, props.ticket.key);
                }}
              ></input>{" "}
              % discount.
            </div>
          </div>

          {props.ticket.functionArgs.reqWarning || props.ticket.functionArgs.buyWarning || props.ticket.functionArgs.getWarning || props.ticket.functionArgs.discountWarning
            ? <div  className={classes.BogodLineWarning}
            >
              <div style={{ paddingLeft: "5px"}}> {buyWarningText}</div>
              <div style={{ paddingRight: "5px", textAlign: "left"}}> {getWarningText}</div>
              <div style={{ paddingRight: "5px", textAlign: "left"}}> {discountWarningText}</div>
            </div>
            : null
          }

          <div
            style={{
              padding: "0px 10px 0px 30px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "30px",
            }}
          >
            <button
              className={classes.FeatureButton}
              onClick={(event) => switchPriceFeature(event, props.ticket.key)}
            >
              Select different promotion
            </button>
          </div>
        </Aux>
      );
    } else if (props.ticket.priceFeature === "twofer") {
      // defines warnings for Two-for-One price feature
      let twoferRegexNum = /^(0|[1-9]|[1-9][0-9]+)$/;
      let twoferRegexPrice = /^(0|0\.|0\.[0-9]|0\.[0-9][0-9]|\.|\.[0-9]|\.[0-9][0-9]|[1-9][0-9]+|[1-9][0-9]+\.|[1-9][0-9]+\.[0-9]|[1-9][0-9]+\.[0-9][0-9]|[0-9]| [0-9]\.|[0-9]\.[0-9]|[0-9]\.[0-9][0-9]|)$/;

      // determines if a required field warning is required
      if ((props.ticket.functionArgs.buy === "" && props.ticket.functionArgs.for === "") ||
        (props.ticket.functionArgs.buy !== "" && props.ticket.functionArgs.for !== "")) {
        props.ticket.functionArgs.reqWarning = false;
        console.log("props.ticket.functionArgs.reqWarning: ", props.ticket.functionArgs.reqWarning)
      } else {
        props.ticket.functionArgs.reqWarning = true;
        console.log("props.ticket.functionArgs.reqWarning: ", props.ticket.functionArgs.reqWarning)
      }

      // determines if a "buy" or "for" field warning is required
      if(!props.ticket.functionArgs.buy) {
        props.ticket.functionArgs.buyWarning = false;
        console.log("ticket.functionArgs.buyWarning: ", props.ticket.functionArgs.buyWarning)
      } else {
        props.tickprops.et.functionArgs.buyWarning = !twoferRegexNum.test(props.ticket.functionArgs.buy);
        console.log("props.ticket.functionArgs.buyWarning: ", props.ticket.functionArgs.buyWarning)
      }

      if(!props.ticket.functionArgs.for) {
        props.ticket.functionArgs.forWarning = false;
        console.log("props.ticket.functionArgs.forWarning: ", props.ticket.functionArgs.forWarning)
      } else {
        props.ticket.functionArgs.forWarning = !twoferRegexPrice.test(props.ticket.functionArgs.for);
        console.log("props.ticket.functionArgs.forWarning: ", props.ticket.functionArgs.forWarning)
      }

      //NEED TO COPY THIS SECTION TO EVENTEDIT
      // determines if a "maxFor" warning is required for "for" field
      if (props.ticket.functionArgs.for && props.ticket.functionArgs.buy && props.ticket.currentTicketPrice) {
        console.log("all three fields exist");
        if (props.ticket.functionArgs.for > (props.ticket.functionArgs.buy * props.ticket.currentTicketPrice)) {
            props.ticket.functionArgs.maxForWarning = true;
          console.log("Invalid 'for' price");
        } else {
            props.ticket.functionArgs.maxForWarning = false;
          console.log("Valid 'for' price");
        }
      } else {
        props.ticket.functionArgs.maxForWarning = false;
        console.log("at least one field doesn't exist");
      }

      // defines styling for the buy and for boxes
      let tempBuyWarning;
      let tempForWarning;
      let buyWarningText;
      let forWarningText;

      if (props.ticket.functionArgs.buyWarning) {
        tempBuyWarning = classes.SpecialFeaturesBoxWarning;
        buyWarningText = "Not a whole number";
      } else if (props.ticket.functionArgs.buy) {
        tempBuyWarning = classes.SpecialFeaturesBox;
        buyWarningText = "";
      } else if (props.ticket.functionArgs.reqWarning) {
        tempBuyWarning = classes.SpecialFeaturesBoxWarning;
        buyWarningText = "Required field";
      } else {
        tempBuyWarning = classes.SpecialFeaturesBox;
        buyWarningText = "";
      }

      if (props.ticket.functionArgs.forWarning) {
        tempForWarning = classes.ForPriceBoxWarning;
        forWarningText = "Not a valid price";
      } else if (props.ticket.functionArgs.maxForWarning) {
        tempForWarning = classes.ForPriceBoxWarning;
        forWarningText = "Price greater than buying individually";
      } else if (props.ticket.functionArgs.for) {
        tempForWarning = classes.ForPriceBox;
        forWarningText = "";
      } else if (props.ticket.functionArgs.reqWarning) {
        tempForWarning = classes.ForPriceBoxWarning;
        forWarningText = "Required field";
      } else {
        tempForWarning = classes.ForPriceBox;
        forWarningText = "";
      }

      // started comment block
      if (ticket.functionArgs.forWarning) {
        tempForWarning = classes.SpecialFeaturesBoxWarning;
        forWarningText = "Not a valid price";
      } else if (ticket.functionArgs.for) {
        tempForWarning = classes.SpecialFeaturesBox;
        forWarningText = "";
      } else if (ticket.functionArgs.reqWarning) {
        tempForWarning = classes.SpecialFeaturesBoxWarning;
        forWarningText = "Required field";
      } else {
        tempForWarning = classes.SpecialFeaturesBox;
        forWarningText = "";
      }
      // ended comment block

     return (
        <Aux>
          <div
            style={{
              height: "30px",
              fontSize: "15px",
              backgroundColor: "#E7E7E7",
              borderTop: "1px solid lightgrey",
              boxSizing: "borderBox",
            }}
          >
            <div
              style={{
                padding: "10px 10px 0px 25px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Two-for-One Price Feature
            </div>
          </div>

          <div
            style={{
              padding: "5px 10px 10px 35px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "55px",
              fontSize: "16px",
            }}
          >
            <div>
              Buy{" "}
              <input
                className={tempBuyWarning}
                type="text"
                id="functionArgBuy2fer"
                placeholder="# of tickets"
                name="buy"
                value={props.ticket.functionArgs.buy}
                onChange={(event) => {
                  changeArgument(event, props.ticket.key);
                }}
              ></input>
              {" "}ticket(s) for {" "}
              <span className={tempForWarning}>
                  <span
                      style={{
                        backgroundColor: "white",
                        padding: "9px 10px 9px 10px",
                        textAlign: "center",
                        width: "70px",
                        boxSizing: "borderBox",
                      }}>
                    {props.ticket.currency === "" ? "USD $" : props.ticket.currency}
                  </span>
                    <input
                      style={{
                        backgroundColor: "fff",
                        padding: "9px 5px 9px 0px",
                        textAlign: "right",
                        width: "85px",
                        border: "none",
                        outline: "none",
                        boxSizing: "borderBox",
                      }}
                      type="text"
                      id="currentTicketPrice"
                      placeholder="10.00"
                      name="for"
                      value={props.ticket.functionArgs.for}
                      onChange={(event) => {
                        changeArgument(event, props.ticket.key);
                          }}
                    ></input>
                  </span>
            </div>
          </div>
          
          {props.ticket.functionArgs.reqWarning || props.ticket.functionArgs.buyWarning || props.ticket.functionArgs.forWarning || props.ticket.functionArgs.maxForWarning
            ? <div className={classes.TwoferLineWarning}
            >
              <div style={{ paddingLeft: "5px"}}> {buyWarningText}</div>
              <div style={{ paddingRight: "5px", textAlign: "left"}}> {forWarningText}</div>
            </div>
            : null
          }

          <div
            style={{
              padding: "0px 10px 0px 30px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "30px",
            }}
          >
            <button
              className={classes.FeatureButton}
              onClick={(event) => switchPriceFeature(event, props.ticket.key)}
            >
              Select different promotion
            </button>
          </div>
        </Aux>
      );
    }
    */