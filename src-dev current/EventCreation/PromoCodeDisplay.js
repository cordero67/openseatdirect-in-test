import React, { useState, useRef } from "react";

import classes from "./EventCreation.module.css";
import Aux from "../hoc/Auxiliary/Auxiliary";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrashAlt
} from "@fortawesome/free-solid-svg-icons";

const PromoCodeDisplay = (props) => {
    let display = (
      <div>
        {props.ticket.promoCodes.map((item, index) => {
          console.log("item: ", item);
          console.log("item.amount: ", item.amount);
          let finalPrice = "";
          if (item.percent === false) {
            finalPrice = (props.ticket.currentTicketPrice - item.amount).toFixed(2);
          } else if (item.percent === true) {
            finalPrice = (
                props.ticket.currentTicketPrice *
              (1 - item.amount / 100)
            ).toFixed(2);
          }

          return (
            <Aux key={index}>
              <div
                style={{
                  display: `grid`,
                  gridTemplateColumns: "180px 165px 30px 115px 180px 25px",
                  padding: "0px 10px 0px 35px",
                  boxSizing: "borderBox",
                  backgroundColor: "#E7E7E7",
                  height: "50px",
                  fontSize: "16px",
                }}
              >
                <div
                  style={{
                    padding: "0px 0px 0px 0px",
                    textAlign: "left",
                  }}
                >
                  <input
                    style={{
                      padding: "9px 10px",
                      border: "1px solid lightgrey",
                      boxSizing: "borderBox",
                      textAlign: "left",
                      width: "150px",
                      height: "40px",
                    }}
                    type="text"
                    id="promoName"
                    placeholder="unique name"
                    value={item.name}
                    onChange={(event) => {
                      props.changePromoCodesName(event, props.ticket.key, item.key);
                    }}
                  ></input>
                </div>

                <div
                  style={{
                    margin: "0px 10px 20px 0px",
                    border: "1px solid lightgrey",
                    boxSizing: "borderBox",
                    backgroundColor: "white",
                    display: `grid`,
                    gridTemplateColumns: "70px 80px",
                  }}
                >
                  <div
                    style={{
                      padding: "9px 0px 9px 0px",
                      textAlign: "center",
                      boxSizing: "borderBox",
                    }}
                  >
                    {props.ticket.currency === "" ? "USD $" : props.ticket.currency}
                  </div>
                  <input
                    style={{
                      padding: "9px 5px 9px 0px",
                      textAlign: "right",
                      border: "0px solid lightgrey",
                      boxSizing: "borderBox",
                    }}
                    type="text"
                    id="promoAmount"
                    placeholder=""
                    value={!item.percent ? item.amount : ""}
                    onChange={(event) => {
                        props.changePromoCodesAmount(event, props.ticket.key, item.key);
                    }}
                  ></input>
                </div>

                <div style={{ paddingTop: "10px" }}>OR</div>

                <div
                  style={{
                    margin: "0px 10px 20px 0px",
                    border: "1px solid lightgrey",
                    boxSizing: "borderBox",
                    backgroundColor: "white",
                    display: `grid`,
                    width: "90px",
                    gridTemplateColumns: "55px 30px",
                  }}
                >
                  <input
                    style={{
                      padding: "9px 5px 9px 0px",
                      textAlign: "right",
                      border: "0px solid lightgrey",
                      boxSizing: "borderBox",
                    }}
                    type="text"
                    id="promoPercent"
                    placeholder=""
                    value={item.percent ? item.amount : ""}
                    onChange={(event) => {
                        props.changePromoCodesPercent(event, props.ticket.key, item.key);
                    }}
                  ></input>
                  <div
                    style={{
                      padding: "9px 0px 9px 0px",
                      textAlign: "center",
                      boxSizing: "borderBox",
                    }}
                  >
                    %
                  </div>
                </div>

                <div
                  style={{
                    padding: "10px 10px 0px 0px",
                    textAlign: "center",
                  }}
                >
                  {finalPrice}
                </div>

                <div
                  style={{
                    padding: "9px 0px 9px 3px",
                    boxSizing: "borderBox",
                    color: "blue"
                  }}
                >
                  <FontAwesomeIcon
                    cursor="pointer"
                    onClick={(event) => {
                        props.deletePromoCode(event, props.ticket, item.key)
                    }}
                    icon={faTrashAlt}
                  />
                </div>
              </div>
            </Aux>
          );
        })}
      </div>
    );
    return display;
  };

  export default PromoCodeDisplay;