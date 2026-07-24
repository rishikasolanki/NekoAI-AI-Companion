import {
  useEffect,
  useRef,
  useState,
} from "react";

import Sprite from "./Sprite";
import useEmotion from "../hooks/useEmotion";
import usePetMovement from "../hooks/usePetMovement";
import usePetStateMachine from "../hooks/usePetStateMachine";

import "./Pet.css";

const randomMessages = [
  "Meow! Ready for one small win? 🐾",
  "No side quests. Lock in.",
  "Tiny progress still counts.",
  "I am watching supportively 😼",
  "Have you finished your important task?",
  "Hydration check, bestie 💧",
  "Do not make me use the sad eyes 🥺",
];

// Worst case, if a native window drag never fires a mouseup (e.g. the
// OS swallows it), this clears the dragging pose on its own so the
// pet can never get stuck in a "being dragged" state.
const DRAG_FAILSAFE_MS = 4000;

export default function Pet() {
  const {
    state,
    forceState,
  } = usePetStateMachine("idle");

  const [isDragging, setIsDragging] =
    useState(false);

  const {
    direction,
    turnAround,
  } = usePetMovement(state, isDragging);

  const {
    emotion,
    setEmotion,
  } = useEmotion();

  const [message, setMessage] =
    useState("");

  const [xp, setXp] = useState(() => {
    const saved =
      localStorage.getItem("neko-xp");

    return Number(saved || 0);
  });

  const [showXp, setShowXp] =
    useState(false);

  const speechTimerRef = useRef(null);
  const emotionTimerRef = useRef(null);
  const clickTimerRef = useRef(null);
  const dragFailsafeRef = useRef(null);

  const level =
    Math.floor(xp / 100) + 1;

  const levelProgress = xp % 100;

  useEffect(() => {
    localStorage.setItem(
      "neko-xp",
      String(xp)
    );
  }, [xp]);

  // Alarm/task/habit features already send these IPC events — keep
  // listening exactly as before. Only "sleep"/"sad" now interrupt the
  // pet's current locomotion (mirrors the old behaviour of pausing
  // movement for those two); other emotions (e.g. the alarm's
  // "angry", or "celebrate" on dismiss) just play on top of whatever
  // the pet is already doing, which reads as less jarring.
  useEffect(() => {
    const removeMessageListener =
      window.electronAPI?.onPetMessage?.(
        (newMessage) => {
          showMessage(newMessage);
          playMeow("happy");
        }
      );

    const removeEmotionListener =
      window.electronAPI?.onPetEmotion?.(
        (newEmotion) => {
          setEmotion(newEmotion);

          if (newEmotion === "sleep") {
            forceState("sleep", 6000);
          } else if (newEmotion === "sad") {
            forceState("sit", 5000);
          }
        }
      );

    return () => {
      removeMessageListener?.();
      removeEmotionListener?.();
    };
  }, [setEmotion, forceState]);

  // Lightweight personality timer: occasional speech bubbles and a
  // brief happy-emotion flash. Locomotion (idle/walk/run/sit/sleep)
  // is owned entirely by usePetStateMachine now, so this no longer
  // touches it — previously this timer and a second one inside
  // usePetMovement both randomized walking independently, which
  // could fight each other.
  useEffect(() => {
    const personalityTimer =
      window.setInterval(() => {
        if (Math.random() < 0.4) {
          const nextMessage =
            randomMessages[
              Math.floor(
                Math.random() *
                  randomMessages.length
              )
            ];

          showMessage(nextMessage);
        }

        if (Math.random() < 0.2) {
          setEmotion("happy");

          window.clearTimeout(
            emotionTimerRef.current
          );

          emotionTimerRef.current =
            window.setTimeout(() => {
              setEmotion("idle");
            }, 1600);
        }
      }, 15000);

    return () => {
      window.clearInterval(
        personalityTimer
      );

      window.clearTimeout(
        emotionTimerRef.current
      );
    };
  }, [setEmotion]);

  useEffect(() => {
    function handleWindowMouseUp() {
      endDrag();
    }

    window.addEventListener(
      "mouseup",
      handleWindowMouseUp
    );

    window.addEventListener(
      "blur",
      handleWindowMouseUp
    );

    return () => {
      window.removeEventListener(
        "mouseup",
        handleWindowMouseUp
      );

      window.removeEventListener(
        "blur",
        handleWindowMouseUp
      );

      window.clearTimeout(
        dragFailsafeRef.current
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showMessage(text) {
    window.clearTimeout(
      speechTimerRef.current
    );

    setMessage(text);

    speechTimerRef.current =
      window.setTimeout(() => {
        setMessage("");
      }, 4800);
  }

  function playMeow(type = "normal") {
    try {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) {
        return;
      }

      const context = new AudioContext();
      const oscillator =
        context.createOscillator();
      const gain = context.createGain();

      const sounds = {
        normal: [520, 760, 430],
        happy: [650, 900, 580],
        sad: [480, 350, 260],
      };

      const notes =
        sounds[type] ||
        sounds.normal;

      const now = context.currentTime;

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(
        notes[0],
        now
      );

      oscillator.frequency.linearRampToValueAtTime(
        notes[1],
        now + 0.12
      );

      oscillator.frequency.linearRampToValueAtTime(
        notes[2],
        now + 0.4
      );

      gain.gain.setValueAtTime(
        0.0001,
        now
      );

      gain.gain.exponentialRampToValueAtTime(
        0.14,
        now + 0.03
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.45
      );

      oscillator.start(now);
      oscillator.stop(now + 0.46);
    } catch (error) {
      console.error(
        "Meow sound failed:",
        error
      );
    }
  }

  function rewardXp(amount) {
    setXp((current) =>
      current + amount
    );

    setShowXp(true);

    window.setTimeout(() => {
      setShowXp(false);
    }, 1000);
  }

  function performTickle() {
    const nextEmotion =
      emotion === "happy"
        ? "celebrate"
        : "happy";

    setEmotion(nextEmotion);
    forceState("sit", 2000);

    rewardXp(5);
    playMeow("happy");

    showMessage(
      nextEmotion === "celebrate"
        ? "More pets! I approve 😻"
        : "Purrrrr... tickles!"
    );

    window.clearTimeout(
      emotionTimerRef.current
    );

    emotionTimerRef.current =
      window.setTimeout(() => {
        setEmotion("idle");
      }, 2000);
  }

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    window.clearTimeout(
      clickTimerRef.current
    );

    clickTimerRef.current =
      window.setTimeout(() => {
        performTickle();
      }, 230);
  }

  function handleDoubleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    window.clearTimeout(
      clickTimerRef.current
    );

    setEmotion("excited");
    forceState("sit", 1800);

    rewardXp(15);
    playMeow("happy");

    showMessage(
      "Opening your productivity HQ! ⚡"
    );

    window.electronAPI?.openDashboard();

    window.clearTimeout(
      emotionTimerRef.current
    );

    emotionTimerRef.current =
      window.setTimeout(() => {
        setEmotion("idle");
      }, 1800);
  }

  function handleContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();

    turnAround();
    setEmotion("surprised");

    window.clearTimeout(
      emotionTimerRef.current
    );

    emotionTimerRef.current =
      window.setTimeout(() => {
        setEmotion("idle");
      }, 1500);

    showMessage(
      "Whoa! Secret turnaround unlocked 🙀"
    );
  }

  function startDrag() {
    setIsDragging(true);

    // Pause autonomous locomotion while the OS drags the window;
    // resumes on its own after the failsafe if nothing else clears
    // it first.
    forceState(state, DRAG_FAILSAFE_MS + 500);

    window.clearTimeout(
      dragFailsafeRef.current
    );

    dragFailsafeRef.current =
      window.setTimeout(() => {
        endDrag();
      }, DRAG_FAILSAFE_MS);
  }

  function endDrag() {
    window.clearTimeout(
      dragFailsafeRef.current
    );

    setIsDragging((wasDragging) => {
      if (wasDragging) {
        forceState("idle", 300);
      }

      return false;
    });
  }

  return (
    <div className="desktop-pet">
      {message && (
        <div className="pet-speech-bubble">
          <p>{message}</p>
          <span />
        </div>
      )}

      <div className="pet-level-card">
        <span>Lv. {level}</span>

        <div className="pet-xp-track">
          <div
            className="pet-xp-fill"
            style={{
              width: `${levelProgress}%`,
            }}
          />
        </div>
      </div>

      {showXp && (
        <div className="pet-xp-popup">
          +5 XP
        </div>
      )}

      <div
        className="pet-drag-area"
        title="Drag Neko"
        onMouseDown={startDrag}
      >
        <Sprite
          state={state}
          direction={direction}
          isDragging={isDragging}
        />
      </div>

      <button
        type="button"
        className="pet-face-button"
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        aria-label="Tickle Neko"
        title="Click to tickle · Double-click to open NekoAI"
      />
    </div>
  );
}
