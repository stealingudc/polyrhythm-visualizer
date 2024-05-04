import * as Accordion from "@radix-ui/react-accordion";
import useTheme from "@redux/theme/useTheme";
import { HiOutlineChevronDown } from "react-icons/hi";
import "@radix-ui-local/accordion/accordion.css";
import { usePolycanvas } from "@redux/polycanvas/polycanvas";
import { IconButton, Slider } from "@radix-ui/themes";
import React from "react";
import "./poly-canvas-settings.css";
import { IoInformationCircleOutline } from "react-icons/io5";
import * as Tooltip from "@radix-ui/react-tooltip";

type SectionProps = {
  value: string;
  label: string;
  theme: string;
  children: React.ReactNode | React.ReactNode[];
}

const Section = ({ value, label, theme, children }: SectionProps) => {
  return (
    <Accordion.Item className="AccordionItem" value={value}>
      <Accordion.Header className="AccordionHeader">
        <Accordion.Trigger className="AccordionTrigger">
          <h3>{label}</h3>
          <HiOutlineChevronDown className="AccordionChevron" style={{ color: `var(--${theme}-10)` }} aria-hidden />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="AccordionContent">
        {children}
      </Accordion.Content>
    </Accordion.Item>
  )
}

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

const round = (n: number) => Math.floor(n);

export default () => {
  const { theme } = useTheme();
  const { arc, arcs, settings } = usePolycanvas();

  const handleAddArc = () => {
    const velocity = (4 * Math.PI * (settings.speed.loops - (arcs.length))) / settings.speed.timeframeSeconds;
    arc.addArc({
      color: { r: 255, g: 255, b: 255, a: 0.3 },
      velocity,
      nextImpactTime: 0
    })
  }

  return (
    <>
      <Section value="item-2" label="Display" theme={theme}>
        <div className="slider-label">
          <span>Arc Count</span>
          <Info>Number of arcs to be displayed.</Info>
        </div>
        <div className="slider-container" style={{ marginTop: "0.5em", justifyContent: "start" }}>
          <IconButton onClick={() => {arc.removeArc(arcs.length - 1)}}>-</IconButton>
          <span>{arcs.length}</span>
          <IconButton onClick={() => {handleAddArc()}}>+</IconButton>
        </div>
        <div className="slider-label">
          <span>Arc Spacing</span>
          <Info>The distance between the arcs is equal, spanning the edge of the canvas<br />to this distance-percentage from the center.</Info>
        </div>
        <div className="slider-container">
          <Slider min={1} max={50} defaultValue={[settings.arc.distance * 100]} onValueChange={(val) => settings.setArcDistance(val[0] / 100)} />
          <span>{round(settings.arc.distance * 100)}%</span>
        </div>
      </Section>
      <Section value="item-3" label="Speed" theme={theme}>
        <div className="slider-label">
          <span>Loop Speed</span>
          <Info>Speed at which one loop is completed across a given time.</Info>
        </div>
        <div className="slider-container">
          <Slider min={arcs.length} max={60} defaultValue={[settings.speed.loops]} onValueChange={(val) => settings.setLoops(val[0])} />
          <span>{settings.speed.loops}</span>
        </div>
        <div className="slider-label">
          <span>Time</span>
          <Info>Time frame in which one loop is to be completed.</Info>
        </div>
        <div className="slider-container">
          <Slider min={300} max={900} step={1} defaultValue={[settings.speed.timeframeSeconds]} onValueChange={(val) => settings.setTimeframeSeconds(val[0])} />
          <span>{settings.speed.timeframeSeconds / 10}s</span>
        </div>
        <code>Speed: {((settings.speed.loops / settings.speed.timeframeSeconds)).toPrecision(2)} units/second.</code><br />
        <code>Base Velocity: {((4 * Math.PI * settings.speed.loops) / settings.speed.timeframeSeconds).toPrecision(2)} rad/s.</code>
      </Section>
    </>
  );
}
