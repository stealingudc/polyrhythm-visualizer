import { useAppDispatch, useAppSelector } from "@hooks/redux/redux"
import audioReducer from "./audio";

export default () => {
  const dispatch = useAppDispatch();
  const audio = useAppSelector((state) => state.audio);

  return { audio, 
    setAudio: {
      setSample: (src: string) => dispatch(audioReducer.actions.setSample(src)),
      setVolume: (value: number) => dispatch(audioReducer.actions.setVolume(value)),
      setEnabled: (value: boolean) => dispatch(audioReducer.actions.setEnabled(value))
    }};
}
