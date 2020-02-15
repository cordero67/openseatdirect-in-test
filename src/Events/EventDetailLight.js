import React, { useState, useEffect } from "react";

import { API } from "../config";

import styles from "./EventDetail.module.css";
import Aux from "../hoc/Auxiliary/Auxiliary";

import Logo from "./NEWPIC.png";
import Logo2 from "./piff2by1.png";

const EventDetail = props => {
  const [showLargerDoublePane, setShowLargerDoublePane] = useState(false);
  const [showSmallerDoublePane, setShowSmallerDoublePane] = useState(false);

  const handleErrors = response => {
    // back-end server is down, i.e. response is "undefined"
    // "ERROR" will be "err"
    console.log("Inside 'apiCore' 'handleErrors()'", response);
    //console.log("json response: ", expandedLog(response, 1));
    if (!response.ok) {
      console.log("response was false!");
      //console.log("response.status: ", response.status);
      throw Error(response.status);
    }
    return response;
  };

  const getEventData = () => {
    return fetch(`${API}/events`, {
      method: "GET"
    })
      .then(handleErrors)
      .then(response => {
        console.log("'apiCore' - 'getEventData()' - '.then' block");
        return response.json();
      })
      .catch(err => {
        console.log(
          "Inside '.catch' block of 'getEventData()', this is the error:",
          err
        );
        throw Error(err);
      });
  };

  useEffect(() => {
    //getEventData();
    stylingUpdate(window.innerWidth, window.innerHeight);
  }, []);

  const stylingUpdate = (inWidth, inHeight) => {
    // based on window width, displays one or two panes
    if (inWidth < 800) {
      setShowLargerDoublePane(false);
    } else {
      setShowLargerDoublePane(true);
    }
    if (inWidth < 480) {
      setShowSmallerDoublePane(false);
    } else {
      setShowSmallerDoublePane(true);
    }
  };

  window.onresize = function(event) {
    stylingUpdate(window.innerWidth, window.innerHeight);
  };

  const ticketsHandler = () => {
    window.location.href = "/ev/lightofgold?eventID=46017305135";
  };

  let summaryPlacard;

  if (showLargerDoublePane) {
    summaryPlacard = (
      <div className={styles.SummaryPlacard}>
        <div className={styles.SummaryDetails}>
          <div className={styles.Month}>MAY</div>
          <div className={styles.Date}>20</div>
          <div className={styles.Event}>
            2020 Gold Women's Business Connect Conference
          </div>
          <div className={styles.Presenter}>
            by Light of Gold PR, Marketing, and Consulting LLC
          </div>
        </div>
        <div className={styles.TicketRange}>
          <div className={styles.Prices}>$30 - $50</div>
        </div>
      </div>
    );
  } else
    summaryPlacard = (
      <div className={styles.SummaryPlacard}>
        <div className={styles.SummaryDetails}>
          <div className={styles.Month}>MAY</div>
          <div className={styles.Date}>20</div>
          <div className={styles.Event}>
            2020 Gold Women's Business Connect Conference
          </div>
          <div className={styles.Presenter}>
            by Light of Gold PR, Marketing, and Consulting LLC
          </div>
        </div>
      </div>
    );

  let image;

  image = (
    <img
      className={styles.ImageBox}
      src="https://www.openseatdirect.com/api/event/photo/e/46017305135"
      alt="Event Logo Coming Soon!!!"
    />
  );

  let topDisplay;
  let ticketDisplay;
  let middleDisplay;
  let bottomDisplay;

  if (showLargerDoublePane) {
    topDisplay = (
      <div className={styles.UpperGrid}>
        {image}
        {summaryPlacard}
      </div>
    );
    middleDisplay = null;
  } else {
    topDisplay = <div className={styles.UpperGrid}>{image}</div>;
    if (showSmallerDoublePane) {
      middleDisplay = (
        <Aux>
          <div className={styles.MiddleGrid}>
            <div>
              <div className={styles.Month}>MAY</div>
              <div className={styles.Date}>20</div>
            </div>
            <div>
              <div className={styles.TitleLeft}>
                2020 Gold Women's Business Connect Conference
              </div>
              <div className={styles.TextLeft}>
                by Light of Gold PR, Marketing, and Consulting LLC
              </div>
            </div>
          </div>
        </Aux>
      );
    } else {
      middleDisplay = (
        <Aux>
          <div className={styles.MiddleGrid}>
            <div>
              <div className={styles.TitleLeft}>
                2020 Gold Women's Business Connect Conference
              </div>
              <div className={styles.TextLeft}>
                by Light of Gold PR, Marketing, and Consulting LLC
              </div>
            </div>
          </div>
        </Aux>
      );
    }
  }

  //  <div className={styles.Presenter}>by PIFF Films</div>

  if (!showLargerDoublePane) {
    ticketDisplay = (
      <div className={styles.TicketGrid}>
        <div className={styles.PriceRange}>$30 - $50</div>
        <div className={styles.ButtonContainer}>
          <button onClick={ticketsHandler} className={styles.ButtonGreen}>
            Tickets
          </button>
        </div>
      </div>
    );
  } else {
    ticketDisplay = (
      <div className={styles.TicketGrid}>
        <div className={styles.PriceRange}>$30 - $50</div>
        <div className={styles.ButtonContainer}>
          <button onClick={ticketsHandler} className={styles.ButtonGreen}>
            Tickets
          </button>
        </div>
      </div>
    );
  }

  if (showSmallerDoublePane) {
    bottomDisplay = (
      <div className={styles.LowerGrid}>
        <div className={styles.LeftLowerGrid}>
          <div className={styles.TitleLeft}>Event Details</div>
          <div className={styles.TextLeft}>
            <div>
              The 2020 Gold Women’s Business Connect Conference will shine a
              light on Women, Power, Business, and Economic Development! Learn
              strategies to grow your business, enhance your productivity, and
              increase your bottom line. At the Conference, we’ll have fun speed
              networking activities, breakout sessions on important topics,
              breakfast and refreshments, vendor and resource information
              tables, prize drawings, and more!
            </div>
          </div>
          <br></br>
          <div className={styles.TitleLeft}>
            About Light of Gold PR, Marketing, and Consulting LLC
          </div>
          <div className={styles.TextLeft}>
            <div>
              Light of Gold PR, Marketing and Consulting LLC, is a MWBE (City
              certified Minority and Women Business Enterprise), specializes in
              PR (Public Relations), Marketing, Consulting, Branding & Digital
              products & services, Web, Video and TV Commercials, as well as
              Events and Social Media Management.
            </div>
            <br></br>
            <div>
              Light of Gold PR, Marketing, and Consulting LLC. provides
              innovative solutions and creative opportunities for your products
              and services to be promoted to the public consistently. They
              enhance your image, give you more visibility, and save your
              organization money! They can increase the overall profitability by
              positioning your company in front of your target market.
            </div>
            <br></br>
            <div >
              For more information visit their Website at {" "}
              <span
                style={{ color: "blue" }}
                onClick={() =>
                  (window.location.href = `http://www.lightofgoldpr.com`)
                }
              >
                http://www.lightofgoldpr.com.
              </span>
            </div>
          </div>
        </div>

        <div className={styles.RightLowerGrid}>
          <div className={styles.TitleRight}>Date and Time</div>
          <div className={styles.TextRight}>May 20, 2020</div>
          <div className={styles.TextRight}>8:30 am - 12:30 pm</div>
          <br></br>
          <div className={styles.TitleLeft}>Location</div>
          <div className={styles.TextLeft}>Berkeley College - </div>
          <div className={styles.TextLeft}>Bryant Park 2nd Fl.</div>
          <div className={styles.TextLeft}>12 E 41st St.</div>
          <div className={styles.TextLeft}>between Madison and 5th Ave</div>
          <div className={styles.TextLeft}>New York, NY 10017</div>
        </div>
      </div>
    );
  } else {
    bottomDisplay = (
      <div className={styles.LowerGrid}>
        <div className={styles.LeftLowerGrid}>
          <div className={styles.TitleLeft}>Date and Time</div>
          <div className={styles.TextLeft}>May 20, 2020</div>
          <div className={styles.TextLeft}>8:30 am - 12:30 pm</div>
          <br></br>
          <div className={styles.TitleLeft}>Location</div>
          <div className={styles.TextLeft}>Berkeley College</div>
          <div className={styles.TextLeft}>Bryant Park 2nd Fl.</div>
          <div className={styles.TextLeft}>12 E 41st St.</div>
          <div className={styles.TextLeft}>between Madison and 5th Ave</div>
          <div className={styles.TextLeft}>New York, NY 10017</div>
          <br></br>
          <div className={styles.TitleLeft}>Event Details</div>
          <div className={styles.TextLeft}>
            <div>
              The 2020 Gold Women’s Business Connect Conference will shine a
              light on Women, Power, Business, and Economic Development! Learn
              strategies to grow your business, enhance your productivity, and
              increase your bottom line. At the Conference, we’ll have fun speed
              networking activities, breakout sessions on important topics,
              breakfast and refreshments, vendor and resource information
              tables, prize drawings, and more!
            </div>
          </div>
          <br></br>
          <div className={styles.TitleLeft}>
            About Light of Gold PR, Marketing, and Consulting LLC
          </div>
          <div className={styles.TextLeft}>
            <div>
              The 2020 Gold Women’s Business Connect Conference will shine a
              light on Women, Power, Business, and Economic Development! Learn
              strategies to grow your business, enhance your productivity, and
              increase your bottom line. At the Conference, we’ll have fun speed
              networking activities, breakout sessions on important topics,
              breakfast and refreshments, vendor and resource information
              tables, prize drawings, and more!
            </div>
            <br></br>
            <div>
              Light of Gold PR, Marketing, and Consulting LLC. provides
              innovative solutions and creative opportunities for your products
              and services to be promoted to the public consistently. They
              enhance your image, give you more visibility, and save your
              organization money! They can increase the overall profitability by
              positioning your company in front of your target market. link.
            </div>
            <br></br>
            <div>
              For more information visit their Website at {" "}
              <span
                style={{ color: "blue" }}
                onClick={() =>
                  (window.location.href = `http://www.lightofgoldpr.com`)
                }
              >
                http://www.lightofgoldpr.com.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.MainContainer}>
      {topDisplay}
      {ticketDisplay}
      {middleDisplay}
      {bottomDisplay}
    </div>
  );
};

export default EventDetail;
