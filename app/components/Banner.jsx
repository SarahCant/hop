/* export default function Banner({ name, children }) {
  // if children exist, render them;
  // otherwise fall back to name prop;
  // and finally fall back to a default string
  const title = children ?? "SpilSammen Chat";

  return (
    <div className="banner-outer">
      <div className="banner">
        <h1 className="!text-[1.5rem] !-mt-1.5 !text-[var(--bg)]">{title}</h1>
      </div>
    </div>
  );
}
 */

export default function Banner({ name, children }) {
  const title = children ?? name ?? "SpilSammen Chat";
  return (
    <div className="banner-outer">
      <div className="banner">
        <h1 className="!text-[1.5rem] !-mt-1.5 !text-[var(--bg)]">{title}</h1>
      </div>
    </div>
  );
}
