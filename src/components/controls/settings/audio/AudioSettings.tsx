import * as Accordion from "@radix-ui/react-accordion"
import { Select, Slider } from "@radix-ui/themes";
import useTheme from "@redux/theme/useTheme"
import { HiOutlineChevronDown } from "react-icons/hi";
import "./audio-settings.css";
import "@radix-ui-local/accordion/accordion.css";
import * as Tooltip from "@radix-ui/react-tooltip";
import { IoInformationCircleOutline } from "react-icons/io5";
import React from "react";
import useAudio from "@redux/audio/useAudio";

type AudioSamplesJSON = {
  section: string,
  samples: {
    name: string,
    path: string
  }[]
}[];

type InfoProps = {
  children: string | string[] | React.ReactNode | React.ReactNode[];
}

const Info = ({ children }: InfoProps) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <IoInformationCircleOutline />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="info-content" sideOffset={5}>
            {children}
            <Tooltip.Arrow className="info-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export default () => {
  const { theme } = useTheme();
  const { audio, setAudio } = useAudio();

  const [audioSamples, setAudioSamples] = React.useState<AudioSamplesJSON>([]);
  React.useEffect(() => {
    fetch("/audio.json")
      .then(res => res.json())
      .then((json) => {
        setAudioSamples(json satisfies AudioSamplesJSON);
      });
  }, []);

  return (
    <>
      <Accordion.Item className="AccordionItem" value={"item-4"}>
        <Accordion.Header className="AccordionHeader">
          <Accordion.Trigger className="AccordionTrigger">
            <h3>Audio</h3>
            <HiOutlineChevronDown className="AccordionChevron" style={{ color: `var(--${theme}-10)` }} aria-hidden />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="AccordionContent">
          <div className="label">
            <span>Sample</span>
            <Info>The soundbyte that plays on every half-arc span end.</Info>
          </div>
          <Select.Root defaultValue="/audio/soft-bell_c5.ogg" onValueChange={(value) => setAudio.setSample(value)}>
            <Select.Trigger className="SelectTrigger" />
            <Select.Content className="SelectContent">
              {audioSamples.map((json, index) => {
                return (
                  <div key={`audio-group_${index}`}>
                    <Select.Group key={`audio-json_${index}`}>
                      <Select.Label>{json.section}</Select.Label>
                      {
                        json.samples.map((sample, i) =>
                          <Select.Item key={`sample_${index + i}`} value={sample.path} >{sample.name}</Select.Item>
                        )
                      }
                    </Select.Group>
                    {index !== audioSamples.length - 1 ? <Select.Separator /> : null}
                  </div>
                )
              })}
            </Select.Content>
          </Select.Root>
          <div className="label">
            <span>Volume</span>
          </div>
          <div className="slider-container">
            <Slider min={1} max={100} defaultValue={[50]} onValueChange={(value) => {setAudio.setVolume(value[0])}} />
            <span>{audio.volume}%</span>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </>
  )
}
