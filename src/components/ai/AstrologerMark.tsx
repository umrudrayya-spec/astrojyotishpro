/** Hand-drawn SVG identity for the AI astrologer: a crescent inside an eight-petal yantra. */
export function AstrologerMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="24" cy="24" r="21" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d="M24 5 L27 14 L24 12 L21 14 Z" transform={`rotate(${i * 45} 24 24)`} strokeLinejoin="round" />
      ))}
      <circle cx="24" cy="24" r="9" />
      <path d="M27.5 18.5a7 7 0 1 0 0 11 5.5 5.5 0 1 1 0-11z" fill="currentColor" stroke="none" />
    </svg>
  );
}
