import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";

interface Props extends ComponentPropsWithoutRef<"input"> {
  icon?: ReactNode;
  onClick?: () => void;
  error?: boolean;
}

type Ref = HTMLInputElement;

export const Input = forwardRef<Ref, Props>(
  ({ icon, onClick, error, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type="text"
          className={`border border-[#d2d2d2] rounded-3xl p-2 px-3 w-full outline-orange ${
            error ? "border-[#f00]" : ""
          }`}
          ref={ref}
          {...props}
        />
        <div
          className="absolute top-2 right-3 cursor-pointer"
          onClick={onClick}
        >
          {icon}
        </div>
      </div>
    );
  }
);
