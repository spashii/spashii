import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
// @ts-ignore
import { loadSlim } from "@tsparticles/slim";

export const Confetti = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () =>
      ({
        fullScreen: {
          enable: false,
        },
        particles: {
          number: {
            value: 80,
          },
          color: {
            // value: ["#00FFFC", "#FC00FF", "#fffc00"],
            // only grays
            value: ["#000000", "#888888", "#ffffff"],
          },
          shape: {
            type: ["circle", "square"],
            options: {},
          },
          opacity: {
            value: {
              min: 0,
              max: 1,
            },
            animation: {
              enable: true,
              speed: 1,
              startValue: "max",
              destroy: "min",
            },
          },
          size: {
            value: {
              min: 2,
              max: 4,
            },
          },
          links: {
            enable: false,
          },
          life: {
            duration: {
              sync: true,
              value: 15,
            },
            count: 1,
          },
          move: {
            enable: true,
            gravity: {
              enable: true,
              acceleration: 1,
            },
            speed: {
              min: 10,
              max: 20,
            },
            decay: 0.1,
            direction: "none",
            straight: false,
            outModes: {
              default: "destroy",
              top: "none",
            },
          },
          rotate: {
            value: {
              min: 0,
              max: 360,
            },
            direction: "random",
            move: true,
            animation: {
              enable: true,
              speed: 60,
            },
          },
          tilt: {
            direction: "random",
            enable: true,
            move: true,
            value: {
              min: 0,
              max: 360,
            },
            animation: {
              enable: true,
              speed: 60,
            },
          },
          roll: {
            darken: {
              enable: true,
              value: 25,
            },
            enable: true,
            speed: {
              min: 15,
              max: 25,
            },
          },
          wobble: {
            distance: 30,
            enable: true,
            move: true,
            speed: {
              min: -15,
              max: 15,
            },
          },
        },
        emitters: {
          life: {
            count: 1,
            duration: 10,
            delay: 0.4,
          },
          rate: {
            delay: 0.1,
            quantity: 150,
          },
        },
      } satisfies ISourceOptions),
    []
  );

  if (init) {
    return <Particles options={options} />;
  }

  return <></>;
};
