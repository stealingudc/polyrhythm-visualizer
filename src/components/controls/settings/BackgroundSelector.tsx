import { Grid, HoverCard, Inset } from "@radix-ui/themes";
import useBackground from "@redux/background/useBackground";
import React from "react";
import "@radix-ui-local/accordion/accordion.css";
import "@components/controls/settings/background-selector.css"
import * as Accordion from "@radix-ui/react-accordion";
import { HiOutlineChevronDown } from "react-icons/hi";
import useTheme from "@redux/theme/useTheme";

type BackgroundImage = {
  [key: string]: string;
}

export default () => {
  const [images, setImages] = React.useState<BackgroundImage[]>([]);
  const { setBackground } = useBackground();
  const { theme } = useTheme();

  React.useEffect(() => {
    fetch("/backgrounds.json").then(res => res.json()).then(json => setImages(json));
  }, []);

  return (
    <Accordion.Item className="AccordionItem" value="item-1">
      <Accordion.Header className="AccordionHeader">
        <Accordion.Trigger className="AccordionTrigger">
          <h3>Background</h3>
          <HiOutlineChevronDown className="AccordionChevron" style={{ color: `var(--${theme}-10)` }} aria-hidden />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="AccordionContent">
        <Grid columns={"3"} gap={"4"}>
          {images.map((bg) =>
          (
            <HoverCard.Root
              key={Object.values((bg))[0]}
            >
              <HoverCard.Trigger>
                <button
                  className="image-button"
                  onClick={() => setBackground(Object.values(bg)[0])}
                >
                  <Inset clip={"padding-box"} side={"top"} pb={"current"}>
                    <img src={Object.values(bg)[0]}></img>
                  </Inset>
                </button>
              </HoverCard.Trigger>
              <HoverCard.Content className="hover-card">
                {Object.keys(bg)[0]}
              </HoverCard.Content>
            </HoverCard.Root>
          )
          )}
        </Grid>
      </Accordion.Content>
    </Accordion.Item>
  );
}
