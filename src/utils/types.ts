export type Column<T> = {
  header: string;
  key: string;
  align?: "left" | "right" | "center";
  render?: (meal: T) => JSX.Element;
};

export type OrderType = {
  id: number;
  fullName: string;
  order: number;
  price: number;
};

export type UserType = {
  password: string;
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  role: string;
};
