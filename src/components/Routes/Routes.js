import React, { useState } from 'react';
import { Route } from 'react-router-dom';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Main from '../HomePage/HomePage';
import Video from '../Video/Video';
import EventCreation from '../../EventCreation/EventCreation';
import Events from '../../Events/Events';
import EventDetail from '../../Events/EventDetail';
import EventDetailHaHa from '../../Events/EventDetailHaHa';
import EventDetailPIFF from '../../Events/EventDetailPIFF';
import EventDetailTech from '../../Events/EventDetailTech';
import EventDetailLight from '../../Events/EventDetailLight';
import ContactUs from '../ContactUs/ContactUs';
import CheckoutBT from '../../TicketPurchases/Checkout_bt';
import CheckoutPP from '../../TicketPurchases/Checkout_pp';
import TicketSelection from '../../TicketPurchases/TicketSelection.js';

import Header from '../Headers/Header';
import SideDrawer from '../SideDrawer/SideDrawer';
import Footer from '../Footers/Footer';

//import LogoA from '../../assets/OpenSeatDirect/WhiteLettering_BlueBackground_1024.png';
//import LogoB from '../../assets/OpenSeatDirect/BlueLettering_WhiteBackground_1024.png';
import LogoC from '../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png';
//import LogoD from '../../assets/OpenSeatDirect/Black_and_White_1024.png';
//import LogoE from '../../assets/OpenSeatDirect/Black_and_White_TransparentBackground_1024.png';

const Routes = () => {

  const [showSideDrawer, setShowSideDrawer] = useState(false)
  
  const closeSideDrawer = () => {
    setShowSideDrawer(false);
  }

  const toggleSideDrawer = () => {
    setShowSideDrawer(!showSideDrawer)
  }

  return (
    <Aux>
      <Route
        path="/"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header positioning="fixed" logo={LogoC} clicked={toggleSideDrawer}/>
            <SideDrawer
              open={showSideDrawer}
              closed={closeSideDrawer}/>
            <Main />
            <Footer></Footer>
          </React.Fragment>
        )}
      />
      <Route
        path="/video"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header positioning="fixed" logo={LogoC} clicked={toggleSideDrawer}/>
            <SideDrawer
              open={showSideDrawer}
              closed={closeSideDrawer}/>
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
            <Header positioning="fixed" logo={LogoC} clicked={toggleSideDrawer}/>
            <SideDrawer
              open={showSideDrawer}
              closed={closeSideDrawer}/>
            <ContactUs />
            <Footer></Footer>
          </React.Fragment>
        )}
      />



      <Route
        path="/eventcreation"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header positioning="fixed" logo={LogoC} clicked={toggleSideDrawer}/>
            <SideDrawer
              open={showSideDrawer}
              closed={closeSideDrawer}/>
            <EventCreation />
            <Footer></Footer>
          </React.Fragment>
        )}
      />
      <Route
        path="/events"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <Header positioning="fixed" logo={LogoC} clicked={toggleSideDrawer}/>
            <SideDrawer
              open={showSideDrawer}
              closed={closeSideDrawer}/>
            <Events />
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
        path="/checkout_pp"
        exact
        render={(routeProps) => (
          <React.Fragment>
            <CheckoutPP />
          </React.Fragment>
        )}
      />

      <Route
        path="/ed/"
        render={(routeProps) => (
          <React.Fragment>
            <Header positioning="fixed" logo={LogoC} clicked={toggleSideDrawer}/>
            <SideDrawer
              open={showSideDrawer}
              closed={closeSideDrawer}/>
            <EventDetail />
            <Footer></Footer>
          </React.Fragment>
        )}
      />
      <Route
        path="/edh/"
        render={(routeProps) => (
          <React.Fragment>
            <Header positioning="fixed" logo={LogoC} clicked={toggleSideDrawer}/>
            <SideDrawer
              open={showSideDrawer}
              closed={closeSideDrawer}/>
            <EventDetailHaHa />
            <Footer></Footer>
          </React.Fragment>
        )}
      />
      <Route
        path="/edf/"
        render={(routeProps) => (
          <React.Fragment>
            <Header positioning="fixed" logo={LogoC} clicked={toggleSideDrawer}/>
            <SideDrawer
              open={showSideDrawer}
              closed={closeSideDrawer}/>
            <EventDetailPIFF />
            <Footer></Footer>
          </React.Fragment>
        )}
      />
      <Route
        path="/edt/"
        render={(routeProps) => (
          <React.Fragment>
            <Header positioning="fixed" logo={LogoC} clicked={toggleSideDrawer}/>
            <SideDrawer
              open={showSideDrawer}
              closed={closeSideDrawer}/>
            <EventDetailTech />
            <Footer></Footer>
          </React.Fragment>
        )}
      />
      <Route
        path="/edl/"
        render={(routeProps) => (
          <React.Fragment>
            <Header positioning="fixed" logo={LogoC} clicked={toggleSideDrawer}/>
            <SideDrawer
              open={showSideDrawer}
              closed={closeSideDrawer}/>
            <EventDetailLight />
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
