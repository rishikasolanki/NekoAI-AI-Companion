import {
  useEffect,
  useRef,
  useState,
} from "react";

const WALK_SPEED = 2;
const WALK_INTERVAL = 45;

export default function usePetMovement() {
  const [direction, setDirection] =
    useState(1);

  const [isWalking, setIsWalking] =
    useState(true);

  const walkTimerRef = useRef(null);
  const behaviourTimerRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const movingRef = useRef(false);

  useEffect(() => {
    if (
      !window.electronAPI?.movePetBy ||
      !isWalking
    ) {
      return undefined;
    }

    walkTimerRef.current =
      window.setInterval(async () => {
        if (movingRef.current) {
          return;
        }

        movingRef.current = true;

        try {
          const result =
            await window.electronAPI.movePetBy(
              direction * WALK_SPEED,
              0
            );

          if (
            result?.hitLeft ||
            result?.hitRight
          ) {
            setDirection((current) =>
              current === 1 ? -1 : 1
            );
          }
        } catch (error) {
          console.error(
            "Pet movement failed:",
            error
          );
        } finally {
          movingRef.current = false;
        }
      }, WALK_INTERVAL);

    return () => {
      window.clearInterval(
        walkTimerRef.current
      );
    };
  }, [direction, isWalking]);

  useEffect(() => {
    behaviourTimerRef.current =
      window.setInterval(() => {
        const random = Math.random();

        if (random < 0.3) {
          setIsWalking(false);

          window.clearTimeout(
            pauseTimerRef.current
          );

          pauseTimerRef.current =
            window.setTimeout(() => {
              setIsWalking(true);
            }, 1800 + Math.random() * 2800);
        } else if (random < 0.58) {
          setDirection((current) =>
            current === 1 ? -1 : 1
          );
        }
      }, 5000);

    return () => {
      window.clearInterval(
        behaviourTimerRef.current
      );

      window.clearTimeout(
        pauseTimerRef.current
      );
    };
  }, []);

  function turnAround() {
    setDirection((current) =>
      current === 1 ? -1 : 1
    );
  }

  return {
    direction,
    isWalking,
    setIsWalking,
    turnAround,
  };
}