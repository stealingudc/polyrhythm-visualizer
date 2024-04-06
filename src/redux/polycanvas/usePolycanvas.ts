import { useAppDispatch, useAppSelector } from "@hooks/redux/redux"
import polycanvasReducer from "./polycanvas";

export default () => {
  const dispatch = useAppDispatch();

  const arc = useAppSelector((state) => state.polycanvas.arc);
  const setArc = {
    count: (count: number) =>
      dispatch(polycanvasReducer.actions.setArcCount(count)),
    distance: (distance: number) =>
      dispatch(polycanvasReducer.actions.setArcDistance(distance)),
    alpha: (value: number) => {
      dispatch(polycanvasReducer.actions.setArcAlpha(value))
    }
  };

  const speed = useAppSelector(state => state.polycanvas.speed);
  const setSpeed = {
    loops: (count: number) =>
      dispatch(polycanvasReducer.actions.setLoops(count)),
    timeframeSeconds: (seconds: number) =>
      dispatch(polycanvasReducer.actions.setTimeframe(seconds)),
  };

  const point = useAppSelector(state => state.polycanvas.point);
  const setPoint = {
    radius: (radius: number) =>
      dispatch(polycanvasReducer.actions.setPointRadius(radius))
  };

  return { arc, setArc, speed, setSpeed, point, setPoint };
}

