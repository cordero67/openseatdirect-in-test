import { API } from "../config";
import {isValidEventNum} from "../utils/validators";

const storeEventAPIData = (eventJson) =>{
  let eventNum_string = JSON.stringify(eventJson.eventNum);
  let evtLoaded = JSON.parse (localStorage.getItem (`eventAPILoaded`));
  let enumLoaded = JSON.parse (localStorage.getItem (`eventNum`));
  console.log ("in storeEventAPIData=", evtLoaded,enumLoaded,eventNum_string, eventJson);
  if ((enumLoaded===eventNum_string) && evtLoaded) return;
  console.log ("storing new eventData",eventNum_string);
  localStorage.setItem (`eventAPIData`,JSON.stringify(eventJson));
  localStorage.setItem (`eventNum`,JSON.stringify(eventJson?.eventNum));
  localStorage.setItem (`eventAPILoaded`,'true');
}


const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.status);
  }
  return response;
};


export const getAPIEvent = (eventNumString) =>{
  return  new Promise ((resolve, reject)=>{
      //cache event Data if aske for two or more times.
      // set in case next step fails 
      let evnum = ('string'=== typeof eventNumString) ? eventNumString : JSON.stringify(eventNumString);
      const isGoodEventNum = isValidEventNum(evnum);
  
      if (!isGoodEventNum){
        return resolve({ok: false, noevent:true});
      };
  
      // reload event iff eventNum is valid AND eventNum is different from stored Event Num OR 
      //            eventAPILoaded flag is false, meaning event data never succesfully loaded on prior attempts
      let reloadEventData = isGoodEventNum && (
            (evnum!==localStorage.getItem(`eventNum`)) || (!JSON.parse(localStorage.getItem ('eventAPILoaded'))));
    

      console.log (">>>>> reloadEventData, evnum =>>>>", reloadEventData, evnum,
      localStorage.getItem(`eventNum`),
      evnum!==localStorage.getItem(`eventNum`),"eventAPILoaded=",JSON.parse(localStorage.getItem ('eventAPILoaded')));
      
      if (!reloadEventData ) {
        console.log ("resolving with stored data", reloadEventData);
        return resolve ({ok:true, data: JSON.parse (localStorage.getItem (`eventAPIData`))});
      };


      let url = `${API}/events/${evnum}`;  
      console.log ("continue after resolving w url=", url);

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json"); 
      return fetch(url, {
        method: "GET",
        headers:myHeaders
      })
      .then(handleErrors)
      .then((response) => {
          return response.json();
        })
      .then ((r) =>{
        if (isValidEventNum(r.eventNum)) {
          if (!("photoUrl1" in r)) {
            r["photoUrl1"] =
              "https://imagedelivery.net/IF3fDroBzQ70u9_0XhN7Jg/cf557769-811d-44d6-8efc-cf75949d3100/public";
          };
          if (!("photoUrl2" in r)) {
            r["photoUrl2"] =
              "https://imagedelivery.net/IF3fDroBzQ70u9_0XhN7Jg/cf557769-811d-44d6-8efc-cf75949d3100/public";
          };
          storeEventAPIData(r);
          return resolve( {ok:true, data:r})
        } else{
          JSON.parse(localStorage.setItem ('eventAPILoaded','false'));
          return resolve({ok:false, noevent:true, error:"event Does not exist"});
        };
      })
      .catch((err) => {
        console.log("Inside '.catch' useOurAPiEvent",err);
        JSON.parse(localStorage.setItem ('eventAPILoaded','false'));
        return resolve ({ok:false, error:"event Does not exist", networkError:false});
      });
  })
}


