import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";

interface Props extends ComponentPropsWithoutRef<"button"> {
  styles?: string;
  variant?: "contained" | "outlined";
  children: ReactNode;
}

type Ref = HTMLButtonElement;

export const Button = forwardRef<Ref, Props>(
  ({ styles, variant = "contained", children, ...props }) => {
    return (
      <button
        {...props}
        className={`${
          variant === "contained" ? "bg-orange" : "bg-light-orange"
        } ${
          variant === "contained" ? "text-white" : "text-orange"
        } border-none font-semibold rounded-3xl py-1 w-full disabled:opacity-25 ${styles}`}
      >
        {children}
      </button>
    );
  }
);
