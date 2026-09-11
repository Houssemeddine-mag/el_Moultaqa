import { memo, useCallback, useEffect, useRef, useState } from "react";

// SponsorLoop — slow infinite logo loop in the webapp's own style.
// Measures one sequence and repeats just enough copies to loop seamlessly
// (clones are aria-hidden; screen readers get the first copy only).
// Pauses on hover, honors prefers-reduced-motion (static centered row).
const MIN_COPIES = 2;
const COPY_HEADROOM = 2;
const SMOOTH_TAU = 0.25;

function SponsorCard({ item }) {
  const content = item.src ? (
    <img src={item.src} alt={item.alt || item.name} loading="lazy" decoding="async" draggable={false} />
  ) : (
    <span className="sponsor-text-chip" title={item.alt || item.name}>
      {item.name}
    </span>
  );

  return (
    <div className="sponsor-item" title={item.alt || item.name}>
      {item.website ? (
        <a
          className="sponsor-loop-link"
          href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${item.alt || item.name} website`}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

export const SponsorLoop = memo(function SponsorLoop({
  items,
  speed = 40,
  gap = 20,
  ariaLabel = "Sponsors",
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const seqRef = useRef(null);
  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(MIN_COPIES);
  const [paused, setPaused] = useState(false);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sw = seqRef.current?.getBoundingClientRect?.().width ?? 0;
    if (sw > 0) {
      setSeqWidth(Math.ceil(sw));
      setCopyCount(Math.max(MIN_COPIES, Math.ceil(containerWidth / sw) + COPY_HEADROOM));
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    if (!window.ResizeObserver) {
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
    const ro = new ResizeObserver(updateDimensions);
    if (containerRef.current) ro.observe(containerRef.current);
    if (seqRef.current) ro.observe(seqRef.current);
    return () => ro.disconnect();
  }, [updateDimensions, items]);

  useEffect(() => {
    const imgs = seqRef.current?.querySelectorAll("img") ?? [];
    if (imgs.length === 0) return undefined;
    let remaining = imgs.length;
    const done = () => {
      remaining -= 1;
      if (remaining === 0) updateDimensions();
    };
    imgs.forEach((img) => {
      if (img.complete) {
        done();
      } else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
    });
    return () =>
      imgs.forEach((img) => {
        img.removeEventListener("load", done);
        img.removeEventListener("error", done);
      });
  }, [items, updateDimensions]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    let raf = null;
    let last = null;
    const animate = (timestamp) => {
      if (last === null) last = timestamp;
      const dt = Math.max(0, timestamp - last) / 1000;
      last = timestamp;
      const target = paused ? 0 : speed;
      velocityRef.current +=
        (target - velocityRef.current) * (1 - Math.exp(-dt / SMOOTH_TAU));
      if (seqWidth > 0) {
        const next =
          ((offsetRef.current + velocityRef.current * dt) % seqWidth + seqWidth) % seqWidth;
        offsetRef.current = next;
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${-next}px, 0, 0)`;
        }
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      last = null;
    };
  }, [speed, seqWidth, paused, reducedMotion]);

  if (!items || items.length === 0) return null;

  if (reducedMotion || items.length <= 1) {
    return (
      <div className="sponsor-loop sponsor-loop--static" role="region" aria-label={ariaLabel}>
        {items.map((item) => (
          <SponsorCard key={item.id} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="sponsor-loop"
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ "--sponsor-loop-gap": `${gap}px` }}
    >
      <div ref={trackRef} className="sponsor-loop-track">
        {Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className="sponsor-loop-list"
            key={`copy-${copyIndex}`}
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {items.map((item) => (
              <li className="sponsor-loop-item" key={`${copyIndex}-${item.id}`}>
                <SponsorCard item={item} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
});

export default SponsorLoop;
