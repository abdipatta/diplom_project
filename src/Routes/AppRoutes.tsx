import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import { PrivateRoute } from "./PrivateRoute";
import { Suspense, lazy, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Login = lazy(() => import("../pages/Login"));
const Orders = lazy(() => import("../pages/Orders"));
const Settings = lazy(() => import("../pages/Settings"));
export const AppRoutes = () => {
  const ctx = useContext(AuthContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/login",
          element: (
            <Suspense fallback="loading">
              <Login />
            </Suspense>
          ),
        },
        {
          path: "/",
          element: <Navigate to={ctx?.isAuth ? "/orders" : "/login"} />,
        },
        {
          path: "/orders",
          element: (
            <PrivateRoute
              component={
                <Suspense fallback="loading">
                  <Orders />
                </Suspense>
              }
              fallbackPath="/"
            />
          ),
        },
        {
          path: "/settings",
          element: (
            <PrivateRoute
              component={
                <Suspense fallback="loading">
                  <Settings />
                </Suspense>
              }
              fallbackPath="/"
            />
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
