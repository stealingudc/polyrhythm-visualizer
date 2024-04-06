import { RGB } from "@utils/getColorPalette";

type RadixColor = {
  [key: string]: RGB;
}

const radixColors: RadixColor[] = [
  {"gold": {r: 151, g: 132, b: 103 }},
  {"bronze": { r: 161, g: 128, b: 113 }},
  {"brown": { r: 172, g: 127, b: 88 }},
  {"yellow": { r: 255, g: 231, b: 41 }},
  {"amber": { r: 255, g: 197, b: 61 }},
  {"orange": { r: 247, g: 107, b: 20 }},
  {"tomato": { r: 230, g: 77, b: 46 }},
  {"red": { r:229, g: 73, b: 77}},
  {"ruby": { r: 229, g: 70, b: 101 }},
  {"crimson": { r: 232, g: 61, b: 129}},
  {"pink": { r: 214, g: 65, b: 159}},
  {"plum": { r: 170, g: 74, b: 187}},
  {"purple": { r: 142, g: 79, b: 198}},
  {"violet": { r: 110, g: 86, b: 206}},
  {"iris": { r: 91, g: 91, b: 213}},
  {"indigo": { r: 63, g: 99, b: 221}},
  {"blue": { r: 0, g: 144, b: 255}},
  {"cyan": { r: 0, g: 162, b: 199}},
  {"teal": { r: 18, g: 164, b: 147}},
  {"jade": { r: 42, g: 163, b: 133}},
  {"green": { r: 48, g: 163, b: 109}},
  {"grass": { r: 70, g: 167, b: 88}},
  {"lime": { r: 190, g: 238, b: 100}},
  {"mint": { r: 135, g: 234, b: 213}},
  {"sky": { r: 125, g: 226, b: 254}}
] 

export default (rgb: RGB) => {
  const distances: number[] = [];
  for(const color of radixColors){
    const colorRGB: RGB = Object.values(color)[0];
    const distanceObj = {
      r: rgb.r - colorRGB.r,
      g: rgb.g - colorRGB.g,
      b: rgb.b - colorRGB.b
    };
    const distance = 
      Math.hypot(distanceObj.r, distanceObj.g, distanceObj.b);
    distances.push(distance);
  }
  const smallestDistance = distances.reduce((a, b) => Math.min(a, b));
  return Object.keys(radixColors[distances.indexOf(smallestDistance)])[0]; 
}
