import { useContext, useState } from "react";
import { SideBar } from "./UI/SideBar";
import { AuthContext } from "../contexts/AuthContext";
import Menu from "../assets/menu.svg?react";
import ArrowIcon from "../assets/arrow.svg?react";
import { IconButton } from "./UI/IconButton";

export const Header = () => {
  const ctx = useContext(AuthContext);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const toggleSideBar = () => setOpenSideBar((prev) => !prev);
  const toggleMenu = () => setOpenMenu((prev) => !prev);

  const onLogOut = () => ctx?.logOut();

  return (
    <>
      <header className="bg-orange flex justify-between px-8 py-2 text-white relative z-10">
        <div className="flex items-center gap-2 font-bold ">
          {ctx?.isAuth && (
            <Menu className="cursor-pointer" onClick={toggleSideBar} />
          )}
          <p>LOGO</p>
  

        </div>
        {ctx?.isAuth && (
          <div className="flex items-center">
            <p>{ctx?.fullName}</p>
            <IconButton
              icon={<ArrowIcon className="rotate-90" onClick={toggleMenu} />}
            />

            {openMenu && (
              <>
                <div
                  onClick={toggleMenu}
                  className="absolute top-0 left-0 w-full h-screen"
                ></div>
                <p
                  className="absolute top-8 right-10 text-black bg-white px-4 py-2 border rounded-xl cursor-pointer hover:bg-[#d2d2d2]"
                  onClick={onLogOut}
                >
                  Log out
                </p>
              </>
            )}
          </div>
        )}
      </header>
      <SideBar onClose={toggleSideBar} open={openSideBar} />
    </>
  );
};
