/** Navagraha mandala mark drawn in SVG (no images). */
export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22" className="fill-gold" />
      <circle cx="24" cy="24" r="17" className="fill-primary" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <circle key={i} cx={24 + Math.cos(a) * 11} cy={24 + Math.sin(a) * 11} r="2.2" className="fill-gold" />
        );
      })}
      <circle cx="24" cy="24" r="4.5" className="fill-gold" />
    </svg>
  );
}
