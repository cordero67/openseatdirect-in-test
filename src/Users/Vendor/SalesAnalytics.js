import React, { useEffect, useState } from "react";

import classes from "./SalesAnalytics.module.css";

const SalesAnalytics = (props) => {

    const [buyerInfo, setBuyerInfo] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
    
        if (
          typeof window !== "undefined" &&
          localStorage.getItem(`user`) !== null
        ) {
          let tempUser = JSON.parse(localStorage.getItem("user"));
          let tempBuyerInfo = {};
          tempBuyerInfo.email = tempUser.user.email
          tempBuyerInfo.name = tempUser.user.name
          console.log("tempBuyerInfo: ", tempBuyerInfo)
          setBuyerInfo(tempBuyerInfo);
        } else {
          window.location.href = "/signin";
        }
        setIsLoading(false);
    }, []);

    return (
        <div>
            <div className={classes.DisplayPanelTitle}>
                SALES ANALYTICS
            </div>
            <div className={classes.DisplayPanel}>
                <div>Coming soon!</div>
            </div>
        </div>
    )
}

export default SalesAnalytics;