function convertToPostgresTimezoneString(dateTimeObj) {
  if (!dateTimeObj) return null;

  const { year, month, day, hour, minute } = dateTimeObj;
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
  return date.toISOString();

}

export default convertToPostgresTimezoneString;