import React, { useEffect, useState } from "react";

import classes from "../Vendor/VendorAccountOLD.module.css";

const Profile = (props) => {

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
                Profile
            </div>
            <div className={classes.DisplayPanel}>
                <div>Name:{" "}{isLoading ? null : buyerInfo.name}</div>
                <br></br>
                <div>E-mail:{" "}{isLoading ? null : buyerInfo.email}</div>
            </div>
        </div>
    )
}

export default Profile;