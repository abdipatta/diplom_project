export const getStoragedItem = (key: string) => {
  const jsonData = localStorage.getItem(key);

  if (jsonData) {
    return JSON.parse(jsonData);
  }
};
export const addItemToStorage = (
  item: { username: string; isAuth: boolean } | string,
  key: string
) => {
  localStorage.setItem(key, JSON.stringify(item));
};
