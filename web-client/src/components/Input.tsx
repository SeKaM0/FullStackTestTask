import { TextInput, type TextInputProps } from "@mantine/core";
import clsx from "clsx";

const Input = (props: TextInputProps) => {
  const { error, placeholder, classNames, label, ...other } = props;

  return (
    <TextInput
      classNames={{
        ...classNames,
        root: clsx("w-full", classNames?.root),

        label: clsx(
          "font-medium text-gray-900 pb-1 text-base",
          error && "text-red-400",
          classNames?.label
        ),
        input: clsx(
          "h-auto truncate rounded-lg font-medium text-base text-gray-900 px-3 py-[10px] h-[45px]" +
            "border-[1px] border-gray-200 placeholder:text-gray-300 bg-white",
          classNames?.input
        ),
      }}
      error={error}
      placeholder={placeholder}
      label={label}
      {...other}
    />
  );
};

export default Input;
