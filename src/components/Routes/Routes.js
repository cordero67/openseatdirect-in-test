import React, { useState, Fragment } from "react";
import { Route } from "react-router-dom";

import Events from "../../Events/Events";
import EventsPast from "../../Events/EventsPast";
import EventDetails from "../../Events/EventDetails";
import EventDetailsNEW from "../../Events/EventDetailsNEW";
import EventDeletion from "../../EventCreation/DeleteEvent";
import PrivacyPolicy from "../Corporate/PrivacyPolicy";
import TermsConditions from "../Corporate/TermsConditions";
import CustomerInfoPaid from "../../TicketPurchases/CustomerInfoPaid";
import CustomerInfoFree from "../../TicketPurchases/CustomerInfoFree";
import CheckoutPayPalExpress from "../../TicketPurchases/CheckoutPayPalExpress";
import CheckoutPayPalMerchant from "../../TicketPurchases/CheckoutPayPalMerchant";
import CheckoutStripeIndex from "../../TicketPurchases/StripeIndex";
import CheckoutStripe from "../../TicketPurchases/CheckoutStripe";
import CheckoutOpennode from "../../TicketPurchases/CheckoutOpennode";
import CheckoutStripeResult from "../../TicketPurchases/CheckoutStripeResult";
import TicketSelection from "../../TicketPurchases/TicketSelection";
import AuthenticationOLD from "../../Users/Authentication/AuthenticationOLD";
import AuthenticationCURRENT from "../../Users/Authentication/Authentication";
import Authentication from "../../Authentication/Authentication";
import StripeConnection from "../../Users/Authentication/StripeConnection";
//import BuyerAccount from "../../Users/Buyer/BuyerAccount";
import VendorAccount from "../../Users/Vendor/VendorAccount";

import Header from "../Headers/Header";
import SideDrawer from "../SideDrawer/SideDrawer";
import Footer from "../Footers/Footer";

import LogoC from "../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png";

const Routes = () => {
  const [showSideDrawer, setShowSideDrawer] = useState(false);

  const closeSideDrawer = () => {
    setShowSideDrawer(false);
  };

  const toggleSideDrawer = () => {
    setShowSideDrawer(!showSideDrawer);
  };

  const [isResizing, setIsResizing] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  const stylingUpdate = (inWidth) => {
    setIsResizing(true);
    setScreenSize(inWidth);
    setIsResizing(false);
  };

  window.onresize = function (event) {
    stylingUpdate(window.innerWidth);
  };

  const [userObject, setUserObject] = useState({});

  return (
    <Fragment>
      <Route
        path="/auth"
        exact
        render={(routeProps) => (
          <Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <Authentication
              user={userObject}
              updateUser={(data) => {
                console.log("AND TO HERE");
                console.log("USER: ", userObject);
                setUserObject(data);
              }}
            />
            <Footer></Footer>
          </Fragment>
        )}
      />

      <Route
        path="/authNEW"
        exact
        render={(routeProps) => (
          <Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <AuthenticationOLD
              user={userObject}
              updateUser={(data) => {
                console.log("AND TO HERE");
                console.log("USER: ", userObject);
                setUserObject(data);
              }}
            />
            <Footer></Footer>
          </Fragment>
        )}
      />

      <Route
        path="/stripeconnection"
        exact
        render={(routeProps) => (
          <Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <StripeConnection
              user={userObject}
              updateUser={(data) => {
                console.log("AND TO HERE");
                console.log("USER: ", userObject);
                setUserObject(data);
              }}
            />
            <Footer></Footer>
          </Fragment>
        )}
      />

      <Route
        path="/myaccount"
        exact
        render={(routeProps) => (
          <Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <VendorAccount
              user={userObject}
              buyer={"ANOTHER"}
              owner={"SOMETHING"}
            />
            <Footer></Footer>
          </Fragment>
        )}
      />

      <Route
        path="/privacypolicy"
        exact
        render={(routeProps) => (
          <Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <PrivacyPolicy />
            <Footer></Footer>
          </Fragment>
        )}
      />

      <Route
        path="/termsconditions"
        exact
        render={(routeProps) => (
          <Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <TermsConditions />
            <Footer></Footer>
          </Fragment>
        )}
      />

      <Route
        path="/delete"
        exact
        render={(routeProps) => (
          <Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <EventDeletion />
            <Footer></Footer>
          </Fragment>
        )}
      />

      <Route
        path="/"
        exact
        render={(routeProps) => (
          <Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <Events />
            <Footer></Footer>
          </Fragment>
        )}
      />

      <Route
        path="/past"
        exact
        render={(routeProps) => (
          <Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <EventsPast />
            <Footer></Footer>
          </Fragment>
        )}
      />

      <Route
        path="/infopaid"
        exact
        render={(routeProps) => (
          <Fragment>
            <CustomerInfoPaid />
          </Fragment>
        )}
      />

      <Route
        path="/infofree"
        exact
        render={(routeProps) => (
          <Fragment>
            <CustomerInfoFree />
          </Fragment>
        )}
      />

      <Route
        path="/checkout-paypalexpress"
        exact
        render={(routeProps) => (
          <Fragment>
            <CheckoutPayPalExpress />
          </Fragment>
        )}
      />

      <Route
        path="/checkout-paypalmerchant"
        exact
        render={(routeProps) => (
          <Fragment>
            <CheckoutPayPalMerchant />
          </Fragment>
        )}
      />

      <Route
        path="/checkout-stripe-index"
        exact
        render={(routeProps) => (
          <Fragment>
            <CheckoutStripeIndex />
          </Fragment>
        )}
      />

      <Route
        path="/checkout-stripe"
        exact
        render={(routeProps) => (
          <Fragment>
            <CheckoutStripe />
          </Fragment>
        )}
      />

      <Route
        path="/checkout-stripe-result"
        exact
        render={(routeProps) => (
          <Fragment>
            <CheckoutStripeResult />
          </Fragment>
        )}
      />

      <Route
        path="/checkout-opennode"
        exact
        render={(routeProps) => (
          <Fragment>
            <CheckoutOpennode />
          </Fragment>
        )}
      />


      <Route
        path="/ed/"
        render={(routeProps) => (
          <Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <EventDetails />
            <Footer></Footer>
          </Fragment>
        )}
      />

      <Route
        path="/edNEW/"
        render={(routeProps) => (
          <Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <EventDetailsNEW />
            <Footer></Footer>
          </Fragment>
        )}
      />

      <Route
        path="/et/"
        render={(routeProps) => (
          <Fragment>
            <TicketSelection />
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default Routes;
