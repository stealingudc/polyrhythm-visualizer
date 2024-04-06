import { IoSettingsOutline } from "react-icons/io5"
import "./controls.css"
import React from "react";
import Drawer from "react-modern-drawer";
import 'react-modern-drawer/dist/index.css'
import useBreakpoint from "../../hooks/useBreakpoint";
import * as Accordion from "@radix-ui/react-accordion";
import BackgroundSelector from "./settings/BackgroundSelector";
import PolyCanvasSettings from "./settings/polycanvas/PolyCanvasSettings";
import AudioSettings from "./settings/audio/AudioSettings";

export default () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const breakpoint = useBreakpoint();

  const toggleDrawer = () => {
    setIsOpen(prev => !prev)
  }

  return (
    <>
      <button className="control-button" onClick={() => setIsOpen(!isOpen)}>
        <IoSettingsOutline size={"80%"} />
      </button>
      <Drawer
        className="settings-menu"
        open={isOpen}
        direction={breakpoint < 768 ? "bottom" : "left"}
        onClose={toggleDrawer}
        style={{width: breakpoint < 768 ? "100vw" : "500px", overflowY: "auto"}}
      >
        <h2>Settings</h2>
        <Accordion.Root className="AccordionRoot" type="multiple">
          <BackgroundSelector />
          <PolyCanvasSettings />
          <AudioSettings />
        </Accordion.Root>
      </Drawer>
    </>
  )
}
