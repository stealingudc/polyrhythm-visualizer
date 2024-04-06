import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AudioState {
  volume: number;
  sample: string;
  isEnabled: boolean;
}

const initialState: AudioState = {
  volume: 0.02,
  sample: "/audio/old-timey_c4.ogg",
  isEnabled: false
}

export const audio = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setSample: (state, action: PayloadAction<string>) => {
      state.sample = action.payload;
    },
    toggleEnabled: (state) => {
      state.isEnabled = !state.isEnabled;
    }
  },
})

export default audio;
