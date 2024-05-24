const jsonParseFromStorage = (key) => {
  let token;
  if (!key) {
    return;
  }
  try {
    token = JSON.parse(localStorage.getItem(key));
  } catch (error) {
    //
  }
  return token;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export { jsonParseFromStorage, formatDate };
