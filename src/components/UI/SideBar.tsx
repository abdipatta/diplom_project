import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import OrderIcon from "../../assets/order.svg?react";
import SettingsIcon from "../../assets/settings.svg?react";
import ArrowIcon from "../../assets/arrow.svg?react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const SideBar = ({ open, onClose }: Props) => {
  return (
    open &&
    createPortal(
      <>
        <div
          onClick={onClose}
          className="bg-black absolute top-0 w-full h-full opacity-40"
        ></div>
        <div className="sm:w-96 w-64 min-h-[94.5vh] bg-white absolute top-10 left-0">
          <ul className="flex flex-col items-start">
            <li className="border-b border-[#d2d2d2] mx-auto w-52 pb-5 mb-5 mt-10  text-orange font-bold cursor-pointer">
              <NavLink
                to="/orders"
                onClick={onClose}
                className={"flex items-center gap-2 justify-between"}
              >
                <div className="flex items-center gap-2">
                  <OrderIcon />
                  Orders
                </div>
                <ArrowIcon className="sm:hidden block" />
              </NavLink>
            </li>
            <li className="mx-auto w-52  text-orange font-bold cursor-pointer">
              <NavLink
                to="/settings"
                onClick={onClose}
                className={"flex items-center gap-2 justify-between"}
              >
                <div className="flex items-center gap-2">
                  <SettingsIcon />
                  Settings
                </div>
                <ArrowIcon className="sm:hidden block" />
              </NavLink>
            </li>
          </ul>
        </div>
      </>,
      document.body
    )
  );
};
