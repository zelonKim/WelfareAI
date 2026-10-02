export const formatDate = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}월 ${day}일`;
};
