import * as Accordion from "@radix-ui/react-accordion"
import { Select, Slider } from "@radix-ui/themes";
import useTheme from "@redux/theme/useTheme"
import { HiOutlineChevronDown } from "react-icons/hi";
import "./audio-settings.css";
import "@radix-ui-local/accordion/accordion.css";
import * as Tooltip from "@radix-ui/react-tooltip";
import { IoInformationCircleOutline } from "react-icons/io5";

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
          <Select.Root defaultValue="0">
            <Select.Trigger className="SelectTrigger"/>
            <Select.Content className="SelectContent">
              <Select.Group>
                <Select.Label>Synths</Select.Label>
                <Select.Item value="0">Old Timey</Select.Item>
                <Select.Item value="1" disabled>Retro (Coming Soon!)</Select.Item>
              </Select.Group>
              <Select.Separator />
              <Select.Group>
                <Select.Label>Bells</Select.Label>
                <Select.Item value="2">Calm</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
          <div className="label">
            <span>Volume</span>
          </div>
        <div className="slider-container">
          <Slider min={1} max={100} defaultValue={[50]} />
          <span>{50}%</span>
        </div>
        </Accordion.Content>
      </Accordion.Item>
    </>
  )
}
