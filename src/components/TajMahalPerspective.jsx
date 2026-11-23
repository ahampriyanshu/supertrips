import { useRef, useEffect } from 'react';

/**
 * TajMahalPerspective
 *
 * Full-bleed authentic vintage watercolor painting of the monument.
 * Includes subtle ambient watercolor canvas effects:
 * - Edge-to-edge panoramic framing with zero borders
 * - Gentle ambient water reflection shimmer across the foreground pool
 */
export default function TajMahalPerspective({
  artworkUrl = '/magazine/taj-mahal-immersive-watercolor.jpg',
  alt = 'Vintage watercolor painting of the Taj Mahal in Agra'
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let t = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Subtle water ripple shimmer across the foreground reflecting water
    const render = () => {
      t += 0.012;
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;

      ctx.clearRect(0, 0, w, h);

      // Waterline region (lower ~34% of the viewport)
      const poolTopY = h * 0.67;
      const poolBottomY = h;
      const poolLeft = 0;
      const poolRight = w * 0.96;

      ctx.save();
      ctx.beginPath();
      ctx.rect(poolLeft, poolTopY, poolRight - poolLeft, poolBottomY - poolTopY);
      ctx.clip();

      const rippleCount = 6;
      for (let i = 0; i < rippleCount; i++) {
        const progress = (i / rippleCount + (t * 0.05) % 1) % 1;
        const y = poolTopY + progress * (poolBottomY - poolTopY);
        const spread = (y - poolTopY) / (poolBottomY - poolTopY);
        const leftX = poolLeft + spread * 30;
        const rightX = poolRight - spread * 30;
        const span = rightX - leftX;

        const waveOffset = Math.sin(t * 1.3 + i * 1.1) * 4 * spread;
        const alpha = Math.sin(progress * Math.PI) * (0.03 + 0.012 * Math.sin(t + i));

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1 + spread * 1.2;
        ctx.beginPath();
        ctx.moveTo(leftX + span * 0.1, y + waveOffset);
        ctx.quadraticCurveTo(
          leftX + span * 0.45,
          y - waveOffset * 0.7,
          leftX + span * 0.8,
          y + waveOffset
        );
        ctx.stroke();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="magazine-artwork-container">
      {/* Authentic High-Resolution Full-Bleed Vintage Watercolor Painting */}
      <img
        src={artworkUrl}
        onError={(e) => {
          if (!e.currentTarget.src.includes('taj-mahal-immersive-watercolor.jpg')) {
            e.currentTarget.src = '/magazine/taj-mahal-immersive-watercolor.jpg';
          }
        }}
        alt={alt}
        className="magazine-painting-img"
        loading="eager"
        decoding="async"
      />

      {/* Ambient water shimmer canvas */}
      <canvas
        ref={canvasRef}
        className="magazine-water-canvas"
        aria-hidden="true"
      />
    </div>
  );
}
