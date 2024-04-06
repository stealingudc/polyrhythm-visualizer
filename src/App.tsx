import useTheme from '@redux/theme/useTheme';
import Background from './components/background/Background'
import Controls from './components/controls/Controls'
import PolyCanvas from './components/poly_canvas/PolyCanvas'
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

function App() {
  const { theme } = useTheme();
  return (
    <>
      {/*@ts-ignore*/}
      <Theme accentColor={theme} panelBackground='translucent' grayColor='gray' scaling='90%' appearance='dark'>
        <Controls />
        <Background />
        <PolyCanvas />
      </Theme>
    </>
  )
}

export default App
