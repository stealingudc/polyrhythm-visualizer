import * as Accordion from "@radix-ui/react-accordion";
import useTheme from "@redux/theme/useTheme";
import { HiOutlineChevronDown } from "react-icons/hi";
import "@radix-ui-local/accordion/accordion.css";
import usePolycanvas from "@redux/polycanvas/usePolycanvas";
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

export default () => {
  const { theme } = useTheme();
  const { arc, setArc, speed, setSpeed } = usePolycanvas();

  return (
    <>
      <Section value="item-2" label="Display" theme={theme}>
        <div className="slider-label">
          <span>Arc Count</span>
          <Info>Number of arcs to be displayed.</Info>
        </div>
        <div className="slider-container">
          <Slider min={1} max={20} defaultValue={[arc.count]} onValueChange={(val) => setArc.count(val[0])} />
          <span>{arc.count}</span>
        </div>
        <div className="slider-label">
          <span>Arc Spacing</span>
          <Info>The distance between the arcs is equal, spanning the edge of the canvas<br />to this distance-percentage from the center.</Info>
        </div>
        <div className="slider-container">
          <Slider min={1} max={50} defaultValue={[arc.distance * 100]} onValueChange={(val) => setArc.distance(val[0] / 100)} />
          <span>{arc.distance * 100}%</span>
        </div>
        <div className="slider-label">
          <span>Opacity</span>
          <Info>How translucent the arcs should be.</Info>
        </div>
        <div className="slider-container">
          <Slider min={10} max={100} defaultValue={[arc.alpha * 100]} onValueChange={(val) => setArc.alpha(val[0] / 100)} />
          <span>{arc.alpha * 100}%</span>
        </div>
      </Section>
      <Section value="item-3" label="Speed" theme={theme}>
        <div className="slider-label">
          <span>Loop Speed</span>
          <Info>Speed at which one loop is completed across a given time.</Info>
        </div>
        <div className="slider-container">
          <Slider min={arc.count} max={100} defaultValue={[speed.loops]} onValueChange={(val) => setSpeed.loops(val[0])} />
          <span>{speed.loops}</span>
        </div>
        <div className="slider-label">
          <span>Time</span>
          <Info>Time frame in which one loop is to be completed.</Info>
        </div>
        <div className="slider-container">
          <Slider min={10} max={900} step={1} defaultValue={[speed.timeframeSeconds]} onValueChange={(val) => setSpeed.timeframeSeconds(val[0])} />
          <span>{speed.timeframeSeconds / 10}s</span>
        </div>
        <code>Speed: {((speed.loops / speed.timeframeSeconds)).toPrecision(2)} units/second.</code><br/>
        <code>Base Velocity: {((4 * Math.PI * speed.loops) / speed.timeframeSeconds).toPrecision(2)} rad/s.</code>
      </Section>
    </>
  );
}
