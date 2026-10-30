const particles = Array.from({ length: 20 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  delay: `${-((index * 7) % 23)}s`,
  duration: `${12 + (index * 3) % 13}s`,
  size: `${3 + index % 4}px`,
  drift: `${(index % 2 ? 1 : -1) * (18 + index % 5 * 8)}px`,
}));

export default function PlaceAtmosphere({ theme }) {
  const hasParticles = ['snow', 'rain', 'petals', 'sand'].includes(theme.motion);
  return (
    <div className={`place-atmosphere place-atmosphere--${theme.motion}`} aria-hidden="true" key={theme.motion}>
      {hasParticles && particles.map((particle, index) => (
        <span key={index} style={{
          '--particle-x': particle.left,
          '--particle-delay': particle.delay,
          '--particle-duration': particle.duration,
          '--particle-size': particle.size,
          '--particle-drift': particle.drift,
        }} />
      ))}
    </div>
  );
}
