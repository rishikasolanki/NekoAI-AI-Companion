import useEmotion from "../hooks/useEmotion";

const emotionFaces = {
  idle: "🐱",
  happy: "😺",
  excited: "😸",
  celebrate: "😻",
  angry: "😾",
  sad: "😿",
  sleep: "😴",
  surprised: "🙀",
  playful: "😼",
};

export default function Sprite({
  direction = 1,
  isWalking = false,
  isDragging = false,
}) {
  const { emotion } = useEmotion();

  const face =
    emotionFaces[emotion] ||
    emotionFaces.idle;

  return (
    <div
      className={[
        "pet-sprite",
        isWalking
          ? "pet-walking"
          : "pet-idle",
        isDragging
          ? "pet-dragging"
          : "",
        `pet-${emotion}`,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        "--pet-direction": direction,
      }}
    >
      <div className="pet-shadow" />

      <div className="pet-body">
        <span>{face}</span>

        {emotion === "sleep" && (
          <div className="pet-effect">
            Zzz
          </div>
        )}

        {emotion === "angry" && (
          <div className="pet-effect">
            💢
          </div>
        )}

        {emotion === "celebrate" && (
          <div className="pet-effect">
            ✨
          </div>
        )}
      </div>
    </div>
  );
}