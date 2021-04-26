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
const monthAbbr2 = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
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

  tempDateTime = new Date(item);
  tempDateTime.setMinutes(
    tempDateTime.getMinutes() + tempDateTime.getTimezoneOffset()
  );

  tempMonthAbbr = monthAbbr[tempDateTime.getMonth()];
  tempMonthNames = monthNames[tempDateTime.getMonth()];
  tempDate = tempDateTime.getDate();
  tempDay = weekDays[tempDateTime.getDay()];
  tempYear = tempDateTime.getFullYear();
  if (tempDateTime.getHours() === 0) {
    tempHours = 12;
    tempAmPm = "AM";
  } else if (tempDateTime.getHours() < 12) {
    tempHours = tempDateTime.getHours();
    tempAmPm = "AM";
  } else {
    tempHours = tempDateTime.getHours() - 12;
    tempAmPm = "PM";
  }

  if (tempDateTime.getMinutes() > 9) {
    tempMinutes = tempDateTime.getMinutes();
  } else {
    tempMinutes = "0" + tempDateTime.getMinutes();
  }

  if (tempDateTime.getHours() === 0 && tempDateTime.getMinutes() === 0) {
    tempLongDateTime = `${tempDay}\, ${tempMonthNames} ${tempDate}\, ${tempYear} \- 12 Midnight`;
  } else if (
    tempDateTime.getHours() === 12 &&
    tempDateTime.getMinutes() === 0
  ) {
    tempLongDateTime = `${tempDay}\, ${tempMonthNames} ${tempDate}\, ${tempYear} \- 12 Noon`;
  } else {
    tempLongDateTime = `${tempDay}\, ${tempMonthNames} ${tempDate}\, ${tempYear} \- ${tempHours}\:${tempMinutes}${tempAmPm}`;
  }

  return [tempMonthAbbr, tempDate, tempLongDateTime];
};

export const getLongStartDate = (item) => {
  let tempDateTime; //NEED
  let tempMonthAbbr;
  let tempMonthNames; //NEED
  let tempDate; //NEED
  let tempDay; //NEED
  let tempYear; //NEED
  let tempAmPm; //NEED
  let tempHours; //NEED
  let tempMinutes; //NEED
  let tempLongDateTime; //NEED

  tempDateTime = new Date(item); //NEED
  tempDateTime.setMinutes(
    tempDateTime.getMinutes() + tempDateTime.getTimezoneOffset()
  ); //NEED

  tempMonthAbbr = monthAbbr[tempDateTime.getMonth()];
  tempMonthNames = monthNames[tempDateTime.getMonth()]; //NEED
  tempDate = tempDateTime.getDate(); //NEED
  tempDay = weekDays[tempDateTime.getDay()]; //NEED
  tempYear = tempDateTime.getFullYear(); //NEED
  //NEED
  if (tempDateTime.getHours() === 0) {
    tempHours = 12;
    tempAmPm = "AM";
  } else if (tempDateTime.getHours() < 12) {
    tempHours = tempDateTime.getHours();
    tempAmPm = "AM";
  } else {
    tempHours = tempDateTime.getHours() - 12;
    tempAmPm = "PM";
  }

  if (tempDateTime.getMinutes() > 9) {
    tempMinutes = tempDateTime.getMinutes();
  } else {
    tempMinutes = "0" + tempDateTime.getMinutes();
  }
  //NEED

  if (tempDateTime.getHours() === 0 && tempDateTime.getMinutes() === 0) {
    tempLongDateTime = `${tempDay}\, ${tempMonthNames} ${tempDate}\, ${tempYear} \- 12 Midnight`;
  } else if (
    tempDateTime.getHours() === 12 &&
    tempDateTime.getMinutes() === 0
  ) {
    tempLongDateTime = `${tempDay}\, ${tempMonthNames} ${tempDate}\, ${tempYear} \- 12 Noon`;
  } else {
    tempLongDateTime = `${tempDay}\, ${tempMonthNames} ${tempDate}\, ${tempYear} \- ${tempHours}\:${tempMinutes}${tempAmPm}`;
  }

  return [tempLongDateTime];
};

export const getStartDate = (item) => {
  let tempDateTime; //NEED
  let tempMonthAbbr;
  let tempMonthNames; //NEED
  let tempDate; //NEED
  let tempDay; //NEED
  let tempYear; //NEED
  let tempAmPm; //NEED
  let tempHours; //NEED
  let tempMinutes; //NEED
  let tempLongDateTime; //NEED

  tempDateTime = new Date(item); //NEED
  tempDateTime.setMinutes(
    tempDateTime.getMinutes() + tempDateTime.getTimezoneOffset()
  ); //NEED

  tempMonthAbbr = monthAbbr[tempDateTime.getMonth()];
  tempMonthNames = monthNames[tempDateTime.getMonth()]; //NEED
  tempDate = tempDateTime.getDate(); //NEED
  tempDay = weekDays[tempDateTime.getDay()]; //NEED
  tempYear = tempDateTime.getFullYear(); //NEED
  //NEED
  if (tempDateTime.getHours() === 0) {
    tempHours = 12;
    tempAmPm = "AM";
  } else if (tempDateTime.getHours() < 12) {
    tempHours = tempDateTime.getHours();
    tempAmPm = "AM";
  } else {
    tempHours = tempDateTime.getHours() - 12;
    tempAmPm = "PM";
  }

  if (tempDateTime.getMinutes() > 9) {
    tempMinutes = tempDateTime.getMinutes();
  } else {
    tempMinutes = "0" + tempDateTime.getMinutes();
  }
  //NEED

  tempLongDateTime = `${tempMonthNames} ${tempDate}\, ${tempYear}`;

  return [tempLongDateTime];
};

export const getDate = (item) => {
  let tempDateTime;
  let tempMonthNames;
  let tempDate;
  let tempYear;
  let tempAmPm;
  let tempHours;
  let tempMinutes;
  let tempLongDateTime;

  tempDateTime = new Date(item.createdAt);
  tempDateTime.setMinutes(
    tempDateTime.getMinutes() + tempDateTime.getTimezoneOffset()
  );

  tempMonthNames = monthAbbr2[tempDateTime.getMonth()];
  tempDate = tempDateTime.getDate();
  tempYear = tempDateTime.getFullYear();
  if (tempDateTime.getHours() === 0) {
    tempHours = 12;
    tempAmPm = "AM";
  } else if (tempDateTime.getHours() < 12) {
    tempHours = tempDateTime.getHours();
    tempAmPm = "AM";
  } else {
    tempHours = tempDateTime.getHours() - 12;
    tempAmPm = "PM";
  }

  if (tempDateTime.getMinutes() > 9) {
    tempMinutes = tempDateTime.getMinutes();
  } else {
    tempMinutes = "0" + tempDateTime.getMinutes();
  }

  if (tempDateTime.getHours() === 0 && tempDateTime.getMinutes() === 0) {
    tempLongDateTime = `${tempMonthNames} ${tempDate}\, ${tempYear} 12 Midnight`;
  } else if (
    tempDateTime.getHours() === 12 &&
    tempDateTime.getMinutes() === 0
  ) {
    tempLongDateTime = `${tempMonthNames} ${tempDate}\, ${tempYear} 12 Noon`;
  } else {
    tempLongDateTime = `${tempMonthNames} ${tempDate}\, ${tempYear} ${tempHours}\:${tempMinutes}${tempAmPm}`;
  }

  return [tempLongDateTime];
};

export const getDateNoTime = (item) => {
  let tempDateTime;
  let tempMonthNames;
  let tempDate;
  let tempYear;
  let tempLongDateTime;

  tempDateTime = new Date(item.createdAt);
  tempDateTime.setMinutes(
    tempDateTime.getMinutes() + tempDateTime.getTimezoneOffset()
  );

  tempMonthNames = monthAbbr2[tempDateTime.getMonth()];
  tempDate = tempDateTime.getDate();
  tempYear = tempDateTime.getFullYear();

  tempLongDateTime = `${tempMonthNames} ${tempDate}\, ${tempYear} `;

  return [tempLongDateTime];
};

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
