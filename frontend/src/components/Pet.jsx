import {
  useEffect,
  useRef,
  useState,
} from "react";

import Sprite from "./Sprite";
import useEmotion from "../hooks/useEmotion";
import usePetMovement from "../hooks/usePetMovement";

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

const emotions = [
  "idle",
  "happy",
  "playful",
  "sleep",
  "sad",
  "excited",
];

export default function Pet() {
  const {
    direction,
    isWalking,
    setIsWalking,
    turnAround,
  } = usePetMovement();

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

  const level =
    Math.floor(xp / 100) + 1;

  const levelProgress = xp % 100;

  useEffect(() => {
    localStorage.setItem(
      "neko-xp",
      String(xp)
    );
  }, [xp]);

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

          setIsWalking(
            !["sleep", "sad"].includes(
              newEmotion
            )
          );
        }
      );

    return () => {
      removeMessageListener?.();
      removeEmotionListener?.();
    };
  }, [setEmotion, setIsWalking]);

  useEffect(() => {
    const behaviourTimer =
      window.setInterval(() => {
        const nextEmotion =
          emotions[
            Math.floor(
              Math.random() *
                emotions.length
            )
          ];

        setEmotion(nextEmotion);

        setIsWalking(
          !["sleep", "sad", "idle"].includes(
            nextEmotion
          )
        );

        if (Math.random() < 0.45) {
          const nextMessage =
            randomMessages[
              Math.floor(
                Math.random() *
                  randomMessages.length
              )
            ];

          showMessage(nextMessage);
        }

        window.clearTimeout(
          emotionTimerRef.current
        );

        emotionTimerRef.current =
          window.setTimeout(() => {
            setEmotion("idle");
            setIsWalking(true);
          }, 4500);
      }, 12000);

    return () => {
      window.clearInterval(
        behaviourTimer
      );

      window.clearTimeout(
        emotionTimerRef.current
      );
    };
  }, [
    setEmotion,
    setIsWalking,
  ]);

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
    setIsWalking(false);

    rewardXp(5);
    playMeow("happy");

    showMessage(
      nextEmotion === "celebrate"
        ? "More pets! I approve 😻"
        : "Purrrrr... tickles!"
    );

    window.setTimeout(() => {
      setEmotion("idle");
      setIsWalking(true);
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
    setIsWalking(false);

    rewardXp(15);
    playMeow("happy");

    showMessage(
      "Opening your productivity HQ! ⚡"
    );

    window.electronAPI?.openDashboard();

    window.setTimeout(() => {
      setEmotion("idle");
      setIsWalking(true);
    }, 1800);
  }

  function handleContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();

    turnAround();
    setEmotion("surprised");

    showMessage(
      "Whoa! Secret turnaround unlocked 🙀"
    );

    window.setTimeout(() => {
      setEmotion("idle");
    }, 1500);
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
      >
        <Sprite
          direction={direction}
          isWalking={isWalking}
          isDragging={false}
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