export default function TimeStamp({ timestamp, className = "" }) {
  if (!timestamp) return null;

  const d = new Date(timestamp);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const timeString = `${day}/${month} ${hours}:${minutes}`;

  return (
    <time dateTime={d.toISOString()} className={className}>
      {timeString}
    </time>
  );
}
