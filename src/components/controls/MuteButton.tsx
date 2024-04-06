import React from "react"
import { PiSpeakerHigh, PiSpeakerSlash } from "react-icons/pi";
import "./controls.css"

export default () => {
  const [isEnabled, setIsEnabled] = React.useState<boolean>(false);
  return(
    <button className="control-button" onClick={() => setIsEnabled(!isEnabled)}>
      {isEnabled ? <PiSpeakerHigh size={"80%"} /> : <PiSpeakerSlash size={"80%"} />}
    </button>
  )

}
