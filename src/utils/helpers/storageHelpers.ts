export const getStoragedItem = (key: string) => {
  const jsonData = localStorage.getItem(key);

  if (jsonData) {
    return JSON.parse(jsonData);
  }
};
export const addItemToStorage = (
  item: { email: string; isAuth: boolean; fullName: string } | string,
  key: string
) => {
  localStorage.setItem(key, JSON.stringify(item));
};
