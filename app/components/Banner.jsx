export default function Banner({ name, children }) {
  //banner text SpilSammen Chat if no children or name attatched
  const title = children ?? name ?? "SpilSammen Chat";

  //mostly plain CSS styling
  return (
    <div className="banner-outer">
      <div className="banner">
        <h1 className="!text-[1.5rem] !-mt-1.5 !text-[var(--bg)]">{title}</h1>
      </div>
    </div>
  );
}
