type PetAvatarProps = {
  emotion?: string;
};

export default function PetAvatar({
  emotion = "happy",
}: PetAvatarProps) {
  return (
    <div className="pet-avatar">
      <img
        src={`/sprites/${emotion}.png`}
        alt={`Neko is ${emotion}`}
        draggable={false}
      />
    </div>
  );
}