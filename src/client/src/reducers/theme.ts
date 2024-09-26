import { ACTIVETHEME } from "../types";

const sysDefault = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light"

const initialState = {
  theme: sysDefault,
};

export const themeReducer = (
  state = initialState,
  { type }: { type: ACTIVETHEME }
) => {
  switch (type) {
    case "DARK":
      return "dark";
    case "LIGHT":
      return "light"
    default:
      return state;
  }
};
