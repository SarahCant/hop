export default function TimeStamp({ timestamp, className = "" }) {
  if (!timestamp) return null;

  const d = new Date(timestamp);
  const day = String.apply(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  const timeString = timestamp
    ? (() => {
        const d = new Date(timestamp);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        return `${day}/${month} ${hours}:${minutes}`;
      })()
    : "";

  return (
    <time datetime={d.toISOString()} className={className}>
      {timeString}
    </time>
  );
}
