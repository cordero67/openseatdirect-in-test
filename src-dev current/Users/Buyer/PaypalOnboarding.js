import React, { useEffect, useState } from "react";

const PaypalOnboarding = (props) => {

    return (
        <div>
            <div style={{fontSize: "22px", textDecoration: "underline", fontWeight: "600"}}>PayPal ClientID and Secret</div>
            <br></br>
            <div style={{fontSize: "16px", fontWeight: "600"}}>Instructions</div>
            <br></br>
            <div style={{fontSize: "16px"}}>
                <div>
                    Navigate to the following page: https://developer.paypal.com/developer/applications/.
                </div>
                <br></br>
                <div>
                    Once logged in, you will have a vertical navigation bar on the left-hand side of the page.
                </div>
                <br></br>
                <div>
                    On this navigation bar select “My Apps & Credentials”.
                </div>
                <br></br>
                <div>
                    Click the “Live” button near the top of this page.
                </div>
                <br></br>
                <div>
                    A little lower on this same page, click on the “Create App” button.
                </div>
                <br></br>
                <div>This will switch your screen to a "Create New App" page.
                </div>
                <br></br>
                <div>
                    On this page, in the “App Name” section type in a name that reminds you of OpenSeatDirect.
                </div>
                <br></br>
                <div>
                    Then click the “Create App” button.
                </div>
                <br></br>
                <div>
                    This will switch your screen to a page that bears the title of the "App Name" you just provided.
                </div>
                <br></br>
                <div>
                    On this page, both the "Client ID" and the "Secret" under the "Hide" link are located.
                </div>
                <br></br>
                <div>
                    Once these two numbers are provided to OpenSeatDirect, all ticket proceeds will go straight to your PayPal account.
                </div>
                <br></br>
                <div>
                    On this same page scroll down to the "LIVE APP SETTINGS".
                </div>
                <br></br>
                <div>
                    In this section, check the box to the left of the "Transaction SearchAccess your PayPal transaction history.".
                </div>
            </div>
        </div>
    )

}

export default PaypalOnboarding;