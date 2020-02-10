import React, { useState, useEffect } from "react";

import { API } from "../config";

import styles from "./EventDetail.module.css";
import Aux from "../hoc/Auxiliary/Auxiliary";

import Logo from "./NEWPIC.png";

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

  let summaryPlacard;

  if (showLargerDoublePane) {
    summaryPlacard = (
      <div className={styles.SummaryPlacard}>
        <div className={styles.SummaryDetails}>
          <div className={styles.Month}>MAY</div>
          <div className={styles.Date}>06-09</div>
          <div className={styles.Event}>
            Philadelphia Independent Film Festival - Film and Technology
            Discussions. Democratizing Content.
          </div>
          <div className={styles.Presenter}>by PIFF Films</div>
        </div>
        <div className={styles.TicketRange}>
          <div className={styles.Prices}>$50 - $175</div>
        </div>
      </div>
    );
  } else
    summaryPlacard = (
      <div className={styles.SummaryPlacard}>
        <div className={styles.SummaryDetails}>
          <div className={styles.Month}>MAY</div>
          <div className={styles.Date}>06-09</div>
          <div className={styles.Event}>
            Philadelphia Independent Film Festival - Film and Technology
            Discussions. Democratizing Content.
          </div>
          <div className={styles.Presenter}>by PIFF Films</div>
        </div>
      </div>
    );

  let image;

  image = (
    <img
      className={styles.ImageBox}
      src={Logo}
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
    middleDisplay = <div className={styles.MiddleGrid}>{summaryPlacard}</div>;
  }

  if (!showLargerDoublePane) {
    ticketDisplay = (
      <div className={styles.TicketGrid}>
        <div className={styles.PriceRange}>$50 - $175</div>
        <div className={styles.ButtonContainer}>
          <button className={styles.ButtonGreen}>Tickets</button>
        </div>
      </div>
    );
  } else {
    ticketDisplay = (
      <div className={styles.TicketGrid}>
        <div className={styles.PriceRange}>$50 - $175</div>
        <div className={styles.ButtonContainer}>
          <button className={styles.ButtonGreen}>Tickets</button>
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
              Part of the Media Track #phillytechweek #PTW19 Philadelphia Tech
              Week 2019 ~ presented by Comcast Where: TBD #piffFilms Creative &
              Media track discussions supported by: mediabureau.com,
              gearstuff.com, University of the Arts Corzo Center for the
              Creative Economy, and Philly Nexus.e
            </div>
          </div>
          <br></br>
          <div className={styles.TitleLeft}>About PIFF</div>
          <div className={styles.TextLeft}>
            <div>
              PIFF discovers and curates a unique collection of local and global
              Independent Drama, Documentary, Thriller, Sci-Fi, Political,
              Horror, Comedy, Music Video, Animation, Web Series and other
              thought provoking films in Philadelphia, PA, using surrounding
              traditional and non-traditional theaters and venues. PIFF is
              committed too discovering and presenting a unique cinematic
              experience unrestrained by conventional boundaries.
            </div>
            <br></br>
            <div>
              At this year's events, PIFF will be discussing the tokenization
              (democratization of content) of film, independent distribution,
              breaking media technology, media and propaganda, via the cross
              roads of digital story telling, media, film, education, and
              culture using #uff #piff #piffFilms #mediabureau #PTW20 #AI
              #BigData among other tags.
            </div>
          </div>

          <br></br>
          <div className={styles.TitleLeft}>History</div>
          <div className={styles.TextLeft}>
            <div>
              Founded by digital media pioneer Media Bureau Inc in 2007, the
              Philadelphia Independent Film Festival’s (PIFF) birth was a direct
              result of a colliding critical mass of independent digital film
              and media, and a swift reaction to the perceived demand to
              “experience” it. The goal was to establish an event environment to
              discuss film and its digital path while always trying to innovate
              at the leading edge. The festival incubated from the then
              omni-present (#uff) underground film forum. The forum had been
              meeting off and on since the inception of the Media Bureau in 1997
              and was the first place in PA to regularly produce, screen, and
              stream digital films and discuss the art of digital storytelling
              at the intersection of digital media and technology. No other
              place existed like it at the time in Philadelphia and the
              tri-state area.
            </div>
            <br></br>
            <div>
              Through a steady stream of incredibly in the moment original
              content and technology grew the rare appreciation for film in ways
              that we never had thought of. It was not a passive experience
              anymore. With this we realized we were taking part in
              Philadelphia’s transformation, from analog to digital content
              production, and in turn were witnessing the birth of a new
              (digital) storytelling technique. The audience reaction was
              instant.
            </div>
            <br></br>
            <div>
              This analog to digital media transition (adoption) was complete
              across the consumer market place as early as 2006 (just in time to
              adjust via the great recession) and was a strategic reason to
              launch the festival when we did. By this time, MBN had fully
              engaged in digital media history from a uniquely Philadelphian,
              old city (historical) perspective. Our ecosystem had been
              established via design and by “request” and was defined by our
              ability to reach our layered and displaced digital communities on
              demand. We have been fortunate to be able to follow and peer in to
              the many journeys of countless storytellers, innovators,
              creative’s, and filmmakers, in all formats, across many borders,
              over 20+ years. We are now screening/discussing digital film from
              a unique pertch – the Democratization of Content.
            </div>
            <br></br>
            <div>
              Digital filmmaking has taught the festival many things. Most
              importantly, perhaps, it has opened the minds of possibility for
              anybody to exercise their right to shoot and post “their story”.
              This was how we were able to coin the term in 2008, Real Time
              Documentary, to help our filmmakers better place their experiences
              in the context of a narrative, yet obviously documentary film. The
              festival was conceived to help enable this type of creative cipher
              to know no cinematic bounds.
            </div>
            <br></br>
            <div>
              The Philadelphia Independent Film Festival (PIFF) is in its
              thirteenth year of operation. Each year, the festival has grown,
              and adds to its knowledge bank a diverse selection of unknown
              national and international films. 95% of the films the festival
              screens during its 4+ day festival are world and local premiers
              while an average of 70% +/- are world premiers.
            </div>
          </div>
        </div>

        <div className={styles.RightLowerGrid}>
          <div className={styles.TitleRight}>Date and Time</div>
          <div className={styles.TextRight}>May 6, 2020</div>
          <div className={styles.TextRight}>8pm - 10pm</div>
          <br></br>
          <div className={styles.TitleRight}>Location</div>
          <div className={styles.TextRight}>Adress</div>
          <div className={styles.TextRight}>City, State</div>
        </div>
      </div>
    );
  } else {
    bottomDisplay = (
      <div className={styles.LowerGrid}>
        <div className={styles.RightLowerGrid}>
          <div className={styles.TitleLeft}>Date and Time</div>
          <div className={styles.TextLeft}>May 6, 2020</div>
          <div className={styles.TextLeft}>8pm - 10pm</div>
          <br></br>
          <div className={styles.TitleLeft}>Location</div>
          <div className={styles.TextLeft}>Adress</div>
          <div className={styles.TextLeft}>City, State</div>
        </div>
        <div className={styles.LeftLowerGrid}>
          <div className={styles.TitleLeft}>Event Details</div>
          <div className={styles.TextLeft}>
            <div>
              Part of the Media Track #phillytechweek #PTW19 Philadelphia Tech
              Week 2019 ~ presented by Comcast Where: TBD #piffFilms Creative &
              Media track discussions supported by: mediabureau.com,
              gearstuff.com, University of the Arts Corzo Center for the
              Creative Economy, and Philly Nexus.e
            </div>
          </div>
          <br></br>
          <div className={styles.TitleLeft}>About PIFF</div>
          <div className={styles.TextLeft}>
            <div>
              PIFF discovers and curates a unique collection of local and global
              Independent Drama, Documentary, Thriller, Sci-Fi, Political,
              Horror, Comedy, Music Video, Animation, Web Series and other
              thought provoking films in Philadelphia, PA, using surrounding
              traditional and non-traditional theaters and venues. PIFF is
              committed too discovering and presenting a unique cinematic
              experience unrestrained by conventional boundaries.
            </div>
            <br></br>
            <div>
              At this year's events, PIFF will be discussing the tokenization
              (democratization of content) of film, independent distribution,
              breaking media technology, media and propaganda, via the cross
              roads of digital story telling, media, film, education, and
              culture using #uff #piff #piffFilms #mediabureau #PTW20 #AI
              #BigData among other tags.
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
