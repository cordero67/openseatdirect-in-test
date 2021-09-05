import React, { useState, Fragment } from "react";
import { Route } from "react-router-dom";

import Events from "../../Events/Events";
import EventsPast from "../../Events/EventsPast";
import EventDetails from "../../Events/EventDetails";
import EventDeletion from "../../EventCreation/DeleteEvent";
import PrivacyPolicy from "../Corporate/PrivacyPolicy";
import TermsConditions from "../Corporate/TermsConditions";
import CustomerInfoPaid from "../../TicketPurchases/CustomerInfoPaid";
import CustomerInfoFree from "../../TicketPurchases/CustomerInfoFree";
import CheckoutPayPalExpress from "../../TicketPurchases/CheckoutPayPalExpress";
import CheckoutPayPalMerchant from "../../TicketPurchases/CheckoutPayPalMerchant";
import TicketSelection from "../../TicketPurchases/TicketSelection";
import Authentication from "../../Users/Authentication/Authentication";
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
          <React.Fragment>
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
          </React.Fragment>
        )}
      />

      <Route
        path="/myaccount"
        exact
        render={(routeProps) => (
          <React.Fragment>
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
          </React.Fragment>
        )}
      />

      <Route
        path="/privacypolicy"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <PrivacyPolicy />
            <Footer></Footer>
          </React.Fragment>
        )}
      />

      <Route
        path="/termsconditions"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <TermsConditions />
            <Footer></Footer>
          </React.Fragment>
        )}
      />

      <Route
        path="/delete"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <EventDeletion />
            <Footer></Footer>
          </React.Fragment>
        )}
      />

      <Route
        path="/"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <Events />
            <Footer></Footer>
          </React.Fragment>
        )}
      />

      <Route
        path="/past"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <EventsPast />
            <Footer></Footer>
          </React.Fragment>
        )}
      />

      <Route
        path="/infopaid"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <CustomerInfoPaid />
          </React.Fragment>
        )}
      />

      <Route
        path="/infofree"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <CustomerInfoFree />
          </React.Fragment>
        )}
      />

      <Route
        path="/checkout-paypalexpress"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <CheckoutPayPalExpress />
          </React.Fragment>
        )}
      />

      <Route
        path="/checkout-paypalmerchant"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <CheckoutPayPalMerchant />
          </React.Fragment>
        )}
      />

      <Route
        path="/ed/"
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <EventDetails />
            <Footer></Footer>
          </React.Fragment>
        )}
      />

      <Route
        path="/et/"
        render={(routeProps) => (
          <React.Fragment>
            <TicketSelection />
          </React.Fragment>
        )}
      />
    </Fragment>
  );
};

export default Routes;

/*


      <Route
        path="/personal"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <BuyerAccount />
            <Footer></Footer>
          </React.Fragment>
        )}
      />
      */
