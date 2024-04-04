import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="py-10 sm:px-14 px-4">
        <Outlet />
      </main>
    </>
  );
};
