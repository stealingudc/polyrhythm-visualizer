import React from "react"
import "./background.css"
import getColorPalette from "@utils/getColorPalette";
import getClosestRadixColor from "@utils/getClosestRadixColor";
import getArrayMode from "@utils/getArrayMode";
import useTheme from "@redux/theme/useTheme";
import useBackground from "@redux/background/useBackground";

type Props = {
  children?: React.ReactNode | React.ReactNode[];
}

export default (props: Props) => {
  const { setTheme } = useTheme();
  const { background } = useBackground();

  const ref = React.createRef<HTMLDivElement>();

  React.useEffect(() => {
    const colors: string[] = [];
    getColorPalette(background, 64)
      .then((palette) => palette.forEach((rgb) => colors.push(getClosestRadixColor(rgb))))
      .then(() => {setTheme(getArrayMode(colors)); });
  }, [background]);

  React.useEffect(() => {
    if(ref.current){
      ref.current.animate([
        { opacity: "0" },
        { opacity: "0.25" }
      ], { duration: 500, iterations: 1 });
    }
  }, [background]);

  return (<div ref={ref} className="background" style={{backgroundImage: `url(${background})`}}>
    {props.children}
  </div>)
}
