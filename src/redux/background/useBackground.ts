import { useAppDispatch, useAppSelector } from "@hooks/redux/redux"
import backgroundReducer from "./background";

export default () => {
  const dispatch = useAppDispatch();
  const background = useAppSelector((state) => state.background.value);
  const setBackground = (src: string) => dispatch(backgroundReducer.actions.set(src));

  return { background, setBackground };
}
