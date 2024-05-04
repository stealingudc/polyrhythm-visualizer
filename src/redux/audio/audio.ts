import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AudioState {
  volume: number;
  sample: string;
  isEnabled: boolean;
}

const initialState: AudioState = {
  volume: 50,
  sample: "/audio/soft-bell_c5.ogg",
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
    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.isEnabled = action.payload;
    }
  },
})

export default audio;
