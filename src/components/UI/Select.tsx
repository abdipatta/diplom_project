import { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"select"> {
  options: {
    value: string;
    label: string;
  }[];
}

export const Select = ({ options, ...props }: Props) => {
  return (
    <select {...props} className="border border-[#d2d2d2] p-2 rounded-3xl">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
