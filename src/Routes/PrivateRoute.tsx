import { useEffect, useState } from "react";
import { getStoragedItem } from "../utils/helpers/storageHelpers";
import { Navigate } from "react-router-dom";

type Props = {
  component: () => JSX.Element;
  fallbackPath: string;
};

export const PrivateRoute = ({ component: Component, fallbackPath }: Props) => {
  const [loginData, setLoginData] = useState<{
    username: string;
    isAuth: boolean;
  }>({
    username: "",
    isAuth: false,
  });

  useEffect(() => {
    const data = getStoragedItem("LOGIN_DATA");
    console.log(data);

    if (data !== undefined) {
      setLoginData(data);
    }
  }, []);

  if (loginData.isAuth === false) {
    return <Navigate to={fallbackPath} />;
  }
  return <Component />;
};
