import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import { Login } from "../pages/Login";
import { Orders } from "../pages/Orders";
import { Settings } from "../pages/Settings";
import { PrivateRoute } from "./PrivateRoute";

export const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <PrivateRoute component={Login} fallbackPath="/orders" />,
        },
        {
          path: "/orders",
          element: <PrivateRoute component={Orders} fallbackPath="/" />,
        },
        {
          path: "/settings",
          element: <PrivateRoute component={Settings} fallbackPath="/" />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
