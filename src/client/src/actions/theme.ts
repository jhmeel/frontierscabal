import { ACTIVETHEME, ACTION } from "../types"

export const changeTheme = (theme:ACTIVETHEME) => (dispatch: (action: ACTION) => void) =>  {
    dispatch({
      type: theme,
    });
  };
  