export const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleDateString();
}

export const formatDateTimeWithTime = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleString();
}

export const formatTime = (time) => {
  time = time.split(".")[0];
  const splitTime = time.split(":").map((n) => Number(n));
  const hours = splitTime[0];
  const minutes = splitTime[1];
  const seconds = splitTime[2];

  let res = "";
  if (hours) res += `${hours}h`;
  if (minutes) res += ` ${minutes}m`;
  if (seconds) res += ` ${seconds}s`;

  return res;
};