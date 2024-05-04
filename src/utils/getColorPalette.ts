export type RGB = {
  r: number;
  g: number;
  b: number;
}

const buildRGB = (data: ImageData["data"], blockSize?: number): RGB[] => {
  const values: RGB[] = [];
  for (var i = 0; i < data.length; i += 4 * (blockSize ? blockSize : 512)) {
    const rgb: RGB = {
      r: data[i],
      g: data[i + 1],
      b: data[i + 2]
    };
    values.push(rgb);
  }
  return values;
}

const findBiggestColorRange = (values: RGB[]) => {
  var rMin = Number.MAX_VALUE;
  var gMin = Number.MAX_VALUE;
  var bMin = Number.MAX_VALUE;

  var rMax = Number.MIN_VALUE;
  var gMax = Number.MIN_VALUE;
  var bMax = Number.MIN_VALUE;

  values.forEach((pixel) => {
    rMin = Math.min(rMin, pixel.r);
    gMin = Math.min(gMin, pixel.g);
    bMin = Math.min(bMin, pixel.b);

    rMax = Math.max(rMax, pixel.r);
    gMax = Math.max(gMax, pixel.g);
    bMax = Math.max(bMax, pixel.b);
  });

  const rRange = rMax - rMin;
  const gRange = gMax - gMin;
  const bRange = bMax - bMin;

  const biggestRange = Math.max(rRange, gRange, bRange);
  if (biggestRange === rRange) {
    return "r";
  } else if (biggestRange === gRange) {
    return "g";
  } else return "b";
}

const quantization = (values: RGB[], depth: number): RGB[] => {
  const MAX_DEPTH = 4;
  if (depth === MAX_DEPTH || values.length === 0) {
    const color = values.reduce((prev, current) => {
      prev.r += current.r;
      prev.g += current.g;
      prev.b += current.b;

      return prev;
    },
      {
        r: 0,
        g: 0,
        b: 0
      });

    color.r = Math.round(color.r / values.length);
    color.g = Math.round(color.g / values.length);
    color.b = Math.round(color.b / values.length);
    return [color];
  }
  
  const biggestRange = findBiggestColorRange(values);
  values.sort((p1, p2) => {
    return p1[biggestRange] - p2[biggestRange];
  });
  const mid = values.length / 2;
  return [
    ...quantization(values.slice(0, mid), depth + 1),
    ...quantization(values.slice(mid + 1), depth + 1)
  ];
}

export default async (src: string, blockSize?: number): Promise<RGB[]> => {
  const img = new Image();
  img.src = src;

  const values: RGB[] = [];

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx!.drawImage(img, 0, 0);

    const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
    const rgb = buildRGB(imageData.data, blockSize);

    const palette = quantization(rgb, 1);
    for(const color of palette){
      values.push(color);
    }
  }

  await img.decode();

  return values;
}
