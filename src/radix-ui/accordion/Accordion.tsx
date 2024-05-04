import * as Accordion from "@radix-ui/react-accordion";
import classNames from "classnames";
import React, { LegacyRef } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";
import "./accordion.css";

type Props = {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
}

const AccordionTrigger = React.forwardRef(({ children, className, ...props }: Props, forwardedRef) => {
  return (
    <Accordion.Header className="AccordionHeader">
      <Accordion.Trigger
        className={classNames('AccordionTrigger', className)}
        {...props}
        ref={forwardedRef as LegacyRef<HTMLButtonElement>}
        disabled={false}
        aria-disabled={false}
      >
        {children}
        <HiOutlineChevronDown className="AccordionChevron" style={{ color: `green` }} color="green" aria-hidden />
      </Accordion.Trigger>
    </Accordion.Header>
  )
});

const AccordionContent = React.forwardRef(({ children, className, ...props }: Props, forwardedRef) => (
  <Accordion.Content
    className={classNames('AccordionContent', className)}
    {...props}
    ref={forwardedRef as LegacyRef<HTMLDivElement>}
  >
    <div className="AccordionContentText">{children}</div>
  </Accordion.Content>
));

export { AccordionTrigger, AccordionContent }
