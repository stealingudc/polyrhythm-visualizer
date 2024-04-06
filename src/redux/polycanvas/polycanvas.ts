import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PolycanvasState {
  arc: {
    count: number,
    distance: number
    alpha: number
  },
  speed: {
    loops: number;
    timeframeSeconds: number;
  },
  point: {
    radius: number;
  }
}

const initialState: PolycanvasState = {
  arc: {
    count: 20,
    distance: 0.05,
    alpha: 0.1
  },
  speed: {
    loops: 20,
    timeframeSeconds: 600,
  },
  point: {
    radius: 0.0065 
  }
}

export const polycanvas = createSlice({
  name: 'polycanvas',
  initialState,
  reducers: {
    setArcCount: (state, action: PayloadAction<number>) => {
      state.arc.count = action.payload;
    },
    setArcDistance: (state, action: PayloadAction<number>) => {
      state.arc.distance = action.payload;
    },
    setArcAlpha: (state, action: PayloadAction<number>) => {
      state.arc.alpha = action.payload;
    },
    setLoops: (state, action: PayloadAction<number>) => {
      state.speed.loops = action.payload;
    },
    setTimeframe: (state, action: PayloadAction<number>) => {
      state.speed.timeframeSeconds = action.payload;
    },
    setPointRadius: (state, action: PayloadAction<number>) => {
      state.point.radius = action.payload;
    }
  },
})

export default polycanvas;
export { initialState as polyInitialState };
