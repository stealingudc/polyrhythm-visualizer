import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ThemeState {
  value: string;
}

const initialState: ThemeState = {
  value: "gray",
}

export const theme = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
  },
})

export default theme;




