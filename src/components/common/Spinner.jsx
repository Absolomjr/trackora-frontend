export function Spinner({ size }) {
  return <span className={`spinner ${size === "sm" ? "spinner--sm" : ""}`} />;
}

export function LoadingBlock({ label = "Loading…" }) {
  return (
    <div className="loader-center">
      <Spinner />
      <span>{label}</span>
    </div>
  );
}

export default Spinner;
