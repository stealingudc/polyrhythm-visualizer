import { configureStore } from '@reduxjs/toolkit'
import theme from '@redux/theme/theme'
import background from '@redux/background/background'
import polycanvas from './polycanvas/polycanvas'
import audio from './audio/audio'

const store = configureStore({
  reducer: {
    theme: theme.reducer,
    background: background.reducer,
    polycanvas: polycanvas.reducer,
    audio: audio.reducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;
