export const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleDateString();
}