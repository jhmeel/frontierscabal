import { ACTIVETHEME } from "../types";

export const lightTheme = {
  type:'LIGHT',
  background: "#FFFFFF",
  title: "#000000",
  text: "#757575",
  icon: "#000000",
  primary: "#176984",
  border: "#ededed",
  secondary: "#033",
  button: {
    filled: {
      primary: "#176984",
      text: "#FFFFFF",
      variant: "",
    },
    outlined: {
      primary: "#176984",
      text: "#000000",
      variant: "",
    },
  },
  loading: "#ccc",
  error: {
    backgroundColor: "#FFD9D9",
    color: "#FF0000",
    icon: "#",
  },
  warning: {
    backgroundColor: "#FFF9D9",
    color: "#FF8A00",
    icon: "#",
  },
  success: {
    backgroundColor: "#FFF9D9",
    color: "#FF8A00",
    icon: "#",
  },
};

export const darkTheme = {
  type:'DARK',
  background: "#051a21",
  title: "#FFFFFF",
  text: "#808080",
  icon: "#FFFFFF",
  primary: "#004e6b",
  border: "#ededed",
  secondary: "#333",
  button: {
    filled: {
      primary: "#176984",
      text: "#FFFFFF",
      variant: "",
    },
    outlined: {
      primary: "#FFFFFF",
      text: "#000000",
      variant: "#176984",
    },
  },
  loading: "#ccc",
  error: {
    backgroundColor: "crimson",
    color: "#FF0000",
    icon: "#ccc",
  },
  warning: {
    backgroundColor: "#FFF9D9",
    color: "#FF8A00",
    icon: "#ccc",
  },
  success: {
    backgroundColor: "greenyellow",
    color: "#FF8A00",
    icon: "#ccc",
  },
};

const sysDefault = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? darkTheme
  : lightTheme;

const initialState = {
  theme: sysDefault,
};

export const themeReducer = (
  state = initialState,
  { type }: { type: ACTIVETHEME }
) => {
  switch (type) {
    case "DARK":
      return darkTheme;
    case "LIGHT":
      return lightTheme;
    default:
      return state;
  }
};
