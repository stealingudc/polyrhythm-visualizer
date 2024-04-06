import Drawer from "react-modern-drawer";

type Props = {
  isOpen: boolean;
  direction: "top" | "bottom" | "left" | "right";
}

export default (props: Props) => {
  const { isOpen, direction } = props;
  return(
    <Drawer open={isOpen} direction={direction}>
      <div></div>
    </Drawer>
  )
}
