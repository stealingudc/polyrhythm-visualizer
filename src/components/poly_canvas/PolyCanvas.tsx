import usePolycanvas from "@redux/polycanvas/usePolycanvas";
import useAnimationFrame from "../../hooks/useAnimationFrame";
import "./poly_canvas.css";
import React from "react";
import useAudio from "@redux/audio/useAudio";
import * as Tone from "tone";

type Coords2D = {
  x: number;
  y: number;
}

type Canvas = {
  center: Coords2D;
  start: Coords2D;
  end: Coords2D;
  length: number;

  strokeStyle: CanvasRenderingContext2D['strokeStyle'];
  lineWidth: CanvasRenderingContext2D['lineWidth'];
}

type Color = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

type Arc = {
  color: Color;
  velocity: number;
}

type SettingsState = {
  arc: {
    arcs: Arc[];
    distance: number;
    alpha: number;
  },
  speed: {
    loops: number;
    timeframeSeconds: number;
  },
  point: {
    radius: number;
  },
  audio: {
    sample: string;
    volume: number;
    isEnabled: boolean;
  }
}

type SettingsAction = {
  type: "set_arcs";
  payload: Arc[];
} | {
  type: "set_arcDistance";
  payload: number;
} | {
  type: "set_alpha";
  payload: number;
} | {
  type: "set_loops";
  payload: number;
} | {
  type: "set_timeframeSeconds";
  payload: number;
} | {
  type: "set_pointRadius";
  payload: number;
} | {
  type: "set_sample";
  payload: string;
} | {
  type: "set_volume";
  payload: number;
} | {
  type: "toggle_audioEnabled";
}

const canvasConfig = {
  strokeStyle: "white",
  lineWidth: 6
}

const settingsReducer = (state: SettingsState, action: SettingsAction) => {
  switch (action.type) {
    case ("set_arcs"): {
      state.arc.arcs = action.payload;
      return state;
    }
    case ("set_arcDistance"): {
      state.arc.distance = action.payload;
      return state;
    }
    case ("set_alpha"): {
      state.arc.alpha = action.payload;
      return state;
    }
    case ("set_loops"): {
      state.speed.loops = action.payload;
      return state;
    }
    case ("set_timeframeSeconds"): {
      state.speed.timeframeSeconds = action.payload;
      return state;
    }
    case ("set_pointRadius"): {
      state.point.radius = action.payload;
      return state;
    }
    case ("set_sample"): {
      state.audio.sample = action.payload;
      return state;
    }
    case ("set_volume"): {
      state.audio.volume = action.payload;
      return state;
    }
    case ("toggle_audioEnabled"): {
      state.audio.isEnabled = !state.audio.isEnabled;
      return state;
    }
  }
}

export default () => {
  const ref = React.createRef<HTMLCanvasElement>();
  var ctx: CanvasRenderingContext2D | null;
  var canvas: Canvas;
  var startTime: number;
  var currentTime: number;
  var elapsedTime: number;
  var context: AudioContext;

  const { arc, speed, point } = usePolycanvas();
  const { audio } = useAudio();

  const updateArcs = (arcCount: number) => {
    const _arcs = [];
    for (var i = 0; i < arcCount; i++) {
      _arcs.push(
        { color: { red: 255, green: 255, blue: 255, alpha: arc.alpha }, velocity: (4 * Math.PI * (speed.loops - i)) / speed.timeframeSeconds }
      );
    }
    return _arcs;
  }

  const loadSample = () => fetch("/audio/old-timey_c4.ogg")
    .then(res => res.arrayBuffer())
    .then(buffer => context.decodeAudioData(buffer));

  const [settings, dispatch] = React.useReducer(settingsReducer,
    {
      arc: {
        arcs: updateArcs(arc.count),
        distance: arc.distance,
        alpha: arc.alpha
      },
      speed: {
        loops: speed.loops,
        timeframeSeconds: speed.timeframeSeconds
      },
      point: {
        radius: point.radius
      },
      audio: {
        sample: audio.sample,
        volume: audio.volume,
        isEnabled: audio.isEnabled
      }
    });

  React.useEffect(() => {
    startTime = performance.now();
    elapsedTime = performance.now();

    context = new AudioContext();


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

      canvas = {
        center, start, end, length,
        strokeStyle: canvasConfig.strokeStyle,
        lineWidth: canvasConfig.lineWidth,
      }
    }
  }, []);

  React.useEffect(() => {
    dispatch({ type: "set_arcDistance", payload: arc.distance });
    dispatch({ type: "set_alpha", payload: arc.alpha });
    dispatch({ type: "set_loops", payload: speed.loops });
    dispatch({ type: "set_timeframeSeconds", payload: speed.timeframeSeconds });
    dispatch({ type: "set_pointRadius", payload: point.radius });
    const _arcs = updateArcs(arc.count);
    dispatch({ type: "set_arcs", payload: _arcs });
  }, [
    arc.count, arc.distance, arc.alpha,
    speed.loops, speed.timeframeSeconds,
    point.radius
  ]);

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
      const spacing = (canvas.length / 2 - initialArcRadius) / settings.arc.arcs.length;

      settings.arc.arcs.forEach((arc, index) => {
        if (ctx) {
          const radius = initialArcRadius + (index * spacing);
          ctx.beginPath();
          ctx.arc(canvas.center.x, canvas.center.y, radius, Math.PI * 2, 0);

          ctx.strokeStyle = `rgba(${arc.color.red}, ${arc.color.green},
            ${arc.color.blue}, ${arc.color.alpha})`;

          ctx.lineWidth = ctx.lineWidth;

          ctx.stroke();
          drawCircle(index, radius, arc.velocity);
        }
      });

    }
    // console.log(arcs)
  }

  const drawCircle = (index: number, radius: number, velocity: number) => {
    if (canvas && ctx) {
      ctx.beginPath();
      ctx.fillStyle = "white";

      const distance = Math.PI + (elapsedTime * velocity);
      const sinDistance = Math.sin(distance);
      const arcX = canvas.center.x + radius * Math.cos(distance);
      const arcY = canvas.center.y + radius * sinDistance;

      ctx.arc(arcX, arcY, canvas.length * 0.0065, 0, Math.PI * 2);
      ctx.fill();

      if (-0.01 < sinDistance && sinDistance < 0.01) {
        settings.arc.arcs[index].color.alpha = 1.0;
        loadSample().then(sample => {
          const gain = context.createGain();
          gain.gain.value = 0.1;
          gain.connect(context.destination);
          const source = context.createBufferSource();
          source.buffer = sample;
          // source.playbackRate.value = 2 ** ((60 - index) / 12);
          source.connect(gain);
          source.start(0);
        })
      }

      if (settings.arc.arcs[index].color.alpha > settings.arc.alpha) {
        settings.arc.arcs[index].color.alpha -= 0.025;
      }

      ctx.stroke();
    }
  }

  const clearCanvas = () => {
    if (ctx) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  useAnimationFrame(() => {
    // Used to calculate distance between circles. Don't remove.
    currentTime = performance.now();
    elapsedTime = (currentTime - startTime) / 1000;

    clearCanvas();

    drawLine();
    drawArcs();
  })

  return (
    <canvas ref={ref} className="poly-canvas"></canvas>
  )
}
