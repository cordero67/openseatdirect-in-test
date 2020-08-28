  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthAbbr = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  export const getDates = (item) => {

    let tempDateTime;
    let tempMonthAbbr;
    let tempMonthNames;
    let tempDate;
    let tempDay;
    let tempYear;
    let tempAmPm;
    let tempHours;
    let tempMinutes;
    let tempLongDateTime;

    tempDateTime = new Date(item.startDateTime);
    tempMonthAbbr = monthAbbr[tempDateTime.getMonth()];
    tempMonthNames = monthNames[tempDateTime.getMonth()];
    tempDate = tempDateTime.getDate();
    tempDay = weekDays[tempDateTime.getDay()];
    tempYear = tempDateTime.getFullYear();
    if (tempDateTime.getHours() > 12) {
      tempHours = tempDateTime.getHours() - 12;
      tempAmPm = "PM";
    } else {
      tempHours = tempDateTime.getHours();
      tempAmPm = "AM";
    }
    if (tempDateTime.getMinutes() > 9) {
      tempMinutes = tempDateTime.getMinutes();
    } else {
      tempMinutes = "0" + tempDateTime.getMinutes();
    }

    tempLongDateTime = `${tempDay}\, ${tempMonthNames} ${tempDate}\, ${tempYear} \- ${tempHours}\:${tempMinutes}${tempAmPm}`;

    return [tempMonthAbbr, tempDate, tempLongDateTime]
  }

  export const compareValues = (key, order) => {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }
      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  };

