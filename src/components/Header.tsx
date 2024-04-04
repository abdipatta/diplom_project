import { useEffect, useState } from "react";
import Menu from "../assets/menu.svg?react";
import { SideBar } from "./UI/SideBar";
import { getStoragedItem } from "../utils/helpers/storageHelpers";

export const Header = () => {
  const [openSideBar, setOpenSideBar] = useState(false);

  const [loginData, setLoginData] = useState<{
    username: string;
    isAuth: boolean;
  }>({
    username: "",
    isAuth: false,
  });

  const toggleSideBar = () => setOpenSideBar((prev) => !prev);

  useEffect(() => {
    const data = getStoragedItem("LOGIN_DATA");
    if (data !== undefined) {
      setLoginData(data);
    }
  }, []);

  return (
    <>
      <header className="bg-orange flex justify-between px-8 py-2 text-white relative z-10">
        <div className="flex items-center gap-2 font-bold ">
          {loginData.isAuth && (
            <Menu className="cursor-pointer" onClick={toggleSideBar} />
          )}
          <p>LOGO</p>
        </div>
        {loginData.isAuth && <p>{loginData.username}</p>}
      </header>
      <SideBar onClose={toggleSideBar} open={openSideBar} />
    </>
  );
};
