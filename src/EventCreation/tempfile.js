const saveEvent = async (preview) => {
    console.log("we are saving");

    if (!eventDescription.eventTitle) {
      console.log("You need to complete these fields");
      !eventDescription.eventTitle ? setEventTitleOmission(true) : setEventTitleOmission(false);
    } else {

        // Create a test FormData object
        var formData = new FormData();
        //formData.append("isDraft", eventDescription.isDraft);
        formData.append("eventNum", eventDescription.eventNum);
        formData.append("eventTitle", eventDescription.eventTitle);
        //formData.append("eventType", eventDescription.eventType);
        formData.append("locationVenueName", eventDescription.locationVenueName);
        /*
        formData.append("locationAddress1", eventDescription.locationAddress1);
        formData.append("locationAddress2", eventDescription.locationAddress2);
        formData.append("locationCity", eventDescription.locationCity);
        formData.append("locationState", eventDescription.locationState);
        formData.append("locationZipPostalCode", eventDescription.locationZipPostalCode);
        formData.append("locationCountryCode", eventDescription.locationCountryCode);
        formData.append("locationNote", eventDescription.locationNote);
        formData.append("webinarLink", eventDescription.webinarLink);
        formData.append("onlineInformation", eventDescription.onlineInformation);
        formData.append("shortDescription", eventDescription.shortDescription);
        formData.append("longDescription", eventDescription.longDescription);
        */
        formData.append("startDateTime", eventDescription.startDate);

        let imageBlob;

        console.log("type of: ", typeof eventDescription.eventImage)

        if (imageToSend){
            console.log("imageToSend: ", imageToSend)
            console.log("typeof: ", typeof imageToSend)
            imageBlob = await new Promise (resolve => imageToSend.toBlob(resolve, 'image/png'));
        } else {
          console.log("there is no image");
        };

        formData.append("photo", imageBlob);
        formData.append("startDateTime", eventDescription.startDate);
        
        // Display the key/value pairs
        for (var pair of formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]); 
        }

        let userid = JSON.parse(localStorage.getItem("user")).user._id;
        let token = JSON.parse(localStorage.getItem("user")).token;
        const authstring =
          `Bearer ${token}`;
        const APIURL = "https://www.openseatdirect.com/api";
        var myHeaders = new Headers();
        myHeaders.append("Authorization", authstring);

        let apiurl;

        if (eventDescription.eventNum) {
          console.log("editting an existing event");
          apiurl = `${APIURL}/eventix/${userid}/${eventDescription.eventNum}`;
          console.log("apiurl: ", apiurl)
          fetch(apiurl, {
            method: "post",
            headers: myHeaders,
            body: formData,
            redirect: "follow",
          })
          .then(handleErrors)
          .then((response) => {
            console.log("response in event/create", response);
            console.log("apiurl: ", apiurl)
            return response.json();
          })
          .then((res) => {
            console.log(res);
            if (preview) {
              window.location.href = `/ed/${eventDescription.eventUrl}?eventID=${eventDescription.eventNum}`
            }
          })
          .catch((err) => {
            console.log("**ERROR THROWN", err);
          });
        } else {
          console.log("creating a new event");
          apiurl = `${APIURL}/eventix/${userid}`;
          fetch(apiurl, {
            method: "post",
            headers: myHeaders,
            body: formData,
            redirect: "follow",
          })
          .then(handleErrors)
          .then((response) => {
            console.log("response in event/create", response);
            return response.json();
          })
          .then((res) => {
            console.log(res);
            if (preview) {
              window.location.href = `/ed/${eventDescription.eventUrl}?eventID=${eventDescription.eventNum}`
            }
          })
          .catch((err) => {
            console.log("**ERROR THROWN", err);
          });
        
        }
    }
  };