import useAnimationFrame from "../../hooks/useAnimationFrame";
import "./poly_canvas.css";
import React from "react";
import useAudio from "@redux/audio/useAudio";
import { usePolycanvas } from "@redux/polycanvas/polycanvas";

type Coords2D = {
  x: number;
  y: number;
}

type Canvas = {
  center: Coords2D;
  start: Coords2D;
  end: Coords2D;
  length: number;

  width: number;
  height: number;

  strokeStyle: CanvasRenderingContext2D['strokeStyle'];
  lineWidth: CanvasRenderingContext2D['lineWidth'];
}

const canvasConfig = {
  strokeStyle: "white",
  lineWidth: 6
}

var ctx: CanvasRenderingContext2D | null;
var canvas: Canvas;


export default () => {
  const ref = React.createRef<HTMLCanvasElement>();
  var currentTime: number = performance.now();
  var elapsedTime: number = performance.now();

  const [startTime, _] = React.useState<number>(performance.now());

  const { arc, arcs, point, points, settings } = usePolycanvas();
  const audioSettings = useAudio();

  const [audios, setAudios] = React.useState<HTMLAudioElement[]>([]);

  const getAudio = (count: number) => {
    const audios: HTMLAudioElement[] = [];
    for (var i = 0; i < count; i++) {
      const audio = new Audio();
      audio.src = audioSettings.audio.sample;
      audio.volume = audioSettings.audio.volume / 100;
      audio.preservesPitch = false;
      audio.playbackRate = 2 ** ((60 + i - 60) / 12);
      audios.push(audio);
    }
    return audios;
  };

  const calculateImpactTime = (currentImpactTime: number, velocity: number) => {
    return currentImpactTime + (Math.PI / velocity) * 1000;
  }

  const getPointPosition = (index: number): Coords2D => {
    const initialArcRadius = canvas.length * settings.arc.distance;
    const spacing = (canvas.length / 2 - initialArcRadius) / arcs.length;
    const radius = initialArcRadius + (index * spacing);

    const distance = Math.PI + (elapsedTime * arcs[index].velocity);
    const sinDistance = Math.sin(distance);
    const x = canvas.center.x + radius * Math.cos(distance);
    const y = canvas.center.y + radius * sinDistance;

    return { x, y };
  }

  const makeArcs = (arcCount: number): void => {
    const _arcs = [];
    for (var i = 0; i < arcCount; i++) {
      const velocity = (4 * Math.PI * (settings.speed.loops - i)) / settings.speed.timeframeSeconds;
      _arcs.push({
        color: { r: 255, g: 255, b: 255, a: 0.3 },
        velocity,
        nextImpactTime: calculateImpactTime(startTime, velocity),
      });
    }
    arc.setArcs(_arcs);
  }

  const makePoints = (): void => {
    const _points = [];
    if (canvas) {
      for (var i = 0; i < arcs.length; i++) {
        const distance = Math.PI + (elapsedTime * arcs[i].velocity);
        const position = getPointPosition(i);

        _points.push({
          radius: 0.0065,
          position,
          distanceOffset: distance
        })
      }
    }
    point.setPoints(_points);
  }

  React.useEffect(() => {
    makeArcs(10);

    setAudios(getAudio(arcs.length));

    if (ref.current) {
      ctx = ref.current?.getContext("2d");

      ref.current.width = ref.current.clientWidth;
      ref.current.height = ref.current.clientHeight;

      const center: Coords2D = {
        x: ref.current.width / 2,
        y: ref.current.height / 2
      };
      const start: Coords2D = {
        x: 0,
        y: ref.current.height / 2
      };
      const end: Coords2D = {
        x: ref.current.width,
        y: ref.current.height / 2
      };
      const length = end.x;
      const width = ref.current.width;
      const height = ref.current.height;

      canvas = {
        center, start, end, length,
        width, height,
        strokeStyle: canvasConfig.strokeStyle,
        lineWidth: canvasConfig.lineWidth,
      }
    }
  }, []);

  React.useEffect(() => {
    if(arcs.length !== 0)
    makeArcs(arcs.length);
  }, [settings.speed.timeframeSeconds, settings.speed.loops])

  React.useEffect(() => {
    makePoints();
    setAudios(getAudio(arcs.length))
  }, [arcs.length]);

  React.useEffect(() => {
    setAudios(getAudio(arcs.length))
  }, [audioSettings.audio.sample, audioSettings.audio.volume]);

  const drawLine = () => {
    if (canvas && ctx) {
      ctx.beginPath();
      ctx.moveTo(canvas.start.x, canvas.start.y);
      ctx.lineTo(canvas.end.x, canvas.end.y);

      ctx.strokeStyle = canvas.strokeStyle;
      ctx.lineWidth = ctx.lineWidth;

      ctx.stroke();
    }
  }

  const drawArcs = () => {
    if (canvas && ctx) {
      const initialArcRadius = canvas.length * settings.arc.distance;
      const spacing = (canvas.length / 2 - initialArcRadius) / arcs.length;

      arcs.forEach((arc, index) => {
        if (ctx) {
          const radius = initialArcRadius + (index * spacing);
          ctx.beginPath();
          ctx.arc(canvas.center.x, canvas.center.y, radius, Math.PI * 2, 0);

          ctx.strokeStyle = `rgba(${arc.color.r}, ${arc.color.g},
            ${arc.color.b}, ${arc.color.a})`;

          ctx.lineWidth = ctx.lineWidth;

          ctx.stroke();
        }
      });
    }
  }

  const drawPoints = () => {
    if (canvas && ctx) {
      ctx.beginPath();
      ctx.fillStyle = "white";

      points.forEach((_point, index) => {
        const position = getPointPosition(index);
        point.setProperty({ index, key: "position", value: position });
        if (canvas && ctx) {
          ctx.beginPath();
          ctx.fillStyle = "white";
          ctx.arc(_point.position.x, _point.position.y, canvas.length * _point.radius, 0, Math.PI * 2);
          ctx.fill();
          if (index !== 0) {
            if (canvas.center.y - index < _point.position.y && _point.position.y < canvas.center.y + index) {
              arc.setProperty({ index, key: "color", value: { r: 255, g: 255, b: 255, a: 1 } });
              if (audioSettings.audio.isEnabled) {
                audios[index].play().catch(() => { });
                if (!audios[index].ended && audios[index].currentTime > 0.5) {
                  audios[index].pause();
                  audios[index].currentTime = 0;
                  audios[index].play().catch(() => { });
                }
              }
            }
          } else {
            if (canvas.center.y - 1 < _point.position.y && _point.position.y < canvas.center.y + 1) {
              arc.setProperty({ index, key: "color", value: { r: 255, g: 255, b: 255, a: 1 } });
              if (audioSettings.audio.isEnabled) {
                audios[index].play().catch(() => { });
                if (!audios[index].ended && audios[index].currentTime > 0.5) {
                  audios[index].pause();
                  audios[index].currentTime = 0;
                  audios[index].play().catch(() => { });
                }
              }
              audioSettings.audio.isEnabled ? audios[index].play() : null;
            }
          }

          if (arcs[index].color.a > 0.3) {
            arc.setProperty({ index, key: "color", value: { r: 255, g: 255, b: 255, a: arcs[index].color.a - 0.025 } });
          }
        }
      }
      )
      ctx.stroke();
    };
  }

  const clearCanvas = () => ctx ? ctx.clearRect(0, 0, window.innerWidth, window.innerHeight) : null;

  useAnimationFrame(() => {
    // Used to calculate distance between circles. Don't remove.
    currentTime = performance.now();
    elapsedTime = (currentTime - startTime) / 1000;

    clearCanvas();

    drawLine();
    drawArcs();
    drawPoints();
  })

  return (
    <>
      <canvas ref={ref} className="poly-canvas"></canvas>
      {/* Elapsed Time: {elapsedTime} */}
    </>
  )
}
