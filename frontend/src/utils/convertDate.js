function convertToPostgresTimezoneString(dateTimeObj) {
  if (!dateTimeObj) return null;

  const { year, month, day, hour, minute } = dateTimeObj;
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
  // console.log(date);
  return date

  // const options = {
  //   timeZone: timeZone,
  //   timeZoneName: 'short',
  //   year: 'numeric',
  //   month: '2-digit',
  //   day: '2-digit',
  //   hour: '2-digit',
  //   minute: '2-digit',
  //   hour12: false
  // };

  // const formatter = new Intl.DateTimeFormat('en-US', options);
  // const formattedDate = formatter.format(date);
  // console.log(formattedDate);
  // const offsetString = formatOffset(offset);
  // console.log(offsetString);


  // return `${formattedDate}${offsetString}`;
}

// function formatOffset(offset) {
//   const sign = offset >= 0 ? '+' : '-';
//   const absOffset = Math.abs(offset);
//   const hours = Math.floor(absOffset / 3600000);
//   const minutes = Math.floor((absOffset % 3600000) / 60000);

//   return `${sign}${pad(hours, 2)}:${pad(minutes, 2)}`;
// }

// function pad(num, size) {
//   return String(num).padStart(size, '0');
// }

export default convertToPostgresTimezoneString;