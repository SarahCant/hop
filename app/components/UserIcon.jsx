export default function UserIcon({ name, className = "uicon" }) {
  //convert user/group name's first character to uppercase, fallback '?'
  const initial = name?.[0]?.toUpperCase();

  return (
    <div
      className={`flex items-center justify-center rounded-full ${className}`}
    >
      <span className="text-[14px]">{initial}</span>
    </div>
  );
}
