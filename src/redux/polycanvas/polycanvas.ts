import { useAppDispatch, useAppSelector } from '@hooks/redux/redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Color = {
  r: number; g: number; b: number; a: number;
}

type Coordinates2D = {
  x: number; y: number;
}

type Arc = {
  color: Color;
  velocity: number;
  nextImpactTime: number;
}

type ArcPropertyPayload = {
  index: number;
  key: keyof Arc;
  value: Arc[keyof Arc];
}

type Point = {
  position: Coordinates2D;
  distanceOffset: number;
  radius: number;
}

type PointPropertyPayload = {
  index: number;
  key: keyof Point;
  value: Point[keyof Point];
}

type Settings = {
  speed: {
    loops: number;
    timeframeSeconds: number;
  },
  arc: {
    minArcs: number;
    maxArcs: number;
    distance: number;
  }
}

interface PolycanvasState {
  arcs: Arc[],
  points: Point[];
  settings: Settings;
}

const initialState: PolycanvasState = {
  arcs: [],
  points: [],
  settings: {
    speed: {
      loops: 20,
      timeframeSeconds: 600
    },
    arc: {
      minArcs: 0,
      maxArcs: 12,
      distance: 0.05
    }
  }
}

export const polycanvas = createSlice({
  name: 'polycanvas',
  initialState,
  reducers: {
    // Arcs
    addArc: (state, action: PayloadAction<Arc>) => {
      if (state.arcs.length > state.settings.arc.minArcs && state.arcs.length < state.settings.arc.maxArcs) {
        state.arcs.push(action.payload);
      } else {
        throw(`Number of arcs is invalid. (min: ${state.settings.arc.minArcs}, max: ${state.settings.arc.maxArcs}, got: ${state.arcs.length})`);
      }
    },
    removeArc: (state, action: PayloadAction<number>) => {
      if (state.arcs[action.payload]) {
        state.arcs = state.arcs.filter((_, index) => index != action.payload);
      } else {
        throw(`Tried removing arc at index ${action.payload}. No such arc exists.`);
      }
    },
    setArcs: (state, action: PayloadAction<Arc[]>) => {
      if (action.payload.length < state.settings.arc.maxArcs) {
        state.arcs = action.payload;
      } else {
        throw(`Number of arcs exceeds the maximum. (max: ${state.settings.arc.maxArcs}, got: ${action.payload.length})`);
      }
    },
    arc_setProperty: (state, action: PayloadAction<ArcPropertyPayload>) => {
      if(state.arcs[action.payload.index]){
        // @ts-ignore
        state.arcs[action.payload.index][action.payload.key] = action.payload.value;
      }
    },
    // Points
    addPoint: (state, action: PayloadAction<Point>) => {
      if (state.points.length < state.arcs.length) {
        state.points = [...state.points, action.payload];
      } else {
        throw(`Tried to add point at index ${state.points.length}`);
      }
    },
    removePoint: (state, action: PayloadAction<number>) => {
      if(state.points[action.payload]){
        state.points = state.points.filter((_, index) => index != action.payload);
      } else {
        throw(`Tried removing point at index ${action.payload}. Not such point exists.`);
      }
    },
    setPoints: (state, action: PayloadAction<Point[]>) => {
      if(action.payload.length <= state.arcs.length){
        state.points = action.payload;
      } else {
        throw(`Number of points exceeds the number of arcs. (arcs: ${state.arcs.length}, points: ${action.payload.length})`);
      }
    },
    point_setProperty: (state, action: PayloadAction<PointPropertyPayload>) => {
      if(state.points[action.payload.index]){
        // @ts-ignore
        state.points[action.payload.index][action.payload.key] = action.payload.value;
      }
    },
    // Settings
    settings_setLoops: (state, action: PayloadAction<number>) => {
      state.settings.speed.loops = action.payload;
    },
    settings_setTimeframeSeconds: (state, action: PayloadAction<number>) => {
      state.settings.speed.timeframeSeconds = action.payload;
    },
    settings_setMaxArcs: (state, action: PayloadAction<number>) => {
      state.settings.arc.maxArcs = action.payload;
    },
    settings_setArcDistance: (state, action: PayloadAction<number>) => {
      state.settings.arc.distance = action.payload;
    }
  }
});

export const usePolycanvas = () => {
  const dispatch = useAppDispatch();

  const arcs = useAppSelector(state => state.polycanvas.arcs);
  const points = useAppSelector(state => state.polycanvas.points);

  const settings = {
    ...useAppSelector(state => state.polycanvas.settings),
    setLoops: (value: number) => 
      dispatch(polycanvas.actions.settings_setLoops(value)),
    setTimeframeSeconds: (value: number) =>
      dispatch(polycanvas.actions.settings_setTimeframeSeconds(value)),
    setMaxArcs: (value: number) =>
      dispatch(polycanvas.actions.settings_setMaxArcs(value)),
    setArcDistance: (value: number) =>
      dispatch(polycanvas.actions.settings_setArcDistance(value))
  }

  const arc = {
    addArc: (arc: Arc) =>
      dispatch(polycanvas.actions.addArc(arc)),
    removeArc: (index: number) =>
      dispatch(polycanvas.actions.removeArc(index)),
    setArcs: (arcs: Arc[]) =>
      dispatch(polycanvas.actions.setArcs(arcs)),
    setProperty: (payload: ArcPropertyPayload) => 
      dispatch(polycanvas.actions.arc_setProperty(payload))
  }

  const point = {
    addPoint: (point: Point) =>
      dispatch(polycanvas.actions.addPoint(point)),
    removePoint: (index: number) =>
      dispatch(polycanvas.actions.removePoint(index)),
    setPoints: (points: Point[]) =>
      dispatch(polycanvas.actions.setPoints(points)),
    setProperty: (payload: PointPropertyPayload) =>
      dispatch(polycanvas.actions.point_setProperty(payload))
  }

  return { arc, arcs, point, points, settings };
}

export default polycanvas;
export { initialState as polyInitialState };
