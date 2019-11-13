export const getDateStr = dt => {
  //exports.getDateStr = (dt) =>{
  // returns pretty date string assuming UTC time
  // i.e.  'Sat Nov 2, 2019 6:30 PM'
  const mon = dt.getUTCMonth();
  if (isNaN(mon)) return "";
  const monstr = [
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
    "Dec"
  ][mon];
  const day = dt.getUTCDay();
  const dstr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day];
  const udate = dt.getUTCDate();
  const yr = dt.getUTCFullYear();
  const min = dt.getUTCMinutes();
  const hr24 = dt.getUTCHours();
  let hr12 = hr24 % 12;
  hr12 = hr12 == 0 ? 12 : hr12;
  const ampm = hr24 > 11 ? " PM" : " AM";
  const mystr =
    dstr +
    " " +
    monstr +
    " " +
    udate +
    ", " +
    yr +
    " " +
    hr12 +
    ":" +
    ("00" + min).slice(-2) +
    ampm;
  return mystr;
};
