import { Button as MantineButton, clsx, Sx } from "@mantine/core";
import type { ReactNode } from "react";

interface ButtonProps {
  fullWidth?: boolean;
  title?: string;
  onClick?: (() => void) | ((e: any) => void);
  isLoading?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  classes?: string;
  sx?: Sx;
  leftIcon?: ReactNode;
  children?: ReactNode;
}

const Button = (props: ButtonProps) => {
  const {
    fullWidth = false,
    title,
    onClick,
    isLoading = false,
    disabled = false,
    classes = "",
    sx,
    type = "button",
    leftIcon,
    children,
    ...other
  } = props;

  return (
    <MantineButton
      size="lg"
      disabled={disabled}
      onClick={onClick}
      loading={isLoading}
      type={type}
      leftIcon={leftIcon}
      classNames={{
        root: clsx(
          " group border-2 outline-0 border-blue-600 text-[16px] h-[48px] font-semibold rounded-lg",
          "bg-blue-600 hover:bg-blue-500 text-[#FFFFFF]",
          classes
        ),
      }}
      component="button"
      sx={() => ({
        width: fullWidth ? "100%" : "auto",
        ...sx,
      })}
      {...other}
    >
      {title}
      {children}
    </MantineButton>
  );
};

export default Button;
