import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
const readReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const serverSnapshot = () => false;

export default function usePlaceMotion() {
  const paused = useSyncExternalStore(subscribe, readReducedMotion, serverSnapshot);
  return { paused };
}
