import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stringToBoolean = (value: string) => {
  return value === "true";
};

export const numberFormat = (value: number) => {
  return new Intl.NumberFormat().format(value);
};
