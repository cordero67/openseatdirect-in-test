import React, { useState, Fragment } from "react";

<<<<<<< HEAD
import QRCode from "qrcode.react";
=======
import QRCode from "qrcode.react"
>>>>>>> master

import { getLongStartDate } from "../Resources/VendorFunctions";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import classes from "./QRCodesModal.module.css";

const ReceiptModal = (props) => {
<<<<<<< HEAD
  console.log("selected order: ", props);
  console.log(props.details.tickets[0].uuid);
  //const [ticketQRCode, setTicketQRCode] = useState(props.details.tickets[0].uuid);
=======
  
  console.log("selected order: ", props);
  console.log(props.details.tickets[0].uuid);
  const [ticketQRCode, setTicketQRCode] = useState(props.details.tickets[0].uuid);
>>>>>>> master
  const [ticketIndex, setTicketIndex] = useState(0);

  let longDateTime;
  [longDateTime] = getLongStartDate(props.details.startDateTime);

  // LOOKS GOOD: 1/21/21
  const modalButtons = () => {
    return (
      <div
        style={{
          width: "330px",
<<<<<<< HEAD
          textAlign: "center",
        }}
      >
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            props.close();
=======
          textAlign: "center"
        }}
      >
        <button className={classes.ButtonGrey}
          onClick={() => {
            props.close()
>>>>>>> master
          }}
        >
          CLOSE
        </button>
      </div>
<<<<<<< HEAD
    );
  };
=======
    )
  }
>>>>>>> master

  const loadPreviousTicket = () => {
    let newPosition;
    if (ticketIndex === 0) {
      newPosition = props.details.tickets.length - 1;
    } else {
<<<<<<< HEAD
      newPosition = ticketIndex - 1;
    }
    setTicketIndex(newPosition);
    console.log("newPosition: ,", newPosition);
  };
=======
      newPosition = ticketIndex - 1
    }
    setTicketIndex(newPosition)
    console.log("newPosition: ,", newPosition)
  }
>>>>>>> master

  const loadNextTicket = () => {
    let newPosition;
    if (ticketIndex === props.details.tickets.length - 1) {
      newPosition = 0;
    } else {
<<<<<<< HEAD
      newPosition = ticketIndex + 1;
    }
    setTicketIndex(newPosition);
    console.log("newPosition: ,", newPosition);
  };
=======
      newPosition = ticketIndex + 1
    }
    setTicketIndex(newPosition)
    console.log("newPosition: ,", newPosition)
  }
>>>>>>> master

  return (
    <Fragment>
      <Backdrop show={props.show}></Backdrop>
      <div
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0",
        }}
        className={classes.Modal}
      >
        <br></br>
        <div
          style={{
            width: "330px",
            fontWeight: "600",
            fontSize: "18px",
<<<<<<< HEAD
            textAlign: "center",
=======
            textAlign: "center"
>>>>>>> master
          }}
        >
          {props.details.eventTitle}
        </div>
        <div
          style={{
            width: "330px",
            fontSize: "16px",
            textAlign: "center",
            fontWeight: "400",
<<<<<<< HEAD
            paddingTop: "5px",
=======
            paddingTop: "5px"
>>>>>>> master
          }}
        >
          {longDateTime}
        </div>
        <br></br>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "42px 246px 42px",
            width: "330px",
            height: "220px",
<<<<<<< HEAD
            paddingTop: "10px",
=======
            paddingTop: "10px"
>>>>>>> master
          }}
        >
          <ion-icon
            style={{
              paddingTop: "80px",
              fontSize: "42px",
              border: "none",
<<<<<<< HEAD
              color: "lightgrey",
            }}
            name="chevron-back-outline"
            onClick={() => {
              loadPreviousTicket();
            }}
          />
          <div style={{ textAlign: "center" }}>
=======
              color: "lightgrey"
            }}
            name="chevron-back-outline"
            onClick={() => {
                loadPreviousTicket()
            }}
          />
          <div style={{textAlign: "center"}}>
>>>>>>> master
            <QRCode
              value={props.details.tickets[ticketIndex].uuid}
              size="96"
              imageSettings={{
                height: "20",
<<<<<<< HEAD
                width: "20%",
              }}
              styles={{ border: "2px solid blue" }}
=======
                width: "20%"
              }}
              styles={{border: "2px solid blue"}}
>>>>>>> master
            />
          </div>
          <ion-icon
            style={{
              paddingTop: "80px",
              fontSize: "42px",
              border: "none",
<<<<<<< HEAD
              color: "lightgrey",
            }}
            name="chevron-forward-outline"
            onClick={() => {
              loadNextTicket();
=======
              color: "lightgrey"
            }}
            name="chevron-forward-outline"
            onClick={() => {
                loadNextTicket()
>>>>>>> master
            }}
          />
        </div>
        <br></br>
<<<<<<< HEAD
        <div>
          Ticket #{ticketIndex + 1} of {props.details.tickets.length}
        </div>
=======
        <div>Ticket #{ticketIndex+1} of {props.details.tickets.length}</div>
>>>>>>> master
        <br></br>
        {modalButtons()}

        <br></br>
      </div>
    </Fragment>
  );
};

<<<<<<< HEAD
export default ReceiptModal;
=======
export default ReceiptModal;
>>>>>>> master
