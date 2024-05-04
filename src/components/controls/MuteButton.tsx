import { PiSpeakerHigh, PiSpeakerSlash } from "react-icons/pi";
import "./controls.css"
import useAudio from "@redux/audio/useAudio";

export default () => {
  const { audio, setAudio } = useAudio();
  return(
    <button className="control-button" onClick={() => {setAudio.setEnabled(!audio.isEnabled)}}>
      {audio.isEnabled ? <PiSpeakerHigh size={"80%"} /> : <PiSpeakerSlash size={"80%"} />}
    </button>
  )

}
