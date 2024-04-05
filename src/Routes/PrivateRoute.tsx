import { ReactElement, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

type Props = {
  component: ReactElement;
  fallbackPath: string;
};

export const PrivateRoute = ({ component: Component, fallbackPath }: Props) => {
  const ctx = useContext(AuthContext);

  if (!ctx?.isAuth) {
    return <Navigate to={fallbackPath} />;
  }
  return Component;
};
