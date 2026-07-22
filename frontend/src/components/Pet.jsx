import usePetMovement from "../hooks/usePetMovement";
import SpeechBubble from "./SpeechBubble";
import useSpeech from "../hooks/useSpeech";
import useEmotion from "../hooks/useEmotion";
import Sprite from "./Sprite";
import useDecision from "../hooks/useDecision";

export default function Pet() {
  const {
    position,
    setPosition,
    isDragging,
    setIsDragging
  } = usePetMovement();

  const message = useSpeech();
  const { setEmotion } = useEmotion();

  // 🔗 Connect backend decision engine
  useDecision();

  const handleMouseDown = () => {
    // Manual override for testing
    setEmotion("celebrate");
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setEmotion("idle");
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - 90,
      y: e.clientY - 90
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {/* Speech bubble shows AI messages */}
      <SpeechBubble message={message} />

      {/* Pet sprite (placeholder or animated later) */}
      <Sprite />
    </div>
  );
}
