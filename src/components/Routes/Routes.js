import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Main from "../HomePage/HomePage";
import MainNew from "../HomePage/HomePageNEW";
import Video from "../Video/Video";
import EventEdit from "../../EventCreation/EventEdit";
import Events from "../../Events/Events";
import EventsPast from "../../Events/EventsPast";
import EventDetails from "../../Events/EventDetails";
import EventDeletion from "../../EventCreation/DeleteEvent";
import ContactUs from "../ContactUs/ContactUs";
import CheckoutBT from "../../TicketPurchases/Checkout_bt";
import Checkout from "../../TicketPurchases/Checkout";
import TicketSelection from "../../TicketPurchases/TicketSelection";
import SignIn from "../../Users/Authentication/SignIn";
import SignUp from "../../Users/Authentication/SignUp";
import PasswordRecovery from "../../Users/Authentication/PasswordRecovery";
import PasswordReset from "../../Users/Authentication/PasswordReset";
import PrivateRoute from "./PrivateRoute";
import BuyerDashboard from "../../Users/Buyer/BuyerDashboard";
import PaypalOnboarding from "../../Users/Buyer/PaypalOnboarding";
import VendorDashboard from "../../Users/Vendor/VendorDashboard";

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

  return (
    <Aux>
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
            <Footer></Footer>
          </React.Fragment>
        )}
      />


<Route
        path="/new"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <MainNew />
            <Footer></Footer>
          </React.Fragment>
        )}
      />

      <Route
        path="/signin"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <SignIn />
            <Footer></Footer>
          </React.Fragment>
        )}
      />

      <Route
        path="/signup"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <SignUp />
            <Footer></Footer>
          </React.Fragment>
        )}
      />

      <Route
        path="/passwordrecovery"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <PasswordRecovery />
            <Footer></Footer>
          </React.Fragment>
        )}
      />

      <Route
        path="/passwordreset"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <PasswordReset />
            <Footer></Footer>
          </React.Fragment>
        )}
      />

    <Route
      path="/buyerdashboard"
      exact
      render={(routeProps) => (
        <React.Fragment>
          <Header
            positioning="fixed"
            logo={LogoC}
            clicked={toggleSideDrawer}
          />
          <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
          <BuyerDashboard />
          <Footer></Footer>
        </React.Fragment>
      )}
    />

    <Route
      path="/paypalonboarding"
      exact
      render={(routeProps) => (
          <PaypalOnboarding />
      )}
    />

    <Route
      path="/vendordashboard"
      exact
      render={(routeProps) => (
        <React.Fragment>
          <Header
            positioning="fixed"
            logo={LogoC}
            clicked={toggleSideDrawer}
          />
          <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
          <VendorDashboard />
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
        path="/eventedit"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header
              positioning="fixed"
              logo={LogoC}
              clicked={toggleSideDrawer}
            />
            <SideDrawer open={showSideDrawer} closed={closeSideDrawer} />
            <EventEdit />
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
        path="/checkout_bt"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <CheckoutBT />
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

    </Aux>
  );
};

export default Routes;