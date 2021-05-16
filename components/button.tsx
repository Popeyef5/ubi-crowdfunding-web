import clsx from "clsx";
import { PropsWithChildren } from "react";
import styles from "./button.module.css";

type ButtonProps = {
  children?: React.ReactNode;
  accent?: "primary" | "outline" | "accept" | "warn";
  props?: any;
  onClick?:
    | ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void)
    | undefined;
};

export default function Button({ children, accent, onClick }: ButtonProps) {
  return (
    <div
      className={clsx(
        styles.base,
        accent === "primary" && styles.primary,
        accent === "outline" && styles.outline,
        accent === "accept" && styles.accept,
        accent === "warn" && styles.warn
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function ActionButton({ children, accent, onClick }: ButtonProps) {
  return (
    <div
      className={clsx(
        styles.base,
        styles.action,
        accent === "primary" && styles.primary,
        accent === "outline" && styles.outline,
        accent === "accept" && styles.accept,
        accent === "warn" && styles.warn
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
