import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BackgroundState {
  value: string;
}

const initialState: BackgroundState = {
  value: "/backgrounds/river_dark.jpg",
}

export const background = createSlice({
  name: 'background',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
  },
})

export default background;




