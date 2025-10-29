import { useEffect, useRef, useState } from 'react';
import type React from 'react';

export type SizeDirection = 'increasing' | 'decreasing' | 'same' | null;

export function useSizeChange<T extends HTMLElement>(ref: React.RefObject<T>) {
  const prevWidthRef = useRef<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [direction, setDirection] = useState<SizeDirection>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    // set initial width immediately
    const initialRect = el.getBoundingClientRect();
    const initialWidth = Math.round(initialRect.width);
    prevWidthRef.current = initialWidth;
    setWidth(initialWidth);
    setDirection(null);

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      const newWidth = Math.round(entry.contentRect.width);
      const prev = prevWidthRef.current;

      if (prev == null) {
        setDirection(null);
      } else if (newWidth > prev) {
        setDirection('increasing');
      } else if (newWidth < prev) {
        setDirection('decreasing');
      } else {
        setDirection('same');
      }

      prevWidthRef.current = newWidth;
      setWidth(newWidth);
    });

    ro.observe(el);
    return () => ro.disconnect();
    // re-run when the observed element becomes available/changes
  }, [ref.current]);

  return { width, direction };
}
