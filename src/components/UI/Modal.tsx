import { ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ open, onClose, children }: Props) => {
  return (
    open &&
    createPortal(
      <>
        <div
          onClick={onClose}
          className="bg-black absolute top-0 w-full h-full opacity-40"
        ></div>
        <div className="fixed z-10 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-6 rounded-3xl w-80 sm:w-96">
          {children}
        </div>
      </>,
      document.body
    )
  );
};
