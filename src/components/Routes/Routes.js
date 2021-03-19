import React, { useState, Fragment } from "react";
import { Route } from "react-router-dom";

import Main from "../HomePage/HomePage";
import Video from "../Video/Video";
import Events from "../../Events/Events";
import EventsPast from "../../Events/EventsPast";
import EventDetails from "../../Events/EventDetails";
import EventDeletion from "../../EventCreation/DeleteEvent";
import ContactUs from "../ContactUs/ContactUs";
import PrivacyPolicy from "../Corporate/PrivacyPolicy";
import TermsConditions from "../Corporate/TermsConditions";
import CustomerInfoPaid from "../../TicketPurchases/CustomerInfoPaid";
import CustomerInfoFree from "../../TicketPurchases/CustomerInfoFree";
import Checkout from "../../TicketPurchases/Checkout";
import TicketSelection from "../../TicketPurchases/TicketSelection";
import Registration from "../../TicketPurchases/Registration";
import NewPaypal from "../../TicketPurchases/NewPaypal";
import Authentication from "../../Users/Authentication/Authentication";
import Slider from "../HomePage/Slider";
import PrivateRoute from "./PrivateRoute";
import BuyerAccount from "../../Users/Buyer/BuyerAccount";
import PaypalOnboarding from "../../Users/Buyer/PaypalOnboarding";
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

  return (
    <Fragment>
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
            <Main />
          </React.Fragment>
        )}
      />

      <Route
        path="/slider"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Slider />
          </React.Fragment>
        )}
      />

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
            <Authentication />
            <Footer></Footer>
          </React.Fragment>
        )}
      />

      <Route
        path="/privacy-policy"
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
        path="/terms-and-conditions"
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

      <Route
        path="/paypalonboarding"
        exact
        render={(routeProps) => <PaypalOnboarding />}
      />

      <Route
        path="/vendor"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <VendorAccount />
            <Footer></Footer>
          </React.Fragment>
        )}
      />

      <Route
        path="/video"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <Video />
            <Footer></Footer>
          </React.Fragment>
        )}
      />

      <Route
        path="/contactus"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <ContactUs />
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
        path="/events"
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
        path="/eventspast"
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
        path="/checkout"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Checkout />
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

      <Route
        path="/er/"
        render={(routeProps) => (
          <React.Fragment>
            <Registration />
          </React.Fragment>
        )}
      />

      <Route
        path="/newpaypal/"
        render={(routeProps) => (
          <React.Fragment>
            <NewPaypal />
          </React.Fragment>
        )}
      />
    </Fragment>
  );
};

export default Routes;
