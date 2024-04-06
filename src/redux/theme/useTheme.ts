import { useAppDispatch, useAppSelector } from "@hooks/redux/redux"
import themeReducer from "./theme";

export default () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.value);
  const setTheme = (theme: string) => dispatch(themeReducer.actions.setTheme(theme));

  return { theme, setTheme };
}
