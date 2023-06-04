export const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleDateString();
}

export const formatDateTimeWithTime = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleString();
}